import api from "@/shared/api/axios";

export const refreshTokenRequest = async () => {
  const response = await api.post("/auth/refresh-token");
  return response.data;
};