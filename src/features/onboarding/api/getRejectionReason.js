import api from "@/shared/api/axios";

export const getRejectionReason = async () => {
  const response = await api.get("/users/rejection-reason");
  return response.data;
};
