import { useQuery } from "@tanstack/react-query";
import { fetchClusters } from "../api/dashboardApi";

/**
 * @hook useClusters
 * @description Fetches ML product clusters using React Query.
 * Used by the Manager dashboard ML Insights section.
 *
 * @param {Object} [options]
 * @param {boolean} [options.enabled=true] - Whether the query should run
 * @returns {{ data, isLoading, isError, error, refetch }}
 */
export const useClusters = ({ enabled = true } = {}) => {
  return useQuery({
    queryKey: ["ml", "clusters"],
    queryFn: fetchClusters,
    enabled,
    staleTime: 1000 * 60 * 5,       // 5 minutes
    refetchOnWindowFocus: false,
  });
};
