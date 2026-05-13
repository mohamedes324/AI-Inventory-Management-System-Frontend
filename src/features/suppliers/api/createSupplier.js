import api from "@/shared/api/axios";

export const createSupplier = async (data) => {
  const res = await api.post("/Suppliers", data);
  return res.data;
};
