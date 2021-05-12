module.exports = options = (headless, start) => {
	const options = {
		sessionId: "Puszkarek",
		headless: headless,
		debug: true,
		qrTimeout: 0,
		authTimeout: 0,
		restartOnCrash: start,
		cacheEnabled: true,
		useChrome: false,
		killProcessOnBrowserClose: true,
		throwErrorOnTosBlock: true,
		chromiumArgs: ["--no-sandbox", "--disable-setuid-sandbox", "--aggressive-cache-discard", "--disable-cache", "--disable-application-cache", "--disable-offline-load-stale-cache", "--disk-cache-size=0"],
	};
	return options;
};
