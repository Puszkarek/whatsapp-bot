module.exports = {
	hidden: "​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​",
	error: {
		group: "",
		failed: "",
		invalid: "",
		search: "",
	},
	filters: {
		add: "",
		remove: "",
	},
	cah: {
		chosenCard: "",
		nextTurn: "",
		onlyHost: "",
		already: "",
		deckHeader: "",
		startingGame: "",
		playerQuoteHeader: "",
		chosenOneCardHeader: "",
		endTurnHeader: "",
		scoreboard: "",
		endGame: "",
		alreadyStart: "",
		joinGame: "",
		alreadyInSession: "",
		alreadyJoined: "",
		alreadyPlayed: "",
		invalidHost: "",
		gameStarted: "",
		invalidCard: "",
		killedGame: "",
		newGame: "",
		invalidGame: "",
		alreadyCreate: "",
		await: "",
		notEnoughPlayers: "",
	},
	newsTopic: {
		0: "",
		1: "",
		2: "",
		3: "",
		4: "",
	},
	botNameSet: "",
	measurer(percentage, measurer_type) {
		return `/// ${percentage}% ${measurer_type} ///`;
	},
	holiday(name, data) {
		return `/// ${name} /// ${data}\n\n`;
	},
	anime(anime) {
		let _caption = "Title:";
		const titles = anime.titles;
		for (let key in titles) {
			_caption += "\n" + titles[key];
		}
		_caption += "\n\nEp: " + anime.episodeLength;
		_caption += "\n\nDate: " + anime.startDate + " - " + anime.endDate;
		_caption += "\n\nStatus: " + anime.status;
		_caption += "\n\nRating: " + anime.ageRatingGuide;
		_caption += "\n\nSummary:\n" + anime.synopsis;

		return _caption;
	},
	getMovieText(result) {
		let title = `Title: ${
			result.title != null ? result.title : result.original_name
		}\n`;
		let body = `\nSummary: ${result.overview}\n\n${
			result.release_date != null
				? "Date: " + result.release_date
				: "First Air Date: " + result.first_air_date
		}`;
		return title + body;
	},
	animeQuotes(quoteList) {
		let _response = this.hidden;
		for (let key in quoteList) {
			_response += "Anime: " + quoteList[key].anime;
			_response += "\n\n";
			_response += "Character: " + quoteList[key].character;
			_response += "\n\n";
			_response += quoteList[key].quote;
			_response += "\n\n\n";
		}
		return _response;
	},
	emoji(info) {
		let _response = "";
		let emoji = info[0];
		_response += "Nome: " + emoji.slug;
		_response += "\n\nCharacter: " + emoji.character;
		_response += "\n\nName (Unicode): " + emoji.unicodeName;
		_response += "\n\nCode: " + emoji.codePoint;
		_response += "\n\nGrup: " + emoji.group;
		_response += "\n\nSubgrup: " + emoji.subGroup;
		return _response;
	},
	stickerPackName: "",
	stickerPackAuthor: "",
	botInitialContext: ["", ""],
	botPersonality: "",
};
