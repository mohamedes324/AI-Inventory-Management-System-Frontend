import { useState, useEffect } from "react";
import { useRequest } from "@/shared/hooks/useRequest";
import { getAllSuppliers } from "../api/getAllSuppliers";

/**
 * @hook useSupplierOptions
 * @description Loads all suppliers for the dropdown.
 * Maps the API response to a normalized format with `id` and `name`
 * to account for the API returning `supplierId` / `supplierName`.
 */
export const useSupplierOptions = () => {
  const [suppliers, setSuppliers] = useState([]);
  const { execute, loading } = useRequest(getAllSuppliers);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await execute();
        // Normalize: the API returns { supplierId, supplierName, ... }
        const normalized = (data || []).map((s) => ({
          id: s.supplierId ?? s.id,
          name: s.supplierName ?? s.name ?? "—",
          ...s,
        }));
        setSuppliers(normalized);
      } catch {
        // silently fail — dropdown will just be empty
      }
    };
    load();
  }, []);

  return { suppliers, loading };
};
