import { coordinatesResult, imageResult, langLinksResult, pageResult, wikiMediaResult, wikiSummary } from './resultTypes';
import { listOptions, pageOptions } from './optionTypes';
export declare class Page {
    pageid: number;
    ns: number;
    title: string;
    contentmodel: string;
    pagelanguage: string;
    pagelanguagehtmlcode: string;
    pagelanguagedir: string;
    touched: string;
    lastrevid: number;
    length: number;
    fullurl: string;
    editurl: string;
    canonicalurl: string;
    revid: number;
    parentid: number;
    _summary: wikiSummary;
    _images: Array<imageResult>;
    _content: string;
    _html: string;
    _categories: Array<string>;
    _references: Array<string>;
    _links: Array<string>;
    _coordinates: coordinatesResult;
    _langLinks: Array<langLinksResult>;
    _infobox: any;
    _tables: Array<any>;
    _intro: string;
    _related: Array<wikiSummary>;
    _media: wikiMediaResult;
    constructor(response: pageResult);
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
    intro: (pageOptions?: pageOptions | undefined) => Promise<string>;
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
    images: (listOptions?: listOptions | undefined) => Promise<Array<imageResult>>;
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
    summary: (pageOptions?: pageOptions | undefined) => Promise<wikiSummary>;
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
    html: (pageOptions?: pageOptions | undefined) => Promise<string>;
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
    content: (pageOptions?: pageOptions | undefined) => Promise<string>;
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
    categories: (listOptions?: listOptions | undefined) => Promise<Array<string>>;
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
    links: (listOptions?: listOptions | undefined) => Promise<Array<string>>;
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
    references: (listOptions?: listOptions | undefined) => Promise<Array<string>>;
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
    coordinates: (pageOptions?: pageOptions | undefined) => Promise<coordinatesResult>;
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
    langLinks: (listOptions?: listOptions | undefined) => Promise<Array<langLinksResult>>;
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
    infobox: (pageOptions?: pageOptions | undefined) => Promise<any>;
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
    tables: (pageOptions?: pageOptions | undefined) => Promise<Array<any>>;
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
    related: (pageOptions?: pageOptions | undefined) => Promise<Array<wikiSummary>>;
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
    media: (pageOptions?: pageOptions | undefined) => Promise<wikiMediaResult>;
    runMethod(functionName: string): Promise<any>;
}
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
export declare const images: (title: string, listOptions?: listOptions | undefined) => Promise<Array<imageResult>>;
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
export declare const intro: (title: string, redirect?: boolean) => Promise<string>;
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
export declare const html: (title: string, redirect?: boolean) => Promise<string>;
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
export declare const content: (title: string, redirect?: boolean) => Promise<any>;
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
export declare const categories: (title: string, listOptions?: listOptions | undefined) => Promise<Array<string>>;
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
export declare const links: (title: string, listOptions?: listOptions | undefined) => Promise<Array<string>>;
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
export declare const references: (title: string, listOptions?: listOptions | undefined) => Promise<Array<string>>;
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
export declare const coordinates: (title: string, redirect?: boolean) => Promise<coordinatesResult>;
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
export declare const langLinks: (title: string, listOptions?: listOptions | undefined) => Promise<Array<langLinksResult>>;
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
export declare const infobox: (title: string, redirect?: boolean) => Promise<any>;
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
export declare const tables: (title: string, redirect?: boolean) => Promise<Array<any>>;
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
export declare const rawInfo: (title: string, options: any, redirect?: boolean) => Promise<any>;
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
export declare const summary: (title: string, redirect?: boolean) => Promise<wikiSummary>;
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
export declare const related: (title: string, redirect?: boolean) => Promise<Array<wikiSummary>>;
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
export declare const media: (title: string, redirect?: boolean) => Promise<wikiMediaResult>;
export default Page;
