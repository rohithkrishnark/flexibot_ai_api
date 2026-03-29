const bcrypt = require("bcrypt");
const {
  insertUser,
  findUserByEmail,
  findUFacByEmail,
  findAluminiByEmail,
  saveContact,
} = require("./usercontroller.service");

module.exports = {
  // Register
  RegisterUser: (req, res) => {
    try {
      const { user_name, user_email, password } = req.body;

      // 1️ Validate input
      if (!user_name || !user_email || !password) {
        return res.status(400).json({
          success: 0,
          message: "Missing required fields",
        });
      }

      // 2️ Check if email already exists
      findUserByEmail(user_email, (err, existingUser) => {
        if (err) {
          console.error("findUserByEmail error:", err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        if (existingUser) {
          return res.status(409).json({
            success: 0,
            message: "Email already exists",
          });
        }

        // 3️ Hash password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            console.error("bcrypt hash error:", err);
            return res.status(500).json({
              success: 0,
              message: "Something went wrong",
            });
          }

          // 4️ Insert user
          insertUser(
            {
              user_name,
              user_email,
              password: hashedPassword,
            },
            (err, user) => {
              if (err) {
                console.error("insertUser error:", err);
                return res.status(500).json({
                  success: 0,
                  message: "Something went wrong",
                });
              }

              return res.status(201).json({
                success: 1,
                message: "Registered successfully",
                data: user,
              });
            },
          );
        });
      });
    } catch (error) {
      console.error("RegisterUser error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  // Login
  loginUserDetail: (req, res) => {
    try {
      const { user_email, password } = req.body;

      if (!user_email || !password) {
        return res.status(400).json({
          success: 0,
          message: "Missing required fields",
        });
      }

      findUserByEmail(user_email, (err, user) => {
        if (err) {
          console.error("findUserByEmail error:", err);
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

        bcrypt.compare(password, user.password, (err, match) => {
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
            req.io.emit("login-event", {
              message: `${user.user_name} logged in`,
            });
          }

          return res.status(200).json({
            success: 1,
            message: "Login successful",
            data: {
              user_id: user.user_id,
              user_name: user.user_name,
              user_email: user.user_email,
              role: "user",
            },
          });
        });
      });
    } catch (error) {
      console.error("loginUserDetail error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  //fac login

  FacloginUserDetail: (req, res) => {
    try {
      const { user_email, password } = req.body;

      if (!user_email || !password) {
        return res.status(200).json({
          success: 0,
          message: "Missing required fields",
        });
      }

      findUFacByEmail(user_email, (err, fac) => {
        if (err) {
          console.error("findFacByEmail error:", err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        if (!fac) {
          return res.status(200).json({
            success: 2,
            message: "Invalid email or password",
          });
        }

        const { fac_admin_verify } = fac ?? {};

        if (fac_admin_verify === 0) {
          return res.status(200).json({
            success: 4,
            message: "Admin Approval Pending",
          });
        }

        bcrypt.compare(password, fac.fac_password, (err, match) => {
          if (err) {
            console.error("bcrypt compare error:", err);
            return res.status(500).json({
              success: 0,
              message: "Something went wrong",
            });
          }

          if (!match) {
            return res.status(200).json({
              success: 0,
              message: "Invalid email or password",
            });
          }

          // Optional socket event
          if (req.io) {
            req.io.emit("fac-login-event", {
              message: `${fac.fac_name} logged in`,
            });
          }

          return res.status(200).json({
            success: 1,
            message: "Login successful",
            data: {
              fac_id: fac.fac_id,
              fac_name: fac.fac_name,
              user_email: fac.fac_username,
              fac_dep_id: fac.fac_dep_id,
              role: "fac",
            },
          });
        });
      });
    } catch (error) {
      console.error("loginUserDetail error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  AluminiLogin: (req, res) => {
    try {
      const { user_email, password } = req.body;

      if (!user_email || !password) {
        return res.status(200).json({
          success: 0,
          message: "Missing required fields",
        });
      }

      findAluminiByEmail(user_email, (err, fac) => {
        if (err) {
          console.error("findFacByEmail error:", err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        if (!fac) {
          return res.status(200).json({
            success: 2,
            message: "Invalid email or password",
          });
        }

        const { is_email_send } = fac ?? {};

        if (is_email_send === 0) {
          return res.status(200).json({
            success: 4,
            message: "Admin Approval Pending",
          });
        }

        bcrypt.compare(password, fac.alum_password, (err, match) => {
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
            req.io.emit("alumini-login-event", {
              message: `${fac.alum_name} logged in`,
            });
          }

          return res.status(200).json({
            success: 1,
            message: "Login successful",
            data: {
              alum_id: fac.alum_id,
              alum_name: fac.alum_name,
              alum_email: fac.alum_email,
              role: "alumni",
            },
          });
        });
      });
    } catch (error) {
      console.error("loginUserDetail error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  saveContact: (req, res) => {
    const { name, email, mobile, address, message } = req.body;

    // validation
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Name, Email and Message are required",
        });
    }

    const data = { name, email, mobile, address, message };

    //  CALL MODEL (FIXED)
    saveContact(data, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "DB error",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Thanks for your interest",
        });
    });
},
};
