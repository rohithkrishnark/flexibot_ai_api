const pool = require("../../dbconfig/dbconfig");

module.exports = {
  // Insert Chat
  insertChat: (data, callback) => {
    const { user_id, query, response } = data;

    const sql =
      "INSERT INTO chatbot_messages (user_id, query, response) VALUES (?, ?, ?)";

    pool.query(sql, [user_id || null, query, response], (err, result) => {
      if (err) {
        return callback(err);
      }

      return callback(null, result);
    });
  },
  fetchAllActiveAlumini: (callback) => {
    pool.query(
      `SELECT 
          alum_id,
          alum_name,
          alum_age,
          alum_company,
          alum_company_location,
          alum_company_designation,
          alum_experience,
          alum_qualification,
          alum_status,
          alum_email,
          is_email_send
      FROM
          flexi_bot_ai.alumini
      where alum_status = 1 and is_email_send = 1 `,
      [],
      (err, rows) => {
        if (err) return callback(err, null);
        callback(null, rows);
      },
    );
  },
};
