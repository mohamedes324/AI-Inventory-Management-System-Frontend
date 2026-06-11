/**
 * @component DashboardHeader
 * @description Top section of the dashboard with greeting message,
 * date range picker, and export button.
 *
 * @prop {string} role - Current user role
 * @prop {string} dateRange - Active date range key
 * @prop {Function} onDateRangeChange - Handler for date range change
 * @prop {Function} onExport - Export report handler
 */
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import DateRangePicker from "./DateRangePicker";

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export default function DashboardHeader({
  role,
  dateRange,
  onDateRangeChange,
  onExport,
}) {
  const { t } = useTranslation("dashboard");
  const timeOfDay = getTimeOfDay();

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
    >
      {/* Left: Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-1">
          {t("header.greeting", {
            timeOfDay: t(`header.timeOfDay.${timeOfDay}`),
            role,
          })}
        </h1>
        <p className="text-text-muted text-sm sm:text-base">
          {t("header.subtitle")}
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />

        {onExport && (
          <button
            onClick={onExport}
            className="
              inline-flex items-center gap-2 px-4 py-2.5
              rounded-xl text-sm font-medium
              bg-background-card border border-border-primary
              text-text-secondary hover:text-text-primary
              hover:border-border-secondary hover:bg-background-hover
              transition-all duration-200
              shadow-[var(--shadow-card)]
            "
          >
            <Download size={16} />
            <span className="hidden sm:inline">{t("header.exportReport")}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
