const express = require("express");
const router = express.Router();

// Import the controller for handling account routes
const accountsCtrl = require("../../controllers/api/accounts");

// Define the route handler for /api/accounts
router.get("/", accountsCtrl.getAccounts);

module.exports = router;
