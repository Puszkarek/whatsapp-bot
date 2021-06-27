const clever = require("cleverbot-free");
let messageCxt = RESPONSES.botInitialContext;
let isWaitBotReply = false;
const OpenAI = require("openai-api");
const ai_Bot = new OpenAI(process.env.OPENAI_API_KEY);
const AI_PERSONALITY = RESPONSES.botPersonality;

global.ENABLECHAT = "";
module.exports = async (callback, argumentsTxt, quoteTxt, from, groupId) => {
	function isCalled() {
		if (from == botNumber && quoteTxt != "")
			//&& argumentsTxt != "tr")
			return true;
		return false;
	}

	function isCalledByName() {
		let str = messageAI.search(botName);
		if (str >= 0) {
			let previous = messageAI.charAt(str - 1);
			let end = messageAI.charAt(str + botName.length);
			if (
				(previous === " " || previous === "") &&
				(end === " " || end === "" || end === "," || end === "?")
			) {
				return true;
			}
		}
		return false;
	}
	messageAI = argumentsTxt;
	//isCalled() ||
	if (!(isCalledByName() || isCalled())) return false;
	if (groupId == ENABLECHAT) {
		await useOpenAI({ argumentsTxt, messageAI, messageCxt, callback });
		return;
	}
	useCleverBot({ messageAI, messageCxt, callback });
};
async function useOpenAI({ messageAI, messageCxt, callback }) {
	let _response = "";
	const callbackResponse = {};
	const cxt = ` \nEu: ${messageCxt[0]} \nBot: ${messageCxt[1]} \nEu: ${messageAI} \nBot:`;
	console.log(AI_PERSONALITY + cxt);
	const gptResponse = await ai_Bot.complete({
		engine: "davinci",
		prompt: AI_PERSONALITY + cxt,
		maxTokens: 100,
		temperature: 0.9,
		presencePenalty: 0,
		frequencyPenalty: 0,
		bestOf: 1,
		n: 1,
		stream: false,
		stop: ["?", ".", "\n", "Bot:"],
	});
	_response = gptResponse.data.choices[0].text;
	messageCxt = [messageAI, _response];
	callbackResponse.type = "reply";
	callbackResponse.response = _response;
	callback(callbackResponse);
}
function useCleverBot({ messageAI, messageCxt, callback }) {
	let _response = "";
	const callbackResponse = {};
	clever(messageAI, messageCxt, "pt")
		.then((reply) => {
			if (reply == undefined) return;
			messageCxt.push(messageAI);
			messageCxt.push(response);
			if (messageCxt.length > 3) {
				messageCxt.shift();
			}
			const callbackResponse = {
				type: "reply",
				response: reply,
			};
			callback(callbackResponse);
		})
		.catch((err) => {
			console.log(err);
		});
}
