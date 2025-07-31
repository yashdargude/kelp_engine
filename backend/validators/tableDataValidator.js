/**
 * Validate table data query parameters
 * @param {Object} params - Parameters to validate
 * @param {number} params.page - Page number
 * @param {number} params.limit - Number of records per page
 * @param {string} params.sortBy - Field to sort by
 * @param {string} params.sortOrder - Sort order (asc/desc)
 * @returns {Object} Validation result
 */
const validateTableDataParams = (params) => {
  const { page, limit, sortBy, sortOrder } = params;

  // Validate page
  if (page !== undefined) {
    if (!Number.isInteger(page) || page < 1) {
      return {
        isValid: false,
        error: "Page must be a positive integer",
      };
    }
  }

  // Validate limit
  if (limit !== undefined) {
    if (!Number.isInteger(limit) || limit < 1 || limit > 1000) {
      return {
        isValid: false,
        error: "Limit must be a positive integer between 1 and 1000",
      };
    }
  }

  // Validate sortBy
  if (sortBy !== undefined) {
    const validSortFields = [
      "eventId",
      "eventName",
      "startDate",
      "endDate",
      "parentId",
      "researchValue",
      "description",
    ];

    if (!validSortFields.includes(sortBy)) {
      return {
        isValid: false,
        error: `Invalid sort field. Must be one of: ${validSortFields.join(
          ", "
        )}`,
      };
    }
  }

  // Validate sortOrder
  if (sortOrder !== undefined) {
    const validSortOrders = ["asc", "desc", "ASC", "DESC"];
    if (!validSortOrders.includes(sortOrder)) {
      return {
        isValid: false,
        error: 'Sort order must be either "asc" or "desc"',
      };
    }
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Sanitize and normalize query parameters
 * @param {Object} params - Raw parameters
 * @returns {Object} Sanitized parameters
 */
const sanitizeTableDataParams = (params) => {
  const {
    page = 1,
    limit = 100,
    sortBy = "startDate",
    sortOrder = "desc",
  } = params;

  return {
    page: Math.max(1, parseInt(page) || 1),
    limit: Math.min(1000, Math.max(1, parseInt(limit) || 100)),
    sortBy: sortBy || "startDate",
    sortOrder: sortOrder.toLowerCase() === "asc" ? "asc" : "desc",
  };
};

module.exports = {
  validateTableDataParams,
  sanitizeTableDataParams,
};
