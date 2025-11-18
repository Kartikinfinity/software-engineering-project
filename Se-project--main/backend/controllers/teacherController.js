const Leave = require("../models/Leave");
const Subject = require("../models/Subject");

const getTeacherSubjectIds = async (teacherId) => {
  const subjects = await Subject.find({ teacher: teacherId });
  return subjects.map((s) => s._id);
};

exports.getPendingLeaves = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const subjectIds = await getTeacherSubjectIds(teacherId);

    const leaves = await Leave.find({
      subject: { $in: subjectIds },
      status: "pending",
    })
      .populate("student", "name email className")
      .populate("subject", "name code")
      .sort({ createdAt: -1 });

    return res.json({ leaves });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getLeaveHistory = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const subjectIds = await getTeacherSubjectIds(teacherId);

    const leaves = await Leave.find({
      subject: { $in: subjectIds },
      status: { $ne: "pending" },
    })
      .populate("student", "name email className")
      .populate("subject", "name code")
      .sort({ createdAt: -1 });

    return res.json({ leaves });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.approveLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    await Leave.findByIdAndUpdate(leaveId, { status: "approved" });
    return res.json({ message: "Leave Approved" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.rejectLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    await Leave.findByIdAndUpdate(leaveId, { status: "rejected" });
    return res.json({ message: "Leave Rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
