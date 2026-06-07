/**
 * @typedef {Object} PurchaseOrderItem
 * @property {number} purchaseOrderItemId
 * @property {string} productName
 * @property {number} quantity
 * @property {number} unitCost
 * @property {string} expiryDate
 * @property {number} totalCost
 */

/**
 * @typedef {Object} PurchaseOrder
 * @property {number} purchaseOrderId
 * @property {string} orderDate
 * @property {string} status
 * @property {number} finalTotal
 * @property {string} supplierName
 * @property {number} supplierId
 * @property {Array<PurchaseOrderItem>} items
 */

/**
 * @typedef {Object} PurchaseOrderFilters
 * @property {number|null} SupplierId
 * @property {string} DateFrom
 * @property {string} DateTo
 * @property {number} MinTotal
 * @property {number} MaxTotal
 * @property {boolean} SortDescending
 * @property {string} SortBy  - "date" | "price"
 */

/** Default filter values */
export const DEFAULT_FILTERS = {
  SupplierId: null,
  DateFrom: "",
  DateTo: "",
  MinTotal: 0,
  MaxTotal: 100000,
  SortDescending: true,
  SortBy: "date", // "date" = default (no sortBy sent), "price" = sortBy=1
};

/** Sort-by options mapping for the API */
export const SORT_BY_OPTIONS = {
  DATE: "date",     // backend default — do NOT send sortBy param
  PRICE: "price",   // maps to sortBy = 1 in API request
};

/** Converts the SortBy UI value to the API param (or undefined to omit) */
export const getSortByParam = (sortBy) => {
  if (sortBy === SORT_BY_OPTIONS.PRICE) return 1;
  return undefined; // date = default, don't send
};
