const express = require("express");
const eventInfluenceController = require("../controllers/eventInfluenceController");
const router = express.Router();

router.get("/insights/event-influence", (req, res) => {
  eventInfluenceController.findShortestPath(req, res);
});

module.exports = router;
