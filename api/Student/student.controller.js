const {
  insertStudent,
  fetchAllStudents,
  fetchStudentById,
  updateStudent,
  inactiveStudent,
  batchStudentDetail,
  findStudentByEmail,
  createPost,
  getAllPosts,
  fetchPostById,
  deletePost,
  createActivity,
  getAllActivityDetail,
  createConnection,
  increaseFollower,
  getMyConnections,
  getLoggedStudentDetail,
  EditStudentBio,
  EditSkillService,
  getAllTotalStudents,
  getAllStudentFullActivity,
  giveActivityScore,
  rejectActivity,
} = require("./student.service");
const bcrypt = require("bcrypt");

module.exports = {
  // Insert Student
  insertStudentDetail: async (req, res) => {
    try {
      const data = req.body;
      if (!data.std_name || !data.std_email) {
        return res.status(200).json({
          success: 0,
          message: "Missing required fields",
        });
      }

      console.log(data.std_password);

      // 🔒 Hash the password before sending to DB
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.std_password, saltRounds);
      data.std_password = hashedPassword;

      console.log({
        hashedPassword,
      });

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
    const data = req.body;
    try {
      fetchAllStudents(data, (err, result) => {
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

  getAllTotalStudents: (req, res) => {
    try {
      getAllTotalStudents((err, result) => {
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

  getLoggedStudentDetail: (req, res) => {
    const data = req.body;
    try {
      getLoggedStudentDetail(data, (err, result) => {
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

  inactiveStudent: (req, res) => {
    const data = req.body;

    try {
      inactiveStudent(data, (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database error",
          });
        }

        if (result === 0) {
          return res.status(200).json({
            success: 2,
            message: "Student not found or no change",
          });
        }

        return res.status(200).json({
          success: 1,
          message:
            data.std_status === 1 ? "Student Activated" : "Student Inactive",
        });
      });
    } catch (error) {
      console.error("inactiveStudent error:", error);
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
  batchStudentDetail: (req, res) => {
    const data = req.body;
    try {
      batchStudentDetail(data, (err, result) => {
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
  StudentLogin: (req, res) => {
    try {
      const { user_email, password } = req.body;

      if (!user_email || !password) {
        return res.status(400).json({
          success: 0,
          message: "Missing required fields",
        });
      }

      findStudentByEmail(user_email, (err, user) => {
        if (err) {
          console.error("findStudentByEmail error:", err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        if (!user) {
          return res.status(200).json({
            success: 2,
            message: "Invalid email or password",
          });
        }

        // ⚠️ Use std_password, not password
        if (!user.std_password) {
          return res.status(500).json({
            success: 0,
            message: "Password not set for this user",
          });
        }

        bcrypt.compare(password, user.std_password, (err, match) => {
          if (err) {
            console.error("bcrypt compare error:", err);
            return res.status(500).json({
              success: 0,
              message: "Something went wrong",
            });
          }

          if (!match) {
            return res.status(401).json({
              success: 0,
              message: "Invalid email or password",
            });
          }

          // Optional socket event
          if (req.io) {
            req.io.emit("student-login-event", {
              message: `${user.std_name} logged in`,
            });
          }

          return res.status(200).json({
            success: 1,
            message: "Login successful",
            data: {
              user_id: user.std_id,
              user_name: user.std_name,
              user_email: user.std_email,
              role: "student",
            },
          });
        });
      });
    } catch (error) {
      console.error("StudentLogin error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },
  createPost: (req, res) => {
    try {
      const { caption, description, std_id } = req.body;
      const file = req.file;

      if (!std_id || !caption) {
        return res.status(400).json({ success: 0, message: "Missing fields" });
      }

      const mediaType = file ? file.mimetype.split("/")[0] : null;

      // Step 1: Insert post record
      createPost(
        { caption, description, std_id, media_type: mediaType },
        (err, postId) => {
          if (err)
            return res.status(500).json({ success: 0, message: "DB Error" });
          req.io.emit("new-post", {
            postId,
            student_id: std_id,
            caption,
            description,
            media_type: mediaType,
          });
          return res.status(200).json({
            success: 1,
            message: "Post created successfully",
            data: { postId },
          });
        },
      );
    } catch (error) {
      console.error("createPost error:", error);
      return res
        .status(500)
        .json({ success: 0, message: "Something went wrong" });
    }
  },
  createActivityController: (req, res) => {
    try {
      const { caption, description, student_id } = req.body;

      if (!student_id || !caption) {
        return res.status(400).json({ success: 0, message: "Missing fields" });
      }

      createActivity(
        { caption, description, student_id },
        (err, activityId) => {
          if (err) {
            return res.status(500).json({ success: 0, message: "DB Error" });
          }

          req.io.emit("new-activity", {
            activityId,
            student_id: student_id,
            caption,
            description,
          });

          return res.status(200).json({
            success: 1,
            message: "Activity created successfully",
            data: { activityId },
          });
        },
      );
    } catch (error) {
      console.error("createActivityController error:", error);
      return res
        .status(500)
        .json({ success: 0, message: "Something went wrong" });
    }
  },

  getAllPosts: (req, res) => {
    const { std_id } = req.body;

    getAllPosts(std_id, (err, result) => {
      if (err) return res.status(500).json({ success: 0, message: "DB error" });
      if (result.length === 0)
        return res
          .status(200)
          .json({ success: 2, message: "No Post Available", data: [] });
      return res.status(200).json({ success: 1, data: result });
    });
  },

  getAllActivityDetail: (req, res) => {
    const { std_id } = req.body;

    getAllActivityDetail(std_id, (err, result) => {
      if (err) return res.status(500).json({ success: 0, message: "DB error" });
      if (result.length === 0)
        return res
          .status(200)
          .json({ success: 2, message: "No Post Available", data: [] });
      return res.status(200).json({ success: 1, data: result });
    });
  },

  getPostById: (req, res) => {
    try {
      const id = req.params.id;
      fetchPostById(id, (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ success: 0, message: "Database error" });
        return res.status(200).json({ success: 1, data: result });
      });
    } catch (error) {
      console.error("getPostById error:", error);
      return res
        .status(500)
        .json({ success: 0, message: "Something went wrong" });
    }
  },

  deletePost: (req, res) => {
    try {
      const { id } = req.body;
      if (!id)
        return res
          .status(400)
          .json({ success: 0, message: "Post ID required" });

      deletePost(id, (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ success: 0, message: "Database error" });
        return res
          .status(200)
          .json({ success: 1, message: "Post deleted successfully" });
      });
    } catch (error) {
      console.error("deletePost error:", error);
      return res
        .status(500)
        .json({ success: 0, message: "Something went wrong" });
    }
  },
  connectUser: (req, res) => {
    const { sender_id, sender_type, receiver_id, receiver_type } = req.body;

    createConnection(
      { sender_id, sender_type, receiver_id, receiver_type },
      (err) => {
        if (err)
          return res
            .status(500)
            .json({ success: 0, message: "Error in Inserting Data" });

        //  increase follower count dynamically
        increaseFollower(receiver_id, receiver_type);

        //  SOCKET (optional)
        req.io.emit("new-connection", {
          sender_id,
          receiver_id,
          receiver_type,
        });
        return res.json({ success: 1, message: "Connected SuccessFully" });
      },
    );
  },

  EditStudentBio: (req, res) => {
    const data = req.body;
    EditStudentBio(data, (err, result) => {
      if (err) return res.status(500).json({ success: 0 });

      return res.json({
        success: 1,
        data: result, // [{receiver_id: 2}, {receiver_id: 5}]
      });
    });
  },
  EditSkills: (req, res) => {
    const data = req.body;
    EditSkillService(data, (err, result) => {
      if (err) return res.status(500).json({ success: 0 });
      return res.json({
        success: 1,
        data: result, // [{receiver_id: 2}, {receiver_id: 5}]
      });
    });
  },

  getMyConnections: (req, res) => {
    const { user_id, user_type } = req.body;
    getMyConnections(user_id, user_type, (err, result) => {
      if (err) return res.status(500).json({ success: 0 });

      return res.json({
        success: 1,
        data: result, // [{receiver_id: 2}, {receiver_id: 5}]
      });
    });
  },

  getAllStudentFullActivity: (req, res) => {
    const { dep_id } = req.body;
    getAllStudentFullActivity(dep_id, (err, result) => {
      if (err) return res.status(500).json({ success: 0, message: "DB error" });
      if (result.length === 0)
        return res
          .status(200)
          .json({ success: 2, message: "No Post Available", data: [] });
      return res.status(200).json({ success: 1, data: result });
    });
  },

  giveActivityScore: (req, res) => {
    const data = req.body;
    const { score, user_id, activity_id } = data;

    if (!score || !user_id || !activity_id) {
      return res.status(400).json({ success: 0, message: "Missing fields" });
    }

    giveActivityScore(data, (err, result) => {
      if (err) return res.status(500).json({ success: 0, message: "DB error" });
      return res
        .status(200)
        .json({ success: 1, message: "New activity score Added" });
    });
  },

  rejectActivity: (req, res) => {
    const data = req.body;
    const { reject_reason, user_id, activity_id } = data;

    if (!reject_reason || !user_id || !activity_id) {
      return res.status(400).json({ success: 0, message: "Missing fields" });
    }

    rejectActivity(data, (err, result) => {
      if (err) return res.status(500).json({ success: 0, message: "DB error" });
      return res
        .status(200)
        .json({ success: 1, message: "New activity score Added" });
    });
  },
  
};
