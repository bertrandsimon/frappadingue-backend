const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  surname: String,
  address: String,
  zip_code: Number,
  email: String,
  password: String,
  team_name: String,
  city: String,
  token: String,

});

const User = mongoose.model("users", userSchema);

module.exports = User;