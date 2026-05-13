import api from "@/shared/api/axios";

export const restoreSupplier = async (id) => {
  const res = await api.put(`/Suppliers/${id}/restore`);
  return res.data;
};
