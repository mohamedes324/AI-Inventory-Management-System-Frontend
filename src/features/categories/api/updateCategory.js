import api from "@/shared/api/axios";

export const updateCategory = async (id, { name }) => {
  const res = await api.put(`/Categories/${id}`, { name });
  return res.data;
};
