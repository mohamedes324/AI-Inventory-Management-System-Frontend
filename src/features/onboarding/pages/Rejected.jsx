import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "@/shared/components/ui/Button";

export default function Rejected() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-fadeIn bg-gray-light">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center animate-scaleIn">
        
        {/* Icon */}
        <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5 animate-pulse bg-error">
          <span className="text-white text-2xl">❌</span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold mb-3 text-gray-dark">
          {t("onboarding:rejected.title")}
        </h1>

        {/* Description */}
        <p className="text-sm mb-4 text-gray">
          {t("onboarding:rejected.description")}
        </p>

        {/* 🔴 Static Reason */}
        <div className="bg-error/10 text-error text-sm rounded-lg py-3 px-4 mb-6">
          ⚠️ {t("onboarding:rejected.reason")}
        </div>

        {/* Button */}
        <Button
          fullWidth
          onClick={() => navigate("/upload-documents")}
        >
          {t("onboarding:rejected.retry")}
        </Button>
      </div>
    </div>
  );
}