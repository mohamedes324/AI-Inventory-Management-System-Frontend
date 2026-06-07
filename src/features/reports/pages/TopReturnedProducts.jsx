/**
 * @page TopReturnedProducts
 * @description Full report page for most returned products.
 * Fetches from /api/reports/returns/top-products with date filtering.
 */
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  RotateCcw, ArrowLeft, RefreshCw, AlertTriangle,
  DollarSign, Package,
} from "lucide-react";

import Layout from "@/shared/components/Layout";
import { Button } from "@/shared/components/ui";
import DateRangePicker from "@/features/dashboard/components/shared/DateRangePicker";
import { useTopReturnedProducts } from "../hooks/useTopReturnedProducts";

function getInitialRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start.setDate(start.getDate() - 29);
  return { key: "last30Days", startDate: start.toISOString(), endDate: now.toISOString() };
}

export default function TopReturnedProducts() {
  const { t } = useTranslation("reports");
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState(getInitialRange);

  const { data, isLoading, isError, refetch } = useTopReturnedProducts({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    top: 10,
  });

  const products = Array.isArray(data) ? data : [];

  const handleDateRangeChange = useCallback(({ key, startDate, endDate }) => {
    setDateRange({ key, startDate, endDate });
  }, []);

  return (
    <Layout>
      {/* Header */}
      <header className="shrink-0 bg-background-card border-b border-border-primary px-5 sm:px-8 py-5 animate-fadeIn">
        <div className="max-w-[1440px] mx-auto">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary-400 transition-colors mb-3">
            <ArrowLeft size={14} className="rtl:rotate-180" />
            {t("common.backToDashboard")}
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 shrink-0">
                <RotateCcw size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary tracking-tight">{t("returnedProducts.pageTitle")}</h1>
                <p className="text-text-muted text-sm mt-0.5">{t("returnedProducts.pageSubtitle")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DateRangePicker value={dateRange.key} onChange={handleDateRangeChange} />
              <button onClick={() => refetch()} disabled={isLoading} className="w-9 h-9 shrink-0 rounded-xl border border-border-primary bg-background-card flex items-center justify-center text-text-muted hover:text-primary-400 hover:border-primary-500/30 transition-all duration-200 disabled:opacity-50">
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto px-5 sm:px-8 py-6">
        <div className="max-w-[1440px] mx-auto">
          {/* Loading */}
          {isLoading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-border-primary bg-background-card p-5 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl animate-shimmer shrink-0" />
                  <div className="flex-1"><div className="w-48 h-5 rounded-lg animate-shimmer mb-2" /><div className="w-32 h-3.5 rounded animate-shimmer" /></div>
                  <div className="hidden sm:flex gap-6"><div className="w-20 h-5 rounded animate-shimmer" /><div className="w-20 h-5 rounded animate-shimmer" /></div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {isError && !isLoading && (
            <div className="flex flex-col items-center justify-center py-24 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mb-5"><AlertTriangle size={32} /></div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{t("common.loadError")}</h3>
              <Button variant="ghost" size="sm" onClick={() => refetch()} className="mt-3"><RefreshCw size={16} />{t("common.refresh")}</Button>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-5 animate-float">
                <Package size={32} />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">{t("returnedProducts.empty")}</h3>
              <p className="text-sm text-text-muted max-w-xs text-center">{t("returnedProducts.emptyDesc")}</p>
            </div>
          )}

          {/* Products List */}
          {!isLoading && !isError && products.length > 0 && (
            <div className="space-y-3">
              {products.map((product, index) => (
                <motion.div
                  key={product.productId || index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  onClick={() => navigate(`/products/${product.productId}`)}
                  className="rounded-2xl border border-border-primary bg-background-card p-4 sm:p-5 flex items-center gap-4 hover:border-amber-500/20 hover:shadow-[var(--shadow-card)] transition-all duration-300 cursor-pointer group"
                >
                  {/* Rank */}
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-amber-400">#{index + 1}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-text-secondary group-hover:text-text-primary truncate transition-colors">
                      {product.productName}
                    </h3>
                  </div>

                  {/* Metrics */}
                  <div className="hidden sm:flex items-center gap-5">
                    <div className="text-end min-w-[90px]">
                      <p className="text-xs text-text-muted mb-0.5">{t("returnedProducts.returnedQty")}</p>
                      <div className="flex items-center justify-end gap-1.5">
                        <RotateCcw size={13} className="text-amber-400" />
                        <span className="text-sm font-bold text-amber-400">{product.totalReturnedQuantity}</span>
                      </div>
                    </div>
                    <div className="text-end min-w-[100px]">
                      <p className="text-xs text-text-muted mb-0.5">{t("returnedProducts.refundAmount")}</p>
                      <div className="flex items-center justify-end gap-1.5">
                        <DollarSign size={13} className="text-red-400" />
                        <span className="text-sm font-bold text-red-400">{product.totalRefundAmount?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile metrics */}
                  <div className="flex sm:hidden flex-col items-end gap-1 shrink-0">
                    <span className="text-xs font-semibold text-amber-400">{product.totalReturnedQuantity} {t("returnedProducts.units")}</span>
                    <span className="text-xs font-semibold text-red-400">{product.totalRefundAmount?.toLocaleString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
