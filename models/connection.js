// Load dotenv if not already loaded (needed when this file is required before app.js)
if (!process.env.CONNECTION_STRING) {
  require("dotenv").config();
}

const mongoose = require("mongoose");

mongoose.set('strictQuery', false);
const connectionString = process.env.CONNECTION_STRING;

mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error(error));
