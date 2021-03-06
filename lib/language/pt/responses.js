module.exports = {
	hidden: "​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​",
	error: {
		group: "F, não estamos em um grupo",
		failed: "F, houve algum erro",
		invalid: "F, algo está invalido, verifique o commando novamente",
		search: "F, falha na pesquisa ou nada achado",
	},
	filters: {
		add: " foi adicionado aos filtros",
		remove: " foi removido dos filtros",
	},
	cah: {
		chosenCard: "✔️ Carta escolhida: ",
		nextTurn: "\n\n⏭️ Proximo turno começando...",
		onlyHost: "Você não é o host",
		already: "🎴 Todas as cartas escolhidas, aguarde o resultado\n\n",
		deckHeader: "🃏 Cartas:\n\n",
		startingGame: "Começando...\n\n",
		playerQuoteHeader: " perguntou:\n\n",
		chosenOneCardHeader: "💬 Aguarde os jogadores:\n\n",
		endTurnHeader: " ganhou um ponto\n\n",
		scoreboard: "🥇 Placar:\n",
		endGame: "\n\n🏁 Fim de Jogo",
		alreadyStart: "O jogo ja começou",
		joinGame: "Entrou no jogo",
		alreadyInSession: "Você ja esta em uma sessão",
		alreadyJoined: "Você ja entrou no jogo",
		alreadyPlayed: "Você ja jogou nesse turno",
		invalidHost: "Você não é o host",
		gameStarted:
			"Jogo inciado, aguarde\n\nUse os comandos no privado:\ncah para escolher uma carta\ncah redefine para redefinir o deck",
		invalidCard: "Carta invalida",
		killedGame: "Jogo encerrado",
		newGame: "Novo game criado, entre com Join",
		invalidGame: "Não existe um jogo aqui",
		alreadyCreate: "Ja existe um jogo aqui",
		await: "Aguarde o inicio",
		notEnoughPlayers: "Quantidade insuficiente",
	},
	newsTopic: {
		0: "Tecnologia",
		1: "Entretenimento",
		2: "Esportes",
		3: "Saúde",
		4: "Nação",
	},
	botNameSet: "Meu nome agora é ",
	measurer(percentage, measurer_type) {
		return `Você está ${percentage}% ${measurer_type} hoje`;
	},
	holiday(name, data) {
		return `Feriado: ${name}\nData: ${data}\n\n`;
	},
	anime(anime) {
		let _caption = "Títulos:";
		const titles = anime.titles;
		for (let key in titles) {
			_caption += "\n" + titles[key];
		}
		_caption += "\n\nEpisódios: " + anime.episodeLength;
		_caption += "\n\nData: " + anime.startDate + " - " + anime.endDate;
		_caption += "\n\nStatus: " + anime.status;
		_caption += "\n\nClassificação: " + anime.ageRatingGuide;
		_caption += "\n\nSinopse:\n" + anime.synopsis;

		return _caption;
	},
	getMovieText(result) {
		let title = `Titulo: ${
			result.title != null ? result.title : result.original_name
		}\n`;
		let body = `\nSumario: ${result.overview}\n\n${
			result.release_date != null
				? "Data: " + result.release_date
				: "Lançamento: " + result.first_air_date
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
		_response += "\n\nCaractere: " + emoji.character;
		_response += "\n\nNome unicode: " + emoji.unicodeName;
		_response += "\n\nCódigo: " + emoji.codePoint;
		_response += "\n\nGrupo: " + emoji.group;
		_response += "\n\nSubgrupo: " + emoji.subGroup;
		return _response;
	},
	stickerPackName: "quem usa o pack apoia o socialismo",
	stickerPackAuthor: "Nós",
	botInitialContext: ["como vai?", "bem"],
	botPersonality:
		"o Bot é sarcástico, alem de extremamente arrogante e inteligente.",
};
