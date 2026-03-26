const { insertChat } = require("./chatbot.service");

module.exports = {
  insertchatdetail: (req, res) => {
    try {
      const data = req.body;

      if (!data.query || !data.response) {
        return res.status(200).json({
          success: 0,
          message: "Missing required fields",
        });
      }

      insertChat(data, (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database error",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Chat saved successfully",
          data: result,
        });
      });
    } catch (error) {
      console.error("insertchatdetail error:", error);

      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },
};
