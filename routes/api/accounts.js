const express = require("express");
const router = express.Router();

// Import the controller for handling account routes
const accountsCtrl = require("../../controllers/api/accounts");

// Define the route handlers
router.get("/", accountsCtrl.getAccounts);
router.post("/add-to-cart", accountsCtrl.addToCart);

module.exports = router;
