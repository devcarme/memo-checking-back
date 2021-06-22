/* eslint-disable no-undef */
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
	process.env.DB_PROD_NAME, 
	process.env.DB_PROD_USER, 
	process.env.DB_PROD_PASS, 
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
