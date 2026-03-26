const { insertchatdetail, fetchAllActiveAlumini } = require("./alumini.controller");

const router = require("express").Router();

// Insert
router.post("/insert", insertchatdetail);
router.get('/getall',fetchAllActiveAlumini)


module.exports = router;
