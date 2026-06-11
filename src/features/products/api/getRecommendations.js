import api from "@/shared/api/axios";

export const getRecommendations = async (sku) => {
  const res = await api.get(`/ML/recommendations/${sku}`);
  return res.data;
};
