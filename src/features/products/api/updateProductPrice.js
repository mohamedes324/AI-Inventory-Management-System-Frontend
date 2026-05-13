import api from "@/shared/api/axios";

export const updateProductPrice = async (id, sellingPrice) => {
  const res = await api.patch(`/Products/${id}/updatePrice`, { sellingPrice });
  return res.data;
};
