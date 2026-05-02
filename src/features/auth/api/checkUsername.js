import api from "@/shared/api/axios";

export const checkUsernameRequest = async (params) => {
  const response = await api.get("/auth/is-username-exist", { params });
  return response.data;
};
