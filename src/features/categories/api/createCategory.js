import api from "@/shared/api/axios";

export const createCategory = async ({ name, image }) => {
  const formData = new FormData();
  formData.append("Name", name);
  formData.append("Image", image);

  const res = await api.post("/Categories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
