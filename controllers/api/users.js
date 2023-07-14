const User = require("../../models/user");
const jwt = require("jsonwebtoken");
// Be Sure to add the following
const bcrypt = require("bcrypt");

async function create(req, res) {
  try {
    // Add the user to the database
    await User.create(req.body);
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    // token will be a string
    const token = createJWT(user);
    if (user.email.endsWith("@admin.com")) {
      // Add admin-specific features to the token payload
      const adminToken = jwt.sign({ user, isAdmin: true }, process.env.SECRET, {
        expiresIn: "24h",
      });
      res.status(201).json(adminToken);
    } else {
      // Yes, we can use res.json to send back just a string
      // The client code needs to take this into consideration
      res.status(201).json(token);
    }
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
    res.status(200).json(createJWT(user));
  } catch {
    res.status(400).json("Bad Credentials");
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
};
