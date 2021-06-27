require("dotenv").config();

// * global modules
global.fs = require("fs");
global.imageType = require("image-type");
global.DATA_FNS = {
	format,
	formatDistance,
	formatRelative,
	subDays,
} = require("date-fns");
const chalk = require("chalk");
const fetch = require("node-fetch");
//* global functions
global.FUNCTIONS = {
	isOnlyNumber,
	random: randomInt,
	getFilterPath,
	configURLParams,
	requestFrom,
	capitalizeText,
} = require("./lib/functions/global-functions.js");
//settings
global.OPTIONS = {
	language,
	languageId,
	country,
	botName,
	prefix,
	ownerNumber,
	botNumber,
} = require("./lib/options.js");
//import
const functions = Object.assign(
	require("./lib/functions/help-handler"),
	require("./lib/functions/entertainment-handler"),
	require("./lib/functions/math-handler"),
	require("./lib/functions/util-handler"),
	require("./lib/functions/api-handler"),
	require("./lib/cards-against-humanity/game"),
	require("./lib/functions/filter-handler"),
	require(`./lib/language/${language}/commands.js`),
);
const libPath = `./lib/language/${language}`;
//lang import
global.RESPONSES = require(`${libPath}/RESPONSES.js`);
global.RESPONSES["help"] = JSON.parse(fs.readFileSync(`${libPath}/help.json`));
global.INSULTS = require(`${libPath}/insults.json`);

//IA
const iaHandler = require("./lib/functions/ai-handler");
const stickerPackName = RESPONSES.stickerPackName;
const stickerPackAuthor = RESPONSES.stickerPackAuthor;

module.exports = async (client, message) => {
	try {
		const callback = async function (body) {
			const responseTypes = {
				async reply() {
					await client.reply(from, body.response, id);
				},
				async animatedSticker() {
					await client.sendMp4AsSticker(
						from,
						body.media,
						{ crop: false },
						{ pack: stickerPackName, author: stickerPackAuthor },
					);
				},
				async imageWithCaption() {
					await client.sendImage(
						from,
						body.imageURI,
						body.filetype,
						body.caption,
					);
				},
				async image() {
					await client.sendImage(from, body.imageURI, body.filetype);
				},
				async audio() {
					client.sendAudio(from, body.link, id);
				},
				async replyWithPushName() {
					let coupleList = "";
					const contactIdList = body.contactId;
					const contactLength = contactIdList.length;
					for (let i = 0; i < contactLength; i++) {
						const contact = await client.getContact(
							contactIdList[i],
						);
						const contactName =
							contact.pushname != null
								? contact.pushname
								: contact.formattedName;
						coupleList += contactName;
						if (i != contactLength - 1) {
							coupleList += " e ";
						}
					}
					coupleList = coupleList.trim();
					await client.reply(from, coupleList + body.response, id);
				},
				async mention() {
					await client.sendTextWithMentions(from, body.response);
				},
				async sticker() {
					await client.sendImageAsSticker(from, body.imageURI, {
						pack: stickerPackName,
						author: stickerPackAuthor,
					});
				},
				async link() {
					await client.sendLinkWithAutoPreview(
						from,
						body.link,
						body.caption,
					);
				},
				async message() {
					await client.sendText(body.chatId, body.response);
				},
				async fileFromUrlWithImage() {
					await client.sendFileFromUrl(
						from,
						body.image,
						body.fileType,
						body.url,
						id,
					);
				},
				async error() {
					console.log(body.errorType);
					if (from.id == ownerNumber)
						await client.reply(from, body.errorType.toString(), id);
					else await client.reply(from, body.response, id);
				},
			};
			const clientResponse = responseTypes[body.type];
			if (typeof clientResponse != "function") return;
			clientResponse();
		};
		const { id, from, sender, isGroupMsg, chat, caption, quotedMsg } =
			message;
		const { formattedTitle, groupMetadata } = chat;
		//commands
		let argumentsTxt = caption || message.body || "";
		argumentsTxt = argumentsTxt.toLowerCase();
		let quoteTxt = "";
		if (quotedMsg != null)
			quoteTxt =
				quotedMsg.caption ||
				(quotedMsg.type == "chat" ? quotedMsg.body : "");

		const groupId = isGroupMsg ? groupMetadata.id : "";
		// * verify if is a function
		if (argumentsTxt.startsWith(prefix) && argumentsTxt.length > 1) {
			//formatted log
			argumentsTxt = argumentsTxt.substr(1).trim();
			console.log(
				chalk.green(sender.pushname + ":"),
				chalk.yellow('"' + argumentsTxt + '"'),
				chalk.green(" at"),
				chalk.magenta(format(new Date(), "HH:mm")),
				isGroupMsg
					? chalk.green("from ") + chalk.red(formattedTitle)
					: "",
			);

			const argumentsList = argumentsTxt.split(" ");
			let command = argumentsList.shift() || "";
			argumentsTxt = argumentsList.join(" ");
			//* get function
			let functionToExecute = functions[command];
			if (functionToExecute == null) return;
			functionToExecute(callback, {
				argumentsTxt,
				argumentsList,
				quoteTxt,
				chat,
				isGroupMsg,
				groupId,
				message,
			});
		} else {
			let quoteMessageSender = "";
			if (quotedMsg != null) quoteMessageSender = quotedMsg.from;

			const replyIa = await iaHandler(
				callback,
				argumentsTxt,
				quoteTxt,
				quoteMessageSender,
				groupId,
			);
			if (replyIa == false) {
				if (!isGroupMsg) return;
				functions.searchFilter(callback, {
					argumentsTxt,
					groupId,
				});
			}
		}
	} catch (error) {
		console.log("[CATCH]=> ", error);
		client.reply(message.from, RESPONSES.error.failed, message.id);
	}
};
