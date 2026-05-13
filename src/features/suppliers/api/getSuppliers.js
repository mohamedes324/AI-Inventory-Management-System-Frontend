import api from "@/shared/api/axios";

export const getSuppliers = async () => {
  const res = await api.get("/Suppliers");
  return res.data;
};
