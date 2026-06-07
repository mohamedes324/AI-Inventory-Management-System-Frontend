/**
 * @module orderService
 * @description Service layer for order business logic and formatting.
 *
 * NOTE: The API *response* returns string enum values (e.g. "OutForDelivery"),
 * while the filter query params use integer values (e.g. Status=1).
 * The display helpers below handle both formats so rendering works regardless
 * of whether the value is an integer or a string.
 */

import {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD,
  PAYMENT_METHOD_LABELS,
  ORDER_TYPE,
  ORDER_TYPE_LABELS,
} from "../types/orderTypes";

/* ──────────────────────────────────────────────────────────────────────────
 * String → integer reverse-lookup maps.
 * These map the string enum names returned by the API response back to the
 * integer keys used by ORDER_STATUS_LABELS / PAYMENT_METHOD_LABELS / etc.
 * ────────────────────────────────────────────────────────────────────────── */

/** Maps API string status values → integer enum keys */
const STATUS_STRING_MAP = {
  Draft: ORDER_STATUS.DRAFT,
  OutForDelivery: ORDER_STATUS.OUT_FOR_DELIVERY,
  Completed: ORDER_STATUS.COMPLETED,
  Cancelled: ORDER_STATUS.CANCELLED,
};

/** Maps API string payment method values → integer enum keys */
const PAYMENT_STRING_MAP = {
  Cash: PAYMENT_METHOD.CASH,
  Visa: PAYMENT_METHOD.VISA,
  BankTransfer: PAYMENT_METHOD.BANK_TRANSFER,
};

/** Maps API string order type values → integer enum keys */
const TYPE_STRING_MAP = {
  InStore: ORDER_TYPE.IN_STORE,
  Delivery: ORDER_TYPE.DELIVERY,
};

/* ──────────────────────────────────────────────────────────────────────────
 * Helper: normalise any enum value (string or int) → integer key.
 * ────────────────────────────────────────────────────────────────────────── */
const normalise = (value, stringMap) => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value in stringMap) return stringMap[value];
  return undefined;
};

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
 * Get display label for order status.
 * Accepts both integer (0-3) and string ("Draft", "OutForDelivery", …) values.
 * @param {number|string} status - OrderStatus enum value
 * @returns {string} Human-readable status label
 */
export const getStatusLabel = (status) => {
  const key = normalise(status, STATUS_STRING_MAP);
  return ORDER_STATUS_LABELS[key] ?? "—";
};

/**
 * Resolve an order status (int or string) to its integer enum key.
 * Used by StatusBadge components for color mapping.
 * @param {number|string} status
 * @returns {number|undefined}
 */
export const getStatusKey = (status) => normalise(status, STATUS_STRING_MAP);

/**
 * Get display label for payment method.
 * Accepts both integer (0-2) and string ("Cash", "Visa", "BankTransfer") values.
 * @param {number|string} method - PaymentMethod enum value
 * @returns {string} Human-readable payment method label
 */
export const getPaymentMethodLabel = (method) => {
  const key = normalise(method, PAYMENT_STRING_MAP);
  return PAYMENT_METHOD_LABELS[key] ?? "—";
};

/**
 * Get display label for order type.
 * Accepts both integer (0-1) and string ("InStore", "Delivery") values.
 * @param {number|string} type - OrderType enum value
 * @returns {string} Human-readable order type label
 */
export const getOrderTypeLabel = (type) => {
  const key = normalise(type, TYPE_STRING_MAP);
  return ORDER_TYPE_LABELS[key] ?? "—";
};
