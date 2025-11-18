const express = require("express");
const router = express.Router();
const { applyLeave } = require("../controllers/leaveController");

// POST Apply Leave
router.post("/apply", applyLeave);

module.exports = router;
