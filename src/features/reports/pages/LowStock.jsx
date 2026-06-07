/**
 * @page LowStock
 * @description Low Stock Products report page.
 * Fetches from /api/reports/inventory/low-stock.
 * Shows products below their reorder point with deficit indicators.
 */
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  AlertTriangle, ArrowLeft, RefreshCw, Search,
  Package, TrendingDown,
} from "lucide-react";

import Layout from "@/shared/components/Layout";
import { Button } from "@/shared/components/ui";
import { useLowStock } from "../hooks/useLowStock";

export default function LowStock() {
  const { t } = useTranslation("reports");
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useLowStock();
  const [search, setSearch] = useState("");

  const products = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((p) => p.productName?.toLowerCase().includes(q));
  }, [data, search]);

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
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 shrink-0">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary tracking-tight">{t("lowStock.title")}</h1>
                <p className="text-text-muted text-sm mt-0.5">{t("lowStock.subtitle")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isLoading && products.length > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <AlertTriangle size={13} />
                  {products.length} {t("lowStock.productName")}
                </span>
              )}
              <button onClick={() => refetch()} disabled={isLoading} className="w-9 h-9 shrink-0 rounded-xl border border-border-primary bg-background-card flex items-center justify-center text-text-muted hover:text-primary-400 hover:border-primary-500/30 transition-all duration-200 disabled:opacity-50" title={t("common.refresh")}>
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-5 sm:px-8 py-4 animate-fadeIn" style={{ animationDelay: "100ms" }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("lowStock.searchPlaceholder")} className="w-full rounded-xl border border-border-primary bg-background-input pl-11 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-border-focus focus:ring-2 focus:ring-primary-500/20 transition-all duration-200" />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto px-5 sm:px-8 pb-6">
        <div className="max-w-[1440px] mx-auto">
          {/* Loading */}
          {isLoading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-border-primary bg-background-card p-5 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl animate-shimmer shrink-0" />
                  <div className="flex-1"><div className="w-48 h-5 rounded-lg animate-shimmer mb-2" /><div className="w-32 h-3.5 rounded animate-shimmer" /></div>
                  <div className="hidden sm:flex gap-6"><div className="w-16 h-5 rounded animate-shimmer" /><div className="w-16 h-5 rounded animate-shimmer" /></div>
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
              <h3 className="text-lg font-semibold text-text-primary mb-1">{t("lowStock.empty")}</h3>
              <p className="text-sm text-text-muted max-w-xs text-center">{t("lowStock.emptyDesc")}</p>
            </div>
          )}

          {/* Products List */}
          {!isLoading && !isError && products.length > 0 && (
            <div className="space-y-3">
              {products.map((product, index) => {
                const deficit = (product.reorderPoint || 0) - (product.currentQuantity || 0);
                const severity = product.currentQuantity === 0 ? "critical" : deficit > product.reorderPoint * 0.5 ? "high" : "medium";

                return (
                  <motion.div
                    key={product.productId || index}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    onClick={() => navigate(`/products/${product.productId}`)}
                    className="rounded-2xl border border-border-primary bg-background-card p-4 sm:p-5 flex items-center gap-4 hover:border-border-secondary hover:shadow-[var(--shadow-card)] transition-all duration-300 cursor-pointer group"
                  >
                    {/* Warning icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${severity === "critical" ? "bg-red-500/15" : severity === "high" ? "bg-amber-500/15" : "bg-yellow-500/10"}`}>
                      <AlertTriangle size={18} className={severity === "critical" ? "text-red-400" : severity === "high" ? "text-amber-400" : "text-yellow-400"} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-text-secondary group-hover:text-text-primary truncate transition-colors">
                        {product.productName}
                      </h3>
                    </div>

                    {/* Metrics */}
                    <div className="hidden sm:flex items-center gap-5">
                      <div className="text-end min-w-[80px]">
                        <p className="text-xs text-text-muted mb-0.5">{t("lowStock.currentQty")}</p>
                        <span className={`text-sm font-bold ${product.currentQuantity === 0 ? "text-red-400" : "text-amber-400"}`}>
                          {product.currentQuantity}
                        </span>
                      </div>
                      <div className="text-end min-w-[80px]">
                        <p className="text-xs text-text-muted mb-0.5">{t("lowStock.reorderPoint")}</p>
                        <span className="text-sm font-bold text-text-primary">{product.reorderPoint}</span>
                      </div>
                      <div className="text-end min-w-[60px]">
                        <p className="text-xs text-text-muted mb-0.5">{t("lowStock.deficit")}</p>
                        <div className="flex items-center justify-end gap-1">
                          <TrendingDown size={13} className="text-red-400" />
                          <span className="text-sm font-bold text-red-400">-{Math.max(deficit, 0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Mobile metrics */}
                    <div className="flex sm:hidden flex-col items-end gap-1 shrink-0">
                      <span className={`text-xs font-semibold ${product.currentQuantity === 0 ? "text-red-400" : "text-amber-400"}`}>
                        {product.currentQuantity} / {product.reorderPoint}
                      </span>
                      <span className="text-xs font-semibold text-red-400">-{Math.max(deficit, 0)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
