/**
 * @page ReturnOrderDetails
 * @description Displays full details of a single return order.
 * Fetches data from GET /api/return-orders/{id}.
 * Shows all fields: id, originalOrderId, cashierId, returnDate, reason, totalRefundAmount
 * and all items: id, productId, quantity, unitPrice, refundAmount, newExpiryDate.
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  RotateCcw,
  Loader2,
  Package,
  Calendar,
  Hash,
  AlertCircle,
  DollarSign,
  User,
  FileText,
} from "lucide-react";
import Layout from "@/shared/components/Layout";
import { Button } from "@/shared/components/ui";
import { useRequest } from "@/shared/hooks/useRequest";
import { getReturnOrderById } from "../api/getReturnOrderById";

/** Format date */
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Format currency */
function formatCurrency(val) {
  if (val == null) return "—";
  return `$${Number(val).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function ReturnOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("returnOrders");
  const { execute, loading } = useRequest(getReturnOrderById);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    execute(id)
      .then((data) => setOrder(data))
      .catch((err) => setError(err?.message || t("toasts.fetchError")));
  }, [id]);

  // ── Loading State ──
  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-text-muted">
            <Loader2 size={24} className="animate-spin text-orange-500" />
            <span className="text-sm">{t("details.loading")}</span>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Error State ──
  if (error) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center">
            <AlertCircle size={32} className="text-error" />
          </div>
          <p className="text-sm text-text-muted">{error}</p>
          <Button variant="ghost" size="sm" onClick={() => navigate("/return-orders")}>
            <ArrowLeft size={16} />
            {t("details.backToList")}
          </Button>
        </div>
      </Layout>
    );
  }

  // ── No Data ──
  if (!order) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center p-8">
          <Loader2 size={24} className="animate-spin text-orange-500" />
        </div>
      </Layout>
    );
  }

  const items = order.items || [];

  return (
    <Layout>
      <div className="flex flex-col h-full min-h-0">
        {/* ── Header ── */}
        <header className="shrink-0 bg-background-card border-b border-border-primary px-4 sm:px-8 py-5 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/return-orders")}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-background-hover border border-border-primary hover:border-border-secondary transition-all duration-200"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 shrink-0">
                <RotateCcw size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary tracking-tight">
                  {t("details.title")} #{order.id}
                </h1>
                <p className="text-text-muted text-sm mt-0.5">
                  {t("details.subtitle")}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-4 sm:px-8 py-6 space-y-6 max-w-10xl">
            {/* ═══ ORDER INFO CARD ═══ */}
            <div
              className="bg-background-card rounded-2xl border border-border-primary p-5 sm:p-6 shadow-sm animate-fadeIn"
              style={{ animationDelay: "100ms" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Hash size={16} className="text-orange-500" />
                <span className="text-sm font-semibold text-text-secondary">
                  {t("details.orderInfo")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* ID */}
                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-medium">
                    {t("details.id")}
                  </span>
                  <p className="text-sm font-bold text-text-primary">#{order.id}</p>
                </div>

                {/* Original Order ID */}
                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                    <Hash size={12} />
                    {t("details.originalOrderId")}
                  </span>
                  <p className="text-sm font-bold text-text-primary">
                    #{order.originalOrderId}
                  </p>
                </div>

                {/* Cashier ID */}
                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                    <User size={12} />
                    {t("details.cashierId")}
                  </span>
                  <p className="text-xs font-bold text-text-primary font-mono break-all">
                    {order.cashierId || "—"}
                  </p>
                </div>

                {/* Return Date */}
                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                    <Calendar size={12} />
                    {t("details.returnDate")}
                  </span>
                  <p className="text-sm font-bold text-text-primary">
                    {formatDate(order.returnDate)}
                  </p>
                </div>

                {/* Reason */}
                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                    <FileText size={12} />
                    {t("details.reason")}
                  </span>
                  <div>
                    {order.reason ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border bg-warning/15 text-warning border-warning/25">
                        {order.reason}
                      </span>
                    ) : (
                      <p className="text-sm font-bold text-text-muted">—</p>
                    )}
                  </div>
                </div>

                {/* Total Refund */}
                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                    <DollarSign size={12} />
                    {t("details.totalRefundAmount")}
                  </span>
                  <p className="text-lg font-bold text-orange-500 tabular-nums">
                    {formatCurrency(order.totalRefundAmount)}
                  </p>
                </div>
              </div>
            </div>

            {/* ═══ RETURN ITEMS ═══ */}
            <div
              className="animate-fadeIn"
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Package size={16} className="text-orange-500" />
                <span className="text-sm font-semibold text-text-secondary">
                  {t("details.returnItems")} ({items.length})
                </span>
              </div>

              {items.length === 0 ? (
                <div className="bg-background-card rounded-2xl border border-border-primary p-8 text-center">
                  <Package size={32} className="text-text-muted mx-auto mb-3" />
                  <p className="text-sm text-text-muted">{t("details.noItems")}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="bg-background-card rounded-2xl border border-border-primary p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-orange-500/15 transition-all duration-300 animate-fadeIn group"
                      style={{ animationDelay: `${(idx + 3) * 80}ms` }}
                    >
                      {/* Item Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/15 to-orange-600/10 border border-orange-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                          <Package size={18} className="text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-text-primary text-sm">
                            {t("details.itemLabel")} #{item.id}
                          </h3>
                          <span className="text-xs text-text-muted font-mono">
                            {t("details.productId")}: {item.productId}
                          </span>
                        </div>
                        {/* Item ID badge */}
                        <span className="text-xs text-text-muted bg-background-hover px-2 py-1 rounded-lg font-mono">
                          #{item.id}
                        </span>
                      </div>

                      {/* Item Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {/* Quantity */}
                        <div className="space-y-1">
                          <span className="text-xs text-text-muted font-medium">
                            {t("details.quantity")}
                          </span>
                          <p className="text-sm font-bold text-text-primary tabular-nums">
                            {item.quantity ?? "—"}
                          </p>
                        </div>

                        {/* Unit Price */}
                        <div className="space-y-1">
                          <span className="text-xs text-text-muted font-medium">
                            {t("details.unitPrice")}
                          </span>
                          <p className="text-sm font-bold text-text-primary tabular-nums">
                            {formatCurrency(item.unitPrice)}
                          </p>
                        </div>

                        {/* Refund Amount */}
                        <div className="space-y-1">
                          <span className="text-xs text-text-muted font-medium">
                            {t("details.refundAmount")}
                          </span>
                          <p className="text-sm font-bold text-orange-500 tabular-nums">
                            {formatCurrency(item.refundAmount)}
                          </p>
                        </div>

                        {/* New Expiry Date */}
                        <div className="space-y-1">
                          <span className="text-xs text-text-muted font-medium">
                            {t("details.newExpiryDate")}
                          </span>
                          <p className="text-sm font-bold text-text-primary">
                            {formatDate(item.newExpiryDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
