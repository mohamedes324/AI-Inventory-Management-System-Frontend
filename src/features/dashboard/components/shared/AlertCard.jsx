/**
 * @component AlertCard
 * @description Highlighted notification card for inventory alerts.
 * Supports three severity levels (success, warning, danger) with
 * distinct visual treatments. Optionally clickable for navigation.
 *
 * @prop {'success'|'warning'|'danger'} severity - Visual severity level
 * @prop {string} label - Alert category label
 * @prop {string} message - Alert message
 * @prop {ReactNode} icon - Lucide icon
 * @prop {Function} onClick - Click handler (e.g. navigate to details)
 * @prop {boolean} loading - Show skeleton state
 * @prop {string} className - Additional CSS classes
 */
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const severityMap = {
  success: {
    bg: "bg-emerald-500/[0.06]",
    border: "border-emerald-500/20",
    hoverBorder: "hover:border-emerald-500/40",
    iconBg: "bg-emerald-500/15",
    iconText: "text-emerald-400",
    text: "text-emerald-300",
    glow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.06)]",
  },
  warning: {
    bg: "bg-amber-500/[0.06]",
    border: "border-amber-500/20",
    hoverBorder: "hover:border-amber-500/40",
    iconBg: "bg-amber-500/15",
    iconText: "text-amber-400",
    text: "text-amber-300",
    glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.06)]",
  },
  danger: {
    bg: "bg-red-500/[0.06]",
    border: "border-red-500/20",
    hoverBorder: "hover:border-red-500/40",
    iconBg: "bg-red-500/15",
    iconText: "text-red-400",
    text: "text-red-300",
    glow: "hover:shadow-[0_0_20px_rgba(239,68,68,0.06)]",
  },
};

export default function AlertCard({
  severity = "success",
  label,
  message,
  icon,
  onClick,
  loading = false,
  className = "",
}) {
  const colors = severityMap[severity] || severityMap.success;

  if (loading) {
    return (
      <div
        className={`
          rounded-xl border border-border-primary bg-background-card
          p-4 ${className}
        `}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg animate-shimmer flex-shrink-0" />
          <div className="flex-1">
            <div className="w-20 h-3.5 rounded animate-shimmer mb-2" />
            <div className="w-40 h-4 rounded animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  const Wrapper = onClick ? "button" : "div";

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <Wrapper
        onClick={onClick}
        className={`
          w-full rounded-xl border transition-all duration-300
          ${colors.bg} ${colors.border} ${colors.hoverBorder} ${colors.glow}
          p-4 flex items-center gap-3.5 text-start
          ${onClick ? "cursor-pointer group" : ""}
          ${className}
        `}
      >
        {/* Icon */}
        <div
          className={`
            w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
            ${colors.iconBg} ${colors.iconText}
            transition-transform duration-300 group-hover:scale-110
          `}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-text-muted mb-0.5 uppercase tracking-wider">
            {label}
          </p>
          <p className={`text-sm font-semibold ${colors.text}`}>{message}</p>
        </div>

        {/* Arrow indicator for clickable */}
        {onClick && (
          <ChevronRight
            size={18}
            className="text-text-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0 rtl:rotate-180"
          />
        )}
      </Wrapper>
    </motion.div>
  );
}
