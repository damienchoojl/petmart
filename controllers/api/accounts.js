const Account = require("../../models/account");
const Item = require("../../models/item");

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

    // Check if there is enough stock of the item
    if (quantity > itemToAdd.remainStock) {
      return res.status(400).json({ error: "Not enough stock" });
    }

    // Add the item multiple times based on the quantity
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

module.exports = {
  getAccounts,
  addToCart,
};
