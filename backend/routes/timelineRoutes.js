const express = require("express");
const timelineController = require("../controllers/timelineController");
const router = express.Router();

router.get("/timeline/:rootEventId", (req, res) => {
  timelineController.getTimeline(req, res);
});

module.exports = router;
