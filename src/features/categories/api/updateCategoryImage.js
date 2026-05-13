import api from "@/shared/api/axios";

export const updateCategoryImage = async (id, image) => {
  const formData = new FormData();
  formData.append("Image", image);

  const res = await api.patch(`/Categories/updateCategoryImg/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
