const express = require("express");
const router = express.Router();

const { createAlertController, getAlertsController, markAsReadController } = require("./alertController");

router.post("/create", createAlertController);
router.post("/getfacnotify", getAlertsController);
router.put("/:id/read", markAsReadController);

module.exports = router;
