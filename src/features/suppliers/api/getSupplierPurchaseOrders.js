import api from "@/shared/api/axios";

/**
 * @function getSupplierPurchaseOrders
 * @description Fetches paginated purchase orders for a specific supplier.
 * @param {number|string} supplierId
 * @param {number} page
 * @param {number} pageSize
 * @returns {Promise<Object>} Paginated response with items array
 */
export const getSupplierPurchaseOrders = async (supplierId, page = 1, pageSize = 5) => {
  const res = await api.get("/PurchaseOrders", {
    params: { SupplierId: supplierId, Page: page, PageSize: pageSize },
  });
  return res.data;
};
