/* eslint-disable no-unused-vars */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const createError = require("http-errors");
const dotenv = require("dotenv");
const userRouter = require("./routes/user");
const itemRouter = require("./routes/item");
const categoryRouter = require("./routes/category");

const app = express();

app.use(cors());
app.use(session({
	secret: "secret",
	resave: true,
	saveUninitialized: true,
	cookie: {
		maxAge: 24 * 60 * 60 * 365 * 1000
	}
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Session Setup 
app.use(session({  
	secret: "Your_Secret_Key", 
	resave: false,
	saveUninitialized: true
})); 

app.use("/user", userRouter);
app.use("/item", itemRouter);
app.use("/category", categoryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
});

module.exports = app;
