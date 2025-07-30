const { Pool } = require("pg");

class EventInfluenceModel {
  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async getAllEvents() {
    const result = await this.pool.query("SELECT * FROM events");
    return result.rows;
  }
}

module.exports = new EventInfluenceModel();
