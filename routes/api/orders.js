const express = require("express");
const router = express.Router();
const ordersController = require("../../controllers/api/orders");

router.post("/", ordersController.createOrder);
router.get("/:userId", ordersController.getOrdersByUser);

module.exports = router;
