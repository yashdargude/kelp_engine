const express = require("express");
const eventSearchController = require("../controllers/eventSearchController");
const router = express.Router();

router.get("/events/search", (req, res) => {
  eventSearchController.search(req, res);
});

module.exports = router;
