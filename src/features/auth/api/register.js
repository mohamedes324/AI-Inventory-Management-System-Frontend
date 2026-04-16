import api from "@/shared/api/axios";

export const registerRequest = async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
};