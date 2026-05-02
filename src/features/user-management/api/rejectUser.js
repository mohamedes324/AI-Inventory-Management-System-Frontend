import api from "@/shared/api/axios";

export const rejectUser = async ({ userId, reason }) => {
  const response = await api.put(`/admin/users/${userId}/reject?reason=${encodeURIComponent(reason)}`);
  return response.data;
};