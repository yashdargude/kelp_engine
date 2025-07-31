const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Fetch all records from the events table
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of records to return
 * @param {number} options.offset - Number of records to skip
 * @param {string} options.sortBy - Field to sort by
 * @param {string} options.sortOrder - Sort order (asc/desc)
 * @returns {Promise<Array>} Array of event records
 */
const getAllTableData = async (options = {}) => {
  const {
    limit = 100,
    offset = 0,
    sortBy = "startDate",
    sortOrder = "desc",
  } = options;

  // Validate sort order
  const validSortOrder = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

  // Validate sort field to prevent SQL injection
  const validSortFields = [
    "eventId",
    "eventName",
    "startDate",
    "endDate",
    "parentId",
    "researchValue",
    "created_at",
  ];
  const validSortBy = validSortFields.includes(sortBy) ? sortBy : "startDate";

  const query = `
    SELECT 
      eventId,
      eventName,
      startDate,
      endDate,
      parentId,
      researchValue,
      description
    FROM events 
    ORDER BY ${validSortBy} ${validSortOrder}
    LIMIT $1 OFFSET $2
  `;

  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

/**
 * Get total count of records in events table
 * @returns {Promise<number>} Total count of records
 */
const getTableDataCount = async () => {
  const result = await pool.query("SELECT COUNT(*) as total FROM events");
  return parseInt(result.rows[0].total);
};

/**
 * Get table data with pagination info
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Object containing data and pagination info
 */
const getTableDataWithPagination = async (options = {}) => {
  const data = await getAllTableData(options);
  const total = await getTableDataCount();

  return {
    events: data,
    totalEvents: total,
    page: Math.floor(options.offset / options.limit) + 1,
    limit: options.limit,
    totalPages: Math.ceil(total / options.limit),
  };
};

module.exports = {
  getAllTableData,
  getTableDataCount,
  getTableDataWithPagination,
};
