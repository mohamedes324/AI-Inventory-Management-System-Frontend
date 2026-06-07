import api from "@/shared/api/axios";

/**
 * @module dashboardApi
 * @description API service for the Dashboard feature.
 * All dashboard-related HTTP calls are centralized here.
 */

/**
 * Fetch the dashboard summary data.
 * @param {Object} params
 * @param {string} [params.startDate] - ISO date string (e.g. "2026-01-01")
 * @param {string} [params.endDate]   - ISO date string (e.g. "2026-01-31")
 * @returns {Promise<Object>} Dashboard summary payload
 */
export const fetchDashboardSummary = async ({ startDate, endDate } = {}) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const { data } = await api.get("/dashboard/summary", { params });
  return data;
};
