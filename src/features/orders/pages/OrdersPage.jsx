/**
 * @page OrdersPage
 * @description Orders management page.
 * Uses real API pagination (10 per page) for all views.
 * "Add Order" button visible as placeholder (no action).
 * Layout consistent with PurchasesPage.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Plus, Filter, X, Clock } from "lucide-react";
import Layout from "@/shared/components/Layout";
import { Button, EmptyState } from "@/shared/components/ui";
import Pagination from "@/shared/components/ui/Pagination";

import { useOrders } from "../hooks/useOrders";
import OrderTable from "../components/OrderTable";
import OrderCard from "../components/OrderCard";
import FilterModal from "../components/FilterModal";

export default function OrdersPage() {
  const { t } = useTranslation("orders");
  const navigate = useNavigate();
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
  } = useOrders(10);

  const handleOrderClick = (order) => {
    if (order.status === "Draft") {
      navigate("/orders/new", {
        state: {
          draftOrderId: order.orderId ?? order.id,
        },
      });
      return;
    }

    if (order.status === "OutForDelivery") {
      navigate(`/delivery-orders/${order.id}`);
      return;
    }

    navigate(`/orders/${order.orderId ?? order.id}`);
  };

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
          <Button variant="ghost" size="sm" onClick={() => setFilterOpen(true)}>
            <Filter size={16} />
            <span>{t("page.searchFilter")}</span>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {/* Add Order — placeholder button (no action) */}
          <Button size="sm" onClick={() => navigate("/orders/new")}>
            <Plus size={16} />
            <span>{t("page.addOrder")}</span>
          </Button>
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
        ) : isFiltered ? (
          /* ── Filtered View: Table + Pagination ── */
          <div className="space-y-4">
            <OrderTable
              orders={orders}
              loading={loading}
              onOrderClick={handleOrderClick}
            />

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
        ) : (
          /* ── Default View: Recent Activity Cards + Pagination ── */
          <div className="space-y-4">
            <div className="space-y-3">
              {/* Section label */}
              <div className="flex items-center gap-2 mb-2 animate-fadeIn">
                <Clock size={14} className="text-primary-500" />
                <span className="text-sm font-semibold text-text-secondary">
                  {t("page.recentOrders")}
                </span>
              </div>

              {loading ? (
                /* Skeleton cards */
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-background-card rounded-2xl border border-border-primary p-5 animate-shimmer"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-background-hover" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-24 rounded bg-background-hover" />
                          <div className="h-2.5 w-36 rounded bg-background-hover" />
                        </div>
                        <div className="h-4 w-16 rounded bg-background-hover" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order, idx) => (
                    <OrderCard
                      key={order.orderId || idx}
                      order={order}
                      delay={idx * 60}
                      onClick={() => handleOrderClick(order)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── Pagination (always shown when multiple pages) ── */}
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
