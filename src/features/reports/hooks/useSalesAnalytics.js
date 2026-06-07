import { useQuery } from "@tanstack/react-query";
import { fetchSalesAnalytics } from "../api/reportsApi";

export const useSalesAnalytics = ({ startDate, endDate } = {}) => {
  return useQuery({
    queryKey: ["reports", "sales-analytics", startDate, endDate],
    queryFn: () => fetchSalesAnalytics({ startDate, endDate }),
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: true,
  });
};
