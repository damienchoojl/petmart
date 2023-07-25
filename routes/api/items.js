const express = require("express");
const router = express.Router();
const itemsController = require("../../controllers/api/items");

// GET /api/items
router.get("/", itemsController.index);
router.post("/:itemId/add-review", itemsController.addReview);
router.put("/:itemId", itemsController.updateItem);

module.exports = router;
