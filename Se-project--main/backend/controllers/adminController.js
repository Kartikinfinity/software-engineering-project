const User = require("../models/User");
const Subject = require("../models/Subject");
const bcrypt = require("bcryptjs");

// ADD SUBJECT
exports.addSubject = async (req, res) => {
  try {
    const { name, code, maxLeaves } = req.body;

    const exists = await Subject.findOne({ code });
    if (exists) return res.json({ message: "Subject already exists" });

    const subject = await Subject.create({ name, code, maxLeaves });

    return res.json({ message: "Subject added successfully", subject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET ALL SUBJECTS
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate("teacher", "name email");
    return res.json({ subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET ALL TEACHERS
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("name email");
    return res.json({ teachers });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ASSIGN TEACHER TO SUBJECT
exports.assignTeacher = async (req, res) => {
  try {
    const { subjectId, teacherId } = req.body;

    await Subject.findByIdAndUpdate(subjectId, { teacher: teacherId });

    return res.json({ message: "Teacher assigned successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ADD TEACHER
exports.addTeacher = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const teacher = await User.create({
      name,
      email,
      password: hashed,
      role: "teacher",
      department,
    });

    return res.json({
      message: "Teacher added successfully",
      teacher: { id: teacher._id, name: teacher.name, email: teacher.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
