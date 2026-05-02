import { useTranslation } from "react-i18next";
import {
  Card,
  LanguageSwitcher,
  LogoutButton,
} from "@/shared/components/ui";
import {
  Package,
  FileCheck2,
  ScanSearch,
  BellRing,
  Clock,
  ShieldCheck,
} from "lucide-react";

// ── Step config for the progress timeline ──
const STEPS = [
  { key: "step1", icon: FileCheck2, color: "secondary" },
  { key: "step2", icon: ScanSearch,  color: "primary"   },
  { key: "step3", icon: BellRing,    color: "primary"   },
];

export default function Pending() {
  const { t } = useTranslation();

  return (
    <div className="h-screen bg-gray-light flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* ── Background Orbs ── */}
      <div className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] bg-secondary-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Language Switcher + Logout ── */}
      <div className="absolute top-5 end-5 z-20 flex items-center gap-2">
        <LogoutButton variant="icon" />
        <LanguageSwitcher />
      </div>

      {/* ── Main Content ── */}
      <div className="w-full max-w-md animate-slideUp">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-5 animate-fadeIn">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/25">
            <Package size={18} />
          </div>
          <h1 className="font-bold text-lg tracking-tight text-gray-dark">
            Inventory
            <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              Market
            </span>
          </h1>
        </div>

        {/* Card */}
        <Card className="animate-slideUp shadow-xl shadow-gray-dark/5" padding="none">
          <div className="px-6 py-5 flex flex-col items-center gap-4">

            {/* ── Floating Hourglass Icon ── */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary-500/15 animate-glow scale-125" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30 animate-float">
                <span className="text-white text-xl animate-hourglass select-none">⏳</span>
              </div>
            </div>

            {/* ── Heading ── */}
            <div className="text-center animate-fadeIn">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary-500 bg-primary-50 px-3 py-1 rounded-full border border-primary-100 mb-2.5">
                {t("onboarding:pending.subtitle")}
              </span>
              <h2 className="text-lg font-bold text-gray-dark tracking-tight mb-1">
                {t("onboarding:pending.title")}
              </h2>
              <p className="text-gray text-[13px] leading-relaxed max-w-xs mx-auto">
                {t("onboarding:pending.description")}
              </p>
            </div>

            {/* ── Progress Timeline ── */}
            <div className="w-full flex flex-col gap-0">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx === 0;
                const isActive = idx === 1;

                return (
                  <div
                    key={step.key}
                    className="flex items-start gap-3 animate-fadeIn"
                    style={{ animationDelay: `${(idx + 1) * 120}ms`, animationFillMode: "both" }}
                  >
                    {/* Timeline connector */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`
                          w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                          transition-all duration-300 shadow-sm
                          ${isCompleted
                            ? "bg-secondary-500 text-white shadow-secondary-500/20"
                            : isActive
                              ? "bg-primary-500 text-white shadow-primary-500/20 animate-glow"
                              : "bg-gray-light text-gray border border-gray/10"
                          }
                        `}
                      >
                        <Icon size={14} strokeWidth={2.2} />
                      </div>
                      {idx < STEPS.length - 1 && (
                        <div
                          className={`w-0.5 h-5 rounded-full transition-colors duration-500 ${
                            isCompleted ? "bg-secondary-300" : "bg-gray/15"
                          }`}
                        />
                      )}
                    </div>

                    {/* Step text */}
                    <div className="pt-1.5 pb-2">
                      <p
                        className={`text-[13px] font-semibold leading-tight ${
                          isCompleted
                            ? "text-secondary-700"
                            : isActive
                              ? "text-gray-dark"
                              : "text-gray"
                        }`}
                      >
                        {t(`onboarding:pending.${step.key}`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Estimated Time Badge ── */}
            <div
              className="w-full flex items-center gap-2.5 bg-primary-50/60 border border-primary-100 rounded-xl px-4 py-3 animate-fadeIn"
              style={{ animationDelay: "500ms", animationFillMode: "both" }}
            >
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm border border-primary-100">
                <Clock size={14} className="text-primary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-primary-400 uppercase tracking-wide">
                  {t("onboarding:pending.estimatedTime")}
                </p>
                <p className="text-[13px] font-bold text-primary-700">
                  {t("onboarding:pending.estimatedValue")}
                </p>
              </div>
            </div>

            {/* ── Note ── */}
            <p
              className="text-[11px] text-gray text-center leading-relaxed max-w-xs animate-fadeIn"
              style={{ animationDelay: "650ms", animationFillMode: "both" }}
            >
              {t("onboarding:pending.note")}
            </p>

          </div>
        </Card>

        {/* ── Security footer ── */}
        <div
          className="flex items-center justify-center gap-1.5 mt-4 animate-fadeIn"
          style={{ animationDelay: "800ms", animationFillMode: "both" }}
        >
          <ShieldCheck size={12} className="text-secondary-500" />
          <span className="text-[11px] font-medium text-gray">
            {t("onboarding:pending.secureNote")}
          </span>
        </div>

      </div>
    </div>
  );
}