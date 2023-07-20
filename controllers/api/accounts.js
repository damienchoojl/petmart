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

    // Check if there are items in the cart
    if (account.itemInCart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Generate a random 5-digit order ID
    const orderId = uuidv4().substr(0, 5);

    // Prepare the purchased items and deduct remainStock
    const purchasedItems = [];

    for (const cartItem of account.itemInCart) {
      if (cartItem.remainStock < 1) {
        return res.status(400).json({ error: "Not enough stock for an item" });
      }

      // Deduct the quantity from remainStock
      cartItem.remainStock -= 1;

      // Save the updated item
      await cartItem.save();

      // Add the purchased item to the list
      purchasedItems.push({
        itemId: cartItem._id,
        name: cartItem.name,
        price: cartItem.price,
        quantity: 1, // In this example, we assume each item has a quantity of 1 in the cart.
      });
    }

    // Add the purchased items to purchasedHistory with the generated orderId
    account.purchasedHistory.push({
      orderId,
      items: purchasedItems,
    });

    // Clear the cart after successful checkout
    account.itemInCart = [];

    // Save the updated account
    await account.save();

    res.status(200).json({ message: "Checkout successful", orderId });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ error: "Error during checkout" });
  }
};

module.exports = {
  getAccounts,
  addToCart,
  getCartItems,
  deleteCartItem,
  checkout,
};
