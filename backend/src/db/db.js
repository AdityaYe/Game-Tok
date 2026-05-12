const mongoose = require("mongoose");

const logger = require("../config/logger");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    logger.info("MongoDB connected");
  } catch (err) {
    logger.error("MongoDB connection failed", err);

    throw err;
  }
}

module.exports = connectDB;
