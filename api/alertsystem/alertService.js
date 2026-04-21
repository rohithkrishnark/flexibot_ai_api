const pool = require("../../dbconfig/dbconfig");

// ================= CREATE ALERT =================
const createAlert = (data, callback) => {
  const { title, message, role, user_id = null, type = "info" } = data;

  pool.query(
    `INSERT INTO alertnotify (title, message, type, role, user_id)
     VALUES (?, ?, ?, ?, ?)`,
    [title, message, type, role, user_id],
    (err, result) => {
      if (err) return callback(err);

      const alert = {
        id: result.insertId,
        title,
        message,
        type,
        role,
        user_id,
        is_read: false,
        created_at: new Date(),
      };

      return callback(null, alert);
    },
  );
};

// ================= GET ALERTS =================
const getAlerts = (role, callback) => {
  pool.query(
    `SELECT * FROM alertnotify 
     WHERE role = ?
     ORDER BY created_at DESC`,
    [role],
    (err, result) => {
      if (err) return callback(err);
      return callback(null, result);
    },
  );
};

// ================= MARK AS READ =================
const markAsRead = (id, callback) => {
  console.log(id);
  
  pool.query(
    `UPDATE alertnotify SET is_read = 1 WHERE id = ?`,
    [id],
    (err, result) => {
      if (err) return callback(err);
      return callback(null, result);
    },
  );
};

// ================= DELETE ALERT =================
const deleteAlert = (id, callback) => {
  pool.query(`DELETE FROM alertnotify WHERE id = ?`, [id], (err, result) => {
    if (err) return callback(err);
    return callback(null, result);
  });
};

// ================= MARK ALL AS READ =================
const markAllAsRead = (data, callback) => {
  const { role, user_id } = data;

  pool.query(
    `UPDATE alertnotify 
     SET is_read = true 
     WHERE role = ? OR user_id = ?`,
    [role, user_id],
    (err, result) => {
      if (err) return callback(err);
      return callback(null, result);
    },
  );
};

module.exports = {
  createAlert,
  getAlerts,
  markAsRead,
  deleteAlert,
  markAllAsRead,
};
