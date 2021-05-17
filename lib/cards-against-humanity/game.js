const GameSession = require('./gameSession');
const instances = {};
var playersInGame = {};
const deckHandler = require('./deck-handler');
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
                const playerName = message.sender.pushname != null ? message.sender.pushname : message.sender.verifiedName;
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
                            const cardPick = instances[instanceId].updateTurn(playerId, cardIdToPick);
                            if (cardPick == undefined) {
                                callbackResponse.response = RESPONSES.cah.invalidCard;
                                callback(callbackResponse)
                                return;
                            }
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
                                    _response += index + " - " + cardsToSender[card] + "\n";
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
                        } else {
                            console.log('already choose a card')
                        }
                    } else {
                        if (Object.keys(currentInstance.turnCards).length == Object.keys(currentInstance.players).length - 1) {
                            // * ALL PLAYERS CHOOSE A CARD
                            // turn ends
                            const chosenCardIndex = parseInt(argumentsList[1]);
                            if (chosenCardIndex < Object.keys(currentInstance.turnCards).length) {
                                const chosenCardObj = currentInstance.getResponseCardChosen(chosenCardIndex)
                                instances[instanceId].addPointsToPlayer(chosenCardObj.playerId);
                                // * CREATE SCOREBOARD
                                let _scoreboard = instances[instanceId].scoreboard();
                                _scoreboard = RESPONSES.cah.scoreboard + _scoreboard;
                                //format game
                                let blackCardTxt = currentInstance.blackCard.text;
                                let chosenCard = "*" + chosenCardObj.card + "* "
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
                                    // ! END GAME
                                    _response += RESPONSES.cah.endGame
                                    callbackResponse.response = _response;
                                    callback(callbackResponse)
                                    endGame(playersInGame[playerId])
                                } else {
                                    _response += RESPONSES.cah.nextTurn;
                                    // * CREATE NEXT TURN
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
            const cardId = parseInt(argumentsList[index - 1])
            switch (command) {
                case "pick":

                    if (!isNaN(cardId)) {
                        pickCard(cardId);
                    }
                    break;
                case "redefine":
                    const playerDeck = await deckHandler.generateRandomDeck();
                    instances[instanceId].setPlayerDeck(playerId, playerDeck);
                    pickCard(0);
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
    console.log('start a turn')
    if (isValidGame(groupId)) {
        //starting game
        instances[groupId].turnCards = {};
        const playersLength = Object.keys(instances[groupId].players).length;
        if (playersLength >= 1) {
            const players = instances[groupId].players;
            const chooseOne = instances[groupId].nextChooseOne();
            const blackCard = await deckHandler.getRandomBlackCard();
            console.log('blackcard', blackCard)
            instances[groupId].setBlackCard(blackCard);
            let quote = RESPONSES.cah.blackCardHeader + blackCard.text;;
            for (let player in players) {

                //send card to picker
                let playerDeck = {}
                if (instances[groupId].turnsPlayed == 0) {
                    playerDeck = await deckHandler.generateRandomDeck();
                    instances[groupId].setPlayerDeck(player, playerDeck);
                } else {
                    if (instances[groupId].players[player].deck.length == 0) {
                        playerDeck = await deckHandler.generateRandomDeck();
                        instances[groupId].setPlayerDeck(player, playerDeck);
                    } else {
                        playerDeck = instances[groupId].players[player].deck
                    }
                }
                //! format cards to player
                //send players cards
                if (player != chooseOne) {
                    callbackResponse.chatId = player;
                    let deckTxt = await deckHandler.getDeckTxt(playerDeck);
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
            if (instances[groupId].alreadyStart) {
                _response = "O Jogo ja começou"
            } else {
                if (!instances[groupId].existPlayer(playerId)) {
                    if (playersInGame[playerId] == null) {
                        playersInGame[playerId] = groupId;
                        instances[groupId].addPlayer(playerId, playerName)

                        _response = "Entrou no jogo"
                    } else {
                        _response = "Você ja esta em uma sessão"
                    }
                } else {
                    _response = "Você ja entrou nesse jogo"
                }
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
                endGame(groupId)
                _response = "Jogo encerrado"
            } else {
                _response = "Você não é o host"
            }
        }
        return _response;
    },
    async status({
        groupId
    }) {
        if (!isValidGame(groupId)) {
            _response = "Não existe um jogo nesse grupo"

        } else {
            _response = `Juiz: ${instances[groupId].getChooseOneName()}\nTurnos jogados: ${instances[groupId].turnsPlayed}\nLimite de rodadas: ${instances[groupId].pointsLimit}\n... to com preguiça depois termino isso`

        }
        return _response;
    }
}

function endGame(groupId) {
    //remove players from list and clear
    const playerList = instances[groupId].players;
    for (let player in playerList) {
        let newPlayersList = []
        const playerToRemove = player
        for (let key in playersInGame) {

            if (key != playerToRemove) {

                newPlayersList[key] = playersInGame[key]
            }
        }
        playersInGame = newPlayersList;

    }
    instances[groupId] = null
}

function isValidGame(groupId) {
    return instances[groupId] != null
}
module.exports.testGame = () => {
    let groupId = '555186528365-1613548539@g.us'
    instances[groupId] = new GameSession({
        host: '324324'
    })
    let playerName = "puszkarek";
    let playerId = "234324"

    settingGameCommands["join"]({
        playerName,
        playerId,
        groupId
    })
    playerName = "jona";
    playerId = "0032490"

    settingGameCommands["join"]({
        playerName,
        playerId,
        groupId
    })
    instances[groupId].alreadyStart = true;
    setTurn(console.log, {
        groupId
    });
}