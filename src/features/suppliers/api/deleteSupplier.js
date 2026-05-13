import api from "@/shared/api/axios";

export const deleteSupplier = async (id) => {
  const res = await api.delete(`/Suppliers/${id}`);
  return res.data;
};
