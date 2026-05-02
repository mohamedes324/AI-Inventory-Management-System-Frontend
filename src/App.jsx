import { useEffect } from "react";
import AppRouter from "./app/router";
import { initAuth } from "@/shared/utils/initAuth";
import { useAuthStore } from "@/shared/store/authStore";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "@/shared/components/ui/Toast";
import { Loader } from "@/shared/components/ui";

function App() {
  // بنسحب حالة التحميل من الستور
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const { t } = useTranslation();
  useEffect(() => {
    initAuth();
  }, []);

  // ✋ أهم خطوة: لو لسه بنحمل بيانات الـ Auth، ما تفتحش الـ Router
  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-light">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  );
}

export default App;