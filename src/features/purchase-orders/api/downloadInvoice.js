import api from "@/shared/api/axios";

/**
 * @function downloadInvoice
 * @description Downloads a PDF invoice for a specific purchase order.
 * @param {number|string} id - The purchase order ID
 * @returns {Promise<Blob>} PDF blob
 */
export const downloadInvoice = async (id) => {
  const res = await api.get(`/PurchaseOrders/${id}/invoice`, {
    responseType: "blob",
  });
  return res.data;
};
