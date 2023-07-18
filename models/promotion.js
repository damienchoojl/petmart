const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const promotionSchema = new Schema({
  image: { type: String },
});

module.exports = model("Promotion", promotionSchema);
