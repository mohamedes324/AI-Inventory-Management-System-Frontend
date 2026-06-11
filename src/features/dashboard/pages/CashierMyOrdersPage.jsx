/**
 * @page CashierMyOrdersPage
 * @description Dedicated page showing all orders for the current cashier.
 * Accessible via "View All" from the Recent Orders section of the Cashier Dashboard.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ShoppingCart,
  RefreshCw,
} from "lucide-react";
import Layout from "@/shared/components/Layout";
import { Button, EmptyState } from "@/shared/components/ui";
import Pagination from "@/shared/components/ui/Pagination";
import OrderCard from "@/features/orders/components/OrderCard";
import { useRequest } from "@/shared/hooks/useRequest";
import { getOrders } from "@/features/orders/api/getOrders";
import { getUserIdFromToken } from "@/shared/utils/jwt";

const PAGE_SIZE = 10;

export default function CashierMyOrdersPage() {
  const { t } = useTranslation("orders");
  const navigate = useNavigate();
  const cashierId = getUserIdFromToken();

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const { execute, loading } = useRequest(getOrders);
  const executeRef = useRef(execute);
  executeRef.current = execute;

  const fetchOrders = useCallback(
    async (pageNum = 1) => {
      try {
        const data = await executeRef.current({
          CashierId: cashierId,
          Page: pageNum,
          PageSize: PAGE_SIZE,
          SortDescending: true,
        });
        setOrders(data.items || []);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount || 0);
        setHasNextPage(data.hasNextPage || false);
        setHasPreviousPage(data.hasPreviousPage || false);
      } catch {
        // Handled by useRequest
      }
    },
    [cashierId]
  );

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  const handlePageChange = (newPage) => {
    fetchOrders(newPage);
  };

  return (
    <Layout>
      {/* ── Header ── */}
      <header className="shrink-0 bg-background-card border-b border-border-primary px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-background-hover border border-border-primary hover:border-border-secondary transition-all duration-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/25 shrink-0">
              <ShoppingCart size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary tracking-tight">
                {t("cashierPages.myOrders.title", "My Orders")}
              </h1>
              <p className="text-text-muted text-sm mt-0.5">
                {t(
                  "cashierPages.myOrders.description",
                  "All orders you've handled"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {totalCount > 0 && !loading && (
            <span className="inline-flex items-center gap-1.5 bg-primary-500/10 border border-primary-500/20 text-primary-500 text-xs font-bold px-3 py-1.5 rounded-full">
              {t("page.totalCount", { count: totalCount })}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchOrders(page)}
          >
            <RefreshCw size={14} />
            <span>{t("page.refresh", "Refresh")}</span>
          </Button>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 overflow-auto px-4 sm:px-8 py-6">
        {!loading && orders.length === 0 ? (
          <div className="h-full flex items-center justify-center py-24 animate-fadeIn">
            <EmptyState
              icon={
                <ShoppingCart size={36} className="text-text-muted" />
              }
              message={t(
                "cashierPages.myOrders.empty",
                "No orders found"
              )}
              description={t(
                "cashierPages.myOrders.emptyDesc",
                "You haven't handled any orders yet."
              )}
            />
          </div>
        ) : loading ? (
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
          <div className="space-y-4">
            <div className="space-y-3">
              {orders.map((order, idx) => (
                <OrderCard
                  key={order.orderId ?? order.id ?? idx}
                  order={order}
                  delay={idx * 60}
                  onClick={() =>
                    navigate(`/orders/${order.orderId ?? order.id}`)
                  }
                />
              ))}
            </div>

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
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </Layout>
  );
}
