import api from "@/shared/api/axios";

/**
 * PUT /api/StockBatches/{id}
 * @param {number} id - Stock batch ID
 * @param {{ expireDate: string, remainingQuantity: number, unitCost: number, discountPercentage: number }} data
 */
export const updateStockBatch = async (id, data) => {
  const res = await api.put(`/StockBatches/${id}`, data);
  return res.data;
};
