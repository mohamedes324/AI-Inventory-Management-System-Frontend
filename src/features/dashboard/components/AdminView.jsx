/**
 * @component AdminView
 * @description Admin Dashboard — vertical, full-width layout.
 * Section 1: Total Users | Pending Accounts | Active Accounts | Create User (stacked)
 * Section 2: Users by Role (one full-width card per role, stacked)
 *
 * All data via useAdminDashboard (GET /api/admin/users + GET /api/reports/users/status-breakdown).
 */
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Users,
  Clock,
  CheckCircle2,
  UserPlus,
  Shield,
  Briefcase,
  ShoppingCart,
  Package,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

import { useAdminDashboard } from "../hooks/useAdminDashboard";
import {
  DashboardSection,
  DashboardSkeleton,
  DashboardError,
} from "./shared";
import AnimatedCounter from "./shared/AnimatedCounter";

/* ─────────── Full-width Stat Row ─────────── */

const COLOR_MAP = {
  blue: {
    iconBg: "bg-blue-500/10",
    iconText: "text-blue-400",
    iconRing: "ring-blue-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.08)]",
    accent: "from-blue-500/10 to-transparent",
  },
  amber: {
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-400",
    iconRing: "ring-amber-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.08)]",
    accent: "from-amber-500/10 to-transparent",
  },
  green: {
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-400",
    iconRing: "ring-emerald-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]",
    accent: "from-emerald-500/10 to-transparent",
  },
};

function StatRow({ icon, title, value, subtitle, color = "blue", onClick, delay = 0 }) {
  const colors = COLOR_MAP[color] || COLOR_MAP.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.06, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-2xl
        bg-background-card border border-border-primary
        px-6 py-5 flex items-center gap-5
        transition-all duration-300
        hover:border-border-secondary hover:-translate-y-0.5
        shadow-[var(--shadow-card)] ${colors.glow}
        ${onClick ? "cursor-pointer" : ""}
      `}
    >
      {/* Top accent line */}
      <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r ${colors.accent}`} />

      {/* Icon */}
      <div
        className={`
          w-12 h-12 rounded-xl flex items-center justify-center shrink-0
          ${colors.iconBg} ${colors.iconText}
          ring-1 ${colors.iconRing}
          transition-transform duration-300 group-hover:scale-110
        `}
      >
        {icon}
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-muted">{title}</p>
        {subtitle && (
          <p className="text-xs text-text-muted/70 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Value */}
      <div className="text-3xl font-bold text-text-primary tracking-tight tabular-nums shrink-0">
        <AnimatedCounter value={value} />
      </div>

      {/* Chevron for clickable rows */}
      {onClick && (
        <ArrowRight
          size={18}
          className="text-text-muted/40 group-hover:text-text-secondary transition-all duration-200 group-hover:translate-x-0.5 shrink-0"
        />
      )}
    </motion.div>
  );
}

/* ─────────── Role Config ─────────── */

const ROLE_CONFIG = {
  Admin: { icon: Shield, color: "bg-red-500/10 text-red-400 ring-red-500/20" },
  Manager: { icon: Briefcase, color: "bg-violet-500/10 text-violet-400 ring-violet-500/20" },
  Cashier: { icon: ShoppingCart, color: "bg-blue-500/10 text-blue-400 ring-blue-500/20" },
  InventoryStaff: { icon: Package, color: "bg-amber-500/10 text-amber-400 ring-amber-500/20" },
};

function RoleRow({ role, count, t, delay = 0 }) {
  const config = ROLE_CONFIG[role] || { icon: Users, color: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" };
  const Icon = config.icon;
  const roleLabel = t(`admin.roles.${role}`, role);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: delay * 0.06, ease: [0.4, 0, 0.2, 1] }}
      className="bg-background-card rounded-2xl border border-border-primary px-6 py-5 flex items-center gap-5 shadow-[var(--shadow-card)] hover:shadow-md hover:border-border-secondary hover:-translate-y-0.5 transition-all duration-300 group"
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ring-1 transition-transform duration-300 group-hover:scale-110 ${config.color}`}
      >
        <Icon size={20} />
      </div>

      {/* Role name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
          {roleLabel}
        </p>
      </div>

      {/* Count */}
      <p className="text-3xl font-bold text-text-primary tracking-tight tabular-nums shrink-0">
        {count}
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function AdminView() {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();

  const {
    totalUsers,
    pendingAccounts,
    activeAccounts,
    roleDistribution,
    isLoading,
    isError,
    refetch,
  } = useAdminDashboard();

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <DashboardError onRetry={refetch} />;

  const roleEntries = Object.entries(roleDistribution);

  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-[960px] mx-auto">
      {/* ── Header ── */}
      <DashboardSection delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              {t("admin.title")} 👋
            </h1>
            <p className="text-sm text-text-muted mt-1">
              {t("admin.subtitle")}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border-primary bg-background-card text-text-secondary hover:text-text-primary hover:border-border-secondary transition-all duration-200 shadow-[var(--shadow-card)]"
          >
            <RefreshCw size={16} />
            <span>{t("admin.refresh")}</span>
          </button>
        </div>
      </DashboardSection>

      {/* ── Stats (stacked full-width) ── */}
      <DashboardSection delay={50}>
        <div className="flex flex-col gap-3">
          <StatRow
            icon={<Users size={22} />}
            title={t("admin.stats.totalUsers")}
            value={totalUsers}
            subtitle={t("admin.stats.users")}
            color="blue"
            onClick={() => navigate("/users-management")}
            delay={0}
          />
          <StatRow
            icon={<Clock size={22} />}
            title={t("admin.stats.pendingAccounts")}
            value={pendingAccounts}
            subtitle={t("admin.stats.pending")}
            color="amber"
            onClick={() => navigate("/pending-accounts")}
            delay={1}
          />
          <StatRow
            icon={<CheckCircle2 size={22} />}
            title={t("admin.stats.activeAccounts")}
            value={activeAccounts}
            subtitle={t("admin.stats.active")}
            color="green"
            onClick={() => navigate("/users-management")}
            delay={2}
          />

          {/* Create User — action row */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 3 * 0.06, ease: [0.4, 0, 0.2, 1] }}
            onClick={() => navigate("/create-user")}
            className="group relative overflow-hidden rounded-2xl border border-dashed border-primary-500/30 bg-gradient-to-r from-primary-500/[0.06] to-transparent px-6 py-5 flex items-center gap-5 hover:border-primary-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.08)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-primary-500/40 to-transparent" />
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary-500/10 text-primary-400 ring-1 ring-primary-500/20 shrink-0 transition-transform duration-300 group-hover:scale-110">
              <UserPlus size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-primary group-hover:text-primary-400 transition-colors">
                {t("admin.quickActions.createUser")}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                {t("admin.quickActions.createUserDesc")}
              </p>
            </div>
            <ArrowRight
              size={18}
              className="text-text-muted/40 group-hover:text-primary-400 transition-all duration-200 group-hover:translate-x-0.5 shrink-0"
            />
          </motion.div>
        </div>
      </DashboardSection>

      {/* ── Users by Role (stacked full-width) ── */}
      <DashboardSection
        title={t("admin.sections.usersByRole")}
        subtitle={t("admin.sections.usersByRoleDesc")}
        delay={100}
      >
        <div className="flex flex-col gap-3">
          {roleEntries.map(([role, count], idx) => (
            <RoleRow key={role} role={role} count={count} t={t} delay={idx} />
          ))}
        </div>
      </DashboardSection>
    </div>
  );
}
