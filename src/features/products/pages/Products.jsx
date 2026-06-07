/**
 * @page Products
 * @description Top Selling Products — Sales Performance + Inventory Management.
 * Combines business analytics (top 10 products, last 30 days) with
 * operational tools (search, add product).
 * Clicking a product navigates to the full ProductDetails page.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  TrendingUp, Trophy, Package, RefreshCw, Crown,
  Medal, Award, ArrowUpRight, ShoppingCart, DollarSign,
  AlertTriangle, Plus,
} from "lucide-react";

import Layout from "@/shared/components/Layout";
import { Button } from "@/shared/components/ui";
import RevealOnScroll from "@/shared/components/RevealOnScroll";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { useRequest } from "@/shared/hooks/useRequest";
import { toast } from "@/shared/store/toastStore";
import { useTopSellingProducts } from "../hooks/useTopSellingProducts";

import { createProduct } from "../api/createProduct";
import ProductSearchInput from "../components/ProductSearchInput";
import AddProductModal from "../components/AddProductModal";

/** Rank badge component for top 3 positions */
function RankBadge({ rank }) {
  if (rank === 1) {
    return (
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
        <Crown size={18} className="text-white" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-lg shadow-gray-400/20 shrink-0">
        <Medal size={18} className="text-white" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-700/20 shrink-0">
        <Award size={18} className="text-white" />
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-xl bg-background-hover border border-border-primary flex items-center justify-center shrink-0">
      <span className="text-sm font-bold text-text-muted">#{rank}</span>
    </div>
  );
}

/** Skeleton loader for the product list */
function ProductsSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-border-primary bg-background-card p-5 flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl animate-shimmer shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="w-48 h-5 rounded-lg animate-shimmer mb-2" />
            <div className="w-32 h-3.5 rounded animate-shimmer" />
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <div className="w-20 h-5 rounded animate-shimmer" />
            <div className="w-20 h-5 rounded animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Format currency */
function formatValue(val) {
  if (val == null) return "—";
  return val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Products() {
  const { t } = useTranslation("products");
  const navigate = useNavigate();
  const { isInventoryStaff } = usePermissions();
  const canManage = isInventoryStaff;

  // ── Top Products data ──
  const { data, isLoading, isError, refetch } = useTopSellingProducts();
  const products = Array.isArray(data) ? data : [];

  // ── Add Product modal ──
  const [addOpen, setAddOpen] = useState(false);
  const { execute: execCreate, loading: creating } = useRequest(createProduct);

  const handleCreate = async (formData) => {
    try {
      await execCreate(formData);
      toast.success(t("toasts.createSuccess"));
      setAddOpen(false);
      refetch();
    } catch {
      toast.error(t("toasts.createError"));
    }
  };

  // ── Search handler — navigate to product details on select ──
  const handleSearchSelect = (product) => {
    navigate(`/products/${product.id}`);
  };

  return (
    <Layout>
      {/* ── Header ── */}
      <header className="shrink-0 bg-background-card border-b border-border-primary px-5 sm:px-8 py-5 animate-fadeIn">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 shrink-0">
              <Trophy size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary tracking-tight">
                {t("topProducts.title")}
              </h1>
              <p className="text-text-muted text-sm mt-0.5">
                {t("topProducts.subtitle")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Period badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-semibold px-3 py-1.5 rounded-full">
              <TrendingUp size={13} />
              {t("topProducts.period")}
            </span>

            {/* Refresh */}
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="w-9 h-9 shrink-0 rounded-xl border border-border-primary bg-background-card flex items-center justify-center text-text-muted hover:text-primary-400 hover:border-primary-500/30 transition-all duration-200 disabled:opacity-50"
              title={t("page.refresh")}
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Actions Bar: Search + Add Product ── */}
      <div className="px-5 sm:px-8 py-4 animate-fadeIn" style={{ animationDelay: "100ms" }}>
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <ProductSearchInput
            onSelect={handleSearchSelect}
            className="flex-1 max-w-md"
          />

          {canManage && (
            <Button size="sm" onClick={() => setAddOpen(true)} className="shrink-0">
              <Plus size={16} />
              <span>{t("page.addProduct")}</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <main className="flex-1 overflow-auto px-5 sm:px-8 pb-6">
        <div className="max-w-[1440px] mx-auto">

          {/* Loading */}
          {isLoading && <ProductsSkeleton />}

          {/* Error */}
          {isError && !isLoading && (
            <div className="flex flex-col items-center justify-center py-24 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mb-5">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {t("toasts.fetchError")}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => refetch()} className="mt-3">
                <RefreshCw size={16} />
                {t("page.refresh")}
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400/60 mb-5 animate-float">
                <Package size={32} />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                {t("topProducts.empty")}
              </h3>
              <p className="text-sm text-text-muted max-w-xs text-center">
                {t("topProducts.emptyDesc")}
              </p>
            </div>
          )}

          {/* Product Rankings */}
          {!isLoading && !isError && products.length > 0 && (
            <div className="space-y-3">
              {products.map((product, index) => {
                const rank = index + 1;
                const isTopThree = rank <= 3;

                return (
                  <RevealOnScroll key={product.productId || product.id || index} direction="up" delay={index * 60} distance={16}>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.995 }}
                      onClick={() => navigate(`/products/${product.productId || product.id}`)}
                      className={`
                        w-full text-start rounded-2xl border transition-all duration-300
                        p-4 sm:p-5 flex items-center gap-4 group cursor-pointer
                        ${isTopThree
                          ? "bg-background-card border-border-secondary shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] hover:border-amber-500/30"
                          : "bg-background-card border-border-primary hover:border-border-secondary hover:shadow-[var(--shadow-card)]"
                        }
                      `}
                    >
                      {/* Rank Badge */}
                      <RankBadge rank={rank} />

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-sm sm:text-base font-semibold truncate ${isTopThree ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary"} transition-colors`}>
                          {product.productName || product.name || "—"}
                        </h3>
                        {product.sku && (
                          <p className="text-xs text-text-muted mt-0.5 truncate">
                            SKU: {product.sku}
                          </p>
                        )}
                        {product.categoryName && (
                          <p className="text-xs text-text-muted mt-0.5 truncate">
                            {product.categoryName}
                          </p>
                        )}
                      </div>

                      {/* Sales Metrics */}
                      <div className="hidden sm:flex items-center gap-5">
                        {/* Units Sold */}
                        {product.totalQuantitySold != null && (
                          <div className="text-end min-w-[80px]">
                            <p className="text-xs text-text-muted mb-0.5">{t("topProducts.unitsSold")}</p>
                            <div className="flex items-center justify-end gap-1.5">
                              <ShoppingCart size={13} className="text-blue-400" />
                              <span className="text-sm font-bold text-text-primary">
                                {product.totalQuantitySold.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Revenue */}
                        {product.totalRevenue != null && (
                          <div className="text-end min-w-[100px]">
                            <p className="text-xs text-text-muted mb-0.5">{t("topProducts.revenue")}</p>
                            <div className="flex items-center justify-end gap-1.5">
                              <DollarSign size={13} className="text-emerald-400" />
                              <span className="text-sm font-bold text-emerald-400">
                                {formatValue(product.totalRevenue)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Mobile metrics */}
                      <div className="flex sm:hidden flex-col items-end gap-1 shrink-0">
                        {product.totalQuantitySold != null && (
                          <span className="text-xs font-semibold text-blue-400">
                            {product.totalQuantitySold.toLocaleString()} {t("topProducts.sold")}
                          </span>
                        )}
                        {product.totalRevenue != null && (
                          <span className="text-xs font-semibold text-emerald-400">
                            {formatValue(product.totalRevenue)}
                          </span>
                        )}
                      </div>

                      {/* Navigate arrow */}
                      <ArrowUpRight
                        size={18}
                        className="text-text-muted/40 group-hover:text-primary-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 rtl:-scale-x-100"
                      />
                    </motion.button>
                  </RevealOnScroll>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ── Add Product Modal ── */}
      <AddProductModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleCreate}
        loading={creating}
      />
    </Layout>
  );
}
