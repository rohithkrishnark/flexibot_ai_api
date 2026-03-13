const sendMail = require("../Util/sendMail");
const bcrypt = require("bcrypt");
const {
  insertAlumni,
  fetchAllAlumni,
  fetchAllAlumniById,
  updateAlumni,
  InactiveAlumini,
  InsertAluminMaster,
  IsEmailSend,
  insertdepDetail,
  getAllDepartmetnDetail,
  upatedepDetail,
  getAllProgramDetail,
  updateProgramDetail,
  insertProgramDetail,
  insertDesignation,
  getAllDesignation,
  updateDesignation,
  getAllProgramYear,
  updateProgramYear,
  insertProgramYear,
  getAllGroupDetail,
  updateGroupDetail,
  insertGroupDetail,
  insertFaculty,
  InsertFacultyLogin,
  getAllFaculity,
  ApproveFaculity,
  ApproveFacLoginDtl,
  getProgramMasterYearById,
} = require("./admin.service");

module.exports = {
  insertAluminiDetail: (req, res) => {
    try {
      const data = req.body;
      const {
        alum_name,
        alum_age,
        alum_company,
        alum_company_location,
        alum_company_designation,
        alum_experience,
        alum_qualification,
        alum_email,
        alum_status,
      } = data;

      // Backend validation
      if (!alum_name || alum_name.length < 3) {
        return res.status(200).json({
          success: 0,
          message: "Invalid alumni name",
        });
      }

      if (!alum_age || alum_age < 18 || alum_age > 100) {
        return res.status(200).json({
          success: 0,
          message: "Invalid age",
        });
      }

      if (!alum_email) {
        return res.status(200).json({
          success: 0,
          message: "Email is required",
        });
      }

      if (!alum_company) {
        return res.status(200).json({
          success: 0,
          message: "Company is required",
        });
      }

      if (!alum_company_location) {
        return res.status(200).json({
          success: 0,
          message: "Company location is required",
        });
      }

      if (!alum_company_designation) {
        return res.status(200).json({
          success: 0,
          message: "Designation is required",
        });
      }

      if (
        alum_experience === undefined ||
        alum_experience < 0 ||
        alum_experience > 60
      ) {
        return res.status(200).json({
          success: 0,
          message: "Invalid experience",
        });
      }

      if (!alum_qualification) {
        return res.status(200).json({
          success: 0,
          message: "Qualification is required",
        });
      }

      // Service call (pure callback style)
      insertAlumni(data, (error, result) => {
        if (error) {
          console.error("Insert Alumni Error:", error);
          return res.status(200).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Alumni inserted successfully",
          alum_id: result.alum_id,
        });
      });
    } catch (error) {
      console.error("Insert Alumni Error:", error);
      return res.status(200).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },
  FetchAllAluminiDetail: (req, res) => {
    fetchAllAlumni((error, result) => {
      if (error) {
        return res.status(200).json({
          success: 0,
          message: "Something went wrong.Database Error",
        });
      }

      if (result.length === 0) {
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
  },
  FetchAllAluminiDetailById: (req, res) => {
    const data = req.body;
    fetchAllAlumniById(data, (error, result) => {
      if (error) {
        return res.status(200).json({
          success: 0,
          message: "Something went wrong.Database Error",
        });
      }

      if (result.length === 0) {
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
  },
  UpdateAluminiDetail: (req, res) => {
    try {
      const data = req.body;
      const { id } = req.params; // get ID from URL
      const {
        alum_name,
        alum_age,
        alum_company,
        alum_company_location,
        alum_company_designation,
        alum_experience,
        alum_qualification,
        alum_email,
        alum_status,
      } = data;

      // Backend validation (same as insert)
      if (!alum_name || alum_name.length < 3) {
        return res
          .status(200)
          .json({ success: 0, message: "Invalid alumni name" });
      }

      if (!alum_age || alum_age < 18 || alum_age > 100) {
        return res.status(200).json({ success: 0, message: "Invalid age" });
      }

      if (!alum_email) {
        return res
          .status(200)
          .json({ success: 0, message: "Email is required" });
      }

      if (!alum_company) {
        return res
          .status(200)
          .json({ success: 0, message: "Company is required" });
      }

      if (!alum_company_location) {
        return res
          .status(200)
          .json({ success: 0, message: "Company location is required" });
      }

      if (!alum_company_designation) {
        return res
          .status(200)
          .json({ success: 0, message: "Designation is required" });
      }

      if (
        alum_experience === undefined ||
        alum_experience < 0 ||
        alum_experience > 60
      ) {
        return res
          .status(200)
          .json({ success: 0, message: "Invalid experience" });
      }

      if (!alum_qualification) {
        return res
          .status(200)
          .json({ success: 0, message: "Qualification is required" });
      }

      // Service call for update
      updateAlumni(id, data, (error, result) => {
        if (error) {
          console.error("Update Alumni Error:", error);
          return res
            .status(200)
            .json({ success: 0, message: "Something went wrong" });
        }

        return res.status(200).json({
          success: 1,
          message: "Alumni updated successfully",
          alum_id: id,
        });
      });
    } catch (error) {
      console.error("Update Alumni Error:", error);
      return res
        .status(200)
        .json({ success: 0, message: "Something went wrong" });
    }
  },
  InactiveAluminiDetail: (req, res) => {
    const data = req.body;
    InactiveAlumini(data, (error, result) => {
      if (error) {
        return res.status(200).json({
          success: 0,
          message: "Something went wrong.Database Error",
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Alumini Inactive SuccessFully",
      });
    });
  },
  sendAluminimail: async (req, res) => {
    const data = req.body;
    const { alum_name, email, password, send_email, alum_id } = data;

    if (!email || !password || !alum_name || !alum_id) {
      return res.status(400).json({
        success: 0,
        message: "Missing required fields",
      });
    }

    // If checkbox not selected → don't send mail
    if (send_email !== 1) {
      return res.status(200).json({
        success: 1,
        message: "Mail sending skipped",
      });
    }

    try {
      const htmlTemplate = `
        <div style="font-family: Arial; padding:20px;">
          <h2 style="color:#13163c;">Welcome ${alum_name} 🎉</h2>
          <p>Your Alumni Login Credentials:</p>
          <hr/>
          <p><b>Email:</b> ${email}</p>
          <p><b>Password:</b> ${password}</p>
          <br/>
          <p>Please change your password after login.</p>
          <small>Training Portal Team</small>
        </div>
      `;

      const mailSent = await sendMail(
        email,
        "Your Alumni Login Credentials",
        htmlTemplate,
      );

      if (!mailSent) {
        return res.status(500).json({
          success: 0,
          message: "Failed to send email",
        });
      }

      IsEmailSend(data, (error, result) => {
        if (error) {
          return res.status(200).json({
            success: 0,
            message: "Something went wrong.Database Error",
          });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            console.error("bcrypt hash error:", err);
            return res.status(500).json({
              success: 0,
              message: "Something went wrong",
            });
          }
          const aluminDetail = {
            alum_name,
            alum_id,
            password: hashedPassword,
          };
          InsertAluminMaster(aluminDetail, (error, result) => {
            if (error) {
              return res.status(200).json({
                success: 0,
                message: "Something went wrong.Database Error",
              });
            }
            return res.status(200).json({
              success: 1,
              message: "Email sent successfully",
            });
          });
        });
      });
    } catch (error) {
      console.error("Mail Error:", error);
      return res.status(500).json({
        success: 0,
        message: "Server error while sending mail",
      });
    }
  },
  insertDepartmentDetail: (req, res) => {
    try {
      const data = req.body;
      // Service call (pure callback style)
      insertdepDetail(data, (error, result) => {
        if (error) {
          console.error("Insert Department Detail Error:", error);
          return res.status(200).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Inserted successfully",
          alum_id: result.alum_id,
        });
      });
    } catch (error) {
      console.error("Insert Department Detail Error:", error);
      return res.status(200).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },
  updateDepdetail: (req, res) => {
    try {
      const data = req.body;
      // Service call (pure callback style)
      upatedepDetail(data, (error, result) => {
        if (error) {
          console.error("Insert Department Detail Error:", error);
          return res.status(200).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Inserted successfully",
          alum_id: result.alum_id,
        });
      });
    } catch (error) {
      console.error("Insert Department Detail Error:", error);
      return res.status(200).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  getDepartmentDetil: (req, res) => {
    getAllDepartmetnDetail((error, result) => {
      if (error) {
        return res.status(200).json({
          success: 0,
          message: "Something went wrong.Database Error",
        });
      }

      if (result.length === 0) {
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
  },
  insertProgramMasterDetail: (req, res) => {
    try {
      const data = req.body;
      const { program_name } = data;

      // Validation
      if (!program_name || program_name.length < 2) {
        return res.status(200).json({
          success: 0,
          message: "Program name is required",
        });
      }

      insertProgramDetail(data, (error, result) => {
        if (error) {
          console.error("Insert Program Error:", error);
          return res.status(200).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Program inserted successfully",
          program_id: result.program_id,
        });
      });
    } catch (error) {
      console.error("Insert Program Catch Error:", error);
      return res.status(200).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },
  updateProgramMasterDetail: (req, res) => {
    try {
      const data = req.body;
      const { program_id, program_name } = data;

      if (!program_id) {
        return res.status(200).json({
          success: 0,
          message: "Program ID required",
        });
      }

      if (!program_name || program_name.length < 2) {
        return res.status(200).json({
          success: 0,
          message: "Program name is required",
        });
      }

      updateProgramDetail(data, (error, result) => {
        if (error) {
          console.error("Update Program Error:", error);
          return res.status(200).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Program updated successfully",
        });
      });
    } catch (error) {
      console.error("Update Program Catch Error:", error);
      return res.status(200).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },
  getProgramMasterDetail: (req, res) => {
    getAllProgramDetail((error, result) => {
      if (error) {
        return res.status(200).json({
          success: 0,
          message: "Something went wrong.Database Error",
        });
      }

      if (result.length === 0) {
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
  },

  createDesignation: (req, res) => {
    insertDesignation(req.body, (err, result) => {
      if (err) return res.status(500).json({ success: 0 });
      return res.json({ success: 1, data: result });
    });
  },

  fetchDesignation: (req, res) => {
    getAllDesignation((err, results) => {
      if (err) return res.status(500).json({ success: 0 });
      return res.json({ success: 1, data: results });
    });
  },

  editDesignation: (req, res) => {
    updateDesignation(req.body, (err, result) => {
      if (err) return res.status(500).json({ success: 0 });
      return res.json({ success: 1 });
    });
  },

  insertProgramMasterYear: (req, res) => {
    try {
      const data = req.body;
      const { program_year_name, program_id } = data;

      if (!program_year_name || program_year_name.length < 2) {
        return res.status(200).json({
          success: 0,
          message: "Program year name is required",
        });
      }

      if (!program_id) {
        return res.status(200).json({
          success: 0,
          message: "Program ID required",
        });
      }

      insertProgramYear(data, (error, result) => {
        if (error) {
          console.error("Insert Program Year Error:", error);
          return res.status(200).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Program detail inserted successfully",
          prgm_mast_dtl_slno: result.prgm_mast_dtl_slno,
        });
      });
    } catch (error) {
      console.error("Insert Program Year Catch Error:", error);
      return res.status(200).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  updateProgramMasterYear: (req, res) => {
    try {
      const data = req.body;
      const { prgm_mast_dtl_slno, program_year_name, program_id } = data;

      if (!prgm_mast_dtl_slno) {
        return res.status(200).json({
          success: 0,
          message: "Detail ID required",
        });
      }

      if (!program_year_name || program_year_name.length < 2) {
        return res.status(200).json({
          success: 0,
          message: "Program year name required",
        });
      }

      updateProgramYear(data, (error, result) => {
        if (error) {
          console.error("Update Program Year Error:", error);
          return res.status(200).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Program detail updated successfully",
        });
      });
    } catch (error) {
      console.error("Update Program Year Catch Error:", error);
      return res.status(200).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  getProgramMasterYear: (req, res) => {
    getAllProgramYear((error, result) => {
      if (error) {
        return res.status(200).json({
          success: 0,
          message: "Something went wrong.Database Error",
        });
      }

      if (result.length === 0) {
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
  },

  getProgramMasterYearById: (req, res) => {
    const id = req.params.id;
    getProgramMasterYearById(id, (error, result) => {
      if (error) {
        return res.status(200).json({
          success: 0,
          message: "Something went wrong.Database Error",
        });
      }

      if (result.length === 0) {
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
  },

  insertUserGroupMaster: (req, res) => {
    try {
      const data = req.body;
      const { group_name } = data;

      if (!group_name || group_name.length < 2) {
        return res.status(200).json({
          success: 0,
          message: "Group name is required",
        });
      }

      insertGroupDetail(data, (error, result) => {
        if (error) {
          console.error("Insert Group Error:", error);
          return res.status(200).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Group inserted successfully",
          group_id: result.group_id,
        });
      });
    } catch (error) {
      console.error("Insert Group Catch Error:", error);

      return res.status(200).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },
  updateUserGroupMaster: (req, res) => {
    try {
      const data = req.body;
      const { group_id, group_name } = data;

      if (!group_id) {
        return res.status(200).json({
          success: 0,
          message: "Group ID required",
        });
      }

      if (!group_name || group_name.length < 2) {
        return res.status(200).json({
          success: 0,
          message: "Group name required",
        });
      }

      updateGroupDetail(data, (error, result) => {
        if (error) {
          console.error("Update Group Error:", error);
          return res.status(200).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Group updated successfully",
        });
      });
    } catch (error) {
      console.error("Update Group Catch Error:", error);

      return res.status(200).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  getUserGroupMaster: (req, res) => {
    getAllGroupDetail((error, result) => {
      if (error) {
        return res.status(200).json({
          success: 0,
          message: "Something went wrong.Database Error",
        });
      }

      if (result.length === 0) {
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
  },

  RegisterFaculty: (req, res) => {
    try {
      const data = req.body;

      const {
        fac_name,
        fac_dep_id,
        fac_age,
        fac_group,
        fac_desg_id,
        fac_mobile_no,
        fac_address,
        fac_email,
      } = data;

      // -------- VALIDATIONS --------

      if (!fac_name || fac_name.length < 3) {
        return res.status(200).json({
          success: 0,
          message: "Invalid faculty name",
        });
      }

      if (!fac_age || fac_age < 21 || fac_age > 70) {
        return res.status(200).json({
          success: 0,
          message: "Invalid age",
        });
      }

      if (!fac_email) {
        return res.status(200).json({
          success: 0,
          message: "Email is required",
        });
      }

      if (!fac_dep_id) {
        return res.status(200).json({
          success: 0,
          message: "Department is required",
        });
      }

      if (!fac_group) {
        return res.status(200).json({
          success: 0,
          message: "Group is required",
        });
      }

      if (!fac_desg_id) {
        return res.status(200).json({
          success: 0,
          message: "Designation is required",
        });
      }

      if (!fac_mobile_no || fac_mobile_no.length !== 10) {
        return res.status(200).json({
          success: 0,
          message: "Invalid mobile number",
        });
      }

      if (!fac_address) {
        return res.status(200).json({
          success: 0,
          message: "Address is required",
        });
      }

      // -------- INSERT FACULTY --------

      insertFaculty(data, async (error, result) => {
        if (error) {
          console.error("Insert Faculty Error:", error);
          return res.status(200).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        const fac_id = result.fac_id;

        const defaultPassword = "123";

        // -------- HASH PASSWORD --------

        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const loginData = {
          fac_id: fac_id,
          fac_username: fac_email,
          fac_password: hashedPassword,
          fac_active_status: 0, // waiting for admin approval
        };

        // -------- INSERT LOGIN TABLE --------

        InsertFacultyLogin(loginData, async (error) => {
          if (error) {
            console.error("Login Insert Error:", error);
            return res.status(200).json({
              success: 0,
              message: "Login creation failed",
            });
          }

          // -------- SEND EMAIL --------

          const htmlTemplate = `
        <div style="font-family: Arial; padding:20px;">
          <h2 style="color:#13163c;">Welcome ${fac_name} 🎉</h2>

          <p>Your Faculty Login Credentials:</p>
          <hr/>

          <p><b>Email:</b> ${fac_email}</p>
          <p><b>Password:</b> ${defaultPassword}</p>

          <br/>

          <p>Your account will be activated only after admin verification.</p>

          <p>Please change your password after login.</p>

          <small>Training Portal Team</small>
        </div>
        `;

          await sendMail(
            fac_email,
            "Your Faculty Login Credentials",
            htmlTemplate,
          );

          return res.status(200).json({
            success: 1,
            message:
              "Faculty registered successfully. Credentials sent to email",
            fac_id,
          });
        });
      });
    } catch (error) {
      console.error("Register Faculty Error:", error);

      return res.status(200).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },
  getAllFaculity: (req, res) => {
    getAllFaculity((error, result) => {
      if (error) {
        return res.status(200).json({
          success: 0,
          message: "Something went wrong.Database Error",
        });
      }

      if (result.length === 0) {
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
  },
  ApproveFaculity: (req, res) => {
    const data = req.body;
    ApproveFaculity(data, (error, result) => {
      if (error) {
        return res.status(200).json({
          success: 0,
          message: "Something went wrong.Database Error",
        });
      }

      ApproveFacLoginDtl(data, (error, result) => {
        if (error) {
          return res.status(200).json({
            success: 0,
            message: "Something went wrong.Database Error",
          });
        }
        return res.status(200).json({
          success: 1,
          message: "Admin verification Successfull",
        });
      });
    });
  },
  ApproveFacLoginDtl: (req, res) => {
    const data = req.body;
    ApproveFacLoginDtl(data, (error, result) => {
      if (error) {
        return res.status(200).json({
          success: 0,
          message: "Something went wrong.Database Error",
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Upadate Successfully",
      });
    });
  },
};
