const {
	create,
	Client
} = require("@open-wa/wa-automate");
const msgHandler = require("./msg-handler");
const options = require("./options");

const start = async (client = new Client()) => {
	console.log("[!] Server Started!");
	client.onStateChanged((state) => {
		console.log("[Client State]", state);
		if (state === "CONFLICT" || state === "UNLAUNCHED") client.forceRefocus();
	});
	// message listener
	client.onMessage(async (message) => {
		client.getAmountOfLoadedMessages().then((msg) => {
			if (msg >= 3000) {
				client.cutMsgCache();
			}
		});
		msgHandler(client, message);
	});
};

create(options(true, start))
	.then((client) => start(client))
	.catch((error) => console.log(error));