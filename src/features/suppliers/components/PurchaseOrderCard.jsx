/**
 * @component PurchaseOrderCard
 * @description Expandable accordion card for a single purchase order.
 * Collapsed: Order ID, Date, Status, Final Total, Supplier Name.
 * Expanded: Table of order items with product, quantity, unit cost, expiry, total.
 */
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  Hash,
  Calendar,
  DollarSign,
  Package,
  ShoppingCart,
} from "lucide-react";
import { formatDate } from "@/features/stock-batches/utils/formatDate";

/* ── Status badge color map ── */
const statusColors = {
  Pending: "bg-warning/10 text-warning border-warning/20",
  Approved: "bg-info/10 text-info border-info/20",
  Shipped: "bg-secondary-500/10 text-secondary-500 border-secondary-500/20",
  Delivered: "bg-primary-500/10 text-primary-500 border-primary-500/20",
  Cancelled: "bg-danger/10 text-danger border-danger/20",
};

function OrderStatusBadge({ status }) {
  const color = statusColors[status] || "bg-background-hover text-text-muted border-border-primary/30";
  return (
    <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${color}`}>
      {status}
    </span>
  );
}

export default function PurchaseOrderCard({ order, index, isOpen, onToggle }) {
  const { t } = useTranslation("suppliers");

  const items = order.items || order.purchaseOrderItems || [];

  return (
    <div
      className={`
        border rounded-xl overflow-hidden transition-all duration-300 animate-fadeIn
        ${isOpen
          ? "border-primary-500/30 shadow-[0_0_12px_rgba(34,197,94,0.06)]"
          : "border-border-primary/60 hover:border-border-secondary"
        }
      `}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* ── Collapsed Header ── */}
      <button
        type="button"
        onClick={onToggle}
        className={`
          w-full flex items-center justify-between px-4 py-3 text-left
          transition-all duration-200 group
          ${isOpen
            ? "bg-primary-500/[0.04]"
            : "hover:bg-background-hover/40"
          }
        `}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
            ${isOpen
              ? "bg-primary-500/15 text-primary-500"
              : "bg-background-hover text-text-muted group-hover:text-primary-500"
            }
          `}>
            <ShoppingCart size={14} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-text-primary">
                {t("purchaseOrders.orderLabel", { id: order.id })}
              </p>
              <span className="text-[11px] font-mono text-text-muted bg-background-hover/60 px-1.5 py-0.5 rounded border border-border-primary/40">
                #{order.id}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              {formatDate(order.orderDate)} · ${order.finalTotal?.toFixed(2) ?? "0.00"}
              {order.supplierName && ` · ${order.supplierName}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <OrderStatusBadge status={order.status} />
          <ChevronDown
            size={16}
            className={`text-text-muted transition-transform duration-300 ${isOpen ? "rotate-180 text-primary-500" : ""}`}
          />
        </div>
      </button>

      {/* ── Expanded Items Table ── */}
      <div className={`
        overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}
      `}>
        <div className="border-t border-border-primary/30 bg-background-app/30">
          {/* Order summary row */}
          <div className="px-4 py-3 flex flex-wrap gap-4 border-b border-border-primary/20">
            <div className="flex items-center gap-2">
              <Hash size={13} className="text-text-muted" />
              <span className="text-xs text-text-muted">{t("purchaseOrders.orderId")}:</span>
              <span className="text-xs font-bold text-text-primary">{order.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-text-muted" />
              <span className="text-xs text-text-muted">{t("purchaseOrders.orderDate")}:</span>
              <span className="text-xs font-bold text-text-primary">{formatDate(order.orderDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={13} className="text-text-muted" />
              <span className="text-xs text-text-muted">{t("purchaseOrders.finalTotal")}:</span>
              <span className="text-xs font-bold text-primary-500">${order.finalTotal?.toFixed(2) ?? "0.00"}</span>
            </div>
          </div>

          {/* Items */}
          {items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border-primary/30">
                    <th className="px-4 py-2.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">{t("purchaseOrders.items.product")}</th>
                    <th className="px-4 py-2.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">{t("purchaseOrders.items.quantity")}</th>
                    <th className="px-4 py-2.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">{t("purchaseOrders.items.unitCost")}</th>
                    <th className="px-4 py-2.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">{t("purchaseOrders.items.expiryDate")}</th>
                    <th className="px-4 py-2.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">{t("purchaseOrders.items.total")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-primary/20">
                  {items.map((item, i) => {
                    const productName = item.product?.name || item.productName || `Product #${item.productId}`;
                    const lineTotal = (item.quantity || 0) * (item.unitCost || 0);
                    return (
                      <tr key={item.id || i} className="hover:bg-background-hover/20 transition-colors">
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-secondary-500/10 text-secondary-500 flex items-center justify-center shrink-0">
                              <Package size={12} />
                            </div>
                            <span className="text-[13px] font-semibold text-text-primary truncate max-w-[160px]">{productName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-[13px] font-medium text-text-primary">{item.quantity ?? "—"}</td>
                        <td className="px-4 py-2.5 text-[13px] font-medium text-text-primary">${item.unitCost?.toFixed(2) ?? "—"}</td>
                        <td className="px-4 py-2.5 text-[13px] text-text-secondary">{formatDate(item.expiryDate || item.expireDate)}</td>
                        <td className="px-4 py-2.5 text-[13px] font-bold text-primary-500">${lineTotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6">
              <Package size={24} className="text-text-muted mx-auto mb-2 opacity-40" />
              <p className="text-xs text-text-muted">{t("purchaseOrders.noItems")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
