
import axios from "axios";
import { useAuthStore } from "@/shared/store/authStore";
import { handleError } from "../utils/errorHandler";

let isRefreshing = false;
let failedQueue = [];

export const api = axios.create({
  baseURL: "https://localhost:5000/api",
  withCredentials: true,
});

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// 🟢 REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔴 RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // فحص الـ 401 مع استبعاد طلبات الـ auth نفسها عشان ما يحصلش Loop
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") && // 👈 ضيف السطر ده
      !originalRequest.url.includes("/auth/refresh") // تأكد من المسار الصحيح عندك
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // ✨ التعديل السحري هنا: بنستخدم الـ initAuth عشان نحدث الستور بالكامل (Token, Role, Status)
        // بنستخدم import() جوه الدالة عشان نهرب من الـ Circular Dependency
        const { initAuth } = await import("@/shared/utils/initAuth");
        const { token: newToken } = await initAuth();
        
        processQueue(null, newToken);
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    
    // معالجة الأخطاء العامة
    const message = handleError(error);
    return Promise.reject({
      message,
      status: error.response?.status,
    });
  }
);

export default api;
