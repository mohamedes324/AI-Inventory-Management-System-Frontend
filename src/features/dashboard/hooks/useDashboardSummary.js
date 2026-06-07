import { useQuery } from "@tanstack/react-query";
import { fetchDashboardSummary } from "../api/dashboardApi";

/**
 * @hook useDashboardSummary
 * @description Fetches dashboard summary data using React Query.
 * Supports date range filtering and auto-refetch.
 *
 * @param {Object} options
 * @param {string} [options.startDate] - Filter start date
 * @param {string} [options.endDate]   - Filter end date
 * @param {boolean} [options.enabled=true] - Whether the query should run
 * @returns {{ data, isLoading, isError, error, refetch }}
 */
export const useDashboardSummary = ({ startDate, endDate, enabled = true } = {}) => {
  return useQuery({
    queryKey: ["dashboard", "summary", startDate, endDate],
    queryFn: () => fetchDashboardSummary({ startDate, endDate }),
    enabled,
    staleTime: 1000 * 60 * 2,       // 2 minutes
    refetchInterval: 1000 * 60 * 5,  // Auto-refetch every 5 minutes
    refetchOnWindowFocus: true,
  });
};
