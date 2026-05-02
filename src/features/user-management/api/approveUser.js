import api from "@/shared/api/axios";

export const approveUser = async (userId) => {
  const response = await api.put(`/admin/users/${userId}/approve`);
  return response.data;
};