import { useQuery } from "@tanstack/react-query";
import { getTopSellingProducts } from "../api/getTopSellingProducts";

/**
 * Compute last 30 days range in ISO 8601 format.
 */
function getLast30DaysRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start.setDate(start.getDate() - 29);
  return {
    startDate: start.toISOString(),
    endDate: now.toISOString(),
  };
}

/**
 * @hook useTopSellingProducts
 * @description Fetches top 10 selling products for the last 30 days.
 * Automatically computes date range — no user input needed.
 */
export const useTopSellingProducts = () => {
  const { startDate, endDate } = getLast30DaysRange();

  return useQuery({
    queryKey: ["products", "top-selling", startDate.split("T")[0]],
    queryFn: () => getTopSellingProducts({ startDate, endDate, top: 10 }),
    staleTime: 1000 * 60 * 5,        // 5 minutes
    refetchOnWindowFocus: true,
  });
};
