import api from "@/shared/api/axios";

export const getProducts = async () => {
  const res = await api.get("/Products");
  return res.data;
};
