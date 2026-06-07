/**
 * @page DeliveryOrdersPage
 * @description Delivery Orders management page.
 * Uses real API pagination (20 per page).
 * Clicking a row navigates to the delivery order details page.
 * Visible only for Cashier and Manager users.
 */
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Truck, Clock } from "lucide-react";
import Layout from "@/shared/components/Layout";
import { EmptyState } from "@/shared/components/ui";
import Pagination from "@/shared/components/ui/Pagination";

import { useDeliveryOrders } from "../hooks/useDeliveryOrders";
import DeliveryOrderCard from "../components/DeliveryOrderCard";

export default function DeliveryOrdersPage() {
  const { t } = useTranslation("deliveryOrders");
  const navigate = useNavigate();

  const {
    orders,
    loading,
    page,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    changePage,
  } = useDeliveryOrders(20);

  /** Navigate to delivery order details */
  const handleOrderClick = (order) => {
    if (order.id != null) navigate(`/delivery-orders/${order.id}`);
  };

  return (
    <Layout>
      {/* ── Header ── */}
      <header className="shrink-0 bg-background-card border-b border-border-primary px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
            <Truck size={22} />
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
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold px-3 py-1.5 rounded-full">
              {t("page.totalCount", { count: totalCount })}
            </span>
          )}
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 overflow-auto px-4 sm:px-8 py-6">
        {!loading && orders.length === 0 ? (
          <div className="h-full flex items-center justify-center py-24 animate-fadeIn">
            <EmptyState
              icon={<Truck size={36} className="text-text-muted" />}
              message={t("page.noOrders")}
              description={t("page.noOrdersDesc")}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {/* Section label */}
              <div className="flex items-center gap-2 mb-2 animate-fadeIn">
                <Clock size={14} className="text-blue-500" />
                <span className="text-sm font-semibold text-text-secondary">
                  {t("page.outForDelivery")}
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
                    <DeliveryOrderCard
                      key={order.id || idx}
                      order={order}
                      delay={idx * 60}
                      onClick={() => handleOrderClick(order)}
                    />
                  ))}
                </div>
              )}
            </div>

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
    </Layout>
  );
}
