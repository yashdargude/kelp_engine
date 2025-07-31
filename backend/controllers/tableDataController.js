const {
  getAllTableData: getAllTableDataModel,
  getTableDataCount: getTableDataCountModel,
  getTableDataWithPagination,
} = require("../models/tableDataModel");
const { validateTableDataParams } = require("../validators/tableDataValidator");

/**
 * Get all table data with optional pagination and sorting
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTableData = async (req, res) => {
  try {
    // Extract query parameters
    const {
      page = 1,
      limit = 100,
      sortBy = "startDate",
      sortOrder = "desc",
    } = req.query;

    // Validate parameters
    const validationResult = validateTableDataParams({
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder,
    });

    if (!validationResult.isValid) {
      return res.status(400).json({
        success: false,
        error: validationResult.error,
      });
    }

    // Calculate offset
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get data with pagination
    const result = await getTableDataWithPagination({
      limit: parseInt(limit),
      offset,
      sortBy,
      sortOrder,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error fetching table data:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while fetching table data",
    });
  }
};

/**
 * Get total count of records
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTableDataCount = async (req, res) => {
  try {
    const count = await getTableDataCountModel();

    res.json({
      success: true,
      totalEvents: count,
    });
  } catch (error) {
    console.error("Error fetching table data count:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while fetching count",
    });
  }
};

/**
 * Get table data without pagination (all records)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllTableData = async (req, res) => {
  try {
    const { sortBy = "startDate", sortOrder = "desc" } = req.query;

    // Validate sort parameters
    const validationResult = validateTableDataParams({
      sortBy,
      sortOrder,
    });

    if (!validationResult.isValid) {
      return res.status(400).json({
        success: false,
        error: validationResult.error,
      });
    }

    // Get all data without pagination
    const data = await getAllTableDataModel({
      limit: 10000, // Large limit to get all records
      offset: 0,
      sortBy,
      sortOrder,
    });

    res.json({
      success: true,
      events: data,
      totalEvents: data.length,
    });
  } catch (error) {
    console.error("Error fetching all table data:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while fetching all table data",
    });
  }
};

module.exports = {
  getTableData,
  getTableDataCount,
  getAllTableData,
};
