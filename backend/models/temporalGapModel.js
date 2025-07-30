const { Pool } = require("pg");

class TemporalGapModel {
  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async getEventsInRange(startDate, endDate) {
    const result = await this.pool.query(
      `SELECT * FROM events WHERE endDate > $1 AND startDate < $2 ORDER BY startDate ASC`,
      [startDate, endDate]
    );
    return result.rows;
  }
}

module.exports = new TemporalGapModel();
