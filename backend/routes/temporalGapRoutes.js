const express = require("express");
const temporalGapController = require("../controllers/temporalGapController");
const router = express.Router();

router.get("/insights/temporal-gaps", (req, res) => {
  temporalGapController.findLargestGap(req, res);
});

module.exports = router;
