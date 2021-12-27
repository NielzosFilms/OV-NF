const express = require("express");
const session = require("express-session");
const {v4: uuidv4} = require("uuid");

const ov = require("./ov");

const models = require("../models");

const oneDay = 1000 * 60 * 60 * 24;

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(
	session({
		secret: uuidv4(),
		saveUninitialized: true,
		cookie: {maxAge: oneDay * 7},
		resave: false,
	})
);

app.set("view engine", "ejs");

app.use(express.static("public"));

// Set routes
app.get("/", async (req, res) => {
	const stops = [
		await ov.getDepartures("mijdrecht/bushalte-rondweg"),
		await ov.getDepartures("mijdrecht/bushalte-bozenhoven"),
		await ov.getDepartures("wilnis/bushalte-driehuis-kerk"),
	];
	res.render("index", {
		stops,
		extraInfo: ov.extraInfo,
		getTimeDiff: ov.getTimeDiff,
	});
});

// 404 route
app.use((req, res) => {
	res.status(404).render("404");
});

// Start server
app.listen(3000, () => {
	console.log("🚍Server started on port 3000");
});

module.exports = app;
