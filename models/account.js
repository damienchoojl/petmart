const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const purchasedItemSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: "Item" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const accountSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    favourites: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
    myPets: [
      {
        name: { type: String, required: true },
        type: { type: String, required: true },
        gender: { type: String, enum: ["M", "F"] },
        birthday: { type: Date },
      },
    ],
    purchasedHistory: [
      {
        orderId: { type: String, required: true },
        items: [purchasedItemSchema],
        createdAt: { type: Date },
      },
    ],
    itemInCart: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Account", accountSchema);
