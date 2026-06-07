import api from "@/shared/api/axios";

/**
 * @function getReturnOrderById
 * @description Fetches a single return order by its ID.
 * @param {number|string} id - The return order ID
 * @returns {Promise<Object>} Return order details with items
 */
export const getReturnOrderById = async (id) => {
  const res = await api.get(`/return-orders/${id}`);
  return res.data;
};
