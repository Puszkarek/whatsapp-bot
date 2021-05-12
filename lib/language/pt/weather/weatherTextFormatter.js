const fs = require("fs");
const { conditions: weatherConditions, airQuality: airQualityText } = JSON.parse(fs.readFileSync(__dirname + "/conditions.json"));
module.exports = (body) => {
	let weather = body.current;
	let cityTime = body.location.localtime.split(" ");
	let conditionCode = weather.condition.code;
	let airQualityNumber = weather.air_quality["us-epa-index"];
	return `Região: ${body.location.name}\n\nEstado: ${body.location.region}\n\nPaís: ${body.location.country}\n\nCondição: ${weatherConditions[conditionCode]}\n\nDia: ${cityTime[0]}\n\nHorário: ${cityTime[1]}\n\nTemperatura: ${weather.temp_c}°C\n\nSensação térmica: ${weather.feelslike_c}°C\n\nUmidade: ${weather.humidity}%\n\nVento: ${weather.wind_kph}km/h\n\nDireção do Vento: ${weather.wind_dir}\n\nQualidade do Ar [1-6]: ${airQualityNumber.toString()} "${airQualityText[airQualityNumber]}"`;
};
