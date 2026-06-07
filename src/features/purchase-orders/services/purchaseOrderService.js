/**
 * @module purchaseOrderService
 * @description Service layer for purchase order business logic and formatting.
 */

/**
 * Format a date string to a localized display format.
 * @param {string} dateStr - ISO date string
 * @param {string} locale - Locale identifier (default: "en-GB")
 * @returns {string} Formatted date
 */
export const formatOrderDate = (dateStr, locale = "en-GB") => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Format currency value.
 * @param {number} amount
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount == null) return "—";
  return `$${Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Build query params from filter state, removing empty values.
 * @param {Object} filters - Filter state from the modal
 * @param {number} page - Current page number
 * @param {number} pageSize - Items per page
 * @returns {Object} Clean params object for API call
 */
export const buildQueryParams = (filters, page = 1, pageSize = 5) => {
  const params = {
    Page: page,
    PageSize: pageSize,
    SortDescending: filters.SortDescending,
    SortBy: filters.SortBy,
  };

  if (filters.SupplierId) params.SupplierId = filters.SupplierId;
  if (filters.DateFrom) params.DateFrom = filters.DateFrom;
  if (filters.DateTo) params.DateTo = filters.DateTo;
  if (filters.MinTotal > 0) params.MinTotal = filters.MinTotal;
  if (filters.MaxTotal < 100000) params.MaxTotal = filters.MaxTotal;

  return params;
};
