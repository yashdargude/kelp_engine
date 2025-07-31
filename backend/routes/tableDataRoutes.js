const express = require("express");
const {
  getTableData,
  getTableDataCount,
  getAllTableData,
} = require("../controllers/tableDataController");

const router = express.Router();

/**
 * GET /api/table-data
 * Fetch all events with pagination and sorting
 * Query parameters:
 * - page: Page number (default: 1)
 * - limit: Records per page (default: 100, max: 1000)
 * - sortBy: Field to sort by (default: startDate)
 * - sortOrder: Sort order - asc/desc (default: desc)
 */
router.get("/table-data", getTableData);

/**
 * GET /api/table-data/all
 * Fetch all events without pagination
 * Query parameters:
 * - sortBy: Field to sort by (default: startDate)
 * - sortOrder: Sort order - asc/desc (default: desc)
 */
router.get("/table-data/all", getAllTableData);

/**
 * GET /api/table-data/count
 * Get total count of events
 */
router.get("/table-data/count", getTableDataCount);

module.exports = router;
