const router = require("express").Router();
const {
  insertchatdetail,
  sendMessageController,
  getChatMessagesController,
  getChatUsersController,
  getRecentchant
} = require("./chatbot.controller");

// Insert
router.post("/insert", insertchatdetail);

router.post("/send-message", sendMessageController);

router.get("/messages", getChatMessagesController);

// routes/chat.route.js
router.get("/users/:user_id", getChatUsersController);


router.get('/recentchat',getRecentchant)

module.exports = router;
