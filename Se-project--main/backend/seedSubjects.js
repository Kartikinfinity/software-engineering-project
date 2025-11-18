const connectDB = require("./config/db");
const Subject = require("./models/Subject");
const mongoose = require("mongoose");

const seed = async () => {
  await connectDB();

  const subjects = [
    {
      name: "Advanced Java Programming",
      code: "CSE201",
      maxLeaves: 10,
      teacher: new mongoose.Types.ObjectId("691885ad683ab5eb0080c19e")
    },
    {
      name: "Operating Systems",
      code: "CSE202",
      maxLeaves: 10,
      teacher: new mongoose.Types.ObjectId("691885ad683ab5eb0080c19e")
    },
    {
      name: "Applied Mathematics",
      code: "MTH201",
      maxLeaves: 10,
      teacher: new mongoose.Types.ObjectId("691885ad683ab5eb0080c19e")
    },
    {
      name: "Database Management System",
      code: "CSE204",
      maxLeaves: 10,
      teacher: new mongoose.Types.ObjectId("691885ad683ab5eb0080c19e")
    }
  ];

  for (const s of subjects) {
    const exists = await Subject.findOne({ code: s.code });
    if (exists) {
      console.log(s.code, "exists");
      continue;
    }
    await Subject.create(s);
    console.log("Created", s.code);
  }

  process.exit(0);
};

seed();
