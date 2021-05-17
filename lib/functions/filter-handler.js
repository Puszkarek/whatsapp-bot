//word filters
const filterPath = "./session/filters/";
const filters = {};
let filtersPath = fs.readdirSync(filterPath);
if (filtersPath.length > 0) {
    for (let i in filtersPath) {
        let pathId = filterPath + filtersPath[i];
        let id = filtersPath[i].replace(".json", "");
        filters[id] = JSON.parse(fs.readFileSync(pathId));
    }
}

function getFilterPath(path, id) {
    return path + id + ".json";
}
module.exports = {
    async filter(callback, {
        argumentsTxt,
        argumentsList,
        isGroupMsg,
        groupId,
        quoteTxt
    }) {
        let _response = '';
        const callbackResponse = {}
        callbackResponse.type = 'reply'
        if (isGroupMsg) {
            let key = "";
            let filterContent = "";
            if (quoteTxt != '') {
                //is a reply
                key = argumentsTxt.trim();
                filterContent = quoteTxt
            } else {
                //isn't a reply
                if (argumentsTxt.includes('"')) {
                    txt = argumentsTxt.split('"');
                    key = txt[1].trim();
                    filterContent = txt[2];
                } else {
                    key = argumentsList[0].trim();
                    let i = argumentsTxt.indexOf(" ") + 1;
                    filterContent = argumentsTxt.substr(i);
                }
            }
            if (!(argumentsTxt < 1)) {
                let currentFilter = filters[groupId] != null ? filters[groupId] : {};
                currentFilter[key] = filterContent.trim();
                newFilterList = JSON.stringify(Object.assign({}, currentFilter));
                fs.writeFileSync(getFilterPath(filterPath, groupId), newFilterList);
                filters[groupId] = currentFilter;
                _response = key + RESPONSES.filters.add;
            }
        } else {
            _response = RESPONSES.error.group;
        }
        callbackResponse.response = _response;
        callback(callbackResponse)
    },
    async removefilter(callback, {
        argumentsTxt,
        argumentsList,
        isGroupMsg,
        groupId
    }) {
        const callbackResponse = {}
        callbackResponse.type = 'reply'
        let _response = "";
        if (isGroupMsg) {
            let key = argumentsTxt.trim();
            if (argumentsTxt.length > 0) {
                let currentFilter = filters[groupId];
                if (currentFilter[key] == null) return;
                delete currentFilter[key];
                let newFilterList = JSON.stringify(Object.assign({}, currentFilter));
                fs.writeFileSync(getFilterPath(filterPath, groupId), newFilterList);
                _response = argumentsList + RESPONSES.filters.remove;
            }
        } else {
            _response = RESPONSES.error.group;
        }
        callbackResponse.response = _response;
        callback(callbackResponse)
    },
    async listfilters(callback, {
        isGroupMsg,
        groupId
    }) {
        const callbackResponse = {}
        callbackResponse.type = 'reply'
        let _response = "";
        if (isGroupMsg) {
            for (let key in filters[groupId]) {
                _response += key + "\n";
            }
        } else {
            _response = RESPONSES.error.group;
        }
        callbackResponse.response = _response.trim();
        callback(callbackResponse)
    },
    async searchFilter(callback, {
        argumentsTxt,
        groupId
    }) {
        currentFilter = filters[groupId];
        if (currentFilter == null) return;
        for (var key in currentFilter) {
            let str = argumentsTxt.search(key);

            if (str >= 0) {
                let previous = argumentsTxt.charAt(str - 1);
                let end = argumentsTxt.charAt(str + key.length);
                if ((previous === " " || previous === "") && (end === " " || end === "")) {
                    //is a word
                    let _response = currentFilter[key];
                    const callbackResponse = {
                        type: 'reply',
                        response: _response
                    }
                    callback(callbackResponse)
                    break;
                }
            }
        }
    }
}