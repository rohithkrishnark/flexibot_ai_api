const pool = require("../../dbconfig/dbconfig");

module.exports = {
  insertUser: async (user) => {
    const [result] = await pool.query(
      `INSERT INTO user_login (user_name, password, user_email, create_date, edit_date)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [user.user_name, user.password, user.user_email]
    );
    return { user_id: result.insertId, user_name: user.user_name, user_email: user.user_email };
  },

  findUserByEmail: async (email) => {
    const [rows] = await pool.query(
      "SELECT * FROM user_login WHERE user_email = ?",
      [email]
    );
    return rows[0]; // return single user or undefined
  }
};
