import { useTranslation } from "react-i18next";

export default function Pending() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-fadeIn bg-gray-light">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center animate-scaleIn">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5 bg-primary-500">
          <span className="text-white text-2xl animate-hourglass">⏳</span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold mb-3 text-gray-dark">
          {t("onboarding:pending.title")}
        </h1>

        {/* Description */}
        <p className="text-sm mb-6 leading-relaxed text-gray">
          {t("onboarding:pending.description")}
        </p>

        {/* Info Cards */}
        <div className="flex flex-col gap-3 text-sm">
          <div className="bg-gray-50 rounded-lg py-2">
            📄 {t("onboarding:pending.step1")}
          </div>

          <div className="bg-gray-50 rounded-lg py-2">
            🔍 {t("onboarding:pending.step2")}
          </div>

          <div className="bg-gray-50 rounded-lg py-2">
            ⚡ {t("onboarding:pending.step3")}
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-xs mt-6 text-gray">
          {t("onboarding:pending.note")}
        </p>
      </div>
    </div>
  );
}