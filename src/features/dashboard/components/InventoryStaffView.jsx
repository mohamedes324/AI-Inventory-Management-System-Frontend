/**
 * @component InventoryStaffView
 * @description Inventory Staff Dashboard — simplified operational overview.
 * Sections:
 *  1. Statistics cards (total products, low stock, out of stock, purchases this month)
 *  2. Recent Purchases (latest 5 + View All)
 *  3. Low Stock Products (first 5 + View All)
 *  4. Out of Stock Products (first 5 + View All)
 *
 * All data is fetched via useInventoryStaffDashboard which reuses existing
 * Manager Dashboard APIs (dashboard/summary, reports/inventory/*) and
 * the PurchaseOrders endpoint.
 */
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Package,
  AlertTriangle,
  XCircle,
  ShoppingCart,
  ArrowRight,
  PackageX,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";

import { useInventoryStaffDashboard } from "../hooks/useInventoryStaffDashboard";
import {
  DashboardSection,
  DashboardGrid,
  DashboardSkeleton,
  DashboardError,
  StatCard,
} from "./shared";
import RecentOrderCard from "@/features/purchase-orders/components/RecentOrderCard";

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
          {viewAllLabel}
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

export default function InventoryStaffView() {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();

  const {
    summary,
    lowStockProducts,
    outOfStockProducts,
    recentPurchases,
    purchasesThisMonth,
    isLoading,
    isError,
    refetch,
  } = useInventoryStaffDashboard();

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <DashboardError onRetry={refetch} />;

  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* ── Header ── */}
      <DashboardSection delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              {t("inventoryStaff.title")} 👋
            </h1>
            <p className="text-sm text-text-muted mt-1">
              {t("inventoryStaff.subtitle")}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border-primary bg-background-card text-text-secondary hover:text-text-primary hover:border-border-secondary transition-all duration-200 shadow-[var(--shadow-card)]"
          >
            <RefreshCw size={16} />
            <span>{t("inventoryStaff.refresh")}</span>
          </button>
        </div>
      </DashboardSection>

      {/* ── 1. Top Statistics Cards ── */}
      <DashboardSection delay={50}>
        <DashboardGrid cols={4}>
          <StatCard
            title={t("inventoryStaff.stats.totalProducts")}
            value={summary.totalProducts || 0}
            icon={<Package size={20} />}
            color="purple"
            subtitle={t("inventoryStaff.stats.products")}
          />
          <StatCard
            title={t("inventoryStaff.stats.lowStock")}
            value={summary.lowStockProducts || 0}
            icon={<AlertTriangle size={20} />}
            color="amber"
            subtitle={t("inventoryStaff.stats.products")}
          />
          <StatCard
            title={t("inventoryStaff.stats.outOfStock")}
            value={summary.outOfStockProducts || 0}
            icon={<XCircle size={20} />}
            color="red"
            subtitle={t("inventoryStaff.stats.products")}
          />
          <StatCard
            title={t("inventoryStaff.stats.purchasesThisMonth")}
            value={purchasesThisMonth}
            icon={<ShoppingCart size={20} />}
            color="blue"
            subtitle={t("inventoryStaff.stats.purchases")}
          />
        </DashboardGrid>
      </DashboardSection>

      {/* ── Bottom Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* ── Recent Purchases ── */}
        <DashboardSection delay={100}>
          <SectionHeader
            icon={<ShoppingCart size={15} className="text-blue-400" />}
            title={t("inventoryStaff.sections.recentPurchases")}
            onViewAll={() => navigate("/purchases")}
            viewAllLabel={t("inventoryStaff.viewAll")}
          />
          {recentPurchases.length > 0 ? (
            <div className="space-y-3">
              {recentPurchases.map((purchase, idx) => (
                <RecentOrderCard
                  key={purchase.purchaseOrderId ?? purchase.id ?? idx}
                  order={purchase}
                  delay={idx * 60}
                  onClick={() =>
                    navigate(`/purchases/${purchase.purchaseOrderId ?? purchase.id}`)
                  }
                />
              ))}
            </div>
          ) : (
            <EmptySection
              icon={<ShoppingCart size={22} className="text-text-muted/40" />}
              message={t("inventoryStaff.empty.recentPurchases")}
            />
          )}
        </DashboardSection>

        {/* ── Alerts Side (Low Stock & Out of Stock) ── */}
        <div className="space-y-6">
          {/* Low Stock Products */}
          <DashboardSection delay={150}>
            <SectionHeader
              icon={<AlertTriangle size={15} className="text-amber-400" />}
              title={t("inventoryStaff.sections.lowStockProducts")}
              onViewAll={() => navigate("/reports/inventory/low-stock")}
              viewAllLabel={t("inventoryStaff.viewAll")}
            />
            {lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.map((product, idx) => {
                  const deficit = (product.reorderPoint || 0) - (product.currentQuantity || 0);
                  const severity = product.currentQuantity === 0 ? "critical" : deficit > product.reorderPoint * 0.5 ? "high" : "medium";

                  return (
                    <motion.div
                      key={product.productId ?? idx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.04 }}
                      onClick={() => navigate(`/products/${product.productId}`)}
                      className="rounded-2xl border border-border-primary bg-background-card p-4 flex items-center gap-4 hover:border-border-secondary hover:shadow-[var(--shadow-card)] transition-all duration-300 cursor-pointer group"
                    >
                      {/* Warning Icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${severity === "critical" ? "bg-red-500/15" : severity === "high" ? "bg-amber-500/15" : "bg-yellow-500/10"}`}>
                        <AlertTriangle size={18} className={severity === "critical" ? "text-red-400" : severity === "high" ? "text-amber-400" : "text-yellow-400"} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-text-secondary group-hover:text-text-primary truncate transition-colors">
                          {product.productName}
                        </h3>
                      </div>

                      {/* Metrics */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${product.currentQuantity === 0 ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                          {product.currentQuantity} / {product.reorderPoint}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <EmptySection
                icon={<AlertTriangle size={22} className="text-text-muted/40" />}
                message={t("inventoryStaff.empty.lowStock")}
              />
            )}
          </DashboardSection>

          {/* Out of Stock Products */}
          <DashboardSection delay={200}>
            <SectionHeader
              icon={<XCircle size={15} className="text-red-400" />}
              title={t("inventoryStaff.sections.outOfStockProducts")}
              onViewAll={() => navigate("/reports/inventory/out-of-stock")}
              viewAllLabel={t("inventoryStaff.viewAll")}
            />
            {outOfStockProducts.length > 0 ? (
              <div className="space-y-3">
                {outOfStockProducts.map((product, idx) => (
                  <motion.div
                    key={product.productId ?? idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    onClick={() => navigate(`/products/${product.productId}`)}
                    className="rounded-2xl border border-red-500/15 bg-background-card p-4 flex items-center gap-4 hover:border-red-500/30 hover:shadow-[var(--shadow-card)] transition-all duration-300 cursor-pointer group"
                  >
                    {/* Critical Icon */}
                    <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
                      <PackageX size={18} className="text-red-400" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-text-secondary group-hover:text-text-primary truncate transition-colors">
                        {product.productName}
                      </h3>
                    </div>

                    {/* Urgent badge */}
                    <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20 shrink-0">
                      {t("inventoryStaff.urgent")}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptySection
                icon={<XCircle size={22} className="text-text-muted/40" />}
                message={t("inventoryStaff.empty.outOfStock")}
              />
            )}
          </DashboardSection>
        </div>
      </div>
    </div>
  );
}
