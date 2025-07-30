const { Pool } = require("pg");

class EventSearchModel {
  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async searchEvents({
    name,
    start_date_after,
    end_date_before,
    sortBy,
    sortOrder,
    page,
    limit,
  }) {
    let query = "SELECT * FROM events WHERE 1=1";
    const params = [];
    let paramIdx = 1;

    if (name) {
      query += ` AND LOWER(eventName) LIKE $${paramIdx}`;
      params.push(`%${name.toLowerCase()}%`);
      paramIdx++;
    }
    if (start_date_after) {
      query += ` AND startDate > $${paramIdx}`;
      params.push(start_date_after);
      paramIdx++;
    }
    if (end_date_before) {
      query += ` AND endDate < $${paramIdx}`;
      params.push(end_date_before);
      paramIdx++;
    }
    if (sortBy) {
      const allowedSort = ["startDate", "eventName"];
      if (allowedSort.includes(sortBy)) {
        query += ` ORDER BY ${sortBy} ${sortOrder === "desc" ? "DESC" : "ASC"}`;
      }
    } else {
      query += " ORDER BY startDate ASC";
    }
    // Pagination
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    query += ` LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`;
    params.push(limit, offset);

    const result = await this.pool.query(query, params);
    // Get total count
    let countQuery = "SELECT COUNT(*) FROM events WHERE 1=1";
    const countParams = [];
    paramIdx = 1;
    if (name) {
      countQuery += ` AND LOWER(eventName) LIKE $${paramIdx}`;
      countParams.push(`%${name.toLowerCase()}%`);
      paramIdx++;
    }
    if (start_date_after) {
      countQuery += ` AND startDate > $${paramIdx}`;
      countParams.push(start_date_after);
      paramIdx++;
    }
    if (end_date_before) {
      countQuery += ` AND endDate < $${paramIdx}`;
      countParams.push(end_date_before);
      paramIdx++;
    }
    const countResult = await this.pool.query(countQuery, countParams);
    const totalEvents = parseInt(countResult.rows[0].count);

    return {
      totalEvents,
      page,
      limit,
      events: result.rows.map((e) => ({
        event_id: e.eventid,
        event_name: e.eventname,
      })),
    };
  }
}

module.exports = new EventSearchModel();
