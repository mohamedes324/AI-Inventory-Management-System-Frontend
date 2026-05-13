/**
 * @function getBatchStatus
 * @description Calculates batch status from real API data.
 * The API does NOT return a status field — we derive it from:
 *   - remainingQuantity
 *   - expireDate
 *
 * Status logic:
 *   remainingQuantity <= 0          → "consumed"
 *   expireDate < today              → "expired"
 *   remainingQuantity > 0 && valid  → "active"
 *
 * @param {Object} batch
 * @param {number} batch.remainingQuantity
 * @param {string} batch.expireDate
 * @returns {{ key: string, color: string }}
 */
export const getBatchStatus = (batch) => {
  if (!batch) return { key: "active", color: "green" };

  // Consumed: no remaining quantity
  if (batch.remainingQuantity <= 0) {
    return { key: "consumed", color: "gray" };
  }

  // Expired: expiry date has passed
  if (batch.expireDate) {
    const expiry = new Date(batch.expireDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (expiry < today) {
      return { key: "expired", color: "red" };
    }
  }

  // Active: has stock and not expired
  return { key: "active", color: "green" };
};

/**
 * Batch status Tailwind class mappings.
 * Uses direct palette opacity tokens.
 */
export const BATCH_STATUS_STYLES = {
  green: "bg-primary-500/15 text-primary-400 border-primary-500/30",
  red:   "bg-error/15 text-error border-error/30",
  gray:  "bg-gray-500/15 text-gray-400 border-gray-500/30",
};
