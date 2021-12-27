const router = require("express").Router();

const models = require("../models");

function formatDateString(date) {
	date = new Date(date);
	return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

function formatDateToInputString(date) {
	date = new Date(date);
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

router.get("/dashboard", async (req, res) => {
	if (!req.session.user) res.redirect("/login");
	const dashboardEntries = await models.DashboardEntry.findAll();
	res.render("show-dashboard", {
		dashboardEntries,
		formatDateString,
		user: req.session.user,
	});
});

router.get("/dashboard/:id/delete", async (req, res) => {
	if (!req.session.user) res.redirect("/login");
	const dashboardEntry = await models.DashboardEntry.findByPk(req.params.id);
	await dashboardEntry.destroy();
	res.redirect("/dashboard");
});

router.get("/dashboard/:id/edit", async (req, res) => {
	if (!req.session.user) res.redirect("/login");
	const dashboardEntry = await models.DashboardEntry.findByPk(req.params.id);
	res.render("edit-dashboard", {
		validationErrors: [],
		previousValues: {},
		dashboardEntry,
		formatDateString,
		formatDateToInputString,
		user: req.session.user,
	});
});

router.post("/dashboard/:id/edit", async (req, res) => {
	if (!req.session.user) res.redirect("/login");
	const dashboardEntry = await models.DashboardEntry.findByPk(req.params.id);
	try {
		await dashboardEntry.update({
			stationId: req.body.stationId,
			walkingTime: req.body.walkingTime,
		});
		res.redirect("/dashboard");
	} catch (error) {
		res.render("edit-dashboard", {
			validationErrors: error.errors?.map((error) => {
				return {
					msg: error.message,
				};
			}),
			previousValues: req.body,
			dashboardEntry,
			formatDateString,
			formatDateToInputString,
			user: req.session.user,
		});
	}
});

router.get("/dashboard/new", async (req, res) => {
	if (!req.session.user) res.redirect("/login");
	res.render("new-dashboard", {
		validationErrors: [],
		previousValues: {},
		formatDateString,
		formatDateToInputString,
		user: req.session.user,
	});
});

router.post("/dashboard/new", async (req, res) => {
	if (!req.session.user) res.redirect("/login");
	try {
		const maxOrder = await models.DashboardEntry.max("order");
		await models.DashboardEntry.create({
			stationId: req.body.stationId,
			walkingTime: req.body.walkingTime,
			order: maxOrder + 1,
		});
		res.redirect("/dashboard");
	} catch (error) {
		res.render("new-dashboard", {
			validationErrors: error.errors?.map((error) => {
				return {
					msg: error.message,
				};
			}),
			previousValues: req.body,
			formatDateString,
			formatDateToInputString,
			user: req.session.user,
		});
	}
});

router.get("/dashboard/:id/delete", async (req, res) => {
	if (!req.session.user) res.redirect("/login");
	const dashboardEntry = await models.DashboardEntry.findByPk(req.params.id);
	await dashboardEntry.destroy();
	res.redirect("/dashboard");
});

router.get("/dashboard/:id/move/up", async (req, res) => {
	if (!req.session.user) res.redirect("/login");
	const dashboardEntry = await models.DashboardEntry.findByPk(req.params.id);
	const prevDashboardEntry = await models.DashboardEntry.findOne({
		where: {
			order: dashboardEntry.order - 1,
		},
	});
	if (!prevDashboardEntry || !dashboardEntry) {
		res.redirect("/dashboard");
		return;
	}
	await dashboardEntry.update({
		order: dashboardEntry.order - 1,
	});
	await prevDashboardEntry.update({
		order: prevDashboardEntry.order + 1,
	});
	res.redirect("/dashboard");
});

router.get("/dashboard/:id/move/down", async (req, res) => {
	if (!req.session.user) res.redirect("/login");
	const dashboardEntry = await models.DashboardEntry.findByPk(req.params.id);
	const nextDashboardEntry = await models.DashboardEntry.findOne({
		where: {
			order: dashboardEntry.order + 1,
		},
	});
	if (!nextDashboardEntry || !dashboardEntry) {
		res.redirect("/dashboard");
		return;
	}
	await dashboardEntry.update({
		order: dashboardEntry.order + 1,
	});
	await nextDashboardEntry.update({
		order: nextDashboardEntry.order - 1,
	});
	res.redirect("/dashboard");
});

module.exports = router;
