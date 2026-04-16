import api from "@/shared/api/axios";

export const uploadDocumentRequest = async (file) => {
  const formData = new FormData();

  // 👇 نفس الاسم من Swagger
  formData.append("IdentityImageFile", file);

  const res = await api.post("/users/identity-image", formData);

  return res.data;
};