import axios from "@/shared/api/axios";

export const logoutApi = async () => {
  return axios.post("/auth/logout");
};