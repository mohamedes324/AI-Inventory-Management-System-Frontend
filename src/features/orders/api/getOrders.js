import api from "@/shared/api/axios";

/**
 * @function getOrders
 * @description Fetches paginated orders with optional filters.
 * @param {Object} params - Query parameters
 * @param {number} params.Page
 * @param {number} params.PageSize
 * @param {number} [params.Status]
 * @param {number} [params.Type]
 * @param {number} [params.PaymentMethod]
 * @param {number} [params.ProductId]
 * @param {number} [params.CashierId]
 * @param {string} [params.DateFrom]
 * @param {string} [params.DateTo]
 * @param {number} [params.MinTotal]
 * @param {number} [params.MaxTotal]
 * @param {number} [params.SortBy]
 * @param {boolean} [params.SortDescending]
 * @returns {Promise<Object>} Paginated response with items array
 */
export const getOrders = async (params = {}) => {
  // Remove undefined/null/empty values so they aren't sent as query params
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );
  const res = await api.get("/Orders", { params: cleanParams });
  return res.data;
};
