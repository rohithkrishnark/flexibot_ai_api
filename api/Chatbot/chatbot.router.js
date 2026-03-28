const router = require("express").Router();
const {
  insertchatdetail,
  sendMessageController,
  getChatMessagesController,
} = require("./chatbot.controller");

// Insert
router.post("/insert", insertchatdetail);

router.post("/send-message", sendMessageController);

router.get("/messages", getChatMessagesController);

module.exports = router;
