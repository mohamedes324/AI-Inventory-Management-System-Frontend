import api from "@/shared/api/axios";

export const checkPhoneNumberRequest = async (params) => {
  const response = await api.get("/auth/is-phone-number-exist", { params });
  return response.data;
};
