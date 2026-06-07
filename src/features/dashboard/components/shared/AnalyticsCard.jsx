/**
 * @component AnalyticsCard
 * @description Large highlighted analytics card for key business metrics
 * like total stock value. Features a prominent value display with
 * description and optional icon.
 *
 * @prop {string} title - Metric title
 * @prop {string} value - Formatted value string (e.g. "1.38M EGP")
 * @prop {string} description - Explanatory text
 * @prop {ReactNode} icon - Lucide icon
 * @prop {string} color - Accent color: 'green' | 'blue' | 'purple' | 'cyan'
 * @prop {boolean} loading - Show skeleton state
 * @prop {string} className - Additional CSS classes
 */
import { motion } from "framer-motion";

const colorMap = {
  green: {
    valueBg: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5",
    valueText: "text-emerald-400",
    iconText: "text-emerald-400",
    borderAccent: "border-emerald-500/20",
    glow: "shadow-[0_0_40px_rgba(16,185,129,0.05)]",
  },
  blue: {
    valueBg: "bg-gradient-to-br from-blue-500/10 to-blue-600/5",
    valueText: "text-blue-400",
    iconText: "text-blue-400",
    borderAccent: "border-blue-500/20",
    glow: "shadow-[0_0_40px_rgba(59,130,246,0.05)]",
  },
  purple: {
    valueBg: "bg-gradient-to-br from-violet-500/10 to-violet-600/5",
    valueText: "text-violet-400",
    iconText: "text-violet-400",
    borderAccent: "border-violet-500/20",
    glow: "shadow-[0_0_40px_rgba(139,92,246,0.05)]",
  },
  cyan: {
    valueBg: "bg-gradient-to-br from-cyan-500/10 to-cyan-600/5",
    valueText: "text-cyan-400",
    iconText: "text-cyan-400",
    borderAccent: "border-cyan-500/20",
    glow: "shadow-[0_0_40px_rgba(6,182,212,0.05)]",
  },
  amber: {
    valueBg: "bg-gradient-to-br from-amber-500/10 to-amber-600/5",
    valueText: "text-amber-400",
    iconText: "text-amber-400",
    borderAccent: "border-amber-500/20",
    glow: "shadow-[0_0_40px_rgba(245,158,11,0.05)]",
  },
  red: {
    valueBg: "bg-gradient-to-br from-red-500/10 to-red-600/5",
    valueText: "text-red-400",
    iconText: "text-red-400",
    borderAccent: "border-red-500/20",
    glow: "shadow-[0_0_40px_rgba(239,68,68,0.05)]",
  },
};

export default function AnalyticsCard({
  title,
  value,
  description,
  icon,
  color = "green",
  loading = false,
  className = "",
}) {
  const colors = colorMap[color] || colorMap.green;

  if (loading) {
    return (
      <div
        className={`
          rounded-2xl border border-border-primary bg-background-card
          p-6 ${className}
        `}
      >
        <div className="w-10 h-10 rounded-xl animate-shimmer mb-4" />
        <div className="w-32 h-4 rounded animate-shimmer mb-3" />
        <div className="w-48 h-8 rounded-lg animate-shimmer mb-2" />
        <div className="w-40 h-3.5 rounded animate-shimmer" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={`
        relative overflow-hidden rounded-2xl
        border ${colors.borderAccent} ${colors.valueBg}
        p-6 ${colors.glow}
        ${className}
      `}
    >
      {/* Background decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-white/[0.02] to-transparent -translate-y-1/2 translate-x-1/2" />

      {/* Icon */}
      {icon && (
        <div className={`mb-4 ${colors.iconText}`}>
          {icon}
        </div>
      )}

      {/* Title */}
      <p className="text-sm font-medium text-text-muted mb-1.5 uppercase tracking-wider">
        {title}
      </p>

      {/* Value */}
      <p className={`text-3xl font-bold tracking-tight mb-1.5 ${colors.valueText}`}>
        {value}
      </p>

      {/* Description */}
      {description && (
        <p className="text-sm text-text-muted">{description}</p>
      )}
    </motion.div>
  );
}
