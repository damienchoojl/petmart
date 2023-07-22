const User = require("../../models/user");
const jwt = require("jsonwebtoken");
// Be Sure to add the following
const bcrypt = require("bcrypt");

async function create(req, res) {
  try {
    // Add the user to the database
    const user = await User.create(req.body);
    // token will be a string
    const token = createJWT(user);
    // Yes, we can use res.json to send back just a string
    // The client code needs to take this into consideration
    res.json(token);
  } catch (err) {
    // Client will check for non-2xx status code
    // 400 = Bad Request
    res.status(400).json(err);
  }
}

async function login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error();
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new Error();
    res.json(createJWT(user));
  } catch {
    res.status(400).json("Bad Credentials");
  }
}

async function updatePassword(req, res) {
  try {
    const { userId } = req.params;
    console.log("userId in updatePassword:", userId); // Check if userId is logged correctly
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
    res.json("Password updated successfully.");
  } catch (err) {
    res.status(400).json(err);
  }
}

async function updateImage(req, res) {
  try {
    const { userId } = req.params;
    const { image } = req.body;
    const user = await User.findByIdAndUpdate(userId, { image }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
}

/*-- Helper Functions --*/

function createJWT(user) {
  return jwt.sign(
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn: "24h" }
  );
}

function checkToken(req, res) {
  // req.user will always be there for you when a token is sent
  console.log("req.user", req.user);
  res.json(req.exp);
}

module.exports = {
  create,
  login,
  checkToken,
  updatePassword,
  updateImage,
};
