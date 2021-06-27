require("dotenv").config();
const wiki = require("wikipedia");
const fetch = require("node-fetch");
const wrap = require("word-wrap");
const gis = require("g-i-s");
const im = require("gm").subClass({
	imageMagick: true,
});
const { Translate } = require("@google-cloud/translate").v2;
const translate = new Translate({
	credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
	projectId: JSON.parse(process.env.GOOGLE_CREDENTIALS).project_id,
});
const { decryptMedia } = require("@open-wa/wa-decrypt");
const uaOverride =
	"WhatsApp/2.16.352 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Safari/605.1.15";

//sticker config
const fontRatio = 0.12;
const fontStrokeRatio = 0.004;
const bottomRatio = 0.02;

module.exports = {
	async sticker(callback, { message, argumentsTxt }) {
		let m = null;
		let callbackResponse = {};
		if (message.quotedMsgObj != null) {
			m = message.quotedMsgObj;
		} else {
			m = message;
		}
		if (m.mimetype) {
			let media = await decryptMedia(m, uaOverride);
			if (m.type === "image") {
				if (argumentsTxt.length >= 1) {
					await im(media).size(function (err, size) {
						try {
							if (!err) {
								let scale = 1;
								let stickerArguments = argumentsTxt;
								let color = "#ffffff";
								let addStroke = true;
								let fontType = "./lib/theboldfont.otf";
								if (argumentsTxt.includes(",")) {
									const params = stickerArguments.split(",");
									console.log(params);
									stickerArguments = params[0].trim();
									scale = parseFloat(params[1]);
									if (params[2] != null) {
										color = params[2].trim();
									}
									if (params[3] != null) {
										fontType = capitalizeText(
											params[4],
										).trim();
									}
									if (
										params[4] != null &&
										params[4].includes("false")
									) {
										console.log("set to not add stroke");
										addStroke = false;
									}
								}
								// * scale
								const imageWidth = size.width;
								let fontSize = imageWidth * fontRatio * scale;
								let fontStroke = 0;
								if (addStroke) {
									console.log("add font stroke");
									fontStroke =
										imageWidth * fontStrokeRatio * scale;
								}
								let bottomOffset = imageWidth * bottomRatio;
								let widthScale = Math.floor(14 / scale);
								// * config Caption
								let stickerCaptions = wrap(stickerArguments, {
									width: widthScale,
									trim: true,
									indent: "",
								});
								stickerCaptions = stickerCaptions.toUpperCase();

								im(media)
									.font(fontType, fontSize)
									.stroke("#000", fontStroke)
									.fill(color)
									.drawText(
										0,
										bottomOffset,
										stickerCaptions,
										"South",
									)
									.resize(512, 512)
									.background("Transparent")
									.gravity("Center")
									.extent(512, 512)
									.toBuffer(
										"WEBP",
										async function (err, buffer) {
											if (err) {
												callbackResponse.type = "error";
												callbackResponse.errorType =
													err;
												callbackResponse.response =
													RESPONSES.error.failed;
											} else {
												_imgURI = `data:${
													m.mimetype
												};base64,${buffer.toString(
													"base64",
												)}`;
												callbackResponse.type =
													"sticker";
												callbackResponse.imageURI =
													_imgURI;
											}
											callback(callbackResponse);
										},
									);
							}
						} catch (error) {
							console.log(error);
						}
					});
				} else {
					await im(media)
						.resize(512, 512)
						.background("Transparent")
						.gravity("Center")
						.extent(512, 512)
						.toBuffer("WEBP", async function (err, buffer) {
							if (err) {
								console.log(buffer);
								callbackResponse.type = "error";
								callbackResponse.errorType = err;
								callbackResponse.response =
									RESPONSES.error.failed;
							} else {
								_imgURI = `data:${
									m.mimetype
								};base64,${buffer.toString("base64")}`;
								callbackResponse.type = "sticker";
								callbackResponse.imageURI = _imgURI;
							}
							callback(callbackResponse);
						});
				}
			} else {
				callbackResponse.type = "animatedSticker";
				callbackResponse.media = media;
				callback(callbackResponse);
			}
		}
	},
	async wiki(callback, { argumentsTxt }) {
		let _response = RESPONSES.hidden;
		let callbackResponse = {};
		callbackResponse.type = "reply";
		if (argumentsTxt.length > 1) {
			try {
				let searchLanguage = await wiki.setLang(language);
				let searchResults = await wiki.search(argumentsTxt);
				let page = await wiki.page(searchResults.results[0].pageid);
				let content = await page.content({
					redirect: false,
				});
				_response += content.replaceAll("\n", "\n\n");
				callbackResponse.response = _response;
				callback(callbackResponse);
			} catch (err) {
				callbackResponse.type = "error";
				callbackResponse.errorType = err;
				callbackResponse.response = RESPONSES.error.search;
				callback(callbackResponse);
			}
		}
	},
	async image(callback, { argumentsTxt }) {
		let callbackResponse = {};
		callbackResponse.type = "reply";
		gis(argumentsTxt, async (error, results) => {
			if (error) {
				callbackResponse.type = "error";
				callbackResponse.errorType = error;
				callback(callbackResponse);
			} else {
				try {
					for (let i = 0; i < 10; i++) {
						let item = results[randomInt(40)];
						let img = await fetch(item.url);
						let _response = await img.buffer();
						let _type = imageType(_response);
						console.log(_type);
						if (_type != null) {
							let _filetype = "file." + _type.ext;
							let _imgURI = `data:${
								_type.mime
							};base64,${_response.toString("base64")}`;
							callbackResponse.type = "image";
							callbackResponse.imageURI = _imgURI;
							callbackResponse.filetype = _filetype;
							callback(callbackResponse);
							break;
						}
					}
				} catch (err) {
					callbackResponse.type = "error";
					callbackResponse.errorType = err;
					callback(callbackResponse);
				}
			}
		});
	},
	async tr(callback, { argumentsTxt, argumentsList, quoteTxt }) {
		let callbackResponse = {};
		callbackResponse.type = "reply";
		let _target = argumentsList[0] != null ? argumentsList[0] : language;
		const dataText = quoteTxt != "" ? quoteTxt : argumentsTxt.slice(3);
		if (dataText === "") {
			callbackResponse.response = RESPONSES.error.invalid;
		} else {
			let [_response] = await translate.translate(dataText, _target);
			callbackResponse.response = _response;
		}
		callback(callbackResponse);
	},
	async mentionall(callback, { message }) {
		let _response = "";
		if (message.isGroupMsg) {
			let members = message.chat.groupMetadata.participants;
			for (let member in members) {
				_response += "@";
				_response += members[member].id.split("@")[0];
				_response += "\n";
			}
			_response = _response.trim();
		} else {
			_response = RESPONSES.error.group;
		}
		let callbackResponse = {
			type: "mention",
			response: _response,
		};
		callback(callbackResponse);
	},
};
