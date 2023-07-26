const User = require("../../models/user");
const Account = require("../../models/account");
const jwt = require("jsonwebtoken");
// Be Sure to add the following
const bcrypt = require("bcrypt");

async function create(req, res) {
  try {
    console.log("Creating a new user...");
    const { name, email, password } = req.body;

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create the user and the associated account
    const newUser = await User.create({ name, email, password });
    console.log("New user created:", newUser);

    const newAccount = await Account.create({ user: newUser._id });
    console.log("New account created:", newAccount);

    // Create a JWT token for the user
    const token = createJWT(newUser);

    // Return the token and any other necessary information
    res.json({ token, user: newUser });
  } catch (err) {
    console.log("Error in signup:", err);
    res.status(400).json({ error: "Sign Up Failed - Try Again" });
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
