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
};
