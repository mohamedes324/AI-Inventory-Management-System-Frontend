import api from "@/shared/api/axios";

export const getPendingUsers = async () => {
  const response = await api.get("/admin/users/pending");
  return response.data;
};