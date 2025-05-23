const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log("Error connecting to database", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;