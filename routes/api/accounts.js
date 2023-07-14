const express = require("express");
const router = express.Router();
const accountsCtrl = require("../../controllers/api/accounts");
const ensureLoggedIn = require("../../config/ensureLoggedIn");

router.get("/", ensureLoggedIn, accountsCtrl.getAccount);
router.put("/pets", ensureLoggedIn, accountsCtrl.updatePets);

module.exports = router;
