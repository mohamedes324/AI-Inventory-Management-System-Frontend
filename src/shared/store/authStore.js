import { create } from "zustand";

export const useAuthStore = create((set) => ({
  accessToken: null,
  status: null,
  role: null,
  isAuthLoading: true, // بنبدأ بـ true عشان الـ App يستنى الـ initAuth

  // 1. الضربة القاضية: تحديث كل شيء وقفل الـ Loading (للحالة الناجحة)
  completeAuthInitialization: (token, status, role) =>
    set({
      accessToken: token,
      status: status,
      role: role,
      isAuthLoading: false,
    }),

  // 2. تحديث التوكن فقط: بنستخدمها لما نعوز الـ Role يقرأ من الستور قبل ما نخلص الـ init
  setTokenOnly: (token) => set({ accessToken: token }),

  // 3. تحديث الـ Loading لوحده (لو احتجت تبدأ عملية تحميل جديدة)
  setAuthLoading: (val) => set({ isAuthLoading: val }),

  // 4. تنظيف الستور وقفل الـ Loading (لحالة الخطأ أو الـ Logout)
  clearAuth: () =>
    set({
      accessToken: null,
      status: null,
      role: null,
      isAuthLoading: false, // مهمة جداً عشان الـ App يفتح ويروح للـ Login
    }),

  // الدوال القديمة سيبتها لو محتاجها في أماكن تانية (Optional)
  setStatus: (status) => set({ status }),
  setRole: (role) => set({ role }),
}));