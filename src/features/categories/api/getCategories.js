import api from "@/shared/api/axios";

export const getCategories = async () => {
  const res = await api.get("/Categories");
  return res.data;
};
