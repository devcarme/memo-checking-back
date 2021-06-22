"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("Categories", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
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
		await queryInterface.addIndex("Categories", ["name"]);
	},
	down: async (queryInterface) => {
		await queryInterface.dropTable("Categories");
	}
};