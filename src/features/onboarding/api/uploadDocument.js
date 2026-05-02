import api from "@/shared/api/axios";

export const uploadDocumentRequest = async (file) => {
  const formData = new FormData();

  formData.append("IdentityImageFile", file);

  const res = await api.post("/users/identity-image", formData);

  return res.data;
};