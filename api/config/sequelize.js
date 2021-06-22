/* eslint-disable no-undef */
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
	process.env.NODE_ENV === "development" ? process.env.DB_NAME : process.env.DB_PROD_NAME, 
	process.env.NODE_ENV === "development" ? process.env.DB_USER : process.env.DB_PROD_USER, 
	process.env.NODE_ENV === "development" ? process.env.DB_PASS : process.env.DB_PROD_PASS, 
	{
		host: process.env.NODE_ENV === "development" ? process.env.DB_HOST : process.env.DB_PROD_HOST,
		dialect: "mysql"
	});

try {
	sequelize.authenticate();
	console.log("Connection has been established successfully.");
} catch (error) {
	console.error("Unable to connect to the database:", error);
}

module.exports = sequelize;
