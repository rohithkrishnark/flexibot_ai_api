const { createAlert, getAlerts, markAsRead } = require("./alertService");

module.exports = {
  // ================= CREATE ALERT =================
  createAlertController: (req, res) => {
    try {
      const data = req.body;

      if (!data.title || !data.message) {
        return res.status(400).json({
          success: 0,
          message: "Missing required fields",
        });
      }

      createAlert(data, (err, alert) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database error",
          });
        }

        //  REALTIME EMIT
        try {
          const io = req.io;

          if (alert.user_id) {
            io.to(`user_${alert.user_id}`).emit("new_alert", alert);
          } else {
            io.to(alert.role).emit("new_alert", alert);
          }
        } catch (socketErr) {
          console.error("Socket emit error:", socketErr);
        }

        return res.status(200).json({
          success: 1,
          message: "Alert created successfully",
          data: alert,
        });
      });
    } catch (error) {
      console.error("createAlertController error:", error);

      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  // ================= GET ALERTS =================
  getAlertsController: (req, res) => {
    try {
      const { role } = req.body;

      getAlerts(role, (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "DB Error",
          });
        }

        if (!result || result.length === 0) {
          return res.status(200).json({
            success: 2,
            message: "No alerts found",
            data: [],
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Fetched successfully",
          data: result,
        });
      });
    } catch (error) {
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  // ================= MARK AS READ =================
  markAsReadController: (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: 0,
          message: "Alert ID required",
        });
      }

      markAsRead(id, (err) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database error",
          });
        }

        return res.status(200).json({
          success: 2,
          message: "Marked as read",
        });
      });
    } catch (error) {
      console.error("markAsReadController error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },
};
