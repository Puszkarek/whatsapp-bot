const fs = require("fs");
const { airQuality: airQualityText } = JSON.parse(
	fs.readFileSync(__dirname + "/conditions.json"),
);
module.exports = (body) => {
	let weather = body.weather;
	//response
	let _response = "*Local*\n\n";
	_response += `Region: ${weather.name}\nCountry Code: ${weather.sys.country}\n`;
	_response += `lon: ${weather.coord.lon.toString()}\nlat: ${weather.coord.lat.toString()}`;
	return _response;
};

function dateFormat(timeUTC) {
	const numberDate = Math.floor(timeUTC);
	const date = new Date(numberDate * 1000);
	const hours = date.getHours();
	let minutes = "0" + date.getMinutes();
	let seconds = "0" + date.getSeconds();
	return hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
}
