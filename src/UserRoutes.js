const router = require("express").Router();
const passwordHash = require("password-hash");

const models = require("../models");

// express login get route for user with the app variable
router.get("/login", (req, res) => {
	res.render("login", { validationErrors: [] });
});

// express login route for user with the app variable
router.post("/login", (req, res) => {
	if (req.body.username === "" || req.body.password === "") {
		res.render("login", {
			validationErrors: [{ msg: "Username and Password are required" }],
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

//express register get route for user with the app variable
router.get("/register", (req, res) => {
	res.render("register", { validationErrors: [] });
});

// express register route for user with the app variable
router.post("/register", async (req, res) => {
	if (
		req.body.username === "" ||
		req.body.password === "" ||
		req.body.passwordConfirm === ""
	) {
		res.render("register", {
			validationErrors: [{ msg: "Username and Password are required" }],
		});
	} else {
		if (req.body.password !== req.body.passwordConfirm) {
			res.render("register", {
				validationErrors: [{ msg: "Passwords do not match" }],
			});
		} else {
			try {
				const user = await models.User.create({
					username: req.body.username,
					password: passwordHash.generate(req.body.password),
				});
				req.session.user = user;
				res.redirect("/");
			} catch (err) {
				res.render("register", {
					validationErrors: error.errors?.map((error) => {
						return {
							msg: error.message,
						};
					}),
				});
			}
		}
	}
});

// express profile route for user with the app variable
router.get("/profile", (req, res) => {
	if (req.session.user) {
		res.render("profile", { user: req.session.user });
	} else {
		res.redirect("/login");
	}
});

// express update route for user with the app variable
router.post("/update", async (req, res) => {
	// check if logged in
	if (req.session.user) {
		// check if password is empty
		if (req.body.password === "") {
			// update user without password
			await models.User.update(
				{
					username: req.body.username,
				},
				{
					where: {
						id: req.session.user.id,
					},
				}
			);
			req.session.user = await models.User.findByPk(req.session.user.id);
			res.redirect("/profile");
		} else {
			// update user with password
			try {
				await models.User.update(
					{
						username: req.body.username,
						password: passwordHash.generate(req.body.password),
					},
					{
						where: {
							id: req.session.user.id,
						},
					}
				);
				req.session.user = await models.User.findByPk(
					req.session.user.id
				);
				res.redirect("/profile");
			} catch (err) {
				res.render("profile", {
					validationErrors: error.errors?.map((error) => {
						return {
							msg: error.message,
						};
					}),
				});
			}
		}
	} else {
		res.redirect("/login");
	}
});

module.exports = router;
