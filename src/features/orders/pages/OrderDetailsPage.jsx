/**
 * @page OrderDetailsPage
 * @description Displays full details of a single order.
 * Fetches data from GET /api/Orders/{id}.
 * Shows all order fields, order items (accordion), and stock batch allocations.
 * Read-only — no edit functionality.
 *
 * Architecture mirrors DeliveryOrderDetails for consistency.
 */
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ShoppingCart,
  Loader2,
  Package,
  Calendar,
  Hash,
  AlertCircle,
  DollarSign,
  User,
  CreditCard,
  Tag,
  Percent,
  Receipt,
  Layers,
  ChevronDown,
  Truck,
} from "lucide-react";
import Layout from "@/shared/components/Layout";
import { Button } from "@/shared/components/ui";
import { useRequest } from "@/shared/hooks/useRequest";
import { getOrderById } from "../api/getOrderById";
import {
  getStatusLabel,
  getStatusKey,
  getPaymentMethodLabel,
  getOrderTypeLabel,
} from "../services/orderService";

/* ─────────── Formatters ─────────── */

/** Format date with time */
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

/** Format percentage */
function formatPercent(val) {
  if (val == null) return "—";
  return `${Number(val).toFixed(2)}%`;
}

/* ─────────── Status Badge ─────────── */

/**
 * Status badge with color-coded pill styling.
 * Reuses the same enum-normalisation helpers from orderService.
 */
function StatusBadge({ status }) {
  const label = getStatusLabel(status);
  const key = getStatusKey(status);

  const statusMap = {
    0: "bg-warning/15 text-warning border-warning/25", // Draft
    1: "bg-primary-500/15 text-primary-500 border-primary-500/25", // OutForDelivery
    2: "bg-secondary-500/15 text-secondary-500 border-secondary-500/25", // Completed
    3: "bg-error/15 text-error border-error/25", // Cancelled
  };

  const style =
    statusMap[key] ||
    "bg-background-hover text-text-muted border-border-primary";

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border ${style}`}
    >
      {label}
    </span>
  );
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("orders");
  const { execute, loading } = useRequest(getOrderById);

  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());

  /** Toggle an order-item accordion (multi-expand) */
  const toggleItem = useCallback((itemKey) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) next.delete(itemKey);
      else next.add(itemKey);
      return next;
    });
  }, []);

  /* Fetch order on mount */
  useEffect(() => {
    if (!id) return;
    execute(id)
      .then((data) => setOrder(data))
      .catch((err) =>
        setError(err?.message || t("details.error")),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ── Loading State ── */
  if (loading && !order) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-text-muted">
            <Loader2 size={24} className="animate-spin text-primary-500" />
            <span className="text-sm">{t("details.loading")}</span>
          </div>
        </div>
      </Layout>
    );
  }

  /* ── Error State ── */
  if (error) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center">
            <AlertCircle size={32} className="text-error" />
          </div>
          <p className="text-sm text-text-muted">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft size={16} />
            {t("details.back")}
          </Button>
        </div>
      </Layout>
    );
  }

  /* ── No Data (fallback spinner) ── */
  if (!order) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center p-8">
          <Loader2 size={24} className="animate-spin text-primary-500" />
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
              onClick={() => navigate("/orders")}
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
                  {t("details.title")} #{order.id ?? order.orderId}
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
                <Hash size={16} className="text-primary-500" />
                <span className="text-sm font-semibold text-text-secondary">
                  {t("details.orderInformation")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* ID */}
                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-medium">
                    {t("details.orderId")}
                  </span>
                  <p className="text-sm font-bold text-text-primary font-mono">
                    #{order.id ?? order.orderId}
                  </p>
                </div>

                {/* Order Date */}
                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                    <Calendar size={12} />
                    {t("details.orderDate")}
                  </span>
                  <p className="text-sm font-bold text-text-primary">
                    {formatDate(order.orderDate)}
                  </p>
                </div>

                {/* Cashier Name */}
                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                    <User size={12} />
                    {t("details.cashier")}
                  </span>
                  <p className="text-sm font-bold text-text-primary">
                    {order.cashierName || "—"}
                  </p>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                    <Tag size={12} />
                    {t("details.status")}
                  </span>
                  <div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* Type */}
                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                    <Truck size={12} />
                    {t("details.type")}
                  </span>
                  <p className="text-sm font-bold text-text-primary">
                    {getOrderTypeLabel(order.type)}
                  </p>
                </div>

                {/* Payment Method */}
                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                    <CreditCard size={12} />
                    {t("details.paymentMethod")}
                  </span>
                  <div>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border bg-primary-500/10 text-primary-600 border-primary-500/20">
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Financial Summary ── */}
              <div className="mt-6 pt-5 border-t border-border-primary">
                <div className="flex items-center gap-2 mb-4">
                  <Receipt size={14} className="text-primary-500" />
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {t("details.financialSummary")}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Sub Total */}
                  <div className="space-y-1">
                    <span className="text-xs text-text-muted font-medium">
                      {t("details.subTotal")}
                    </span>
                    <p className="text-sm font-bold text-text-primary tabular-nums">
                      {formatCurrency(order.subTotal)}
                    </p>
                  </div>

                  {/* Discount Percentage */}
                  <div className="space-y-1">
                    <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                      <Percent size={10} />
                      {t("details.discountPercentage")}
                    </span>
                    <p className="text-sm font-bold text-text-primary tabular-nums">
                      {formatPercent(order.discountPercentage)}
                    </p>
                  </div>

                  {/* Discount Amount */}
                  <div className="space-y-1">
                    <span className="text-xs text-text-muted font-medium">
                      {t("details.discountAmount")}
                    </span>
                    <p className="text-sm font-bold text-text-primary tabular-nums">
                      {formatCurrency(order.discountAmount)}
                    </p>
                  </div>

                  {/* Tax Amount */}
                  <div className="space-y-1">
                    <span className="text-xs text-text-muted font-medium">
                      {t("details.taxAmount")}
                    </span>
                    <p className="text-sm font-bold text-text-primary tabular-nums">
                      {formatCurrency(order.taxAmount)}
                    </p>
                  </div>
                </div>

                {/* Final Total — Highlighted */}
                <div className="mt-4 pt-4 border-t border-border-primary/50 flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-secondary flex items-center gap-1.5">
                    <DollarSign size={14} className="text-primary-500" />
                    {t("details.finalTotal")}
                  </span>
                  <p className="text-xl font-bold text-primary-500 tabular-nums">
                    {formatCurrency(order.finalTotal)}
                  </p>
                </div>
              </div>
            </div>

            {/* ═══ ORDER ITEMS (Accordion) ═══ */}
            <div
              className="animate-fadeIn"
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Package size={16} className="text-primary-500" />
                <span className="text-sm font-semibold text-text-secondary">
                  {t("details.items")} ({items.length})
                </span>
              </div>

              {items.length === 0 ? (
                <div className="bg-background-card rounded-2xl border border-border-primary p-8 text-center">
                  <Package
                    size={32}
                    className="text-text-muted mx-auto mb-3"
                  />
                  <p className="text-sm text-text-muted">
                    {t("details.notFound")}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item, idx) => {
                    const itemKey = item.productId ?? item.id ?? idx;
                    const isExpanded = expandedItems.has(itemKey);

                    return (
                      <div
                        key={itemKey}
                        className="bg-background-card rounded-2xl border border-border-primary shadow-sm hover:shadow-md transition-all duration-300 animate-fadeIn overflow-hidden"
                        style={{ animationDelay: `${(idx + 3) * 80}ms` }}
                      >
                        {/* ── Accordion Header ── */}
                        <button
                          type="button"
                          onClick={() => toggleItem(itemKey)}
                          className={`
                            w-full flex items-center justify-between p-5 sm:p-6 text-left
                            transition-all duration-200 group
                            ${
                              isExpanded
                                ? "bg-primary-500/[0.04] border-b border-border-primary/40"
                                : "hover:bg-background-hover/60"
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`
                              w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200
                              ${
                                isExpanded
                                  ? "bg-gradient-to-br from-primary-500/20 to-primary-600/15 border border-primary-500/25"
                                  : "bg-gradient-to-br from-primary-500/15 to-primary-600/10 border border-primary-500/20 group-hover:scale-105"
                              }
                            `}
                            >
                              <Package
                                size={18}
                                className="text-primary-500"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-text-primary text-sm">
                                {item.productName ||
                                  `${t("details.productName")} #${item.productId ?? item.id}`}
                              </h3>
                              <span className="text-xs text-text-muted">
                                {t("details.quantity")}:{" "}
                                {item.quantity ?? "—"} ·{" "}
                                {formatCurrency(item.totalPrice)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs text-text-muted bg-background-hover px-2 py-1 rounded-lg font-mono">
                              #{item.productId ?? item.id}
                            </span>
                            <ChevronDown
                              size={18}
                              className={`text-text-muted transition-transform duration-300 ${
                                isExpanded
                                  ? "rotate-180 text-primary-500"
                                  : ""
                              }`}
                            />
                          </div>
                        </button>

                        {/* ── Accordion Content ── */}
                        <div
                          className={`
                          overflow-hidden transition-all duration-300 ease-in-out
                          ${
                            isExpanded
                              ? "max-h-[2000px] opacity-100"
                              : "max-h-0 opacity-0"
                          }
                        `}
                        >
                          {/* Item Details Grid */}
                          <div className="p-5 sm:p-6 pt-4 sm:pt-4">
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                              {/* Product ID */}
                              <div className="space-y-1">
                                <span className="text-xs text-text-muted font-medium">
                                  {t("details.productId")}
                                </span>
                                <p className="text-sm font-bold text-text-primary font-mono">
                                  #{item.productId ?? item.id}
                                </p>
                              </div>

                              {/* Product Name */}
                              <div className="space-y-1">
                                <span className="text-xs text-text-muted font-medium">
                                  {t("details.productName")}
                                </span>
                                <p className="text-sm font-bold text-text-primary">
                                  {item.productName || "—"}
                                </p>
                              </div>

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

                              {/* Total Price */}
                              <div className="space-y-1">
                                <span className="text-xs text-text-muted font-medium">
                                  {t("details.totalPrice")}
                                </span>
                                <p className="text-sm font-bold text-primary-500 tabular-nums">
                                  {formatCurrency(item.totalPrice)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* ── Stock Batch Allocations ── */}
                          {item.allocations &&
                            item.allocations.length > 0 && (
                              <div className="border-t border-border-primary bg-background-app/30 px-5 sm:px-6 py-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <Layers
                                    size={13}
                                    className="text-primary-400"
                                  />
                                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                                    {t("details.allocations")} (
                                    {item.allocations.length})
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  {item.allocations.map((alloc, aIdx) => (
                                    <div
                                      key={aIdx}
                                      className="bg-background-card rounded-xl border border-border-primary/60 p-3 sm:p-4"
                                    >
                                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                        {/* Stock Batch ID */}
                                        <div className="space-y-0.5">
                                          <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                                            {t("details.stockBatchId")}
                                          </span>
                                          <p className="text-xs font-bold text-text-primary font-mono">
                                            #{alloc.stockBatchId}
                                          </p>
                                        </div>

                                        {/* Quantity */}
                                        <div className="space-y-0.5">
                                          <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                                            {t("details.quantity")}
                                          </span>
                                          <p className="text-xs font-bold text-text-primary tabular-nums">
                                            {alloc.quantity}
                                          </p>
                                        </div>

                                        {/* Unit Price */}
                                        <div className="space-y-0.5">
                                          <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                                            {t("details.unitPrice")}
                                          </span>
                                          <p className="text-xs font-bold text-text-primary tabular-nums">
                                            {formatCurrency(alloc.unitPrice)}
                                          </p>
                                        </div>

                                        {/* Discount % */}
                                        <div className="space-y-0.5">
                                          <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                                            {t("details.discountPercentage")}
                                          </span>
                                          <p className="text-xs font-bold text-text-primary tabular-nums">
                                            {formatPercent(
                                              alloc.discountPercentage,
                                            )}
                                          </p>
                                        </div>

                                        {/* Final Price */}
                                        <div className="space-y-0.5">
                                          <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                                            {t("details.finalPrice")}
                                          </span>
                                          <p className="text-xs font-bold text-text-primary tabular-nums">
                                            {formatCurrency(alloc.finalPrice)}
                                          </p>
                                        </div>

                                        {/* Total */}
                                        <div className="space-y-0.5">
                                          <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                                            {t("details.totalPrice")}
                                          </span>
                                          <p className="text-xs font-bold text-primary-500 tabular-nums">
                                            {formatCurrency(alloc.total)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
