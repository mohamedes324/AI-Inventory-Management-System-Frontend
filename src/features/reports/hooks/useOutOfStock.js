import { useQuery } from "@tanstack/react-query";
import { fetchOutOfStock } from "../api/reportsApi";

export const useOutOfStock = () => {
  return useQuery({
    queryKey: ["reports", "out-of-stock"],
    queryFn: fetchOutOfStock,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
  });
};
