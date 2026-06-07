import api from "@/shared/api/axios";

/**
 * @function rateSupplier
 * @description Submits a rating for a specific supplier.
 * @param {number} supplierId - The supplier ID
 * @param {Object} payload
 * @param {number} payload.rating - Rating value (1-5)
 * @param {string|null} payload.note - Optional note
 * @returns {Promise<Object>} Response data
 */
export const rateSupplier = async (supplierId, payload) => {
  const res = await api.post(`/Suppliers/${supplierId}/ratings`, payload);
  return res.data;
};
