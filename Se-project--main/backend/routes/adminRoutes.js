const express = require("express");
const router = express.Router();
const {
  addSubject,
  getSubjects,
  getTeachers,
  assignTeacher,
  addTeacher,
} = require("../controllers/adminController");

router.post("/add-subject", addSubject);
router.get("/subjects", getSubjects);
router.get("/teachers", getTeachers);
router.post("/assign-teacher", assignTeacher);
router.post("/add-teacher", addTeacher);

module.exports = router;
