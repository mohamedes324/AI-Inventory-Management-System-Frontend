import api from "@/shared/api/axios";

/**
 * @module reportsApi
 * @description API service for all report endpoints.
 */

/** Fetch top returned products */
export const fetchTopReturnedProducts = async ({ startDate, endDate, top = 10 }) => {
  const { data } = await api.get("/reports/returns/top-products", {
    params: { startDate, endDate, top },
  });
  return data;
};

/** Fetch sales analytics (payment methods, peak hours, order types) */
export const fetchSalesAnalytics = async ({ startDate, endDate }) => {
  const { data } = await api.get("/reports/sales/analytics", {
    params: { startDate, endDate },
  });
  return data;
};

/** Fetch low stock products */
export const fetchLowStock = async () => {
  const { data } = await api.get("/reports/inventory/low-stock");
  return data;
};

/** Fetch out of stock products */
export const fetchOutOfStock = async () => {
  const { data } = await api.get("/reports/inventory/out-of-stock");
  return data;
};
