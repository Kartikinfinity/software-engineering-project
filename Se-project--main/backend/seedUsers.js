const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const connectDB = require("./config/db");

const seed = async () => {
  await connectDB();
  try {
    const users = [
      { name: "Student One", email: "student1@example.com", password: "student123", role: "student", className: "CSE-2" },
      { name: "Teacher One", email: "teacher1@example.com", password: "teacher123", role: "teacher", department: "CSE" },
      { name: "Admin One", email: "admin@example.com", password: "admin123", role: "admin" }
    ];

    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(u.email, "already exists");
        continue;
      }
      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hashed });
      console.log("Created", u.email);
    }
    console.log("Seeding done");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
