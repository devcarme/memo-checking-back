const { Sequelize } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("../models/user");

const Category = sequelize.define("category", {
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: Sequelize.TEXT, allowNull: false, unique: true },
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
}, {
	indexes: [
		// Create a unique index on email
		{
			unique: true,
			fields: ["name"]
		},
	]
});

Category.associate = models => {
	Category.belongsToMany(models.Item, { through: "item_category" });
};

//Export model
module.exports = Category;