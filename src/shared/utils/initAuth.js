import { useAuthStore } from "@/shared/store/authStore";
import { refreshTokenRequest } from "@/features/auth/api/refreshToken";
import { getUserStatus } from "@/features/onboarding/api/getUserStatus";
import { getUserRoleFromToken } from "@/shared/utils/jwt"; // 👈 تأكد من استيرادها

export const initAuth = async () => {
  const store = useAuthStore.getState();
  try {
    store.setAuthLoading(true);

    // 1. هات التوكن الجديد
    const authData = await refreshTokenRequest();
    const token = authData.accessToken;

    // 2. حدث التوكن في الستور "بس" (من غير ما تقفل الـ loading)
    // كدا الستور اتحدث بس الـ App لسه واقف على صفحة الـ Loading
    store.setTokenOnly(token); 

    // 3. دلوقتي نادى الفانكشن بتاعتك عادي، هتلاقي التوكن جوه الستور خلاص
    const role = getUserRoleFromToken(); 
    
    // 4. هات الـ Status
    const status = await getUserStatus(); 

    // 🚀 اللحظة الحاسمة:
    // حدث الـ Role والـ Status واقفل الـ Loading مع بعض
    store.completeAuthInitialization(token , status, role);
  } catch (error) {
    console.log("Auth init failed:", error);
    // عشان الـ App يفتح ويلاقي الستور فاضي فيحولك للـ Login
    store.clearAuth();
  }
};