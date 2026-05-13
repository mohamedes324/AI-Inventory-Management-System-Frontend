import api from "@/shared/api/axios";

export const deleteProduct = async (id) => {
  const res = await api.delete(`/Products/${id}`);
  return res.data;
};
