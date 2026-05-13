import api from "@/shared/api/axios";

export const searchProducts = async (q) => {
  const res = await api.get("/Products/search", { params: { q } });
  return res.data;
};
