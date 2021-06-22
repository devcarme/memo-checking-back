module.exports = {
	up: (queryInterface, Sequelize) => {
		// Product belongsToMany Tag
		return queryInterface.createTable(
			"item_category",
			{
				item_id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					references: { model: "items", key: "id" },
					onUpdate: "CASCADE",
					onDelete: "CASCADE",
				},
				category_id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					references: { model: "categories", key: "id" },
					onUpdate: "CASCADE",
					onDelete: "CASCADE",
				},
				created_at: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.fn("NOW")
				},
				updated_at: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.fn("NOW")
				},
			}
		);
	},

	down: (queryInterface) => {
		// remove table
		return queryInterface.dropTable("item_category");
	},
};