const express = require("express");
const router = express.Router();
const ordersCtrl = require("../../controllers/api/orders");
const ensureLoggedIn = require("../../config/ensureLoggedIn");

router.post("/", ensureLoggedIn, ordersCtrl.createOrder);
router.get("/", ensureLoggedIn, ordersCtrl.getOrdersByUser);

module.exports = router;
