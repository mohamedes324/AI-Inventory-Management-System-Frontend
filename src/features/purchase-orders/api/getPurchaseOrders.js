import api from "@/shared/api/axios";

/**
 * @function getPurchaseOrders
 * @description Fetches paginated purchase orders with optional filters.
 * @param {Object} params - Query parameters
 * @param {number} params.Page
 * @param {number} params.PageSize
 * @param {number} [params.SupplierId]
 * @param {number} [params.ProductId]
 * @param {string} [params.Status]
 * @param {string} [params.DateFrom]
 * @param {string} [params.DateTo]
 * @param {boolean} [params.SortDescending]
 * @param {number} [params.SortBy]
 * @returns {Promise<Object>} Paginated response with items array
 */
export const getPurchaseOrders = async (params = {}) => {
  // Remove undefined/null/empty values so they aren't sent as query params
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );
  const res = await api.get("/PurchaseOrders", { params: cleanParams });
  return res.data;
};
