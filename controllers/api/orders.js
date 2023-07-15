const Order = require("../../models/order");

const createOrder = async (req, res) => {
  try {
    const { itemPurchased } = req.body;
    const order = await Order.create({ itemPurchased });
    res.status(201).json({ order });
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ purchasedBy: userId }).populate(
      "itemPurchased"
    );
    res.json({ orders });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

module.exports = {
  createOrder,
  getOrdersByUser,
};
