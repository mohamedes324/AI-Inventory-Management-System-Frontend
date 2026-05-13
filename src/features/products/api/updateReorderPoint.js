import api from "@/shared/api/axios";

export const updateReorderPoint = async (id, reorderPoint) => {
  const res = await api.patch(`/Products/${id}/updateReorderPoint`, { reorderPoint });
  return res.data;
};
