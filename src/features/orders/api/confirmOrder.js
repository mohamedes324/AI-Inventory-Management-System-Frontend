import api from "@/shared/api/axios";

/**
 * @function confirmOrder
 * @description Confirms a draft order.
 * POST /api/Orders/{id}/confirm
 * @param {number} orderId - The order ID
 * @param {{ paymentMethod: number, orderType: number, rowVersion: string }} body
 * @returns {Promise<Object>} Confirmed order response
 */
export const confirmOrder = async (orderId, body) => {
  const res = await api.post(`/Orders/${orderId}/confirm`, body);
  return res.data;
};
