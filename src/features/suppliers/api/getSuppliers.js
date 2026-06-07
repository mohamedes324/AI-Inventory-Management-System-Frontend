import api from "@/shared/api/axios";

export const getSuppliers = async (page = 1, pageSize = 10) => {
  const res = await api.get("/Suppliers", { params: { page, pageSize } });
  return res.data;
};
