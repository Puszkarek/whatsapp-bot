const fs = require("fs");
const { airQuality: airQualityText } = JSON.parse(fs.readFileSync(__dirname + "/conditions.json"));
module.exports = (body) => {
	let weather = body.weather;
	//response
	let _response = "*Local*\n\n";
	_response += `Região: ${weather.name}\nCódigo de País: ${weather.sys.country}\n`;
	_response += `Longitude: ${weather.coord.lon.toString()}\nLatitude: ${weather.coord.lat.toString()}`;
	_response += "\n\n*Tempo*\n\n";
	_response += `Horário: ${dateFormat(weather.dt)}\n`;
	_response += `Nascer do Sol: ${dateFormat(weather.sys.sunrise)}\n`;
	_response += `Pôr do Sol: ${dateFormat(weather.sys.sunset)}\n`;
	_response += "\n\n*Clima*\n\n";
	formattedDescription = weather.weather[0].description.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
	_response += `Condição: ${formattedDescription}\n`;
	_response += `Temperatura: ${weather.main.temp}°C\nSensação térmica: ${weather.main.feels_like}°C\n`;
	_response += `Temperatura Minima: ${weather.main.temp_min}°C\nTemperatura Maxima: ${weather.main.temp_max}°C\n`;
	_response += "\n\n*Ar*\n\n";
	_response += `Umidade: ${weather.main.humidity}%\n`;
	_response += `Vento: ${weather.wind.speed}m/s\nDireção do Vento: ${weather.wind.deg}°\n`;
	const airQuality = body.airQuality;
	const airQualityNumber = airQuality.list[0].main.aqi;
	_response += `Qualidade do Ar [1-5]: ${airQualityNumber} - ${airQualityText[airQualityNumber]}`;
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
