const router = require("express").Router();
const passwordHash = require("password-hash");

const models = require("../models");

// express login get route for user with the app variable
router.get("/login", (req, res) => {
	res.render("login", {validationErrors: []});
});

// express login route for user with the app variable
router.post("/login", (req, res) => {
	if (req.body.username === "" || req.body.password === "") {
		res.render("login", {
			validationErrors: [{msg: "Username and Password are required"}],
		});
	} else {
		models.User.findOne({
			where: {
				username: req.body.username,
			},
		}).then((user) => {
			if (user) {
				if (passwordHash.verify(req.body.password, user.password)) {
					req.session.user = user;
					res.redirect("/");
				} else {
					res.render("login", {
						validationErrors: [
							{
								msg: "Invalid username or password",
							},
						],
					});
				}
			} else {
				res.render("login", {
					validationErrors: [
						{
							msg: "Invalid username or password",
						},
					],
				});
			}
		});
	}
});

// express logout route for user with the app variable
router.get("/logout", (req, res) => {
	req.session.destroy();
	res.redirect("/");
});

module.exports = router;
