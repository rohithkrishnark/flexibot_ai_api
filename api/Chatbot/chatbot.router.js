const router = require("express").Router();
const { insertchatdetail } = require("./chatbot.controller");




// Insert
router.post("/insert", insertchatdetail);


module.exports = router;
