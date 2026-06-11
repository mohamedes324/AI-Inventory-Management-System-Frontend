/**
 * @component CashierView
 * @description Cashier Dashboard — daily operations overview.
 * Sections:
 *  1. Statistics cards (draft count, pending deliveries, completed today, orders this month)
 *  2. My Draft Orders (latest 5 + View All)
 *  3. Pending Deliveries (latest 5 + View All)
 *  4. Recent Orders (latest 5 + View All)
 *  5. Monthly Performance summary
 */
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FileEdit,
  Truck,
  CheckCircle2,
  CalendarDays,
  ArrowRight,
  ShoppingCart,
  Package,
  XCircle,
  Clock,
  BarChart3,
  Plus,
} from "lucide-react";

import { useCashierDashboard } from "../hooks/useCashierDashboard";
import {
  DashboardSection,
  DashboardGrid,
  DashboardSkeleton,
  DashboardError,
  StatCard,
} from "./shared";
import OrderCard from "@/features/orders/components/OrderCard";

/* ─────────── Helpers ─────────── */

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(val) {
  if (val == null) return "—";
  return `$${Number(val).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/* ─────────── Mini Performance Card ─────────── */

function PerformanceCard({ icon, label, value, color }) {
  const colorMap = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  const classes = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-background-card rounded-2xl border border-border-primary p-5 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-border-secondary transition-all duration-300 group">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 transition-transform duration-300 group-hover:scale-110 ${classes}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-text-primary tracking-tight tabular-nums">
          {value}
        </p>
        <p className="text-[0.8125rem] text-text-muted">{label}</p>
      </div>
    </div>
  );
}

/* ─────────── Section Header with View All ─────────── */

function SectionHeader({ icon, title, count, onViewAll, viewAllLabel }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-semibold text-text-secondary">
          {title}
          {count != null && (
            <span className="ml-1.5 text-xs font-bold text-primary-500">
              ({count})
            </span>
          )}
        </span>
      </div>
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-500 hover:text-primary-400 transition-colors duration-200 group/btn"
        >
          {viewAllLabel || "View All"}
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover/btn:translate-x-0.5"
          />
        </button>
      )}
    </div>
  );
}

/* ─────────── Empty Placeholder ─────────── */

function EmptySection({ icon, message }) {
  return (
    <div className="bg-background-card rounded-2xl border border-dashed border-border-primary/60 p-8 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-xl bg-background-hover/50 border border-border-primary flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-xs text-text-muted/70">{message}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function CashierView() {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();

  const {
    draftOrders,
    draftCount,
    pendingDeliveries,
    pendingDeliveryCount,
    recentOrders,
    completedToday,
    ordersThisMonth,
    completedThisMonth,
    cancelledThisMonth,
    pendingThisMonth,
    isLoading,
    isError,
    refetch,
  } = useCashierDashboard();

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <DashboardError onRetry={refetch} />;

  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* ── Header ── */}
      <DashboardSection delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              {t("cashier.title", "Cashier Dashboard")} 👋
            </h1>
            <p className="text-sm text-text-muted mt-1">
              {t("cashier.subtitle", "Here's your daily operations overview.")}
            </p>
          </div>
          <button
            onClick={() => navigate("/orders/new")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus size={16} />
            {t("cashier.newOrder", "New Order")}
          </button>
        </div>
      </DashboardSection>

      {/* ── 1. Statistics Cards ── */}
      <DashboardSection delay={50}>
        <DashboardGrid cols={4}>
          <StatCard
            title={t("cashier.stats.draftOrders", "Draft Orders")}
            value={draftCount}
            icon={<FileEdit size={20} />}
            color="amber"
            subtitle={t("cashier.stats.drafts", "drafts")}
          />
          <StatCard
            title={t("cashier.stats.pendingDeliveries", "Pending Deliveries")}
            value={pendingDeliveryCount}
            icon={<Truck size={20} />}
            color="blue"
            subtitle={t("cashier.stats.outForDelivery", "out for delivery")}
          />
          <StatCard
            title={t("cashier.stats.completedToday", "Completed Today")}
            value={completedToday}
            icon={<CheckCircle2 size={20} />}
            color="green"
            subtitle={t("cashier.stats.today", "today")}
          />
          <StatCard
            title={t("cashier.stats.ordersThisMonth", "Orders This Month")}
            value={ordersThisMonth}
            icon={<CalendarDays size={20} />}
            color="purple"
            subtitle={t("cashier.stats.thisMonth", "this month")}
          />
        </DashboardGrid>
      </DashboardSection>

      {/* ── 2. My Draft Orders ── */}
      <DashboardSection delay={100}>
        <SectionHeader
          icon={<FileEdit size={15} className="text-amber-400" />}
          title={t("cashier.sections.draftOrders", "My Draft Orders")}
          count={draftCount}
          onViewAll={() => navigate("/cashier/draft-orders")}
          viewAllLabel={t("cashier.viewAll", "View All")}
        />
        {draftOrders.length > 0 ? (
          <div className="space-y-3">
            {draftOrders.map((order, idx) => (
              <OrderCard
                key={order.orderId ?? order.id ?? idx}
                order={order}
                delay={idx * 60}
                onClick={() =>
                  navigate("/orders/new", {
                    state: { draftOrderId: order.orderId ?? order.id },
                  })
                }
              />
            ))}
          </div>
        ) : (
          <EmptySection
            icon={<FileEdit size={22} className="text-text-muted/40" />}
            message={t(
              "cashier.empty.drafts",
              "No draft orders. Click 'New Order' to get started.",
            )}
          />
        )}
      </DashboardSection>

      {/* ── 3. Pending Deliveries ── */}
      <DashboardSection delay={150}>
        <SectionHeader
          icon={<Truck size={15} className="text-blue-400" />}
          title={t("cashier.sections.pendingDeliveries", "Pending Deliveries")}
          count={pendingDeliveryCount}
          onViewAll={() => navigate("/cashier/pending-deliveries")}
          viewAllLabel={t("cashier.viewAll", "View All")}
        />
        {pendingDeliveries.length > 0 ? (
          <div className="space-y-3">
            {pendingDeliveries.map((order, idx) => (
              <OrderCard
                key={order.orderId ?? order.id ?? idx}
                order={order}
                delay={idx * 60}
                onClick={() => navigate(`/delivery-orders/${order.id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptySection
            icon={<Truck size={22} className="text-text-muted/40" />}
            message={t(
              "cashier.empty.deliveries",
              "No pending deliveries at the moment.",
            )}
          />
        )}
      </DashboardSection>

      {/* ── 4. Recent Orders ── */}
      <DashboardSection delay={200}>
        <SectionHeader
          icon={<Clock size={15} className="text-primary-500" />}
          title={t("cashier.sections.recentOrders", "Recent Orders")}
          onViewAll={() => navigate("/orders")}
          viewAllLabel={t("cashier.viewAll", "View All")}
        />
        {recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((order, idx) => (
              <OrderCard
                key={order.orderId ?? order.id ?? idx}
                order={order}
                delay={idx * 60}
                onClick={() =>
                  order.status === "OutForDelivery"
                    ? navigate(`/delivery-orders/${order.id}`)
                    : navigate(`/orders/${order.orderId ?? order.id}`)
                }
              />
            ))}
          </div>
        ) : (
          <EmptySection
            icon={<ShoppingCart size={22} className="text-text-muted/40" />}
            message={t("cashier.empty.recent", "No recent orders to show.")}
          />
        )}
      </DashboardSection>

      {/* ── 5. Monthly Performance ── */}
      <DashboardSection
        title={t("cashier.sections.monthlyPerformance", "Monthly Performance")}
        subtitle={t(
          "cashier.sections.monthlySubtitle",
          "Your performance summary for this month",
        )}
        delay={250}
      >
        <DashboardGrid cols={4}>
          <PerformanceCard
            icon={<CalendarDays size={20} />}
            label={t("cashier.performance.ordersMonth", "Orders This Month")}
            value={ordersThisMonth}
            color="blue"
          />
          <PerformanceCard
            icon={<CheckCircle2 size={20} />}
            label={t(
              "cashier.performance.completedMonth",
              "Completed This Month",
            )}
            value={completedThisMonth}
            color="green"
          />
          <PerformanceCard
            icon={<XCircle size={20} />}
            label={t(
              "cashier.performance.cancelledMonth",
              "Cancelled This Month",
            )}
            value={cancelledThisMonth}
            color="red"
          />
          <PerformanceCard
            icon={<Truck size={20} />}
            label={t("cashier.performance.pendingMonth", "Pending Deliveries")}
            value={pendingThisMonth}
            color="amber"
          />
        </DashboardGrid>
      </DashboardSection>
    </div>
  );
}
