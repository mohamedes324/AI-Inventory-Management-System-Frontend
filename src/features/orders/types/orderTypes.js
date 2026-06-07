/**
 * @typedef {Object} Order
 * @property {number} orderId
 * @property {string} orderDate
 * @property {number} orderStatus
 * @property {number} orderType
 * @property {string} cashierName
 * @property {number} paymentMethod
 * @property {number} finalTotal
 */

/**
 * @typedef {Object} OrderFilters
 * @property {number|null} CashierId
 * @property {string} DateFrom
 * @property {string} DateTo
 * @property {number} MinTotal
 * @property {number} MaxTotal
 * @property {number|null} Status
 * @property {number|null} PaymentMethod
 * @property {number|null} Type
 * @property {string} SortBy  - "date" | "price"
 * @property {boolean} SortDescending
 */

/** Default filter values */
export const DEFAULT_FILTERS = {
  CashierId: null,
  DateFrom: "",
  DateTo: "",
  MinTotal: 0,
  MaxTotal: 100000,
  Status: null,
  PaymentMethod: null,
  Type: null,
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

/** OrderStatus enum mapping */
export const ORDER_STATUS = {
  DRAFT: 0,
  OUT_FOR_DELIVERY: 1,
  COMPLETED: 2,
  CANCELLED: 3,
};

/** OrderStatus labels for display */
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.DRAFT]: "Draft",
  [ORDER_STATUS.OUT_FOR_DELIVERY]: "Out For Delivery",
  [ORDER_STATUS.COMPLETED]: "Completed",
  [ORDER_STATUS.CANCELLED]: "Cancelled",
};

/** PaymentMethod enum mapping */
export const PAYMENT_METHOD = {
  CASH: 0,
  VISA: 1,
  BANK_TRANSFER: 2,
};

/** PaymentMethod labels for display */
export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHOD.CASH]: "Cash",
  [PAYMENT_METHOD.VISA]: "Visa",
  [PAYMENT_METHOD.BANK_TRANSFER]: "Bank Transfer",
};

/** OrderType enum mapping */
export const ORDER_TYPE = {
  IN_STORE: 0,
  DELIVERY: 1,
};

/** OrderType labels for display */
export const ORDER_TYPE_LABELS = {
  [ORDER_TYPE.IN_STORE]: "In Store",
  [ORDER_TYPE.DELIVERY]: "Delivery",
};
