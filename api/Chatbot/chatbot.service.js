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
  getChatUsers: (user_id, callback) => {
  const sql = `
SELECT 
  c.id as conversation_id,

  CASE 
    WHEN c.user1_id = ? THEN c.user2_id
    ELSE c.user1_id
  END AS id,

  CASE 
    WHEN c.user1_id = ? THEN c.user2_type
    ELSE c.user1_type
  END AS type,

  CASE 
    WHEN c.user1_id = ? AND c.user2_type = 'student' THEN s.std_name
    WHEN c.user1_id = ? AND c.user2_type = 'alumni' THEN a.alum_name
    WHEN c.user2_id = ? AND c.user1_type = 'student' THEN s2.std_name
    WHEN c.user2_id = ? AND c.user1_type = 'alumni' THEN a2.alum_name
  END AS name,

  c.last_message,
  c.last_message_at

FROM conversations c

LEFT JOIN student s ON c.user2_id = s.std_id
LEFT JOIN alumini a ON c.user2_id = a.alum_id

LEFT JOIN student s2 ON c.user1_id = s2.std_id
LEFT JOIN alumini a2 ON c.user1_id = a2.alum_id

WHERE c.user1_id = ? OR c.user2_id = ?
ORDER BY c.last_message_at DESC
  `;  

  pool.query(sql,[
  user_id, // 1
  user_id, // 2
  user_id, // 3
  user_id, // 4
  user_id, // 5
  user_id, // 6
  user_id, // 7
  user_id  // 8
], (err, result) => {
    if (err) return callback(err);
    return callback(null, result);
  });
}
};
