const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGO = process.env.MONGO_URL;

    if (!MONGO) {
      throw new Error("MONGO_URL is not defined");
    }

    await mongoose.connect(MONGO);

    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("DB Connection Error:", error.message);
  }
};

module.exports = connectDB;
