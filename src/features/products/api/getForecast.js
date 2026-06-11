import api from "@/shared/api/axios";

export const getForecast = async (sku) => {
  const res = await api.get(`/ML/forecast/${sku}`);
  return res.data;
};
