const express = require("express");
const router = express.Router();
const itemsCtrl = require("../../controllers/api/items");

router.get("/", itemsCtrl.getAllItems);
router.get("/:id", itemsCtrl.getItemById);

module.exports = router;
