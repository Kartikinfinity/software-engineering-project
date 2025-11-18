const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const MONGO = process.env.MONGO_URL;

const teachers = [
  { name: "pawan kumar ", email: "pawan@college.com", password: "pawan123" },
  { name: "kranti kumar ", email: "kranti@college.com", password: "kranti123" },
  { name: "ashish sharma", email: "ashish@college.com", password: "ashish123" }
];

async function seed() {
  if (!MONGO) {
    throw new Error("MONGO_URL is not defined");
  }
  await mongoose.connect(MONGO);
  for (let t of teachers) {
    const exists = await User.findOne({ email: t.email });
    if (exists) {
      console.log("Already exists:", t.email);
      continue;
    }
    const hashed = await bcrypt.hash(t.password, 10);
    await User.create({
      name: t.name,
      email: t.email,
      password: hashed,
      role: "teacher"
    });
    console.log("Added:", t.email);
  }
  process.exit();
}

seed();
