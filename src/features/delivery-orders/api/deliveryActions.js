import api from "@/shared/api/axios";

/**
 * @function acceptDelivery
 * @description Marks an order as delivered.
 * @param {number|string} id - The order ID
 * @returns {Promise<Object>} Response data
 */
export const acceptDelivery = async (id) => {
  const res = await api.post(`/Orders/${id}/deliver`);
  return res.data;
};

/**
 * @function failDelivery
 * @description Marks an order delivery as failed.
 * @param {number|string} id - The order ID
 * @returns {Promise<Object>} Response data
 */
export const failDelivery = async (id) => {
  const res = await api.post(`/Orders/${id}/fail-delivery`);
  return res.data;
};
