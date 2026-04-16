import { useEffect } from "react";
import AppRouter from "./app/router";
import { initAuth } from "@/shared/utils/initAuth";
import { useAuthStore } from "@/shared/store/authStore";
import { useTranslation } from "react-i18next";

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
      <div className="flex h-screen items-center justify-center">
        {/* حط هنا الـ Spinner بتاعك */}
        <p>{t("auth:isAuthLoading.title")}</p>

      </div>
    );
  }

  return <AppRouter />;
}

export default App;