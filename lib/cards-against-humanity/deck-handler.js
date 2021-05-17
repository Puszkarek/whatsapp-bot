const cards = {};
const cardPath = `../../lib/language/${language}/cah-cards/`
cards.white = require(cardPath + 'white.json')
cards.black = require(cardPath + 'black.json')


module.exports = {
    async getRandomBlackCard() {
        const randomCard = Math.floor(Math.random() * cards.black.length);
        const card = cards.black[randomCard];
        return card;
    },
    async generateRandomDeck() {
        const deck = [];

        for (let i = 0; i < 15; i++) {
            //white
            let randomCard = Math.floor(Math.random() * cards.white.length);
            deck.push(cards.white[randomCard])
        }
        return deck

    },
    async getDeckTxt(decks) {
        let _response = RESPONSES.cah.deckHeader;
        for (let card in decks) {
            _response += card.toString() + " - " +
                decks[card] + "\n"
        }
        return _response;
    }
}