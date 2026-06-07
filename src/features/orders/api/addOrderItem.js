import api from "@/shared/api/axios";

/**
 * @function addOrderItem
 * @description Adds an item to an existing order.
 * POST /api/Orders/{id}/items
 * @param {number} orderId - The order ID
 * @param {{ sku: string, quantity: number }} body - Item to add
 * @returns {Promise<Object>} Updated order with rowVersion and items
 */
export const addOrderItem = async (orderId, body) => {
  const res = await api.post(`/Orders/${orderId}/items`, body);
  return res.data;
};
