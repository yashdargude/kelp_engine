const { Pool } = require("pg");

class InsightsModel {
  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async getOverlappingEvents(startDate, endDate) {
    // Get all events in the period
    const result = await this.pool.query(
      `SELECT * FROM events WHERE startDate < $2 AND endDate > $1`,
      [startDate, endDate]
    );
    const events = result.rows;
    const overlaps = [];
    // Compare each pair for overlap
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const a = events[i];
        const b = events[j];
        // Check overlap
        if (a.enddate > b.startdate && a.startdate < b.enddate) {
          // Calculate overlap duration
          const overlapStart = new Date(
            Math.max(new Date(a.startdate), new Date(b.startdate))
          );
          const overlapEnd = new Date(
            Math.min(new Date(a.enddate), new Date(b.enddate))
          );
          const overlapDuration = Math.round(
            (overlapEnd - overlapStart) / 60000
          );
          overlaps.push({
            overlappingEventPairs: [
              {
                event_id: a.eventid,
                event_name: a.eventname,
                start_date: a.startdate,
                end_date: a.enddate,
              },
              {
                event_id: b.eventid,
                event_name: b.eventname,
                start_date: b.startdate,
                end_date: b.enddate,
              },
            ],
            overlap_duration_minutes: overlapDuration,
          });
        }
      }
    }
    return overlaps;
  }
}

module.exports = new InsightsModel();
