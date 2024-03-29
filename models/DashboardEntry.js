"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class DashboardEntry extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	DashboardEntry.init(
		{
			stationId: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					notEmpty: true,
				},
			},
			order: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			walkingTime: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: "DashboardEntry",
			defaultScope: {
				order: [["order", "ASC"]],
			},
		}
	);
	return DashboardEntry;
};
