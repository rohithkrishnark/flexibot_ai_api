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
  sendMessage: (data, callback) => {
    const {
      conversation_id,
      sender_id,
      sender_type,
      receiver_id,
      receiver_type,
      message,
    } = data;

    const sql = `
    INSERT INTO messages 
    (conversation_id, sender_id, sender_type, receiver_id, receiver_type, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    const values = [
      conversation_id,
      sender_id,
      sender_type,
      receiver_id,
      receiver_type,
      message,
    ];

    pool.query(sql, values, (err, result) => {
      if (err) return callback(err);
      return callback(null, result);
    });
  },
  getOrCreateConversation: (data, callback) => {
    const { user1_id, user1_type, user2_id, user2_type } = data;

    const checkSql = `
    SELECT * FROM conversations
    WHERE (user1_id = ? AND user1_type = ? AND user2_id = ? AND user2_type = ?)
       OR (user1_id = ? AND user1_type = ? AND user2_id = ? AND user2_type = ?)
  `;

    pool.query(
      checkSql,
      [
        user1_id,
        user1_type,
        user2_id,
        user2_type,
        user2_id,
        user2_type,
        user1_id,
        user1_type,
      ],
      (err, result) => {
        if (err) return callback(err);

        if (result.length > 0) {
          return callback(null, result[0]);
        }

        const insertSql = `
        INSERT INTO conversations 
        (user1_id, user1_type, user2_id, user2_type)
        VALUES (?, ?, ?, ?)
      `;

        pool.query(
          insertSql,
          [user1_id, user1_type, user2_id, user2_type],
          (err2, result2) => {
            if (err2) return callback(err2);

            return callback(null, {
              id: result2.insertId,
            });
          },
        );
      },
    );
  },
  updateLastMessage: (data, callback) => {
    const { conversation_id, message } = data;

    const sql = `
    UPDATE conversations 
    SET last_message = ?, last_message_at = NOW()
    WHERE id = ?
  `;

    pool.query(sql, [message, conversation_id], (err, result) => {
      if (err) return callback(err);
      return callback(null, result);
    });
  },

  getConversationByUsers: (data, callback) => {
    const { user1_id, user1_type, user2_id, user2_type } = data;

    const sql = `
    SELECT * FROM conversations
    WHERE (user1_id = ? AND user1_type = ? AND user2_id = ? AND user2_type = ?)
       OR (user1_id = ? AND user1_type = ? AND user2_id = ? AND user2_type = ?)
    LIMIT 1
  `;

    const values = [
      user1_id,
      user1_type,
      user2_id,
      user2_type,
      user2_id,
      user2_type,
      user1_id,
      user1_type,
    ];

    pool.query(sql, values, (err, result) => {
      if (err) return callback(err);
      return callback(null, result[0] || null);
    });
  },

  // Get messages of conversation
  getMessagesByConversation: (conversation_id, callback) => {
    const sql = `
    SELECT * FROM messages
    WHERE conversation_id = ?
    ORDER BY created_at ASC
  `;

    pool.query(sql, [conversation_id], (err, result) => {
      if (err) return callback(err);
      return callback(null, result);
    });
  },
};
