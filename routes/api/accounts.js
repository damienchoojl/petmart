const express = require("express");
const router = express.Router();
const accountsCtrl = require("../../controllers/api/accounts");

router.get("/", accountsCtrl.getAccounts);
router.post("/add-to-cart", accountsCtrl.addToCart);
router.get("/get-cart-items", accountsCtrl.getCartItems);
router.delete("/delete-cart-item", accountsCtrl.deleteCartItem);
router.post("/checkout", accountsCtrl.checkout);

module.exports = router;
