const {
  insertStudent,
  fetchAllStudents,
  fetchStudentById,
  updateStudent,
} = require("./student.service");

module.exports = {
  // Insert Student
  insertStudentDetail: (req, res) => {
    try {
      const data = req.body;
      if (!data.std_name || !data.std_email) {
        return res.status(200).json({
          success: 0,
          message: "Missing required fields",
        });
      }
      insertStudent(data, (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database error",
          });
        }
        return res.status(200).json({
          success: 1,
          message: "Student inserted successfully",
          data: result,
        });
      });
    } catch (error) {
      console.error("insertStudentDetail error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  // Fetch All Students
  getAllStudents: (req, res) => {
    try {
      fetchAllStudents((err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database error",
          });
        }
        if (!result || result.length === 0) {
          return res.status(200).json({
            success: 2,
            data: [],
            message: "No Record Found",
          });
        }
        return res.status(200).json({
          success: 1,
          data: result,
        });
      });
    } catch (error) {
      console.error("getAllStudents error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  // Fetch Student By ID
  getStudentById: (req, res) => {
    try {
      const id = req.params.id;

      fetchStudentById(id, (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
          });
        }

        return res.status(200).json({
          success: 1,
          data: result,
        });
      });
    } catch (error) {
      console.error("getStudentById error:", error);
      return res.status(500).json({
        success: 0,
      });
    }
  },

  // Update Student
  updateStudentDetail: (req, res) => {
    try {
      const data = req.body;

      if (!data.std_id) {
        return res.status(200).json({
          success: 0,
          message: "Student ID required",
        });
      }

      updateStudent(data, (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Student updated successfully",
        });
      });
    } catch (error) {
      console.error("updateStudentDetail error:", error);

      return res.status(500).json({
        success: 0,
      });
    }
  },
};
