require("dotenv").config();
const request = require("request");
const fetch = require("node-fetch");
const imageType = require("image-type");
const randomQuotes = require("randomquote-api");
const quotesSearch = require("pensador-api");
const axios = require("axios");
const Kitsu = require("kitsu");
// Kitsu.io's API
const api = new Kitsu({
	baseURL: "https://kitsu.io/api/edge/anime?",
});
const { decryptMedia } = require("@open-wa/wa-decrypt");
const uaOverride =
	"WhatsApp/2.16.352 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Safari/605.1.15";

const newsTopic = {
	0: "technology",
	1: "entertainment",
	2: "sports",
	3: "health",
	4: "nation",
};
const libPath = `../language/${language}`;
const weatherResponse = require(`${libPath}/weather/weatherTextFormatter.js`);
const catFacts = require(`${libPath}/cat-facts.json`);

module.exports = {
	async animequote(callback, { argumentsTxt }) {
		let url = configURLParams(
			"https://animechan.vercel.app/api/quotes/anime?",
			{
				title: argumentsTxt,
			},
		);
		let _response = "";
		let callbackResponse = {};
		requestFrom(url)
			.then((response) => {
				_response = RESPONSES.animeQuotes(response);
				_response = _response.trim();
				callbackResponse = {
					type: "reply",
					response: _response,
				};
				callback(callbackResponse);
			})
			.catch((err) => {
				_response = RESPONSES.error.failed;
				callbackResponse = {
					type: "error",
					errorType: err,
					response: _response,
				};
				callback(callbackResponse);
			});
	},
	async emoji(callback, { argumentsTxt }) {
		const callbackResponse = {};
		callbackResponse.type = "reply";
		let url = "https://emoji-api.com/emojis?";
		url = configURLParams(url, {
			access_key: process.env.EMOJI_API_KEY,
			search: argumentsTxt,
		});
		console.log(url);
		requestFrom(url)
			.then(async (response) => {
				if (response == null) return;
				let _response = RESPONSES.emoji(response);
				callbackResponse.response = _response;
				callback(callbackResponse);
			})
			.catch((err) => {
				console.log(err);
			});
	},
	async anime(callback, { argumentsTxt }) {
		api.get("anime", {
			params: {
				filter: {
					text: argumentsTxt,
				},
			},
		})
			.then(async (response) => {
				const anime = response.data[0];
				//image
				imgUrl = anime.posterImage.medium;
				let img = await fetch(imgUrl);
				let buffer = await img.buffer();
				let _type = imageType(buffer);
				let _imgURI = `data:${_type.mime};base64,${buffer.toString(
					"base64",
				)}`;
				let _imgFiletype = "file." + _type.ext;
				let _caption = RESPONSES.hidden;
				_caption += RESPONSES.anime(anime);
				const callbackResponse = {
					type: "imageWithCaption",
					caption: _caption,
					imageURI: _imgURI,
					filetype: _imgFiletype,
				};
				callback(callbackResponse);
			})
			.catch((err) => {
				console.log("error");
				console.log(err);
				_response = RESPONSES.error.failed;
				callbackResponse = {
					type: "error",
					errorType: err,
					response: _response,
				};
				callback(callbackResponse);
			});
	},
	async holidays(callback) {
		let callbackResponse = {};
		let url = "https://date.nager.at/api/v2/publicholidays/2021/BR";
		requestFrom(url)
			.then((response) => {
				let _response = RESPONSES.hidden;
				for (let holiday in response) {
					let name = response[holiday].localName;
					let data = response[holiday].date;
					_response += RESPONSES.holiday(name, data);
				}
				_response = _response.trim();
				callbackResponse = {
					type: "reply",
					response: _response,
				};
				callback(callbackResponse);
			})
			.catch((err) => {
				_response = RESPONSES.error.failed;
				callbackResponse = {
					type: "error",
					errorType: err,
					response: _response,
				};
				callback(callbackResponse);
			});
	},
	async weather(callback, { argumentsTxt }) {
		let callbackResponse = {};
		let urlMain = "http://api.openweathermap.org/data/2.5/";
		let url = configURLParams(urlMain + "weather?units=metric&", {
			appid: process.env.WEATHER_API_KEY,
			lang: "pt_br",
			q: argumentsTxt,
		});
		requestFrom(url)
			.then((weather) => {
				const coordinates = weather.coord;
				url = configURLParams(urlMain + "air_pollution?", {
					appid: process.env.WEATHER_API_KEY,
					lat: coordinates.lat,
					lon: coordinates.lon,
				});

				requestFrom(url)
					.then((airQuality) => {
						let _response = RESPONSES.hidden;
						_response += weatherResponse({
							weather,
							airQuality,
						});
						callbackResponse = {
							type: "reply",
							response: _response,
						};
						callback(callbackResponse);
					})
					.catch((err) => {
						_response = RESPONSES.error.failed;
						callbackResponse = {
							type: "error",
							errorType: err,
							response: _response,
						};
						callback(callbackResponse);
					});
			})
			.catch((err) => {
				_response = RESPONSES.error.failed;
				callbackResponse = {
					type: "error",
					errorType: err,
					response: _response,
				};
				callback(callbackResponse);
			});
	},
	async vagalume(callback, { argumentsTxt }) {
		let callbackResponse = {};

		try {
			let searchTerms = argumentsTxt.split(",");
			let artist = searchTerms[0].trim();
			let song = searchTerms[1].trim();
			let url = configURLParams(
				"https://api.vagalume.com.br/search.php?",
				{
					apikey: process.env.LYRICS_API_KEY,
					art: artist,
					mus: song,
				},
			);
			requestFrom(url)
				.then((response) => {
					if (
						response.type != "song_notfound" &&
						response.type != "notfound"
					) {
						let _response = response.art.name + "\n\n";
						_response += response.mus[0].name + "\n\n";
						_response += RESPONSES.hidden;
						if (
							searchTerms[2] != null &&
							response.mus[0].translate != null
						) {
							_response += response.mus[0].translate[0].text;
						} else {
							_response += response.mus[0].text;
						}
						_response += "\n\n";
						_response += response.mus[0].url;
						callbackResponse = {
							type: "reply",
							response: _response,
						};
					} else {
						_response = RESPONSES.error.search;
						callbackResponse = {
							type: "reply",
							response: _response,
						};
					}
					callback(callbackResponse);
				})
				.catch((err) => {
					_response = RESPONSES.error.failed;
					callbackResponse = {
						type: "error",
						errorType: err,
						response: _response,
					};
					callback(callbackResponse);
				});
		} catch (err) {
			_response = RESPONSES.error.failed;
			callbackResponse = {
				type: "error",
				errorType: err,
				response: _response,
			};
			callback(callbackResponse);
		}
	},
	async music(callback) {
		let callbackResponse = {};
		let url = "https://binaryjazz.us/wp-json/genrenator/v1/genre/";
		requestFrom(url)
			.then((response) => {
				_response = response;
				callbackResponse = {
					type: "reply",
					response: _response,
				};
				callback(callbackResponse);
			})
			.catch((err) => {
				_response = RESPONSES.error.failed;
				callbackResponse = {
					type: "error",
					errorType: err,
					response: _response,
				};
				callback(callbackResponse);
			});
	},
	async advice(callback) {
		let callbackResponse = {};
		let url = "https://api.adviceslip.com/advice";
		requestFrom(url)
			.then((response) => {
				_response = response.slip.advice;
				callbackResponse = {
					type: "reply",
					response: _response,
				};
				callback(callbackResponse);
			})
			.catch((err) => {
				_response = RESPONSES.error.failed;
				callbackResponse = {
					type: "error",
					errorType: err,
					response: _response,
				};
				callback(callbackResponse);
			});
	},
	async cats(callback) {
		let callbackResponse = {};
		let randomItem = randomInt(catFacts.length);
		let _response = catFacts[randomItem];
		let url =
			"https://api.thecatapi.com/v1/images/search?&mime_types=jpg,png&";
		url = configURLParams(url, {
			api_key: process.env.CAT_API_KEY,
		});
		requestFrom(url)
			.then(async (response) => {
				let _img = await fetch(response[0].url);
				let buffer = await _img.buffer();
				let _type = imageType(buffer);
				let _imgURI = `data:${_type.mime};base64,${buffer.toString(
					"base64",
				)}`;
				let _imgFiletype = "file." + _type.ext;
				callbackResponse = {
					type: "imageWithCaption",
					caption: _response,
					imageURI: _imgURI,
					filetype: _imgFiletype,
				};
				callback(callbackResponse);
			})
			.catch((err) => {
				_response = RESPONSES.error.failed;
				callbackResponse = {
					type: "error",
					errorType: err,
					_response: _response,
				};
				callback(callbackResponse);
			});
	},
	async poke(callback, { argumentsTxt }) {
		console.log(argumentsTxt);
		let url = "https://pokeapi.co/api/v2/pokemon/" + argumentsTxt.trim();
		console.log(url);
		const callbackResponse = {};
		let _response = "";
		requestFrom(url)
			.then((response) => {
				//name
				let name = response.forms[0].name;
				name = "Name: " + name.charAt(0).toUpperCase() + name.slice(1);
				name += "\n";
				//abilities
				let abilities = response.abilities;
				for (let ability in abilities) {
					_response += abilities[ability].ability.name + " ";
				}
				abilities = _response.trim();
				abilities = abilities.replace(/ /g, ", ");
				abilities = "Abilities: " + abilities + "\n";
				//types
				_response = "";
				let types = response.types;
				for (let i in types) {
					_response += types[i].type.name + " ";
				}
				types = _response.trim();
				types = types.replace(/ /g, ", ");
				types = "Types: " + types + "\n";
				_response = name + abilities + types;
				_response = _response.trim();
				callbackResponse.type = "reply";
				callbackResponse.response = _response;
				callback(callbackResponse);
			})
			.catch((err) => {
				_response = RESPONSES.error.failed;
				callbackResponse.type = "error";
				callbackResponse.errorType = err;
				callbackResponse.response = _response;
				callback(callbackResponse);
			});
	},
	async horoscope(callback, { argumentsTxt }) {
		let url =
			"http://horoscope-api.herokuapp.com/horoscope/today/" +
			argumentsTxt;
		requestFrom(url)
			.then((response) => {
				_response = response["horoscope"];
				if (_response.length < 3) {
					_response = RESPONSES.error.search;
				}
				callbackResponse = {
					type: "reply",
					response: _response,
				};
				callback(callbackResponse);
			})
			.catch((err) => {
				_response = RESPONSES.error.failed;
				callbackResponse = {
					type: "error",
					errorType: err,
					response: _response,
				};
				callback(callbackResponse);
			});
	},
	async news(callback, { argumentsTxt }) {
		let callbackResponse = {};
		let searchTopic = newsTopic[0];
		if (newsTopic[argumentsTxt] != null) {
			searchTopic = newsTopic[argumentsTxt];
		}
		let url = "https://gnews.io/api/v4/top-headlines?max=5&country=br&";
		url = configURLParams(url, {
			topic: searchTopic,
			token: process.env.NEWS_API_TOKEN,
		});
		requestFrom(url)
			.then(async (response) => {
				let news = response.articles;
				for (let key in news) {
					let _caption = news[key].title;
					_caption += "\n\n";
					_caption += news[key].description;
					_caption += "\n\n";
					_caption += news[key].url;
					let _img = await fetch(news[key].image);
					let buffer = await _img.buffer();
					let _type = imageType(buffer);
					let _imgURI = `data:${_type.mime};base64,${buffer.toString(
						"base64",
					)}`;
					let _imgFiletype = "file." + _type.ext;
					callbackResponse = {
						type: "imageWithCaption",
						caption: _caption,
						imageURI: _imgURI,
						filetype: _imgFiletype,
					};
					callback(callbackResponse);
				}
			})
			.catch((err) => {
				_response = RESPONSES.error.failed;
				callbackResponse = {
					type: "error",
					errorType: err,
					_response: _response,
				};
				callback(callbackResponse);
			});
	},
	async movie(callback, { argumentsTxt }) {
		let callbackResponse = {};
		let url = "";
		let isRandom = false;
		if (argumentsTxt.length > 0) {
			let movieName = argumentsTxt;
			url =
				"https://api.themoviedb.org/3/search/multi?page=1&include_adult=true&";

			if (argumentsTxt.includes("y:")) {
				const params = argumentsTxt.split("y:");
				movieName = params[0].trim();
				url += `year=${params[1].trim()}&`;
			}
			url = configURLParams(url, {
				api_key: process.env.MOVIE_API_KEY,
				query: movieName,
				language: languageId,
			});
		} else {
			url =
				"https://api.themoviedb.org/3/discover/movie?include_adult=true&";
			url = configURLParams(url, {
				api_key: process.env.MOVIE_API_KEY,
				language: languageId,
			});
			isRandom = true;
		}
		console.log(url);
		let _response = "";
		requestFrom(url)
			.then(async (response) => {
				let index = 0;
				if (isRandom) {
					index = randomInt(response.results.length);
				}
				let result = response.results[index];
				let _caption = RESPONSES.hidden;
				_caption += RESPONSES.getMovieText(result);
				imgUrl =
					"https://image.tmdb.org/t/p/original" + result.poster_path;
				let img = await fetch(imgUrl);
				let buffer = await img.buffer();
				let _type = imageType(buffer);
				let _imgURI = `data:${_type.mime};base64,${buffer.toString(
					"base64",
				)}`;
				let _imgFiletype = "file." + _type.ext;
				callbackResponse = {
					type: "imageWithCaption",
					caption: _caption,
					imageURI: _imgURI,
					filetype: _imgFiletype,
				};
				callback(callbackResponse);
			})
			.catch((err) => {
				response = RESPONSES.error.search;
				callbackResponse = {
					type: "error",
					errorType: err,
					_response: _response,
				};
				callback(callbackResponse);
			});
	},
	async nasa(callback, { argumentsTxt }) {
		let callbackResponse = {};
		if (argumentsTxt.length > 0) {
			let url = "https://images-api.nasa.gov/search?media_type=image&";
			url = configURLParams(url, {
				q: argumentsTxt,
			});
			requestFrom(url)
				.then(async (response) => {
					let _results = response.collection.items;
					let _result = _results[randomInt(_results.length)];

					let _caption = _result.data[0].title;
					request(
						_result.href,
						{
							json: true,
						},
						async (error, res, b) => {
							let _img = await fetch(b[0]);
							let buffer = await _img.buffer();
							let _type = imageType(buffer);
							let _imgURI = `data:${
								_type.mime
							};base64,${buffer.toString("base64")}`;
							let _imgFiletype = "file." + _type.ext;
							callbackResponse = {
								type: "imageWithCaption",
								caption: _caption,
								imageURI: _imgURI,
								filetype: _imgFiletype,
							};
							callback(callbackResponse);
						},
					);
				})
				.catch((err) => {
					_response = RESPONSES.error.failed;

					callbackResponse = {
						type: "error",
						errorType: err,
						_response: _response,
					};
					callback(callbackResponse);
				});
		} else {
			let url =
				"https://api.nasa.gov/planetary/apod?api_key=" +
				process.env.NASA_API_KEY;
			requestFrom(url)
				.then(async (response) => {
					let _caption;
					if (response.media_type == "image") {
						let _img = await fetch(response.url);
						let buffer = await _img.buffer();
						let _type = imageType(buffer);

						_caption = response.title;
						let _imgURI = `data:${
							_type.mime
						};base64,${buffer.toString("base64")}`;
						let _imgFiletype = "file." + _type.ext;
						callbackResponse = {
							type: "imageWithCaption",
							caption: _caption,
							imageURI: _imgURI,
							fileType: _imgFiletype,
						};
						callback(callbackResponse);
					} else {
						let _url = response.url;
						callbackResponse = {
							type: "youtubeLink",
							url: _url,
						};
						callback(callbackResponse);
					}
				})
				.catch((err) => {
					_response = RESPONSES.error.failed;
					callbackResponse = {
						type: "error",
						errorType: err,
						_response: _response,
					};
					callback(callbackResponse);
				});
		}
	},
	async bill(callback, { argumentsTxt }) {
		let url = "https://belikebill.ga/billgen-API.php?";
		if (argumentsTxt.length > 0) {
			let billTxt = capitalizeText(argumentsTxt);
			url = configURLParams(url, {
				text: billTxt,
			});
		} else {
			url = configURLParams(url, {
				default: 1,
			});
		}
		console.log(url);
		let _img = await fetch(url);
		let buffer = await _img.buffer();
		let _type = imageType(buffer);
		let _imgURI = `data:${_type.mime};base64,${buffer.toString("base64")}`;
		let _imgFiletype = "file." + _type.ext;
		callbackResponse = {
			type: "image",
			imageURI: _imgURI,
			fileType: _imgFiletype,
		};
		callback(callbackResponse);
	},
	async randomquote(callback) {
		let quotes = randomQuotes.randomTen();
		let _response = RESPONSES.hidden;
		for (let q in quotes) {
			_response += '"' + quotes[q].quote + '"' + "\n";
			_response += "-" + quotes[q].author + "\n\n";
		}
		let callbackResponse = {
			type: "reply",
			response: _response.trim(),
		};
		callback(callbackResponse);
	},
	async quote(callback, { argumentsTxt }) {
		let quotes = await (
			await quotesSearch({
				term: argumentsTxt,
				max: 10,
			})
		).phrases;
		let _response = RESPONSES.hidden;
		for (let q in quotes) {
			_response +=
				'"' +
				quotes[q].text.replace(/.(?=[A-Z])/g, "$&\n") +
				'"' +
				"\n";
			_response += "-" + quotes[q].author + "\n\n";
		}
		let callbackResponse = {
			type: "reply",
			response: _response.trim(),
		};
		callback(callbackResponse);
	},
};
