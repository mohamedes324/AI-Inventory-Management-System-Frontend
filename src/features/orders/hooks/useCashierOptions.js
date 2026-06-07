import { useState, useEffect } from "react";
import { useRequest } from "@/shared/hooks/useRequest";
import { getCashiers } from "../api/getCashiers";

/**
 * @hook useCashierOptions
 * @description Loads all cashiers for the filter dropdown.
 * Maps the API response to a normalized format with `id` and `name`.
 */
export const useCashierOptions = () => {
  const [cashiers, setCashiers] = useState([]);
  const { execute, loading } = useRequest(getCashiers);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await execute();
        // Normalize: the API returns { id, fullName, ... }
        const normalized = (data || []).map((c) => ({
          id: c.id ?? c.userId,
          name: c.fullName ?? c.userName ?? c.name ?? "—",
          ...c,
        }));
        setCashiers(normalized);
      } catch {
        // silently fail — dropdown will just be empty
      }
    };
    load();
  }, []);

  return { cashiers, loading };
};
