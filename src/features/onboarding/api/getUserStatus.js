import api from "@/shared/api/axios";

export const getUserStatus = async () => {
  const response = await api.get("/users/status");
  return response.data;
};