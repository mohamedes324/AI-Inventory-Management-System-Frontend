import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/shared/store/authStore"; // استورد الستور بتاعك

export const getDecodedToken = () => {
    // 👈 السحر هنا: بنجيب الحالة الحالية "حالا" من غير Hooks
    const token = useAuthStore.getState().accessToken;

    if (!token) {
        console.log("No token found in Zustand Store");
        return null;
    }

    try {
        return jwtDecode(token);
    } catch (err) {
        console.error("Invalid token", err);
        return null;
    }
};

// 👇 helpers تحت
export const getUserIdFromToken = () => {
    const decoded = getDecodedToken();
    return decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
};

export const getUserRoleFromToken = () => {
    const decoded = getDecodedToken();
    return decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
};

export const getUserEmailFromToken = () => {
  const decoded = getDecodedToken();
  return decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
};