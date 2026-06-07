/**
 * @page PurchaseOrders
 * @description Purchase Orders management page.
 * Initial load: latest 5 orders. Filter modal for advanced search.
 * "Add Purchase Order" button visible only for InventoryStaff.
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Plus, Filter, RefreshCw, X } from "lucide-react";
import Layout from "@/shared/components/Layout";
import { Button, EmptyState } from "@/shared/components/ui";
import Pagination from "@/shared/components/ui/Pagination";
import { usePermissions } from "@/shared/hooks/usePermissions";

import { usePurchaseOrders } from "../hooks/usePurchaseOrders";
import PurchaseOrderTable from "../components/PurchaseOrderTable";
import FilterModal from "../components/FilterModal";

export default function PurchaseOrders() {
  const { t } = useTranslation("purchaseOrders");
  const { isInventoryStaff } = usePermissions();
  const [filterOpen, setFilterOpen] = useState(false);

  const {
    orders,
    loading,
    page,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    isFiltered,
    activeFilters,
    applyFilters,
    resetFilters,
    changePage,
  } = usePurchaseOrders(5);

  return (
    <Layout>
      {/* ── Header ── */}
      <header className="shrink-0 bg-background-card border-b border-border-primary px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/25 shrink-0">
            <ShoppingCart size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              {t("page.title")}
            </h1>
            <p className="text-text-muted text-sm mt-0.5">
              {t("page.description")}
            </p>
          </div>
        </div>

        <div className="flex items-center w-full sm:w-auto gap-3">
          {totalCount > 0 && !loading && (
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-primary-500/10 border border-primary-500/20 text-primary-500 text-xs font-bold px-3 py-1.5 rounded-full">
              {t("page.totalCount", { count: totalCount })}
            </span>
          )}

          {/* Active filter indicator */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 bg-warning/10 border border-warning/20 text-warning text-xs font-bold px-3 py-1.5 rounded-full hover:bg-warning/20 transition-colors"
              title={t("page.clearFilters")}
            >
              <Filter size={12} />
              {t("page.filtered")}
              <X size={12} />
            </button>
          )}
        </div>
      </header>

      {/* ── Actions Bar ── */}
      <div
        className="px-4 sm:px-8 py-4 flex items-center justify-between animate-fadeIn"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-center gap-3">
          {/* Filter / Search Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilterOpen(true)}
          >
            <Filter size={16} />
            <span>{t("page.searchFilter")}</span>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {/* Add Purchase Order — only for InventoryStaff */}
          {isInventoryStaff && (
            <Button size="sm" onClick={() => {}}>
              <Plus size={16} />
              <span>{t("page.addOrder")}</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <main className="flex-1 overflow-auto px-4 sm:px-8 pb-6">
        {!loading && orders.length === 0 ? (
          <div className="h-full flex items-center justify-center py-24 animate-fadeIn">
            <EmptyState
              icon={<ShoppingCart size={36} className="text-text-muted" />}
              message={t("page.noOrders")}
              description={t("page.noOrdersDesc")}
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterOpen(true)}
                >
                  <Filter size={14} className="me-1" />
                  {t("page.trySearch")}
                </Button>
              }
            />
          </div>
        ) : (
          <div className="space-y-4">
            <PurchaseOrderTable orders={orders} loading={loading} />

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div
                className="animate-fadeIn"
                style={{ animationDelay: "200ms" }}
              >
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                  onPageChange={changePage}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Filter Modal ── */}
      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={applyFilters}
        activeFilters={activeFilters}
      />
    </Layout>
  );
}
