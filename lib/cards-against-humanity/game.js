const GameSession = require("./gameSession");
const deckHandler = require("./deck-handler");
const instances = {};
let playersInGame = {};
const minPlayersToPlay = 2;
//module.exports =
module.exports = {
	async cah(callback, { argumentsList, groupId, message }) {
		try {
			const playerId =
				message.author != undefined ? message.author : message.chatId;
			const callbackResponse = {};
			if (message.isGroupMsg) {
				callbackResponse.type = "reply";
				const command = argumentsList[0];
				const commandToExecute = groupCommands[command];

				if (commandToExecute == null) return;

				const playerName = await getPlayerName(message.sender);
				callbackResponse.response = await commandToExecute(
					{
						playerName,
						playerId,
						groupId,
					},
					callback,
				);
				callback(callbackResponse);
			} else {
				callbackResponse.type = "message";
				let _response = "";
				const instanceId = playersInGame[playerId];
				if (instanceId == null) return;
				if (instances[instanceId].playerAlreadyChoose(playerId)) return;
				const cardId = await getCardId(
					argumentsList,
					instanceId,
					playerId,
				);
				const currentInstance = instances[instanceId];
				if (playerId != currentInstance.theChooseOne) {
					callbackResponse.chatId = playerId;
					callbackResponse.response = await pickWhiteCard({
						cardId,
						playerId,
						currentInstance,
					});
					await callback(callbackResponse);
					if (checkTurnEnd(currentInstance)) {
						// * ! complete turn
						const cardsToSender = currentInstance.getChosenCards();
						_response = RESPONSES.cah.deckHeader;
						let index = 0;
						for (let card in cardsToSender) {
							_response +=
								index + " - " + cardsToSender[card] + "\n";
							index++;
						}
						_response = _response.trim();
						callbackResponse.chatId = currentInstance.theChooseOne;
						callbackResponse.response = _response;
						await callback(callbackResponse);
						//send to group
						callbackResponse.chatId = instanceId;
						_response =
							currentInstance.getChooseOneName() +
							RESPONSES.cah.playerQuoteHeader +
							`${instances[instanceId].blackCard.text}\n\n` +
							_response;
						_response = RESPONSES.cah.already + _response;
						callbackResponse.response = _response;
						await callback(callbackResponse);
					}
				} else {
					callbackResponse.chatId = instanceId;
					if (
						cardId >=
							Object.keys(currentInstance.turnCards).length ||
						cardId < 0
					)
						return;
					callbackResponse.response = await pickBlackCard({
						cardId,
						currentInstance,
					});

					await callback(callbackResponse);
					if (currentInstance.hasWinner()) {
						// ! END GAME
						_response += RESPONSES.cah.endGame;
						callbackResponse.response = _response;
						await callback(callbackResponse);
						endGame(playersInGame[playerId]);
					} else {
						_response += RESPONSES.cah.nextTurn;
						// * CREATE NEXT TURN
						callbackResponse.response = _response;
						await callback(callbackResponse);

						setTurn(callback, {
							instanceId,
						});
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	},
};
async function getCardId(argumentsList, instanceId, playerId) {
	const command = argumentsList[0];
	let cardToReturn = -1;
	if (command == "redefine") {
		if (instances[instanceId].theChooseOne != playerId) {
			await setRandomPlayerDeck(playerId, instanceId);
			cardToReturn = 0;
		}
	} else {
		const lastArgumentElement = argumentsList.length - 1;
		let cardIdToPick = parseInt(argumentsList[lastArgumentElement]);
		if (!isNaN(cardIdToPick)) {
			cardToReturn = cardIdToPick;
		}
	}
	return cardToReturn;
}
async function pickWhiteCard({ cardId, playerId, currentInstance }) {
	if (currentInstance.turnCards[playerId] != null)
		return RESPONSES.cah.alreadyPlayed;
	const cardPick = currentInstance.updateTurn(playerId, cardId);
	if (cardPick == undefined) {
		return RESPONSES.cah.invalidCard;
	}
	currentInstance.removeUsedCards(playerId, cardId);
	_response = RESPONSES.cah.chosenCard + cardPick;
	return _response;
}
async function pickBlackCard({ cardId, currentInstance }) {
	const chosenCardObj = currentInstance.getResponseCardChosen(cardId);
	currentInstance.addPointsToPlayer(chosenCardObj.playerId);
	// * CREATE SCOREBOARD
	let _scoreboard = currentInstance.scoreboard();
	_scoreboard = RESPONSES.cah.scoreboard + _scoreboard;
	//format game
	let blackCardTxt = currentInstance.blackCard.text;
	let chosenCard = "*" + chosenCardObj.card + "* ";

	if (blackCardTxt.includes("_")) {
		blackCardTxt = blackCardTxt.replace("_", chosenCard);
		_response = blackCardTxt;
	} else {
		_response = blackCardTxt;
		_response += "\n\n" + RESPONSES.cah.chosenCard + "\n" + chosenCard;
	}

	_response += "\n\n" + _scoreboard;
	_response =
		currentInstance.getPlayerName(chosenCardObj.playerId) +
		RESPONSES.cah.endTurnHeader +
		_response;
	return _response;
}
async function setTurn(callback, { instanceId }) {
	//#region params
	const callbackResponse = {};
	callbackResponse.type = "message";
	let _response = "";
	console.log("start a turn");
	//#endregion
	//starting game
	instances[instanceId].turnCards = {};
	const players = instances[instanceId].players;
	const chooseOne = instances[instanceId].nextChooseOne();
	//!!!!!!!!!!!!!!!
	const blackCardId = instances[instanceId].getNextBlackCardId();
	const blackCard = await deckHandler.getBlackCard(blackCardId);
	console.log("black card:", blackCard.text);
	instances[instanceId].setBlackCard(blackCard);
	let quote = blackCard.text;
	let playerBlackCardHeader =
		players[chooseOne].name + RESPONSES.cah.playerQuoteHeader;

	for (let playerId in players) {
		//send card to picker
		let playerDeck = {};
		if (instances[instanceId].players[playerId].deck.length == 0) {
			playerDeck = await setRandomPlayerDeck(playerId, instanceId);
		} else {
			playerDeck = instances[instanceId].players[playerId].deck;
		}
		//! format cards to player
		//send players cards
		if (playerId != chooseOne) {
			callbackResponse.chatId = playerId;
			let deckTxt = await deckHandler.getDeckTxt(playerDeck);
			callbackResponse.response =
				playerBlackCardHeader + quote + "\n\n" + deckTxt;
			await callback(callbackResponse);
		} else {
			_response = RESPONSES.cah.chosenOneCardHeader + quote;
			callbackResponse.chatId = chooseOne;
			callbackResponse.response = _response;
			await callback(callbackResponse);
		}
	}
	instances[instanceId].turnsPlayed++;
	//send to group
	callbackResponse.chatId = instanceId;
	_response = RESPONSES.cah.startingGame + playerBlackCardHeader + quote;
	callbackResponse.response = _response;
	await callback(callbackResponse);
}
async function setRandomPlayerDeck(playerId, instanceId) {
	const playerDeck = await deckHandler.getWhiteDeck();
	instances[instanceId].setPlayerDeck(playerId, playerDeck);
	return playerDeck;
}
async function startGame({ instanceId }) {
	const players = Object.keys(instances[instanceId].players);
	//* set black card
	const cardsLengthToPick =
		players.length * (instances[instanceId].pointsLimit - 1);

	const blackCardIdList = await deckHandler.getRandomCardIdList(
		"black",
		cardsLengthToPick + 1,
	);
	console.log(blackCardIdList);
	instances[instanceId].startGame(blackCardIdList);
	//* set player deck
	for (let playerId in players) {
		playerDeck = await setRandomPlayerDeck(players[playerId], instanceId);
	}
	//* start turn
	console.log("end");
}
function checkTurnEnd(instance) {
	return (
		Object.keys(instance.turnCards).length ==
		Object.keys(instance.players).length - 1
	);
}
const groupCommands = {
	async start({ playerId, groupId: instanceId }, callback) {
		let _response = "";
		if (isValidGame(instanceId)) {
			const playersLength = Object.keys(
				instances[instanceId].players,
			).length;
			if (playersLength >= minPlayersToPlay) {
				if (playerId != instances[instanceId].host)
					return RESPONSES.cah.onlyHost;
				if (instances[instanceId].alreadyStart == false) {
					await startGame({ instanceId });
					_response = RESPONSES.cah.gameStarted;
					setTurn(callback, {
						instanceId,
					});
				} else {
					_response = RESPONSES.cah.alreadyStart;
				}
			} else {
				_response = RESPONSES.cah.notEnoughPlayers;
			}
		} else {
			_response = RESPONSES.cah.invalidGame;
		}
		return _response;
	},
	async new({ playerId, groupId }) {
		let _response = "";
		if (isValidGame(groupId)) {
			_response = RESPONSES.cah.alreadyCreate;
		} else {
			//create a new game instance
			instances[groupId] = new GameSession({
				host: playerId,
			});
			_response = RESPONSES.cah.newGame;
		}
		console.log(groupId);
		console.log(instances);
		return _response;
	},
	async join({ playerName, playerId, groupId }) {
		let _response = "";
		//add player to instance
		if (isValidGame(groupId)) {
			if (instances[groupId].alreadyStart) {
				_response = RESPONSES.cah.alreadyStart;
			} else {
				if (!instances[groupId].existPlayer(playerId)) {
					if (playersInGame[playerId] == null) {
						playersInGame[playerId] = groupId;
						instances[groupId].addPlayer(playerId, playerName);

						_response = RESPONSES.cah.joinGame;
					} else {
						_response = RESPONSES.cah.alreadyInSession;
					}
				} else {
					_response = RESPONSES.cah.alreadyJoined;
				}
			}
		} else {
			_response = RESPONSES.cah.invalidGame;
		}
		return _response;
	},
	async kill({ playerId, groupId }) {
		//exclude game
		let _response = "";
		if (!isValidGame(groupId)) {
			_response = RESPONSES.cah.invalidGame;
		} else {
			// ! temporary solution
			if (playerId.includes(instances[groupId].host)) {
				//
				endGame(groupId);
				_response = RESPONSES.cah.killedGame;
			} else {
				_response = RESPONSES.cah.invalidHost;
			}
		}
		return _response;
	},
	async status({ groupId }) {
		if (!isValidGame(groupId)) {
			_response = RESPONSES.cah.invalidGame;
		} else {
			if (instances[groupId].alreadyStart == false)
				_response = RESPONSES.cah.await;
			else
				_response = `Juiz: ${instances[
					groupId
				].getChooseOneName()}\nTurnos jogados: ${
					instances[groupId].turnsPlayed
				}\nLimite de rodadas: ${
					instances[groupId].pointsLimit
				}\n... to com preguiça depois termino isso`;
		}
		return _response;
	},
};
function endGame(groupId) {
	//remove players from list and clear
	const playerList = instances[groupId].players;
	for (let player in playerList) {
		let newPlayersList = [];
		const playerToRemove = player;
		for (let key in playersInGame) {
			if (key != playerToRemove) {
				newPlayersList[key] = playersInGame[key];
			}
		}
		playersInGame = newPlayersList;
	}
	instances[groupId] = null;
}
function isValidGame(groupId) {
	return instances[groupId] != null;
}

async function getPlayerName(sender) {
	if (sender.pushname == undefined) {
		console.log(sender);
	}
	if (sender.pushname != undefined) return sender.pushname;
	else if (sender.formattedName != undefined) return sender.formattedName;
	else if (sender.verifiedName != undefined) return sender.verifiedName;
}
/*
async function testGame() {
	let groupId = "555186528365-1613548539@g.us";
	instances[groupId] = new GameSession({
		host: "324324",
	});
	let playerName = "puszkarek";
	let playerId = "2222";

	const callback = (response) => {};

	groupCommands["join"]({
		playerName,
		playerId,
		groupId,
	});
	playerName = "jona";
	playerId = "5555";

	groupCommands["join"]({
		playerName,
		playerId,
		groupId,
	});
	playerName = "outro";
	playerId = "9999";

	groupCommands["join"]({
		playerName,
		playerId,
		groupId,
	});
	groupCommands["start"](
		{
			playerName,
			playerId: "324324",
			groupId,
		},
		console.log,
	);

	return;
	const status = await groupCommands["status"]({
		playerId,
		groupId,
	});
}
testGame();
*/
