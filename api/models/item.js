const { Sequelize } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("../models/user");

const Item = sequelize.define("item", {
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	question: { type: Sequelize.TEXT, allowNull: false },
	answer: { type: Sequelize.TEXT, allowNull: false },
	note: { type: Sequelize.TEXT, allowNull: true },
	user: {
		type: Sequelize.STRING,

		references: {
			// This is a reference to another model
			model: User,

			// This is the column name of the referenced model
			key: "email",
		},

		allowNull: false
	}
});

Item.associate = models => {
	Item.belongsToMany(models.Item, { through: "item_category" });
};

//Export model
module.exports = Item;