import api from "@/shared/api/axios";

/**
 * Fetch top selling products from the sales report endpoint.
 * @param {Object} params
 * @param {string} params.startDate - ISO 8601 date string
 * @param {string} params.endDate   - ISO 8601 date string
 * @param {number} params.top       - Number of top products to return
 * @returns {Promise<Array>} Top selling products list
 */
export const getTopSellingProducts = async ({ startDate, endDate, top = 10 }) => {
  const { data } = await api.get("/reports/sales/top-products", {
    params: { startDate, endDate, top },
  });
  return data;
};
