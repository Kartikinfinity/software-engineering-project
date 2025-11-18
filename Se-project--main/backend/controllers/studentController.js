const Subject = require("../models/Subject");
const Leave = require("../models/Leave");
const mongoose = require("mongoose");

exports.getDashboard = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(studentId)) return res.status(400).json({ message: "Invalid studentId" });

    // fetch all subjects (later we can filter by student's class)
    const subjects = await Subject.find().lean();

    // For each subject compute leaves taken (approved) and leaves remaining (based on maxLeaves)
    const subjectStats = await Promise.all(subjects.map(async (s) => {
      const taken = await Leave.countDocuments({
        student: studentId,
        subject: s._id,
        status: "approved"
      });
      const pending = await Leave.countDocuments({
        student: studentId,
        subject: s._id,
        status: "pending"
      });
      return {
        subjectId: s._id,
        name: s.name,
        code: s.code,
        maxLeaves: s.maxLeaves,
        leavesTaken: taken,
        leavesPending: pending,
        leavesRemaining: Math.max(0, s.maxLeaves - taken)
      };
    }));

    // recent leaves (last 10)
    const recentLeaves = await Leave.find({ student: studentId })
      .populate("subject", "name code")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return res.json({ subjectStats, recentLeaves });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getLeaves = async (req, res) => {
  try {
    const { studentId } = req.params;
    const leaves = await Leave.find({ student: studentId })
      .populate("subject", "name code")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ leaves });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
