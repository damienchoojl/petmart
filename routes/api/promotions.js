const express = require("express");
const router = express.Router();
const promotionController = require("../../controllers/api/promotions");

router.get("/", promotionController.index);

module.exports = router;
