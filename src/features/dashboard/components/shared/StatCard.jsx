/**
 * @component StatCard
 * @description Premium KPI stat card with icon, animated counter,
 * optional trend indicator, and skeleton loading state.
 *
 * @prop {string} title - KPI label
 * @prop {number} value - Numeric value to display
 * @prop {ReactNode} icon - Lucide icon or any React node
 * @prop {string} color - Accent color key: 'green' | 'blue' | 'purple' | 'cyan' | 'amber'
 * @prop {string} subtitle - Optional subtitle text
 * @prop {Function} formatter - Optional number formatter
 * @prop {boolean} loading - Show skeleton state
 * @prop {string} className - Additional CSS classes
 */
import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";

const colorMap = {
  green: {
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-400",
    iconRing: "ring-emerald-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]",
    accent: "from-emerald-500/10 to-transparent",
  },
  blue: {
    iconBg: "bg-blue-500/10",
    iconText: "text-blue-400",
    iconRing: "ring-blue-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.08)]",
    accent: "from-blue-500/10 to-transparent",
  },
  purple: {
    iconBg: "bg-violet-500/10",
    iconText: "text-violet-400",
    iconRing: "ring-violet-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]",
    accent: "from-violet-500/10 to-transparent",
  },
  cyan: {
    iconBg: "bg-cyan-500/10",
    iconText: "text-cyan-400",
    iconRing: "ring-cyan-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.08)]",
    accent: "from-cyan-500/10 to-transparent",
  },
  amber: {
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-400",
    iconRing: "ring-amber-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.08)]",
    accent: "from-amber-500/10 to-transparent",
  },
};

export default function StatCard({
  title,
  value,
  icon,
  color = "green",
  subtitle,
  formatter,
  loading = false,
  className = "",
}) {
  const colors = colorMap[color] || colorMap.green;

  if (loading) {
    return (
      <div
        className={`
          relative overflow-hidden rounded-2xl
          bg-background-card border border-border-primary
          p-5 ${className}
        `}
      >
        {/* Shimmer skeleton */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl animate-shimmer" />
          <div className="w-16 h-4 rounded-lg animate-shimmer" />
        </div>
        <div className="w-24 h-8 rounded-lg animate-shimmer mb-2" />
        <div className="w-32 h-4 rounded-lg animate-shimmer" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={`
        group relative overflow-hidden rounded-2xl
        bg-background-card border border-border-primary
        p-5 transition-all duration-300
        hover:border-border-secondary hover:-translate-y-0.5
        shadow-[var(--shadow-card)]
        ${colors.glow}
        ${className}
      `}
    >
      {/* Subtle gradient accent at top */}
      <div
        className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r ${colors.accent}`}
      />

      {/* Header: Icon + Title */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={`
            w-11 h-11 rounded-xl flex items-center justify-center
            ${colors.iconBg} ${colors.iconText}
            ring-1 ${colors.iconRing}
            transition-transform duration-300 group-hover:scale-110
          `}
        >
          {icon}
        </div>
        <span className="text-[0.8125rem] font-medium text-text-muted">
          {title}
        </span>
      </div>

      {/* Value */}
      <div className="text-2xl font-bold text-text-primary tracking-tight mb-1">
        <AnimatedCounter value={value} formatter={formatter} />
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-[0.8125rem] text-text-muted">{subtitle}</p>
      )}
    </motion.div>
  );
}
