const GameSession = require('./gameSession');
const deckHandler = require('./deck-handler');
const instances = {};
const playersInGame = {};
//module.exports =
module.exports = {
    async cah(callback, {
        argumentsList,
        groupId,
        message
    }) {
        const playerId = message.author;
        const callbackResponse = {};
        if (message.isGroupMsg) {
            // * start and manager functions
            callbackResponse.type = "reply"
            const command = argumentsList[0];
            const commandToExecute = settingGameCommands[command]

            if (commandToExecute == null) {

                if (command == "start") {
                    if (playerId != instances[groupId].host) return;
                    instances[groupId].alreadyStart = true;
                    setTurn(callback, {
                        groupId
                    });
                }
            } else {
                const playerName = message.sender.pushname;
                callbackResponse.response =
                    await commandToExecute({
                        playerName,
                        playerId: playerId,
                        groupId
                    });
                callback(callbackResponse)
            }


        } else {
            // * player card choose
            // * check if player can choose a card
            const playerId = message.chatId;
            callbackResponse.type = "message";
            callbackResponse.chatId = playerId
            let _response = "";
            const instanceId = playersInGame[playerId];
            if (instanceId == null) {
                return;
            } // not a valid game
            async function pickCard(cardIdToPick) {
                const currentInstance = instances[instanceId];
                if (currentInstance.existPlayer(playerId)) {
                    console.log("exist a player");
                    //choose a card to pick
                    if (playerId != currentInstance.theChooseOne) {
                        if (currentInstance.turnCards[playerId] == null) {
                            const cardId = parseInt(cardIdToPick)
                            const cardPick = instances[instanceId].updateTurn(playerId, cardId);

                            _response = RESPONSES.cah.chosenCard + cardPick

                            callbackResponse.response = _response;
                            callback(callbackResponse)
                            //remove card form player list
                            currentInstance.removeUsedCards(playerId, cardId)
                            if (Object.keys(currentInstance.turnCards).length == Object.keys(currentInstance.players).length - 1) {
                                // complete turn
                                const cardsToSender = currentInstance.getChosenCards();

                                _response = RESPONSES.cah.deckHeader
                                let index = 0;
                                for (let card in cardsToSender) {
                                    _response += index + ": " + cardsToSender[card] + "\n";
                                    index++;
                                }
                                _response = _response.trim();
                                callbackResponse.chatId = currentInstance.theChooseOne;
                                callbackResponse.response = _response;
                                await callback(callbackResponse)
                                //send to group
                                callbackResponse.chatId = instanceId;
                                _response = RESPONSES.cah.blackCardHeader + `${instances[instanceId].blackCard.text}\n\n` + _response
                                _response = RESPONSES.cah.already + _response;
                                callbackResponse.response = _response;
                                await callback(callbackResponse)
                            }
                        }
                    } else {
                        if (Object.keys(currentInstance.turnCards).length == Object.keys(currentInstance.players).length - 1) {
                            // all player select
                            // turn ends
                            const chosenCardIndex = parseInt(argumentsList[1]);
                            if (chosenCardIndex < Object.keys(currentInstance.turnCards).length) {
                                const chosenCardObj = currentInstance.getResponseCardChosen(chosenCardIndex)
                                instances[instanceId].addPointsToPlayer(chosenCardObj.playerId);
                                //create scoreboard
                                let _scoreboard = instances[instanceId].scoreboard();

                                //format game
                                let blackCardTxt = currentInstance.blackCard.text;
                                let chosenCard = chosenCardObj.card
                                if (blackCardTxt.includes("_")) {
                                    blackCardTxt = blackCardTxt.replace("_", chosenCard)
                                    _response = blackCardTxt;
                                } else {
                                    _response = blackCardTxt;
                                }
                                _response += "\n\n" + RESPONSES.cah.chosenCard + "\n" + chosenCard
                                _response += "\n\n" + _scoreboard;
                                callbackResponse.chatId = instanceId;
                                if (instances[instanceId].hasWinner()) {
                                    //game end
                                    _response += "\n\nFim de Jogo"
                                    callbackResponse.response = _response;
                                    callback(callbackResponse)
                                    instances[instanceId] = null;
                                } else {
                                    _response += RESPONSES.cah.nextTurn;
                                    //create next turn
                                    callbackResponse.response = _response;
                                    callback(callbackResponse)

                                    setTurn(callback, {
                                        groupId: instanceId
                                    })
                                }
                            }
                        }
                    }
                    //send choose cart
                } else {
                    //is not in the game
                    console.log('you are not in the game')
                }
            }
            let index = argumentsList.length
            const command = argumentsList[0];
            console.log('the command is: ' + command)

            switch (command) {
                case "pick":
                    if (argumentsList[1] != null) {
                        pickCard(argumentsList[index - 1]);
                    }
                    break;
                case "redefine":
                    const playerDeck = deckHandler.generateRandomDeck();
                    instances[instanceId].setPlayerDeck(playerId, playerDeck);
                    pickCard(0);
                    break;
                case "status":
                    if (!isValidGame(groupId)) {
                        _response = "Não existe um jogo nesse grupo"

                    } else {
                        _response = `Juiz: ${instances[groupId].getChooseOneName}\nTurnos jogados: ${instances[groupId].turnsPlayed}\nLimite de rodadas: ${instances[groupId].pointsLimit}\n... to com preguiça depois termino isso`

                    }
                    callbackResponse.response = _response;
                    break;
            }
        }
    }
}

async function setTurn(callback, {
    groupId
}) {
    const callbackResponse = {}
    callbackResponse.type = "message";
    let _response = ""
    console.log('SET NEW TURN')
    if (isValidGame(groupId)) {
        //starting game
        console.log('create a new instance')
        instances[groupId].turnCards = {};
        const playersLength = Object.keys(instances[groupId].players).length;
        if (playersLength >= 1) {
            const players = instances[groupId].players;
            const chooseOne = instances[groupId].nextChooseOne();
            const blackCard = deckHandler.getRandomBlackCard();
            instances[groupId].setBlackCard(blackCard);
            let quote = "Pergunta: \n " + blackCard.text;;
            for (let player in players) {

                //send card to picker
                let playerDeck = {}
                if (instances[groupId].turnsPlayed == 0) {
                    playerDeck = deckHandler.generateRandomDeck();
                    instances[groupId].setPlayerDeck(player, PlayerDeck);
                } else {
                    playerDeck = instances[groupId].players[player].deck
                }
                //! format cards to player
                //send players cards
                if (player != chooseOne) {
                    callbackResponse.chatId = player;
                    let deckTxt = deckHandler.getDeckTxt(playerDeck);
                    callbackResponse.response = quote + "\n\n" + deckTxt
                    await callback(callbackResponse);
                } else {
                    _response = quote;
                    callbackResponse.chatId = chooseOne;
                    callbackResponse.response = _response;
                    await callback(callbackResponse);
                }

            }
            instances[groupId].turnsPlayed++;
            //send to group
            callbackResponse.chatId = groupId;
            _response = "Começando...\n\n" + quote;
            callbackResponse.response = _response;
            await callback(callbackResponse);
        } else {
            _response = "Quantidade insuficiente";
            callbackResponse.response = _response;
            callback(callbackResponse);
        }
    } else {
        _response = "Não existe um jogo aqui";
        callbackResponse.response = _response;
        callback(callbackResponse);
    }
}
const settingGameCommands = {
    async new({
        playerId,
        groupId
    }) {
        let _response = ""
        if (isValidGame(groupId)) {
            _response = "Ja existe um jogo aqui";
        } else {
            //create a new game instance
            instances[groupId] = new GameSession({
                host: playerId
            })
            _response = "Novo game criado, entre com Join"
        }
        return _response;
    },
    async join({
        playerName,
        playerId,
        groupId
    }) {
        let _response = ""
        //add player to instance
        if (isValidGame(groupId)) {
            if (instances[groupId].alreadyStart) return;
            if (!instances[groupId].existPlayer(playerId)) {
                if (playersInGame[playerId] == null) {
                    playersInGame[playerId] = groupId;
                    console.log(playersInGame)
                    instances[groupId].addPlayer(playerId, playerName)

                    _response = "Entrou no jogo"
                } else {
                    _response = "Você ja esta em uma sessão"
                }
            } else {
                _response = "Você ja entrou nesse jogo"
            }
        } else {
            _response = "Não existe um jogo nesse grupo"
        }
        return _response;
    },
    async kill({
        playerId,
        groupId
    }) {
        //exclude game
        let _response = ""
        if (!isValidGame(groupId)) {
            _response = "Não existe um jogo nesse grupo"
        } else {
            // ! temporary solution
            if (playerId.includes(instances[groupId].host)) {
                //
                instances[groupId] = null
                _response = "Jogo encerrado"
            } else {
                _response = "Você não é o host"
            }
        }
        return _response;
    }
}

function isValidGame(groupId) {
    return instances[groupId] != null
}