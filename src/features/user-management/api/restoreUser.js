import api from "@/shared/api/axios";

export const restoreUser = async (userId) => {
  const response = await api.put(`/admin/users/${userId}/restore`);
  return response.data;
};
