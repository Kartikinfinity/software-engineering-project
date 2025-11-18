const Leave = require("../models/Leave");

exports.applyLeave = async (req, res) => {
  try {
    const { student, subject, fromDate, toDate, type, reason, medicalFile } = req.body;

    if (!student || !subject || !fromDate || !toDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const leave = await Leave.create({
      student,
      subject,
      type,
      fromDate,
      toDate,
      reason,
      medicalFile, // image/pdf link (added later)
      status: "pending",
    });

    return res.json({ message: "Leave applied successfully", leave });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};
