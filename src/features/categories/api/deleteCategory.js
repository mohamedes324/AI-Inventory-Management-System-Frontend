import api from "@/shared/api/axios";

export const deleteCategory = async (id) => {
  const res = await api.delete(`/Categories/${id}`);
  return res.data;
};
