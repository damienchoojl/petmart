const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", unique: true },
    rating: { type: Number },
    comment: { type: String },
  },
  { timestamps: true }
);

const itemSchema = new Schema(
  {
    name: { type: String, required: true },
    petType: { type: String },
    foodType: { type: String },
    categoryType: { type: String },
    detail: [
      {
        details: { type: String },
        ingredients: [{ type: String }],
      },
    ],
    price: { type: Number },
    image1: { type: String },
    image2: { type: String },
    remainStock: { type: Number },
    brand: { type: String },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Item", itemSchema);
