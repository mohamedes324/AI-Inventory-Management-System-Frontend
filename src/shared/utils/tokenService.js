import { useAuthStore } from "@/shared/store/authStore";

// 🟢 قراءة access token
export const getAccessToken = () => {
  return useAuthStore.getState().accessToken;
};

// 🟢 حفظ access token
export const setAccessToken = (token) => {
  useAuthStore.getState().setAccessToken(token);
};

// 🟢 clear
export const clearTokens = () => {
  useAuthStore.getState().clearAuth();
};