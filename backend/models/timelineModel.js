const { Pool } = require("pg");

class TimelineModel {
  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async getEventById(eventId) {
    const result = await this.pool.query(
      "SELECT * FROM events WHERE eventId = $1",
      [eventId]
    );
    return result.rows[0] || null;
  }

  async getChildren(eventId) {
    const result = await this.pool.query(
      "SELECT * FROM events WHERE parentId = $1",
      [eventId]
    );
    return result.rows;
  }
}

module.exports = new TimelineModel();
