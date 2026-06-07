/**
 * @page PurchaseOrderDetails
 * @description Displays full details of a single purchase order.
 * Fetches data from GET /api/PurchaseOrders/{id}.
 * Shows order info (id, orderDate, supplierId, supplierName, status, finalTotal)
 * and all items (id, productId, productName, quantity, unitCost, expiryDate, totalPrice).
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ShoppingCart,
  Loader2,
  Package,
  Calendar,
  Truck,
  DollarSign,
  Hash,
  AlertCircle,
  Download,
} from "lucide-react";
import Layout from "@/shared/components/Layout";
import { Button } from "@/shared/components/ui";
import { useRequest } from "@/shared/hooks/useRequest";
import { getPurchaseOrderById } from "../api/getPurchaseOrderById";
import { downloadInvoice } from "../api/downloadInvoice";
import { toast } from "@/shared/store/toastStore";

/**
 * Status badge with color-coded pill styling
 */
function StatusBadge({ status }) {
  const statusMap = {
    Pending: "bg-warning/15 text-warning border-warning/25",
    Completed: "bg-secondary-500/15 text-secondary-500 border-secondary-500/25",
    Cancelled: "bg-error/15 text-error border-error/25",
    Approved: "bg-primary-500/15 text-primary-500 border-primary-500/25",
  };
  const style = statusMap[status] || "bg-background-hover text-text-muted border-border-primary";
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border ${style}`}>
      {status || "—"}
    </span>
  );
}

/** Format date */
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
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

export default function PurchaseOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("purchaseOrders");
  const { execute, loading } = useRequest(getPurchaseOrderById);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadInvoice = async () => {
    if (!id) return;
    setDownloading(true);
    try {
      const blob = await downloadInvoice(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success(t("details.downloadSuccess"));
    } catch {
      toast.error(t("details.downloadError"));
    } finally {
      setDownloading(false);
    }
  };

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
            <Loader2 size={24} className="animate-spin text-primary-500" />
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
          <Button variant="ghost" size="sm" onClick={() => navigate("/purchases")}>
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
          <Loader2 size={24} className="animate-spin text-primary-500" />
        </div>
      </Layout>
    );
  }

  const items = order.items || [];

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* ── Header ── */}
        <header className="shrink-0 bg-background-card border-b border-border-primary px-4 sm:px-8 py-5 shadow-sm animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/purchases")}
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
                    {t("details.title")} #{order.id}
                  </h1>
                  <p className="text-text-muted text-sm mt-0.5">
                    {t("details.subtitle")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <Button
                variant="primary"
                size="sm"
                loading={downloading}
                onClick={handleDownloadInvoice}
              >
                <Download size={16} />
                <span>{t("details.downloadInvoice")}</span>
              </Button>
            </div>
          </div>
        </header>

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="w-full px-4 sm:px-8 py-6 space-y-6 ">
            {/* ═══ ORDER INFO CARD ═══ */}
            <div
              className="bg-background-card rounded-2xl border border-border-primary p-5 sm:p-6 shadow-sm animate-fadeIn"
              style={{ animationDelay: "100ms" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Hash size={16} className="text-primary-500" />
                <span className="text-sm font-semibold text-text-secondary">
                  {t("details.orderInfo")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* ID */}
                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-medium">{t("details.id")}</span>
                  <p className="text-sm font-bold text-text-primary">#{order.id}</p>
                </div>

                {/* Order Date */}
                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                    <Calendar size={12} />
                    {t("details.orderDate")}
                  </span>
                  <p className="text-sm font-bold text-text-primary">{formatDate(order.orderDate)}</p>
                </div>

                {/* Supplier ID */}
                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-medium">{t("details.supplierId")}</span>
                  <p className="text-sm font-bold text-text-primary">{order.supplierId ?? "—"}</p>
                </div>

                {/* Supplier Name */}
                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                    <Truck size={12} />
                    {t("details.supplierName")}
                  </span>
                  <p className="text-sm font-bold text-text-primary">{order.supplierName || "—"}</p>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-medium">{t("details.status")}</span>
                  <div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* Final Total */}
                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                    <DollarSign size={12} />
                    {t("details.finalTotal")}
                  </span>
                  <p className="text-lg font-bold text-primary-500 tabular-nums">
                    {formatCurrency(order.finalTotal)}
                  </p>
                </div>
              </div>
            </div>

            {/* ═══ ORDER ITEMS ═══ */}
            <div
              className="animate-fadeIn"
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Package size={16} className="text-primary-500" />
                <span className="text-sm font-semibold text-text-secondary">
                  {t("details.orderItems")} ({items.length})
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
                      className="bg-background-card rounded-2xl border border-border-primary p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-primary-500/15 transition-all duration-300 animate-fadeIn group"
                      style={{ animationDelay: `${(idx + 3) * 80}ms` }}
                    >
                      {/* Item Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/15 to-primary-600/10 border border-primary-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                          <Package size={18} className="text-primary-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-text-primary text-sm truncate">
                            {item.productName || "—"}
                          </h3>
                          <span className="text-xs text-text-muted font-mono">
                            Product ID: {item.productId}
                          </span>
                        </div>
                        {/* Item ID */}
                        <span className="text-xs text-text-muted bg-background-hover px-2 py-1 rounded-lg font-mono">
                          #{item.id}
                        </span>
                      </div>

                      {/* Item Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {/* Quantity */}
                        <div className="space-y-1">
                          <span className="text-xs text-text-muted font-medium">{t("details.quantity")}</span>
                          <p className="text-sm font-bold text-text-primary tabular-nums">{item.quantity ?? "—"}</p>
                        </div>

                        {/* Unit Cost */}
                        <div className="space-y-1">
                          <span className="text-xs text-text-muted font-medium">{t("details.unitCost")}</span>
                          <p className="text-sm font-bold text-text-primary tabular-nums">{formatCurrency(item.unitCost)}</p>
                        </div>

                        {/* Expiry Date */}
                        <div className="space-y-1">
                          <span className="text-xs text-text-muted font-medium">{t("details.expiryDate")}</span>
                          <p className="text-sm font-bold text-text-primary">{formatDate(item.expiryDate)}</p>
                        </div>

                        {/* Total Price */}
                        <div className="space-y-1">
                          <span className="text-xs text-text-muted font-medium">{t("details.totalPrice")}</span>
                          <p className="text-sm font-bold text-primary-500 tabular-nums">{formatCurrency(item.totalPrice)}</p>
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
