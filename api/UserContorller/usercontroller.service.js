const pool = require("../../dbconfig/dbconfig");

module.exports = {
  insertUser: (user, callback) => {
    pool.query(
      `INSERT INTO user_login (user_name, password, user_email, create_date, edit_date)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [user.user_name, user.password, user.user_email],
      (err, result) => {
        if (err) {
          console.error("insertUser DB error:", err);
          return callback(err, null);
        }

        return callback(null, {
          user_id: result.insertId,
          user_name: user.user_name,
          user_email: user.user_email,
        });
      },
    );
  },

  findUserByEmail: (email, callback) => {
    pool.query(
      "SELECT * FROM user_login WHERE user_email = ?",
      [email],
      (err, rows) => {
        if (err) {
          console.error("findUserByEmail DB error:", err);
          return callback(err, null);
        }

        // return first row or undefined
        return callback(null, rows[0]);
      },
    );
  },

    findUFacByEmail: (email, callback) => {
    pool.query(
      `
      SELECT 
    fac_login_id,
    fac_username,
    fac_password,
    fac_active_status,
    fa.fac_id,
    fac_name,
    fac_dep_id,
    fac_age,
    fac_group,
    fac_desg_id,
    fac_mobile_no,
    fac_address,
    fac_stauts,
    fac_email,
    fac_admin_verify
FROM
    fac_login_master fl
        LEFT JOIN
    faculity fa ON fl.fac_id = fa.fac_id
WHERE
    fl.fac_username = ?
      `,
      [email],
      (err, rows) => {
        if (err) {
          console.error("findUserByEmail DB error:", err);
          return callback(err, null);
        }

        // return first row or undefined
        return callback(null, rows[0]);
      },
    );
  },  
};
