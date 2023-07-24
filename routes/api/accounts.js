const express = require("express");
const router = express.Router();
const accountsCtrl = require("../../controllers/api/accounts");

router.get("/", accountsCtrl.getAccounts);
router.post("/add-to-cart", accountsCtrl.addToCart);
router.get("/get-cart-items", accountsCtrl.getCartItems);
router.delete("/delete-cart-item", accountsCtrl.deleteCartItem);
router.post("/checkout", accountsCtrl.checkout);
router.get("/get-purchased-history", accountsCtrl.getPurchasedHistory);
router.get("/get-favourite-items", accountsCtrl.getFavouriteItems);
router.post("/add-to-favourites", accountsCtrl.addToFavourites);
router.post("/delete-from-favourites", accountsCtrl.deleteFromFavourites);
router.get("/mypets", accountsCtrl.getMyPets);
router.post("/add-pet", accountsCtrl.addPet);
router.delete("/delete-pet/:petId", accountsCtrl.deletePet);

module.exports = router;
