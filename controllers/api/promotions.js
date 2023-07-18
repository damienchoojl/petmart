const Promotion = require("../../models/promotion");

const index = async (req, res) => {
  const promotions = await Promotion.find();
  res.json({ promotions });
};

module.exports = {
  index,
};
