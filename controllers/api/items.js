const Item = require("../../models/item");

async function getAllItems(req, res) {
  try {
    // Get all items
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function getItemById(req, res) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) throw new Error("Item not found");
    res.status(200).json(item);
  } catch (err) {
    res.status(400).json(err.message);
  }
}

module.exports = {
  getAllItems,
  getItemById,
};
