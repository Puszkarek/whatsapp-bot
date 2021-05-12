const botAI = require("cleverbot-free");
const alexa = require("alexa-bot-api");
const assistantAi = new alexa();
var messageCxt = []
var isWaitBotReply = false;
module.exports = async (callback, argumentsTxt, quoteTxt, from) => {

    function isCalled() {
        if (from == botNumber && quoteTxt != '' && argumentsTxt != 'tr') return true
        return false
    }

    function isCalledByName() {
        let str = messageAI.search(botName);
        if (str >= 0) {
            let previous = messageAI.charAt(str - 1);
            let end = messageAI.charAt(str + botName.length);
            if ((previous === " " || previous === "") &&
                (
                    end === " " ||
                    end === "" ||
                    end === "," ||
                    end === "?"
                )) {
                messageAI = messageAI.slice(0, str - 1);
                messageAI += messageAI.slice((str + botName.length), messageAI.length);
                return true;
            }
        }
        return false;
    }

    async function reply() {
        botAI(messageAI, messageCxt, 'pt').then((response) => {
                //isWaitBotReply = false;
                if (response != '') {
                    messageCxt.push(messageAI);
                    messageCxt.push(response);
                    if (messageCxt.length > 8) {
                        messageCxt.shift()
                    }
                    const callbackResponse = {
                        type: 'reply',
                        response: response
                    }
                    callback(callbackResponse)
                }
            })
            .catch((err) => {
                assistantAi.getReply(messageAI, "pt").then((reply) => {
                        const callbackResponse = {
                            type: 'reply',
                            response: reply
                        }
                        callback(callbackResponse)
                    })
                    .catch((err) => {
                        console.log(err)
                    });
            })

    }
    messageAI = argumentsTxt
    if (!((isCalled() || isCalledByName()))) return false;
    if (isWaitBotReply) return false;
    reply();
}