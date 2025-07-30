const insightsModel = require("../models/insightsModel");

class InsightsController {
  async getOverlappingEvents(req, res) {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ error: "startDate and endDate are required" });
      }
      const overlaps = await insightsModel.getOverlappingEvents(
        startDate,
        endDate
      );
      res.json(overlaps);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new InsightsController();
