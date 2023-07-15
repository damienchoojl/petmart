const express = require("express");
const router = express.Router();
const itemsController = require("../../controllers/api/items");

// GET /api/items
router.get("/", itemsController.index);

module.exports = router;
