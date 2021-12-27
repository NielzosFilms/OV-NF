const fetch = require("node-fetch");

const options = {
	host: "http://api.9292.nl/0.1",
	lang: "nl-NL",
};

const extraInfo = {
	"wilnis/bushalte-driehuis-kerk": {
		walkingTime: "10",
	},
	"mijdrecht/bushalte-rondweg": {
		walkingTime: "17",
	},
	"mijdrecht/bushalte-bozenhoven": {
		walkingTime: "10",
	},
};

function parseTime(t) {
	var d = new Date();
	var time = t.match(/(\d+)(?::(\d\d))?\s*(p?)/);
	d.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
	d.setMinutes(parseInt(time[2]) || 0);
	return d;
}

function getTimeDiff(time) {
	time = parseTime(time);
	const now = new Date();
	const timeDiff = time - now;
	return `${Math.round(timeDiff / 1000 / 60)} min`;
}

async function getDepartures(stopId) {
	const response = await fetch(
		`${options.host}/locations/${stopId}/departure-times?lang=${options.lang}`
	);
	const json = await response.json();
	return json;
}

async function getStops(query) {
	const response = await fetch(
		`${options.host}/locations?q=${query}&lang=${options.lang}`
	);
	const json = await response.json();
	return json;
}

module.exports = {
	getDepartures,
	getStops,
	extraInfo,
	getTimeDiff,
};
