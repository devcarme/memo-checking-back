/* eslint-disable no-undef */
const mysql = require("mysql"); 

const connection = mysql.createConnection({
	host     : process.env.NODE_ENV === "development" ? process.env.DB_HOST : process.env.DB_PROD_HOST,
	user     : process.env.NODE_ENV === "development" ? process.env.DB_USER : process.env.DB_PROD_USER,
	password : process.env.NODE_ENV === "development" ? process.env.DB_PASS : process.env.DB_PROD_PASS,
	database : process.env.NODE_ENV === "development" ? process.env.DB_NAME : process.env.DB_PROD_NAME
});

module.exports = connection;