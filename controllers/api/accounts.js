const { async } = require("q");
const Account = require("../../models/account");
const Item = require("../../models/item");
const { v4: uuidv4 } = require("uuid");

const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().populate("user");
    res.status(200).json(accounts);
  } catch (error) {
    console.error("Failed to fetch account data:", error);
    res.status(500).json({ error: "Failed to fetch account data" });
  }
};

const addToCart = async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;
    const userAccount = await Account.findOne({ user: userId });
    if (!userAccount) {
      return res.status(404).json({ error: "User account not found" });
    }
    const itemToAdd = await Item.findOne({ _id: itemId });
    if (!itemToAdd) {
      return res.status(404).json({ error: "Item not found" });
    }
    if (quantity > itemToAdd.remainStock) {
      return res.status(400).json({ error: "Not enough stock" });
    }
    for (let i = 0; i < quantity; i++) {
      userAccount.itemInCart.push(itemId);
    }
    await userAccount.save();
    res.status(200).json({ message: "Item(s) added to cart successfully" });
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

const getCartItems = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const account = await Account.findOne({ user: userId }).populate(
      "itemInCart"
    );
    if (!account) {
      return res.status(404).json({ error: "User account not found" });
    }

    const cartItems = account.itemInCart;
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Failed to fetch cart items:", error);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
};

const deleteCartItem = async (req, res) => {
  const { itemId } = req.body;
  if (!itemId) {
    return res
      .status(400)
      .json({ error: "Item ID is missing in the request body." });
  }

  try {
    const account = await Account.findOne({ user: req.user._id });
    if (!account) {
      return res.status(404).json({ error: "Account not found." });
    }

    account.itemInCart.pull(itemId);
    await account.save();

    res.json({ message: "Item deleted from cart successfully." });
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const checkout = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const account = await Account.findOne({ user: userId })
      .populate("itemInCart")
      .exec();

    if (!account) {
      return res.status(404).json({ error: "User account not found" });
    }

    if (account.itemInCart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const orderId = uuidv4().substr(0, 5);

    const purchasedItems = [];

    for (const cartItem of account.itemInCart) {
      if (cartItem.remainStock < 1) {
        return res.status(400).json({ error: "Not enough stock for an item" });
      }

      cartItem.remainStock -= 1;

      await cartItem.save();

      purchasedItems.push({
        itemId: cartItem._id,
        name: cartItem.name,
        itemImage: cartItem.image1,
        price: cartItem.price,
        quantity: 1,
      });
    }

    account.purchasedHistory.push({
      orderId,
      items: purchasedItems,
    });

    account.itemInCart = [];

    await account.save();

    res.status(200).json({ message: "Checkout successful", orderId });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ error: "Error during checkout" });
  }
};

const getPurchasedHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const account = await Account.findOne({ user: userId })
      .populate({
        path: "purchasedHistory.items.itemId",
        model: "Item",
        select: "name price quantity image1",
      })
      .exec();

    if (!account) {
      return res.status(404).json({ error: "User account not found" });
    }

    const purchasedHistory = account.purchasedHistory;
    res.status(200).json(purchasedHistory);
  } catch (error) {
    console.error("Failed to fetch purchased history:", error);
    res.status(500).json({ error: "Failed to fetch purchased history" });
  }
};

const getFavouriteItems = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const account = await Account.findOne({ user: userId }).populate(
      "favourites"
    );

    if (!account) {
      return res.status(404).json({ error: "User account not found" });
    }

    const favouriteItems = account.favourites;
    res.status(200).json({ favouriteItems });
  } catch (error) {
    console.error("Failed to fetch favourite items:", error);
    res.status(500).json({ error: "Failed to fetch favourite items" });
  }
};

const addToFavourites = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user._id;

    if (!itemId) {
      return res
        .status(400)
        .json({ error: "Item ID is missing in the request body." });
    }

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const account = await Account.findOne({ user: userId });
    if (!account) {
      return res.status(404).json({ error: "Account not found." });
    }

    if (account.favourites.includes(itemId)) {
      return res.status(400).json({ error: "Item already in favourites" });
    }

    account.favourites.push(itemId);
    await account.save();

    res.json({ message: "Item added to favourites successfully" });
  } catch (error) {
    console.error("Error adding item to favourites:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  getAccounts,
  addToCart,
  getCartItems,
  deleteCartItem,
  checkout,
  getPurchasedHistory,
  getFavouriteItems,
  addToFavourites,
};
