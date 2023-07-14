const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    itemPurchased: [{ type: Schema.Types.ObjectId, ref: "Item" }],
    purchasedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Order", orderSchema);
