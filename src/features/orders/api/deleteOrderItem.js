import api from "@/shared/api/axios";

/**
 * @function deleteOrderItem
 * @description Removes an item from an order draft.
 * DELETE /api/Orders/{orderId}/items/{productId}
 * @param {number} orderId - The order ID
 * @param {number} productId - The product ID
 * @returns {Promise<Object>} Updated order with rowVersion and items
 */
export const deleteOrderItem = async (orderId, productId) => {
  const res = await api.delete(`/Orders/${orderId}/items/${productId}`);
  return res.data;
};
