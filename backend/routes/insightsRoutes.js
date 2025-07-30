const express = require("express");
const insightsController = require("../controllers/insightsController");
const router = express.Router();

router.get("/insights/overlapping-events", (req, res) => {
  insightsController.getOverlappingEvents(req, res);
});

module.exports = router;
