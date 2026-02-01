const bcrypt = require("bcrypt");
const { insertUser, findUserByEmail } = require("./usercontroller.service");

module.exports = {

  //  Register
  RegisterUser: async (req, res) => {
    try {
      const { user_name, user_email, password } = req.body;

      // 1️ Validate input
      if (!user_name || !user_email || !password) {
        return res.status(400).json({
          success: 0,
          message: "Missing required fields"
        });
      }

      // 2️ Check if email already exists
      const existingUser = await findUserByEmail(user_email);
      if (existingUser) {
        return res.status(409).json({
          success: 0,
          message: "Email already exists"
        });
      }

      // 3️ Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 4️ Insert user via service
      const user = await insertUser({
        user_name,
        user_email,
        password: hashedPassword
      });

      res.status(201).json({
        success: 1,
        message: "Registered successfully",
        data: user
      });

    } catch (error) {
      console.error("RegisterUser error:", error);
      res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  //  Login
  loginUserDetail: async (req, res) => {
    try {
      const { user_email, password } = req.body;

      if (!user_email || !password) {
        return res.status(400).json({
          success: 0,
          message: "Missing required fields"
        });
      }

      const user = await findUserByEmail(user_email);
      if (!user) {
        return res.status(401).json({
          success: 0,
          message: "Invalid email or password"
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({
          success: 0,
          message: "Invalid email or password"
        });
      }

      // Optional: emit socket event here
      if (req.io) req.io.emit("login-event", { message: `${user.user_name} logged in` });

      res.status(200).json({
        success: 1,
        message: "Login successful",
        data: { user_id: user.user_id, user_name: user.user_name, user_email: user.user_email }
      });

    } catch (error) {
      console.error("loginUserDetail error:", error);
      res.status(500).json({
        success: 0,
        message: "Something went wrong"
      });
    }
  }
};
