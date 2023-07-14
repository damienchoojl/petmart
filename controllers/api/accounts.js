const Account = require("../../models/account");

async function getAccount(req, res) {
  try {
    // Get the account details for the user
    const account = await Account.findOne({ user: req.user.id })
      .populate("favourites")
      .populate("purchasedHistory")
      .populate("addToCart");
    if (!account) throw new Error("Account not found");
    res.status(200).json(account);
  } catch (err) {
    res.status(400).json(err.message);
  }
}

async function updatePets(req, res) {
  try {
    // Update the user's pet details in the account
    const account = await Account.findOneAndUpdate(
      { user: req.user.id },
      { myPets: req.body.myPets },
      { new: true }
    );
    if (!account) throw new Error("Account not found");
    res.status(200).json(account);
  } catch (err) {
    res.status(400).json(err.message);
  }
}

module.exports = {
  getAccount,
  updatePets,
};
