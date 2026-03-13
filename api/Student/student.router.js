const router = require("express").Router();

const {
  insertStudentDetail,
  getAllStudents,
  getStudentById,
  updateStudentDetail,
} = require("./student.controller");

// Insert
router.post("/insert", insertStudentDetail);
// Fetch all
router.get("/all", getAllStudents);
// Fetch single
router.get("/:id", getStudentById);
// Update
router.post("/update", updateStudentDetail);

module.exports = router;
