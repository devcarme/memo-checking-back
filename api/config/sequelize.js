/* eslint-disable no-undef */
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
	"heroku_aa1fbd9cb6b19fe", 
	"b4227881b53dd8", 
	"5738beb3", 
	{
		host: "eu-cdbr-west-01.cleardb.com",
		dialect: "mysql"
	});

try {
	sequelize.authenticate();
	console.log("Connection has been established successfully.");
} catch (error) {
	console.error("Unable to connect to the database:", error);
}

module.exports = sequelize;
