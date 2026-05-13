import api from "@/shared/api/axios";

export const getProduct = async (id) => {
  const res = await api.get(`/Products/${id}`);
  return res.data;
};
