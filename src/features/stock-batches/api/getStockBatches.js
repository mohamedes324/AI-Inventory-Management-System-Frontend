import api from "@/shared/api/axios";

export const getStockBatches = async (productId) => {
  const res = await api.get(`/StockBatches/product/${productId}`);
  return res.data;
};
