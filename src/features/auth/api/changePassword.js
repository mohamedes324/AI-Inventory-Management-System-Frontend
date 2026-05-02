import api from "@/shared/api/axios";

export const changePasswordRequest = async (data) => {
  const response = await api.put("/auth/change-password", data);
  return response.data;
};
