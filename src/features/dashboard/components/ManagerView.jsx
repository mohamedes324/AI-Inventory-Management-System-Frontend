/**
 * @component ManagerView
 * @description Manager Dashboard — lightweight overview + navigation previews.
 * KPIs and alerts use /dashboard/summary data. Preview cards are static
 * navigation elements — actual analytics fetching happens on dedicated pages.
 */
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  DollarSign, ShoppingCart, Package, Boxes,
  AlertTriangle, XCircle, Clock, Warehouse,
  RotateCcw, Users, Truck,
} from "lucide-react";

import { useDashboardSummary } from "../hooks/useDashboardSummary";
import {
  DashboardHeader, DashboardSection, DashboardGrid,
  DashboardSkeleton, DashboardError,
  StatCard, AlertCard, AnalyticsCard,
} from "./shared";
import { RefundChart } from "./charts";
import { ReturnedProductsPreview, PaymentMethodsPreview } from "./previews";

/** Format large currency values */
function formatCurrency(val) {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
  return val.toFixed(2);
}

/** Format number for counter display with commas */
function currencyFormatter(val) {
  return val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Compute initial "Last 30 Days" range in ISO 8601 */
function getInitialRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start.setDate(start.getDate() - 29);
  return { key: "last30Days", startDate: start.toISOString(), endDate: now.toISOString() };
}

export default function ManagerView() {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState(getInitialRange);

  const { data, isLoading, isError, refetch } = useDashboardSummary({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const handleDateRangeChange = useCallback(({ key, startDate, endDate }) => {
    setDateRange({ key, startDate, endDate });
  }, []);

  const handleExport = useCallback(() => {
    console.log("Export report:", dateRange);
  }, [dateRange]);

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <DashboardError onRetry={refetch} />;

  const summary = data || {};
  const currency = t("currency");

  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* ── 1. Dashboard Header ── */}
      <DashboardHeader
        role="Manager"
        dateRange={dateRange.key}
        onDateRangeChange={handleDateRangeChange}
        onExport={handleExport}
      />

      {/* ── 2. KPI Cards ── */}
      <DashboardSection delay={0}>
        <DashboardGrid cols={5}>
          <StatCard title={t("kpi.totalRevenue")} value={summary.totalRevenue || 0} icon={<DollarSign size={20} />} color="green" formatter={currencyFormatter} subtitle={currency} />
          <StatCard title={t("kpi.totalOrders")} value={summary.totalOrders || 0} icon={<ShoppingCart size={20} />} color="blue" subtitle={t("kpi.orders")} />
          <StatCard title={t("kpi.totalProducts")} value={summary.totalProducts || 0} icon={<Package size={20} />} color="purple" subtitle={t("kpi.products")} />
          <StatCard title={t("kpi.totalStockQuantity")} value={summary.totalStockQuantity || 0} icon={<Boxes size={20} />} color="cyan" subtitle={t("kpi.units")} />
          <div
            onClick={() => navigate("/delivery-orders")}
            className="cursor-pointer"
          >
            <StatCard title={t("kpi.pendingDeliveryOrders")} value={summary.totalPendingOrders || 0} icon={<Truck size={20} />} color="amber" subtitle={t("kpi.pendingOrders")} />
          </div>
        </DashboardGrid>
      </DashboardSection>

      {/* ── 3. Alerts Section ── */}
      <DashboardSection title={t("alerts.title")} delay={100}>
        <DashboardGrid cols={3}>
          <AlertCard severity={summary.lowStockProducts > 0 ? "warning" : "success"} label={t("alerts.lowStock.label")} message={summary.lowStockProducts > 0 ? `⚠️ ${t("alerts.lowStock.warning", { count: summary.lowStockProducts })}` : `✅ ${t("alerts.lowStock.ok")}`} icon={<AlertTriangle size={20} />} onClick={() => navigate("/reports/inventory/low-stock")} />
          <AlertCard severity={summary.outOfStockProducts > 0 ? "danger" : "success"} label={t("alerts.outOfStock.label")} message={summary.outOfStockProducts > 0 ? `❌ ${t("alerts.outOfStock.danger", { count: summary.outOfStockProducts })}` : `✅ ${t("alerts.outOfStock.ok")}`} icon={<XCircle size={20} />} onClick={() => navigate("/reports/inventory/out-of-stock")} />
          <AlertCard severity={summary.pendingPurchaseOrders > 0 ? "warning" : "success"} label={t("alerts.pendingOrders.label")} message={summary.pendingPurchaseOrders > 0 ? `⏳ ${t("alerts.pendingOrders.warning", { count: summary.pendingPurchaseOrders })}` : `✅ ${t("alerts.pendingOrders.ok")}`} icon={<Clock size={20} />} />
        </DashboardGrid>
      </DashboardSection>

      {/* ── 4. Refund Overview (uses already-fetched summary data, no extra API call) ── */}
      <DashboardSection delay={150}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RefundChart totalRevenue={summary.totalRevenue || 0} totalRefundAmount={summary.totalRefundAmount || 0} />
        </div>
      </DashboardSection>

      {/* ── 5. Lightweight Navigation Previews (no API fetching) ── */}
      <DashboardSection delay={200}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ReturnedProductsPreview />
          <PaymentMethodsPreview />
        </div>
      </DashboardSection>

      {/* ── 6. Inventory Analytics ── */}
      <DashboardSection title={t("inventory.title")} delay={250}>
        <DashboardGrid cols={3}>
          <AnalyticsCard title={t("inventory.totalStockValue")} value={`${formatCurrency(summary.totalStockValue || 0)} ${currency}`} description={t("inventory.stockValueDesc")} icon={<Warehouse size={24} />} color="green" />
          <AnalyticsCard title={t("inventory.totalReturns")} value={`${summary.totalReturns || 0}`} description={t("inventory.returnsDesc")} icon={<RotateCcw size={24} />} color="amber" />
          <AnalyticsCard title={t("inventory.totalRefunds")} value={`${formatCurrency(summary.totalRefundAmount || 0)} ${currency}`} description={t("inventory.refundsDesc")} icon={<DollarSign size={24} />} color="red" />
        </DashboardGrid>
      </DashboardSection>

      {/* ── 7. Active Users ── */}
      <DashboardSection title={t("users.title")} delay={300}>
        <AnalyticsCard title={t("users.activeUsers")} value={`${summary.activeUsers || 0}`} description={t("users.activeUsersDesc")} icon={<Users size={24} />} color="blue" className="max-w-md" />
      </DashboardSection>
    </div>
  );
}
