import api from "@/shared/api/axios";

/**
 * @function createReturnOrder
 * @description Creates a new return order.
 * @param {Object} payload
 * @param {string} payload.originalOrderId
 * @param {string|null} payload.reason
 * @param {Array<{originalOrderItemId: string, quantity: string, newExpiryDate: string}>} payload.items
 * @returns {Promise<Object>} Created return order
 */
export const createReturnOrder = async (payload) => {
  const res = await api.post("/return-orders", payload);
  return res.data;
};
