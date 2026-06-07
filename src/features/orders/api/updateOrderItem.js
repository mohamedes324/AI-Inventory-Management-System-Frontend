import api from "@/shared/api/axios";

/**
 * @function updateOrderItem
 * @description Updates the quantity of an item in an existing order.
 * PUT /api/Orders/{orderId}/items/{productId}
 * @param {number} orderId - The order ID
 * @param {number} productId - The product ID
 * @param {{ quantity: number }} body - The updated quantity
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderItem = async (orderId, productId, body) => {
  const res = await api.put(`/Orders/${orderId}/items/${productId}`, body);
  return res.data;
};
