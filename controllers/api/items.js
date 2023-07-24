const { async } = require("q");
const Item = require("../../models/item");
// const Account = require("../../models/account");
// const User = require("../../models/user");

const index = async (req, res) => {
  try {
    const items = await Item.find().populate({
      path: "comments",
      populate: { path: "userId", model: "User" },
    });
    res.json({ items });
  } catch (error) {
    console.error("Failed to fetch items:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

const addReview = async (req, res) => {
  const { itemId } = req.params;
  const { rating, comment } = req.body;

  try {
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Add the new review to the item's comments array
    item.comments.push({ userId: req.user._id, rating, comment });
    await item.save();

    res.status(200).json({ message: "Review added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add review" });
  }
};

module.exports = {
  index,
  addReview,
};
