const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const accountSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    favourites: [{ type: Schema.Types.ObjectId, ref: "Item" }],
    myPets: [
      {
        name: { type: String, required: true },
        type: { type: String, required: true },
        gender: { type: String, enum: ["M", "F"] },
        birthday: { type: Date },
      },
    ],
    purchasedHistory: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    addToCart: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Account", accountSchema);
