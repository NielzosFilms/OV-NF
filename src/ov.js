const fetch = require("node-fetch");

const options = {
	host: "http://api.9292.nl/0.1",
	lang: "nl-NL",
};

async function logApiResult(url) {
	const response = await fetch(url, options);
	const json = await response.json();
	console.log(json);
}

// console.log(JSON.stringify(busstops(), null, 2));
// logApiResult(
// 	`${options.host}/locations?lang=${options.lang}&q="mijdrecht/bushalte-rondweg"`
// );

logApiResult(
	`${options.host}/locations/mijdrecht/bushalte-rondweg?lang=${options.lang}`
);
