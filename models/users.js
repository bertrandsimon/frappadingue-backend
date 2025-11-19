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

// Add indexes for frequently queried fields
userSchema.index({ email: 1 }, { unique: true }); // Unique index for email lookups
userSchema.index({ token: 1 }); // For token-based authentication

const User = mongoose.model("users", userSchema);

module.exports = User;