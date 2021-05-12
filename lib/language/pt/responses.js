module.exports = {
	error: {
		group: "⚠️ F, não estamos em um grupo",
		failed: "⚠️ F, houve algum erro",
		invalid: "⚠️ F, algo está invalido, verifique o commando novamente",
		search: "⚠️ F, falha na pesquisa ou nada achado",
	},
	filters: {
		add: " foi adicionado aos filtros",
		remove: " foi removido dos filtros",
	},
	cah: {
		invalidGame: "",
		already: "🎴 Todas as cartas escolhidas, aguarde o resultado\n\n",
		deckHeader: "🃏 Cartas:\n\n",
		blackCardHeader: "💬 Pergunta:\n\n",
		chosenCard: "✔️ Carta escolhida: ",
		nextTurn: "\n\n⏭️ Proximo turno começando..."
	},
	newsTopic: {
		0: "Tecnologia",
		1: "Entretenimento",
		2: "Esportes",
		3: "Saúde",
		4: "Nação",
	},
	calendar: "aulas",
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
			_caption += "\n" + titles[key]
		}
		_caption += "\n\nEpisódios: " + anime.episodeLength
		_caption += "\n\nData: " + anime.startDate + " - " + anime.endDate
		_caption += "\n\nStatus: " + anime.status
		_caption += "\n\nClassificação: " + anime.ageRatingGuide
		_caption += "\n\nSinopse:\n" + anime.synopsis

		return _caption;
	},
	getMovieText(result) {
		return `Titulo: ${result.title != null ? result.title : result.original_name}\n\nSumario: ${result.overview}\n\n${result.release_date != null ? ("Data: "+ result.release_date) : ("Lançamento: " + result.first_air_date)}`
	},
	covid(info) {
		console.log(info)
		let _response = `Pais: ${info.country}\nCasos: ${info.cases}\n`
		_response += `Casos hoje: ${info.todayCases}\nMortes: ${info.deaths}\n`
		_response += `Mortes hoje: ${info.todayDeaths}`;
		return _response;

	},
	animeQuotes(quoteList) {
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
		let emoji = info[0]
		_response += "Nome: " + emoji.slug
		_response += "\n\nCaractere: " + emoji.character
		_response += "\n\nNome unicode: " + emoji.unicodeName
		_response += "\n\nCódigo: " + emoji.codePoint
		_response += "\n\nGrupo: " + emoji.group
		_response += "\n\nSubgrupo: " + emoji.subGroup
		return _response
	}
};