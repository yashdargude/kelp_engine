const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const insertEvent = async (event) => {
  return pool.query(
    "INSERT INTO events (eventId, eventName, startDate, endDate, parentId, researchValue, description) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (eventId) DO NOTHING",
    event
  );
};

const getAllEvents = async () => {
  const result = await pool.query("SELECT * FROM events");
  return result.rows;
};

const checkDbStatus = async () => {
  await pool.query("SELECT 1");
  return { status: "connected" };
};

module.exports = { pool, insertEvent, getAllEvents, checkDbStatus };
