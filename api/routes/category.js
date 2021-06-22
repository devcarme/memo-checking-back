const express = require("express");
const router = express.Router();

// Require controller modules.
const categoryController = require("../controllers/categoryController");

/// CATEGORIES ROUTES ///

// GET request for get all categories.
// router.get("/all", categoryController.categoryList);
router.get("/all", function (req, res) {
	res.send("coucou");   
});

// POST request for create category.
router.post("/create", categoryController.create);


module.exports = router;    
