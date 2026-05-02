import api from "@/shared/api/axios";

export const checkEmailRequest = async (params) => {
  const response = await api.get("/auth/is-email-exist", { params });
  return response.data;
};
