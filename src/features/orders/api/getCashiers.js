import api from "@/shared/api/axios";

/**
 * @function getCashiers
 * @description Fetches all users with the Cashier role for the filter dropdown.
 * Uses the admin/users endpoint and filters to cashiers only.
 * @returns {Promise<Array>} Array of cashier users
 */
export const getCashiers = async () => {
  const res = await api.get("/admin/users");
  const users = res.data || [];
  // Filter to cashiers only
  return users.filter((u) => u.role === "Cashier");
};
