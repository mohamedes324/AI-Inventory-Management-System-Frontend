import api from "@/shared/api/axios";

/**
 * @function getReturnOrders
 * @description Fetches paginated return orders with optional date filters.
 * @param {Object} params - Query parameters
 * @param {number} params.Page
 * @param {number} params.PageSize
 * @param {string} [params.startDate] - RFC3339 format
 * @param {string} [params.endDate] - RFC3339 format
 * @returns {Promise<Object>} Paginated response with items array
 */
export const getReturnOrders = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );
  const res = await api.get("/return-orders", { params: cleanParams });
  return res.data;
};
