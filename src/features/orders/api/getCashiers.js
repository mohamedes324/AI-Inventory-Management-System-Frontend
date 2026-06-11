import api from "@/shared/api/axios";

/**
 * @function getCashiers
 * @description Fetches all cashiers.
 * @returns {Promise<Array>}
 */
export const getCashiers = async () => {
  const res = await api.get("/reports/users/cashiers");
  return res.data || [];
};