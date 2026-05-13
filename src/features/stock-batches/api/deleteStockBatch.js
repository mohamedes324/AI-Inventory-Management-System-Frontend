import api from "@/shared/api/axios";

/**
 * DELETE /api/StockBatches/{id}
 * @param {number} id - Stock batch ID
 */
export const deleteStockBatch = async (id) => {
  const res = await api.delete(`/StockBatches/${id}`);
  return res.data;
};
