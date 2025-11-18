const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department, className } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Fill all required fields" });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role, department, className });
    return res.status(201).json({ message: "User registered", user: { id: user._id, email: user.email, role: user.role }});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) return res.status(400).json({ message: "Provide email, password and role" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid password" });

    if (user.role !== role) return res.status(403).json({ message: "Role mismatch" });

    // For now return user basic info (later add JWT)
    return res.json({ message: "Login success", user: { id: user._id, name: user.name, email: user.email, role: user.role }});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
