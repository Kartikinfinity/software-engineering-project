const express = require("express");
const router = express.Router();
const { getPendingLeaves, getLeaveHistory, approveLeave, rejectLeave } = require("../controllers/teacherController");

// GET pending leaves for teacher
router.get("/pending/:teacherId", getPendingLeaves);

// GET approved/rejected history
router.get("/history/:teacherId", getLeaveHistory);

// Approve Leave
router.post("/approve/:leaveId", approveLeave);

// Reject Leave
router.post("/reject/:leaveId", rejectLeave);

module.exports = router;
