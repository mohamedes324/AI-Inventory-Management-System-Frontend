import api from "@/shared/api/axios";

/**
 * @function getDeliveryOrders
 * @description Fetches paginated orders that are out for delivery.
 * @param {Object} params - Query parameters
 * @param {number} params.page
 * @param {number} params.pageSize
 * @param {string} [params.sortBy]
 * @param {boolean} [params.sortDescending]
 * @returns {Promise<Object>} Paginated response with items array
 */
export const getDeliveryOrders = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );
  const res = await api.get("/Orders/out-for-delivery", { params: cleanParams });
  return res.data;
};
