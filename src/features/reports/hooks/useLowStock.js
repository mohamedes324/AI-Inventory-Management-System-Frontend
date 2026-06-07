import { useQuery } from "@tanstack/react-query";
import { fetchLowStock } from "../api/reportsApi";

export const useLowStock = () => {
  return useQuery({
    queryKey: ["reports", "low-stock"],
    queryFn: fetchLowStock,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
  });
};
