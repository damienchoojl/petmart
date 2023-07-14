const Order = require("../../models/order");

async function createOrder(req, res) {
  try {
    // Create a new order with the provided item IDs
    const order = await Order.create({
      itemPurchased: req.body.itemPurchased,
      purchasedBy: req.user.id,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function getOrdersByUser(req, res) {
  try {
    // Get all orders for the logged-in user
    const orders = await Order.find({ purchasedBy: req.user.id })
      .populate("itemPurchased")
      .populate("purchasedBy");
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
}

module.exports = {
  createOrder,
  getOrdersByUser,
};
