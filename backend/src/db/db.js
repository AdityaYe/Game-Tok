const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

async function connectDB() {

  try {

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

  } catch (err) {

    console.log("MongoDB connection error:", err);

  }

}

module.exports = connectDB;