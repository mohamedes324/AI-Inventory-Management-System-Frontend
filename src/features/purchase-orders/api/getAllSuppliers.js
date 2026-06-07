import api from "@/shared/api/axios";

/**
 * @function getAllSuppliers
 * @description Fetches all suppliers for the dropdown using the same
 * endpoint as the Suppliers page (/api/Suppliers).
 * Returns the items array with supplier objects { supplierId, supplierName, ... }.
 * @returns {Promise<Array>} Array of supplier objects
 */
export const getAllSuppliers = async () => {
  const res = await api.get("/Suppliers", { params: { page: 1, pageSize: 200 } });
  // The API returns { items: [...], page, totalPages, ... }
  return res.data?.items || res.data || [];
};
