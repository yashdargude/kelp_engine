const eventSearchModel = require("../models/eventSearchModel");

class EventSearchController {
  async search(req, res) {
    try {
      const {
        name,
        start_date_after,
        end_date_before,
        sortBy,
        sortOrder,
        page,
        limit,
      } = req.query;
      const result = await eventSearchModel.searchEvents({
        name,
        start_date_after,
        end_date_before,
        sortBy,
        sortOrder,
        page,
        limit,
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new EventSearchController();
