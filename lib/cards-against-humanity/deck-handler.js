const cards = {};
const cardPath = `../../lib/language/${language}/cah-cards/`;
cards.white = require(cardPath + "white.json");
cards.black = require(cardPath + "black.json");
module.exports = {
	async getBlackCard(cardId) {
		return cards.black[cardId];
	},
	async getRandomCardIdList(deckType, count) {
		const range = deckType == "white" ? cards.white.length - 1 : cards.black.length - 1;
		const numberList = new Set();
		while (numberList.size < count) {
			numberList.add(Math.floor(Math.random() * (range - 1 + 1) + 1));
		}
		return [...numberList];
	},
	async getWhiteDeck() {
		const deck = [];
		const cardsId = await this.getRandomCardIdList("white", 15);
		for (let key in cardsId) {
			const card = cards.white[cardsId[key]];
			deck.push(card);
		}
		return deck;
	},
	async getDeckTxt(decks) {
		let _response = RESPONSES.cah.deckHeader;
		for (let card in decks) {
			_response += card.toString() + " - " + decks[card] + "\n";
		}
		return _response;
	},
};
