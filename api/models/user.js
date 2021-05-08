const { Sequelize } = require("sequelize");
const sequelize = require("../config/sequelize");

const User = sequelize.define("user", {
	email: { type: Sequelize.STRING, primaryKey: true },
	pseudo: { type: Sequelize.STRING, allowNull: false, unique: true },
	password: { type: Sequelize.STRING, allowNull: false }
});

//Export model
module.exports = User;