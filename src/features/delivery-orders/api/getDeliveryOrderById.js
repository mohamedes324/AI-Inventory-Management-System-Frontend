import api from "@/shared/api/axios";

/**
 * @function getDeliveryOrderById
 * @description Fetches a single order by its ID.
 * @param {number|string} id - The order ID
 * @returns {Promise<Object>} Order details with items and allocations
 */
export const getDeliveryOrderById = async (id) => {
  const res = await api.get(`/Orders/${id}`);
  return res.data;
};
