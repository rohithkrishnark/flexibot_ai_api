const {
  insertChat,
  sendMessage,
  getOrCreateConversation,
  updateLastMessage,
  getConversationByUsers,
  getMessagesByConversation,
} = require("./chatbot.service");

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

  sendMessageController: (req, res) => {
    try {
      const {
        user1_id,
        user1_type,
        user2_id,
        user2_type,
        sender_id,
        sender_type,
        receiver_id,
        receiver_type,
        message,
      } = req.body;

      if (!sender_id || !receiver_id || !message) {
        return res.status(400).json({
          success: 0,
          message: "Missing required fields",
        });
      }

      // STEP 1: get or create conversation
      getOrCreateConversation(
        { user1_id, user1_type, user2_id, user2_type },
        (err, conversation) => {
          if (err) {
            return res.status(500).json({
              success: 0,
              message: "Conversation error",
            });
          }

          const data = {
            conversation_id: conversation.id,
            sender_id,
            sender_type,
            receiver_id,
            receiver_type,
            message,
          };

          // STEP 2: insert message
          sendMessage(data, (err2, result) => {
            if (err2) {
              return res.status(500).json({
                success: 0,
                message: "Message insert failed",
              });
            }

            updateLastMessage(
              {
                conversation_id: conversation.id,
                message,
              },
              (err3) => {
                if (err3) {
                  console.error("Last message update failed:", err3);
                }
              },
            );
            // ✅ REALTIME EMIT (IMPORTANT)
            req.io.to(receiver_id).emit("new-message", {
              conversation_id: conversation.id,
              sender_id,
              receiver_id,
              message,
              created_at: data.created_at,
            });

            req.io.to(sender_id).emit("new-message", {
              conversation_id: conversation.id,
              sender_id,
              receiver_id,
              message,
              created_at: data.created_at,
            });

            return res.status(200).json({
              success: 1,
              message: "Message sent successfully",
              conversation_id: conversation.id,
              data: result,
            });
          });
        },
      );
    } catch (error) {
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  getChatMessagesController: (req, res) => {
    try {
      const { user1, user2, user1_type, user2_type } = req.query;

      if (!user1 || !user2) {
        return res.status(400).json({
          success: 0,
          message: "Missing user details",
        });
      }

      // STEP 1: find conversation
      getConversationByUsers(
        {
          user1_id: user1,
          user1_type: user1_type || "student",
          user2_id: user2,
          user2_type: user2_type || "alumni",
        },
        (err, conversation) => {
          if (err) {
            return res.status(500).json({
              success: 0,
              message: "DB error",
            });
          }

          if (!conversation) {
            return res.status(200).json({
              success: 1,
              data: [],
              message: "No conversation yet",
            });
          }

          // STEP 2: get messages
          getMessagesByConversation(conversation.id, (err2, messages) => {
            if (err2) {
              return res.status(500).json({
                success: 0,
                message: "DB error",
              });
            }

            return res.status(200).json({
              success: 1,
              conversation_id: conversation.id,
              data: messages,
            });
          });
        },
      );
    } catch (error) {
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },
};
