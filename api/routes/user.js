const express = require("express");
const router = express.Router();

// Require controller modules.
const userController = require("../controllers/userController");

/// USER ROUTES ///

// POST request for logging user.
router.post("/login", userController.login);

// POST request for registering user.
router.post("/register", userController.register);


module.exports = router;