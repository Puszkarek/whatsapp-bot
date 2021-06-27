const request = require("request");

module.exports = {
	random(length) {
		return Math.floor(Math.random() * length);
	},
	isOnlyNumber(str) {
		str.match(/^[0-9]+$/) != null;
	},
	capitalizeText(text) {
		return text
			.split("\n")
			.map(function (line) {
				if (line != "") {
					line = line[0].toUpperCase() + line.substr(1);
				}
				return line;
			})
			.join("\n");
	},
	configURLParams(url, params) {
		const urlParams = new URLSearchParams();
		for (let key in params) {
			urlParams.set(key, params[key]);
		}
		return url + urlParams.toString();
	},
	requestFrom(url) {
		return new Promise(function (resolve, reject) {
			request(
				url,
				{
					json: true,
				},
				(error, response, body) => {
					if (error) return reject(error);
					if (response.statusCode == 200) {
						resolve(body);
					}
				},
			);
		});
	},
};
