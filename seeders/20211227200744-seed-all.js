"use strict";
const passwordHash = require("password-hash");

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		await queryInterface.bulkInsert(
			"Users",
			[
				{
					username: "admin",
					password: passwordHash.generate("asdf"),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);

		await queryInterface.bulkInsert(
			"DashboardEntries",
			[
				{
					stationId: "mijdrecht/bushalte-rondweg",
					order: 0,
					walkingTime: 17,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					stationId: "mijdrecht/bushalte-bozenhoven",
					order: 1,
					walkingTime: 10,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					stationId: "wilnis/bushalte-driehuis-kerk",
					order: 2,
					walkingTime: 10,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					stationId: "station-amsterdam-bijlmer-arena",
					order: 3,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete("Users", null, {});
		await queryInterface.bulkDelete("DashboardEntries", null, {});
	},
};
