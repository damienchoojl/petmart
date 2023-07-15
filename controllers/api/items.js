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

module.exports = {
  index,
};
