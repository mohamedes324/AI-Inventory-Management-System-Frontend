/**
 * @component DashboardError
 * @description Error state for dashboard with retry button.
 */
import { useTranslation } from "react-i18next";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "@/shared/components/ui/Button";

export default function DashboardError({ onRetry }) {
  const { t } = useTranslation("dashboard");
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mb-5">
        <AlertTriangle size={32} />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{t("errors.loadFailed")}</h3>
      <Button variant="ghost" size="sm" onClick={onRetry} className="mt-3">
        <RefreshCw size={16} />
        {t("errors.retry")}
      </Button>
    </div>
  );
}
