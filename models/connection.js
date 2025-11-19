const mongoose = require("mongoose");

mongoose.set('strictQuery', false);
const connectionString = process.env.CONNECTION_STRING;

// Connection options for better performance
const connectionOptions = {
  connectTimeoutMS: 2000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 5, // Maintain at least 5 socket connections
  serverSelectionTimeoutMS: 5000, // How long to try selecting a server
  heartbeatFrequencyMS: 10000, // How often to check server status
};

mongoose
  .connect(connectionString, connectionOptions)
  .then(() => console.log("Database connected"))
  .catch((error) => console.error(error));
