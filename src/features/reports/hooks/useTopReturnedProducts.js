import { useQuery } from "@tanstack/react-query";
import { fetchTopReturnedProducts } from "../api/reportsApi";

export const useTopReturnedProducts = ({ startDate, endDate, top = 10 } = {}) => {
  return useQuery({
    queryKey: ["reports", "top-returned", startDate, endDate, top],
    queryFn: () => fetchTopReturnedProducts({ startDate, endDate, top }),
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: true,
  });
};
