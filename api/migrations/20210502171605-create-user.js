"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("Users", {
			email: {
				primaryKey: true,
				type: Sequelize.STRING
			},
			pseudo: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn("NOW")
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn("NOW")
			}
		});
		await queryInterface.addIndex("Users", ["pseudo"]);
	},
	down: async (queryInterface) => {
		await queryInterface.dropTable("Users");
	}
};