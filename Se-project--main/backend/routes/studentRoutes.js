const express = require("express");
const router = express.Router();
const { getDashboard, getLeaves } = require("../controllers/studentController");

// GET dashboard for student
// e.g. GET /api/student/dashboard/<studentId>
router.get("/dashboard/:studentId", getDashboard);

// GET all leaves for student
router.get("/leaves/:studentId", getLeaves);

module.exports = router;
