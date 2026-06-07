import api from "@/shared/api/axios";

/**
 * @function getOrderById
 * @description Fetches details of a single order by ID.
 * Endpoint: GET /api/Orders/{id}
 * @param {string|number} id - Order ID
 * @returns {Promise<Object>} Order details object
 */
export const getOrderById = async (id) => {
  const res = await api.get(`/Orders/${id}`);
  return res.data;
};
