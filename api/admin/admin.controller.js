const sendMail = require("../Util/sendMail");
const {
  insertAlumni,
  fetchAllAlumni,
  fetchAllAlumniById,
  updateAlumni,
  InactiveAlumini,
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
    const { alum_name, email, password, send_email, alum_id } = req.body;

    if (!email || !password || !alum_name||!alum_id) {
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

      return res.status(200).json({
        success: 1,
        message: "Email sent successfully",
      });
    } catch (error) {
      console.error("Mail Error:", error);
      return res.status(500).json({
        success: 0,
        message: "Server error while sending mail",
      });
    }
  },
};
