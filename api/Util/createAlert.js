const pool = require("../../dbconfig/dbconfig");

// controller
const createAlert = async (req, res) => {
  const { title, message, role, user_id, type } = req.body;

  const [result] = await pool.query(
    `INSERT INTO alertnotify (title, message, type, role, user_id)
     VALUES (?, ?, ?, ?, ?)`,
    [title, message, type || "info", role, user_id || null]
  );

  const newAlert = {
    id: result.insertId,
    title,
    message,
    type,
    role,
    user_id,
    is_read: false,
    created_at: new Date(),
  };

  // Emit AFTER saving
  if (user_id) {
    io.to(`user_${user_id}`).emit("new-alert", newAlert);
  } else {
    io.to(role).emit("new-alert", newAlert);
  }

  res.json({ success: true, alert: newAlert });
};