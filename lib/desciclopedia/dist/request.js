"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAPIUrl = exports.makeRestRequest = void 0;
const node_fetch_1 = require("node-fetch");
const url_1 = require("url");
const errors_1 = require("./errors");
let API_URL = 'http://desciclopedia.org/api.php?', REST_API_URL = 'http://en.wikipedia.org/api/rest_v1/';
// RATE_LIMIT = false,
// RATE_LIMIT_MIN_WAIT = undefined,
// RATE_LIMIT_LAST_CALL = undefined,
const USER_AGENT = 'wikipedia (https://github.com/dopecodez/Wikipedia/)';
// Makes a request to legacy php endpoint
async function makeRequest(params, redirect = true) {
    try {
        const search = new url_1.URLSearchParams({ ...params });
        search.set('format', 'json');
        if (redirect) {
            search.set('redirects', '');
        }
        if (!params.action)
            search.set('action', "query");
        const options = {
            headers: {
                'User-Agent': USER_AGENT
            }
        };
        const response = await node_fetch_1.default(new url_1.URL(API_URL + search), options);
        const responseBuffer = await response.buffer();
        const result = JSON.parse(responseBuffer.toString());
        return result;
    }
    catch (error) {
        throw new errors_1.wikiError(error);
    }
}
// Makes a request to rest api endpoint
async function makeRestRequest(path, redirect = true) {
    try {
        if (!redirect) {
            path += '?redirect=false';
        }
        const options = {
            headers: {
                'User-Agent': USER_AGENT
            }
        };
        const response = await node_fetch_1.default(new url_1.URL(REST_API_URL + path), options);
        const responseBuffer = await response.buffer();
        const result = JSON.parse(responseBuffer.toString());
        return result;
    }
    catch (error) {
        throw new errors_1.wikiError(error);
    }
}
exports.makeRestRequest = makeRestRequest;
//change language of both urls
function setAPIUrl(prefix) {
    API_URL = 'http://' + prefix.toLowerCase() + '.wikipedia.org/w/api.php?';
    REST_API_URL = 'http://' + prefix.toLowerCase() + '.wikipedia.org/api/rest_v1/';
    return API_URL;
}
exports.setAPIUrl = setAPIUrl;
exports.default = makeRequest;
