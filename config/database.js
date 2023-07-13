const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);
mongoose.set("debug", true);

const db = mongoose.connection;

db.on("connected", function () {
  console.log(`Connected to ${db.name} at ${db.host}:${db.port}`);
});
