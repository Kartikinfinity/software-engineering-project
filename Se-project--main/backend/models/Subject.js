const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
  maxLeaves: { type: Number, default: 3 } // default allowed leaves per subject
});

module.exports = mongoose.model("Subject", subjectSchema);
