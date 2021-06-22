const express = require("express");
const router = express.Router();

// Require controller modules.
const itemController = require("../controllers/itemController");
// const categoryController = require("../controllers/categoryController");

/// ITEM ROUTES ///

// GET request for get all items.
router.get("/all", itemController.itemList);

// GET request for get all items with categories.
router.get("/allWithCategory", itemController.itemListWithCategory);

// POST request for creating item.
router.post("/create", itemController.itemCreate);

// GET request for getting item by category.
router.get("/getByCategory/:category", itemController.itemsByCategory);

// PUT request for updating an item.
router.put("/update/:id", itemController.itemUpdate);

// DELETE request for deleting an item.
router.delete("/delete/:id", itemController.itemDelete);

module.exports = router;