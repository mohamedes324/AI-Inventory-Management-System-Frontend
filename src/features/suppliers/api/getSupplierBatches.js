import api from "@/shared/api/axios";

export const getSupplierBatches = async (supplierId) => {
  const res = await api.get(`/StockBatches/supplier/${supplierId}`);
  return res.data;
};
