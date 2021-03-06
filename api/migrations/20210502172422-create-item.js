"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("Items", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			question: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			answer: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			note: {
				type: Sequelize.TEXT
			},
			user: {
				type: Sequelize.STRING,

				references: {
					model: {
						tableName: "users"
					},
					key: "email"
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
				allowNull: false
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
	},
	down: async (queryInterface) => {
		await queryInterface.dropTable("Items");
	}
};