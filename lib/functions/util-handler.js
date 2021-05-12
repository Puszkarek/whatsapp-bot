require("dotenv").config();
const dwiki = require("../desciclopedia/dist");
const wiki = require("wikipedia");
const fetch = require("node-fetch");
const wrap = require("word-wrap");
const gis = require("g-i-s");
const im = require("gm").subClass({
    imageMagick: true
});
const {
    Translate
} = require("@google-cloud/translate").v2;
const translate = new Translate({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
    projectId: JSON.parse(process.env.GOOGLE_CREDENTIALS).project_id,
});
const {
    decryptMedia
} = require("@open-wa/wa-decrypt");
const uaOverride = "WhatsApp/2.16.352 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Safari/605.1.15";




module.exports = {
    async sticker(callback, {
        message,
        argumentsTxt
    }) {
        let m = null;
        let callbackResponse = {}
        if (message.quotedMsgObj != null) {
            m = message.quotedMsgObj;
        } else {
            m = message;
        }
        if (m.mimetype) {
            let media = await decryptMedia(m, uaOverride);
            if (m.type === "image") {
                if (argumentsTxt.length >= 1) {
                    let str = wrap(argumentsTxt, {
                        width: 18
                    });
                    await im(media)
                        .size(function (err, size) {
                            if (!err) {
                                let fontSize = size.width * 0.12
                                let fontStroke = size.width * 0.004
                                im(media).font("./lib/theboldfont.otf", fontSize)
                                    .stroke("#000", 2)
                                    .fill("#ffffff")
                                    .drawText(0, 10, str, "South")
                                    .resize(512, 512)
                                    .background("Transparent")
                                    .gravity("Center")
                                    .extent(512, 512)
                                    .toBuffer("WEBP", async function (err, buffer) {
                                        if (err) {
                                            callbackResponse.type = 'error';
                                            callbackResponse.errorType = err;
                                            callbackResponse.response = RESPONSES.error.failed

                                        } else {
                                            _imgURI = `data:${m.mimetype};base64,${buffer.toString("base64")}`;
                                            callbackResponse.type = 'sticker';
                                            callbackResponse.imageURI = _imgURI;
                                        }
                                        callback(callbackResponse)
                                    });
                            }
                        })

                } else {
                    await im(media)
                        .resize(512, 512)
                        .background("Transparent")
                        .gravity("Center")
                        .extent(512, 512)
                        .toBuffer("WEBP", async function (err, buffer) {
                            if (err) {
                                console.log(buffer)
                                callbackResponse.type = 'error';
                                callbackResponse.errorType = err;
                                callbackResponse.response = RESPONSES.error.failed

                            } else {
                                _imgURI = `data:${m.mimetype};base64,${buffer.toString("base64")}`;
                                callbackResponse.type = 'sticker';
                                callbackResponse.imageURI = _imgURI;
                            }
                            callback(callbackResponse)
                        });
                }
            } else {
                callbackResponse.type = 'animatedSticker'
                callbackResponse.media = media;
                callback(callbackResponse);
            }
        }
    },
    async wiki(callback, {
        argumentsTxt
    }) {
        let _response = "";
        let callbackResponse = {}
        callbackResponse.type = 'reply'
        if (argumentsTxt.length > 1) {
            try {
                let searchLanguage = await wiki.setLang(language);
                let searchResults = await wiki.search(argumentsTxt);
                let page = await wiki.page(searchResults.results[0].pageid);
                let content = await page.content({
                    redirect: false
                });
                _response = content;
                callbackResponse.response = _response
                callback(callbackResponse)
            } catch (err) {
                callbackResponse.type = 'error'
                callbackResponse.errorType = err
                callbackResponse.response = RESPONSES.error.search
                callback(callbackResponse)
            }
        }
    },
    async dwiki(callback, {
        argumentsTxt
    }) {
        let _response = "";
        let callbackResponse = {}
        callbackResponse.type = 'reply'
        if (argumentsTxt.length > 0) {
            try {
                let searchResults = await dwiki.search(argumentsTxt);
                let page = await dwiki.page(searchResults.results[0].pageid);
                let content = await page.content({
                    redirect: false
                });
                _response = content;
                callbackResponse.response = _response
                callback(callbackResponse)
            } catch (err) {
                callbackResponse.type = 'error'
                callbackResponse.errorType = err
                callbackResponse.response = RESPONSES.error.search
                callback(callbackResponse)
            }
        }
    },
    async image(callback, {
        argumentsTxt
    }) {
        let callbackResponse = {}
        callbackResponse.type = 'reply';
        gis(argumentsTxt, async (error, results) => {
            if (error) {
                callbackResponse.type = 'error'
                callbackResponse.errorType = error;
                callback(callbackResponse)
            } else {
                try {
                    let item = results[randomInt(90)];
                    let img = await fetch(item.url);
                    let _response = await img.buffer();
                    let _type = imageType(_response);
                    let _filetype = "file." + _type.ext;
                    let _imgURI = `data:${_type.mime};base64,${_response.toString("base64")}`
                    if (_type != null) {
                        callbackResponse.type = 'image';
                        callbackResponse.imageURI = _imgURI;
                        callbackResponse.filetype = _filetype;
                        callback(callbackResponse)
                    } else {
                        callbackResponse.type = 'reply';
                        callbackResponse.response = RESPONSES.error.failed;
                        callback(callbackResponse)
                    }
                } catch (err) {
                    callbackResponse.type = 'error'
                    callbackResponse.errorType = err;
                    callback(callbackResponse)
                }
            }
        });
    },
    async botname(callback, {
        argumentsTxt
    }) {
        botName = argumentsTxt.trim();
        callbackResponse.type = 'reply';
        callbackResponse.response = RESPONSES.botNameSet + botName;
        callback(callbackResponse)
    },

    async tr(callback, {
        argumentsTxt,
        argumentsList,
        quoteTxt
    }) {
        let callbackResponse = {}
        callbackResponse.type = 'reply'
        let _target = argumentsList[0] != null ? argumentsList[0] : language;
        const dataText = quoteTxt != '' ? quoteTxt : argumentsTxt.slice(3);
        if (dataText === "") {
            callbackResponse.response = RESPONSES.error.invalid
        } else {
            let [_response] = await translate.translate(dataText, _target);
            callbackResponse.response = _response;
        }
        callback(callbackResponse)
    },
    async mentionall(callback, {
        message
    }) {
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
            type: 'mention',
            response: _response
        }
        callback(callbackResponse)
    },
}