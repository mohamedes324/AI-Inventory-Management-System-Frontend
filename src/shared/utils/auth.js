import { logoutApi } from "@/features/auth/api/logout";

export const logout = async () => {
  try {
    await logoutApi();
  } catch (err) {
    console.log("Logout API failed, continue anyway");
  } finally {
    localStorage.clear();
  }
};