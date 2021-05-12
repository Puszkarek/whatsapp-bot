const {
    newsTopic
} = require("../language/pt/RESPONSES");

module.exports = {
    async help(callback) {
        let _response = "";
        for (var key in RESPONSES.help) {
            _response += prefix + key + "\n";
            _response += RESPONSES.help[key];
            _response += "\n\n───────────────\n\n"
        }
        let callbackResponse = {
            type: 'reply',
            response: _response.trim()
        }
        callback(callbackResponse)
    },
    async newsTopic(callback) {
        let _response = "";
        for (let key in RESPONSES.newsTopic) {
            _response += key + " = " + RESPONSES.newsTopic[key] + "\n";
        }
        let callbackResponse = {
            type: 'reply',
            response: _response
        }
        callback(callbackResponse)
    },
    async ping(callback) {
        let _response = 'pong'
        let callbackResponse = {
            type: 'reply',
            response: _response
        }
        callback(callbackResponse)
    },
}