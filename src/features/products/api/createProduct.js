import api from "@/shared/api/axios";

export const createProduct = async (data) => {
  const res = await api.post("/Products", data);
  return res.data;
};
