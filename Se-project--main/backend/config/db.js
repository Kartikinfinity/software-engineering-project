const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGO = process.env.MONGO_URL;

    if (!MONGO) {
      throw new Error("MONGO_URL is not defined");
    }

    await mongoose.connect(MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
