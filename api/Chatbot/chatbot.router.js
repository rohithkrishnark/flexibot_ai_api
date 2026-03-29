const router = require("express").Router();
const {
  insertchatdetail,
  sendMessageController,
  getChatMessagesController,
  getChatUsersController
} = require("./chatbot.controller");

// Insert
router.post("/insert", insertchatdetail);

router.post("/send-message", sendMessageController);

router.get("/messages", getChatMessagesController);

// routes/chat.route.js
router.get("/users/:user_id", getChatUsersController);

module.exports = router;
