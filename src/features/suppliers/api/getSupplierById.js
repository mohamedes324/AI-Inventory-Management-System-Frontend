import api from "@/shared/api/axios";

export const getSupplierById = async (id) => {
  const res = await api.get(`/Suppliers/${id}`);
  return res.data;
};
