module.exports = class {
	blackCard = {};
	theChooseOne = "";
	currentPlayerIndex = 0;
	players = {};
	turnCards = {};
	alreadyStart = false;
	turnsPlayed = 0;
	pointsLimit = 7;
	blackCardIdList = null;
	currentBlackCardIndex = 0;
	constructor(props) {
		this.host = props.host;
	}
	//players
	existPlayer(playerId) {
		return this.players[playerId];
	}
	addPlayer(playerId, playerName) {
		this.players[playerId] = {
			name: playerName,
			points: 0,
			deck: [],
		};
	}
	removePlayer(playerId) {
		this.players[playerId] = null;
	}
	addPointsToPlayer(playerId) {
		this.players[playerId].points++;
	}
	//deck
	getNextBlackCardId() {
		console.log(this.blackCardIdList);
		const blackCard = this.blackCardIdList[this.currentBlackCardIndex];
		this.currentBlackCardIndex++;
		return blackCard;
	}
	setPlayerDeck(playerId, deck) {
		this.players[playerId].deck = deck;
	}
	removeUsedCards(playerId, cardId) {
		const deck = this.players[playerId].deck;
		let newDeck = [];
		for (let card in deck) {
			if (card != cardId) {
				newDeck.push(deck[card]);
			}
		}
		this.players[playerId].deck = newDeck;
		return newDeck;
	}
	playerAlreadyChoose(playerId) {
		if (this.turnCards[playerId] == null) return false;
		return true;
	}
	//game
	startGame(blackCardList) {
		console.log("start game");
		this.blackCardIdList = blackCardList;
		this.alreadyStart = true;
	}
	setBlackCard(blackCard) {
		this.blackCard = blackCard;
	}
	scoreboard() {
		let score = "";
		for (let playerId in this.players) {
			score += "\n" + this.players[playerId].name;
			score += " - " + this.players[playerId].points + " pontos";
		}
		return score;
	}
	hasWinner() {
		for (let playerId in this.players) {
			if (this.players[playerId].points >= this.pointsLimit) {
				return true;
			}
		}
		return false;
	}
	updateTurn(playerId, cardId) {
		const selectCard = this.players[playerId].deck[cardId];
		if (selectCard != undefined) {
			this.turnCards[playerId] = selectCard;
		}
		return selectCard;
	}
	getChooseOneName() {
		return this.players[this.theChooseOne].name;
	}
	getPlayerName(playerId) {
		return this.players[playerId].name;
	}
	getResponseCardChosen(chooseId) {
		const keys = Object.keys(this.turnCards);
		const selectCardKey = keys[chooseId];
		return {
			card: this.turnCards[selectCardKey],
			playerId: selectCardKey,
		};
	}
	getChosenCards() {
		return this.turnCards;
	}
	nextChooseOne() {
		let keys = Object.keys(this.players);
		this.theChooseOne = keys[this.currentPlayerIndex];
		this.currentPlayerIndex++;
		if (this.currentPlayerIndex >= keys.length) this.currentPlayerIndex = 0;
		return this.theChooseOne;
	}
	getChooseOneName() {
		return this.players[this.theChooseOne].name;
	}
};
