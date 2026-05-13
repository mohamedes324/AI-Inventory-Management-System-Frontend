import api from "@/shared/api/axios";

export const updateProduct = async (id, data) => {
  const res = await api.put(`/Products/${id}`, data);
  return res.data;
};
