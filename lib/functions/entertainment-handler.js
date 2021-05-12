const libPath = `../language/${language}`
const bolso = require(libPath + "/bolsonaro.json")
module.exports = {
    async measurer(callback, {
        argumentsTxt
    }) {
        let mod_type = argumentsTxt.trim();
        let mod = 0;
        if (mod_type == "anarcoprimitivista") {
            mod = 100;
        } else {
            mod = randomInt(100);
        }
        _response = RESPONSES.measurer(mod, mod_type);
        let callbackResponse = {
            type: 'reply',
            response: _response
        }
        callback(callbackResponse)
    },
    async insults(callback) {
        let _response = INSULTS[randomInt(INSULTS.length)];
        let callbackResponse = {
            type: 'reply',
            response: _response
        }
        callback(callbackResponse)
    },

    async choose(callback, {
        argumentsTxt
    }) {
        let _response;
        if (argumentsTxt.length = 0) {
            _response = RESPONSES.error.invalid
        } else {
            let str = argumentsTxt.includes(",") ? argumentsTxt.split(",") : argumentsTxt.split(" ");
            let firstWordIndex = randomInt(str.length);
            _response = str[firstWordIndex].trim();
        }
        let callbackResponse = {
            type: 'reply',
            response: _response
        }
        callback(callbackResponse);
    },
    async countwords(callback, {
        quoteTxt
    }) {
        let callbackResponse = {}
        callbackResponse.type = 'reply'
        let _response = ''
        if (quoteTxt.length > 1) {
            _response = quoteTxt.length.toString()
        } else {
            _response = RESPONSES.error.invalid
        }
        callbackResponse.response = _response
        callback(callbackResponse);
    },
    async ship(callback, {
        message
    }) {
        let _response = "";
        let callbackResponse = {}
        if (message.isGroupMsg) {
            let members = message.chat.groupMetadata.participants;
            let random = randomInt(members.length);
            let member = {};
            member[0] = members[random].id.split("@")[0];
            //member = member.id;
            members = members.filter(function (element) {
                return element != members;
            });
            random = randomInt(members.length);
            member[1] = members[random].id.split("@")[0];
            _response = `@${member[0]} e @${member[1]}`;
            callbackResponse.type = 'mention';
            callbackResponse.response = _response;
        } else {
            callbackResponse.type = 'reply';
            _response = RESPONSES.error.group;
        }
        callback(callbackResponse);
    },
    async who(callback, {
        message
    }) {
        let _response = "";
        let callbackResponse = {}
        if (message.isGroupMsg) {
            let members = message.chat.groupMetadata.participants;
            let random = randomInt(members.length);
            let member = members[random].id.replace('@c.us', '');
            _response = "@" + member;
            callbackResponse.type = 'mention';
            callbackResponse.response = _response;
        } else {
            callbackResponse.type = 'reply';
            _response = RESPONSES.error.group;
        }
        callback(callbackResponse);
    },
    async tts(callback, {
        argumentsTxt,
        quoteTxt,
        argumentsList
    }) {
        const callbackResponse = {}
        try {
            const tts = require("node-gtts")(argumentsList[0]);
            console.log(tts);
            const dataText = argumentsTxt.length > 2 ? argumentsTxt.slice(3) : quoteTxt;
            if (tts != null) {
                tts.save("./media/tts/resId.mp3", dataText, function () {
                    callbackResponse.type = 'audio';
                    callbackResponse.link = "./media/tts/resId.mp3"
                    callback(callbackResponse)
                });
            } else {
                callbackResponse.type = 'reply';
                callbackResponse.response = RESPONSES.error.invalid
                callback(callbackResponse)
            }
        } catch (err) {
            callbackResponse.type = 'error';
            callbackResponse.errorType = err
            callbackResponse.response = RESPONSES.error.failed
            callback(callbackResponse)
        }
    },
}