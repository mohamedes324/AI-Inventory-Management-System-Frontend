import api from "@/shared/api/axios";

/**
 * @function getPurchaseOrderById
 * @description Fetches a single purchase order by its ID.
 * @param {number|string} id - The purchase order ID
 * @returns {Promise<Object>} Purchase order details with items
 */
export const getPurchaseOrderById = async (id) => {
  const res = await api.get(`/PurchaseOrders/${id}`);
  return res.data;
};
