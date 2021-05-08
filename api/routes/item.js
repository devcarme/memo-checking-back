const express = require("express");
const router = express.Router();

// Require controller modules.
const itemController = require("../controllers/itemController");
// const categoryController = require("../controllers/categoryController");

/// ITEM ROUTES ///

// GET request for creating item.
router.get("/all", itemController.itemList);

// POST request for creating item.
router.post("/create", itemController.itemCreate);

// GET request for getting item by category.
router.get("/getByCategory/:category", itemController.itemsByCategory);

module.exports = router;