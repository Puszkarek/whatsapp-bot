"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.media = exports.related = exports.summary = exports.rawInfo = exports.tables = exports.infobox = exports.langLinks = exports.coordinates = exports.references = exports.links = exports.categories = exports.content = exports.html = exports.intro = exports.images = exports.Page = void 0;
const errors_1 = require("./errors");
const request_1 = require("./request");
const utils_1 = require("./utils");
const messages_1 = require("./messages");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const infoboxParser = require('infobox-parser');
class Page {
    constructor(response) {
        /**
         * Returns the intro present in a wiki page
         *
         * @remarks
         * This method is part of the {@link Page | Page }.
         *
         * @param title - The title or page Id of the page
         * @param redirect - Whether to redirect in case of 302
         * @returns The intro string
         */
        this.intro = async (pageOptions) => {
            try {
                if (!this._intro) {
                    const response = await exports.intro(this.pageid.toString(), pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.redirect);
                    this._intro = response;
                }
                return this._intro;
            }
            catch (error) {
                throw new errors_1.introError(error);
            }
        };
        /**
         * Returns the images present in a wiki page
         *
         * @remarks
         * This method is part of the {@link Page | Page }.
         *
         * @param title - The title or page Id of the page
         * @param listOptions - {@link listOptions | listOptions }
         * @returns an array of imageResult {@link imageResult | imageResult }
         */
        this.images = async (listOptions) => {
            try {
                if (!this._images) {
                    const result = await exports.images(this.pageid.toString(), listOptions);
                    this._images = result;
                }
                return this._images;
            }
            catch (error) {
                throw new errors_1.imageError(error);
            }
        };
        /**
         * Returns the summary of the page
         *
         * @remarks
         * This method is part of the {@link Page | Page }.
         *
         * @param title - The title or page Id of the page
         * @param redirect - Whether to redirect in case of 302
         * @returns The summary of the page as {@link wikiSummary | wikiSummary}
         *
         */
        this.summary = async (pageOptions) => {
            try {
                if (!this._summary) {
                    const result = await exports.summary(this.title, pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.redirect);
                    this._summary = result;
                }
                return this._summary;
            }
            catch (error) {
                throw new errors_1.summaryError(error);
            }
        };
        /**
         * Returns the html content of a page
         *
         * @remarks
         * This method is part of the {@link Page | Page }.
         *
         * @param title - The title or page Id of the page
         * @param redirect - Whether to redirect in case of 302
         * @returns The html content as string
         *
         * @beta
         */
        this.html = async (pageOptions) => {
            try {
                if (!this._html) {
                    const result = await exports.html(this.pageid.toString(), pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.redirect);
                    this._html = result;
                }
                return this._html;
            }
            catch (error) {
                throw new errors_1.htmlError(error);
            }
        };
        /**
         * Returns the plain text content of a page and sets parent Id and rev Id
         *
         * @remarks
         * This method is part of the {@link Page | Page }.
         *
         * @param title - The title or page Id of the page
         * @param redirect - Whether to redirect in case of 302
         * @returns The plain text as string and the parent and revision ids
         */
        this.content = async (pageOptions) => {
            try {
                if (!this._content) {
                    const result = await exports.content(this.pageid.toString(), pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.redirect);
                    this.parentid = result.ids.parentId;
                    this.revid = result.ids.revId;
                    this._content = result.result;
                }
                return this._content;
            }
            catch (error) {
                throw new errors_1.contentError(error);
            }
        };
        /**
         * Returns the cetegories present in page
         *
         * @remarks
         * This method is part of the {@link Page | Page }.
         *
         * @param title - The title or page Id of the page
         * @param listOptions - {@link listOptions | listOptions }
         * @returns The categories as an array of string
         */
        this.categories = async (listOptions) => {
            try {
                if (!this._categories) {
                    const result = await exports.categories(this.pageid.toString(), listOptions);
                    this._categories = result;
                }
                return this._categories;
            }
            catch (error) {
                throw new errors_1.categoriesError(error);
            }
        };
        /**
         * Returns the links present in page
         *
         * @remarks
         * This method is part of the {@link Page | Page }.
         *
         * @param title - The title or page Id of the page
         * @param listOptions - {@link listOptions | listOptions }
         * @returns The links as an array of string
         */
        this.links = async (listOptions) => {
            try {
                if (!this._links) {
                    const result = await exports.links(this.pageid.toString(), listOptions);
                    this._links = result;
                }
                return this._links;
            }
            catch (error) {
                throw new errors_1.linksError(error);
            }
        };
        /**
         * Returns the references of external links present in page
         *
         * @remarks
         * This method is part of the {@link Page | Page }.
         *
         * @param title - The title or page Id of the page
         * @param listOptions - {@link listOptions | listOptions }
         * @returns The references as an array of string
         */
        this.references = async (listOptions) => {
            try {
                if (!this._references) {
                    const result = await exports.references(this.pageid.toString(), listOptions);
                    this._references = result;
                }
                return this._references;
            }
            catch (error) {
                throw new errors_1.linksError(error);
            }
        };
        /**
         * Returns the coordinates of a page
         *
         * @remarks
         * This method is part of the {@link Page | Page }.
         *
         * @param title - The title or page Id of the page
         * @param redirect - Whether to redirect in case of 302
         * @returns The coordinates as {@link coordinatesResult | coordinatesResult}
         */
        this.coordinates = async (pageOptions) => {
            try {
                if (!this._coordinates) {
                    const result = await exports.coordinates(this.pageid.toString(), pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.redirect);
                    this._coordinates = result;
                }
                return this._coordinates;
            }
            catch (error) {
                throw new errors_1.coordinatesError(error);
            }
        };
        /**
         * Returns the language links present in the page
         *
         * @remarks
         * This method is part of the {@link Page | Page }.
         *
         * @param title - The title or page Id of the page
         * @param listOptions - {@link listOptions | listOptions }
         * @returns The links as an array of {@link langLinksResult | langLinksResult }
         */
        this.langLinks = async (listOptions) => {
            try {
                if (!this._langLinks) {
                    const result = await exports.langLinks(this.pageid.toString(), listOptions);
                    this._langLinks = result;
                }
                return this._langLinks;
            }
            catch (error) {
                throw new errors_1.linksError(error);
            }
        };
        /**
         * Returns the infobox content of page if present
         *
         * @remarks
         * This method is part of the {@link Page | Page }.
         *
         * @param title - The title or page Id of the page
         * @param redirect - Whether to redirect in case of 302
         * @returns The info as JSON object
         */
        this.infobox = async (pageOptions) => {
            try {
                if (!this._infobox) {
                    const result = await exports.infobox(this.pageid.toString(), pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.redirect);
                    this._infobox = result;
                }
                return this._infobox;
            }
            catch (error) {
                throw new errors_1.infoboxError(error);
            }
        };
        /**
         * Returns the table content of page if present
         *
         * @remarks
         * This method is part of the {@link Page | Page }.
         *
         * @param title - The title or page Id of the page
         * @param redirect - Whether to redirect in case of 302
         * @returns The tables as arrays of JSON objects
         */
        this.tables = async (pageOptions) => {
            try {
                if (!this._tables) {
                    const result = await exports.tables(this.pageid.toString(), pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.redirect);
                    this._tables = result;
                }
                return this._tables;
            }
            catch (error) {
                throw new errors_1.infoboxError(error);
            }
        };
        /**
         * Returns summaries for 20 pages related to the given page. Summaries include page title, namespace
         * and id along with short text description of the page and a thumbnail.
         *
         * @remarks
         * This method is part of the {@link Page | Page }.
         *
         * @param title - The title or page Id of the page
         * @param redirect - Whether to redirect in case of 302
         * @returns The related pages and summary as an array of {@link wikiSummary | wikiSummary}
         *
         * @experimental
         */
        this.related = async (pageOptions) => {
            try {
                if (!this._related) {
                    const result = await exports.related(this.title, pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.redirect);
                    this._related = result;
                }
                return this._related;
            }
            catch (error) {
                throw new errors_1.relatedError(error);
            }
        };
        /**
         * Gets the list of media items (images, audio, and video) in the
         * order in which they appear on a given wiki page.
         *
         * @remarks
         * Called in page object and also through index
         *
         * @param title - The title or page Id of the page
         * @param redirect - Whether to redirect in case of 302
         * @returns The related pages and summary as an array of {@link wikiMediaResult | wikiMediaResult}
         *
         * @experimental
         */
        this.media = async (pageOptions) => {
            try {
                if (!this._media) {
                    const result = await exports.media(this.title, pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.redirect);
                    this._media = result;
                }
                return this._media;
            }
            catch (error) {
                throw new errors_1.mediaError(error);
            }
        };
        this.pageid = response.pageid;
        this.ns = response.ns;
        this.title = response.title;
        this.contentmodel = response.contentmodel;
        this.pagelanguage = response.pagelanguage;
        this.pagelanguagedir = response.pagelanguagedir;
        this.touched = response.touched;
        this.lastrevid = response.lastrevid;
        this.length = response.length;
        this.fullurl = response.fullurl;
        this.editurl = response.editurl;
        this.canonicalurl = response.canonicalurl;
    }
    async runMethod(functionName) {
        try {
            const result = await eval(`this.${functionName}()`);
            return result;
        }
        catch (error) {
            throw new errors_1.preloadError(error);
        }
    }
}
exports.Page = Page;
/**
 * Returns the images present in a wiki page
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param listOptions - {@link listOptions | listOptions }
 * @returns an array of imageResult {@link imageResult | imageResult }
 */
exports.images = async (title, listOptions) => {
    try {
        let imageOptions = {
            generator: 'images',
            gimlimit: (listOptions === null || listOptions === void 0 ? void 0 : listOptions.limit) || 5,
            prop: 'imageinfo',
            iiprop: 'url'
        };
        imageOptions = utils_1.setPageIdOrTitleParam(imageOptions, title);
        const response = await request_1.default(imageOptions, listOptions === null || listOptions === void 0 ? void 0 : listOptions.redirect);
        const images = [];
        const imageKeys = Object.keys(response.query.pages);
        for (const image of imageKeys) {
            const imageInfo = response.query.pages[image];
            imageInfo.url = imageInfo.imageinfo[0].url;
            images.push(imageInfo);
        }
        return images;
    }
    catch (error) {
        throw new errors_1.imageError(error);
    }
};
/**
 * Returns the intro present in a wiki page
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param redirect - Whether to redirect in case of 302
 * @returns The intro string
 */
exports.intro = async (title, redirect = true) => {
    var _a;
    try {
        let introOptions = {
            prop: 'extracts',
            explaintext: '',
            exintro: '',
        };
        introOptions = utils_1.setPageIdOrTitleParam(introOptions, title);
        const response = await request_1.default(introOptions, redirect);
        const pageId = utils_1.setPageId(introOptions, response);
        return (_a = response === null || response === void 0 ? void 0 : response.query) === null || _a === void 0 ? void 0 : _a.pages[pageId].extract;
    }
    catch (error) {
        throw new errors_1.introError(error);
    }
};
/**
 * Returns the html content of a page
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param redirect - Whether to redirect in case of 302
 * @returns The html content as string
 *
 * @beta
 */
exports.html = async (title, redirect = true) => {
    try {
        let htmlOptions = {
            'prop': 'revisions',
            'rvprop': 'content',
            'rvlimit': 1,
            'rvparse': ''
        };
        htmlOptions = utils_1.setPageIdOrTitleParam(htmlOptions, title);
        const response = await request_1.default(htmlOptions, redirect);
        const pageId = utils_1.setPageId(htmlOptions, response);
        return response.query.pages[pageId].revisions[0]['*'];
    }
    catch (error) {
        throw new errors_1.htmlError(error);
    }
};
/**
 * Returns the plain text content of a page as well as parent id and revision id
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param redirect - Whether to redirect in case of 302
 * @returns The plain text as string and the parent and revision ids
 */
exports.content = async (title, redirect = true) => {
    try {
        let contentOptions = {
            'prop': 'extracts|revisions',
            'explaintext': '',
            'rvprop': 'ids'
        };
        contentOptions = utils_1.setPageIdOrTitleParam(contentOptions, title);
        const response = await request_1.default(contentOptions, redirect);
        const pageId = utils_1.setPageId(contentOptions, response);
        const result = response['query']['pages'][pageId]['extract'];
        const ids = {
            revisionId: response['query']['pages'][pageId]['revisions'][0]['revid'],
            parentId: response['query']['pages'][pageId]['revisions'][0]['parentid']
        };
        return {
            result,
            ids
        };
    }
    catch (error) {
        throw new errors_1.contentError(error);
    }
};
/**
 * Returns the cetegories present in page
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param listOptions - {@link listOptions | listOptions }
 * @returns The categories as an array of string
 */
exports.categories = async (title, listOptions) => {
    try {
        let categoryOptions = {
            prop: 'categories',
            pllimit: listOptions === null || listOptions === void 0 ? void 0 : listOptions.limit,
        };
        categoryOptions = utils_1.setPageIdOrTitleParam(categoryOptions, title);
        const response = await request_1.default(categoryOptions, listOptions === null || listOptions === void 0 ? void 0 : listOptions.redirect);
        const pageId = utils_1.setPageId(categoryOptions, response);
        return response.query.pages[pageId].categories.map((category) => category.title);
    }
    catch (error) {
        throw new errors_1.categoriesError(error);
    }
};
/**
 * Returns the links present in page
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param listOptions - {@link listOptions | listOptions }
 * @returns The links as an array of string
 */
exports.links = async (title, listOptions) => {
    try {
        let linksOptions = {
            prop: 'links',
            plnamespace: 0,
            pllimit: (listOptions === null || listOptions === void 0 ? void 0 : listOptions.limit) || 'max',
        };
        linksOptions = utils_1.setPageIdOrTitleParam(linksOptions, title);
        const response = await request_1.default(linksOptions, listOptions === null || listOptions === void 0 ? void 0 : listOptions.redirect);
        const pageId = utils_1.setPageId(linksOptions, response);
        const result = response.query.pages[pageId].links.map((link) => link.title);
        return result;
    }
    catch (error) {
        throw new errors_1.linksError(error);
    }
};
/**
 * Returns the references of external links present in page
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param listOptions - {@link listOptions | listOptions }
 * @returns The references as an array of string
 */
exports.references = async (title, listOptions) => {
    try {
        let extLinksOptions = {
            prop: 'extlinks',
            ellimit: (listOptions === null || listOptions === void 0 ? void 0 : listOptions.limit) || 'max',
        };
        extLinksOptions = utils_1.setPageIdOrTitleParam(extLinksOptions, title);
        const response = await request_1.default(extLinksOptions, listOptions === null || listOptions === void 0 ? void 0 : listOptions.redirect);
        const pageId = utils_1.setPageId(extLinksOptions, response);
        const result = response.query.pages[pageId].extlinks.map((link) => link['*']);
        return result;
    }
    catch (error) {
        throw new errors_1.linksError(error);
    }
};
/**
 * Returns the coordinates of a page
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param redirect - Whether to redirect in case of 302
 * @returns The coordinates as {@link coordinatesResult | coordinatesResult}
 */
exports.coordinates = async (title, redirect = true) => {
    try {
        let coordinatesOptions = {
            prop: 'coordinates',
        };
        coordinatesOptions = utils_1.setPageIdOrTitleParam(coordinatesOptions, title);
        const response = await request_1.default(coordinatesOptions, redirect);
        const pageId = utils_1.setPageId(coordinatesOptions, response);
        const coordinates = response.query.pages[pageId].coordinates;
        return coordinates ? coordinates[0] : null;
    }
    catch (error) {
        throw new errors_1.coordinatesError(error);
    }
};
/**
 * Returns the language links present in the page
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param listOptions - {@link listOptions | listOptions }
 * @returns The links as an array of {@link langLinksResult | langLinksResult }
 */
exports.langLinks = async (title, listOptions) => {
    try {
        let languageOptions = {
            prop: 'langlinks',
            lllimit: (listOptions === null || listOptions === void 0 ? void 0 : listOptions.limit) || 'max',
            llprop: 'url'
        };
        languageOptions = utils_1.setPageIdOrTitleParam(languageOptions, title);
        const response = await request_1.default(languageOptions, listOptions === null || listOptions === void 0 ? void 0 : listOptions.redirect);
        const pageId = utils_1.setPageId(languageOptions, response);
        const result = response.query.pages[pageId].langlinks.map((link) => {
            return {
                lang: link.lang,
                title: link['*'],
                url: link.url
            };
        });
        return result;
    }
    catch (error) {
        throw new errors_1.linksError(error);
    }
};
/**
 * Returns the infobox content of page if present
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param redirect - Whether to redirect in case of 302
 * @returns The info as JSON object
 */
exports.infobox = async (title, redirect = true) => {
    try {
        const infoboxOptions = {
            prop: 'revisions',
            rvprop: 'content',
            rvsection: 0
        };
        const fullInfo = await exports.rawInfo(title, infoboxOptions, redirect);
        const info = infoboxParser(fullInfo).general;
        return info;
    }
    catch (error) {
        throw new errors_1.infoboxError(error);
    }
};
/**
 * Returns the table content of page if present
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param redirect - Whether to redirect in case of 302
 * @returns The tables as arrays of JSON objects
 */
exports.tables = async (title, redirect = true) => {
    try {
        const tableOptions = {
            prop: 'revisions',
            rvprop: 'content',
        };
        const fullInfo = await exports.rawInfo(title, tableOptions, redirect);
        const info = infoboxParser(fullInfo).tables;
        return info;
    }
    catch (error) {
        throw new errors_1.infoboxError(error);
    }
};
/**
 * Returns the raw info of the page
 *
 * @remarks
 * This is not exported and used internally
 *
 * @param title - The title or page Id of the page
 * @param redirect - Whether to redirect in case of 302
 * @returns The rawInfo of the page
 *
 */
exports.rawInfo = async (title, options, redirect = true) => {
    var _a;
    try {
        options = utils_1.setPageIdOrTitleParam(options, title);
        const response = await request_1.default(options, redirect);
        if (!((_a = response.query) === null || _a === void 0 ? void 0 : _a.pages)) {
            throw new Error(messages_1.MSGS.INFOBOX_NOT_EXIST);
        }
        const pageId = utils_1.setPageId(options, response);
        const data = response.query.pages[pageId]['revisions'][0];
        return data ? data['*'] : '';
    }
    catch (error) {
        throw new errors_1.infoboxError(error);
    }
};
//REST-API Requests based on https://en.wikipedia.org/api/rest_v1/#/
//APIs seems to support only title parameters which is a drawback
/**
 * Returns the summary of the page
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param redirect - Whether to redirect in case of 302
 * @returns The summary of the page as {@link wikiSummary | wikiSummary}
 */
exports.summary = async (title, redirect = true) => {
    try {
        const path = 'page/summary/' + title.replace(" ", "_");
        const response = await request_1.makeRestRequest(path, redirect);
        return response;
    }
    catch (error) {
        throw new errors_1.summaryError(error);
    }
};
/**
 * Returns summaries for 20 pages related to the given page. Summaries include page title, namespace
 * and id along with short text description of the page and a thumbnail.
 *
 * @remarks
 * Called in page object and also through index
 *
 * @param title - The title or page Id of the page
 * @param redirect - Whether to redirect in case of 302
 * @returns The related pages and summary as an array of {@link wikiSummary | wikiSummary}
 *
 * @experimental
 */
exports.related = async (title, redirect = true) => {
    try {
        const path = 'page/related/' + title.replace(" ", "_");
        const response = await request_1.makeRestRequest(path, redirect);
        return response;
    }
    catch (error) {
        throw new errors_1.relatedError(error);
    }
};
/**
 * Gets the list of media items (images, audio, and video) in the
 * order in which they appear on a given wiki page.
 *
 * @remarks
 * Called in page object and also through index
 *
 * @param title - The title or page Id of the page
 * @param redirect - Whether to redirect in case of 302
 * @returns The related pages and summary as an array of {@link wikiMediaResult | wikiMediaResult}
 *
 * @experimental
 */
exports.media = async (title, redirect = true) => {
    try {
        const path = 'page/media-list/' + title.replace(" ", "_");
        const response = await request_1.makeRestRequest(path, redirect);
        return response;
    }
    catch (error) {
        throw new errors_1.mediaError(error);
    }
};
exports.default = Page;
