/**
 * @component OrderTable
 * @description Table displaying orders with Order ID, Status, Type, Cashier,
 * Payment Method, Date, and Final Total columns.
 * Consistent with PurchaseOrderTable styling.
 */
import { useTranslation } from "react-i18next";
import { Loader2, ShoppingCart } from "lucide-react";
import { getStatusLabel, getPaymentMethodLabel, getOrderTypeLabel, getStatusKey } from "../services/orderService";

/**
 * Status badge with color-coded pill styling
 */
function StatusBadge({ status }) {
  const label = getStatusLabel(status);
  const key = getStatusKey(status);

  const statusMap = {
    0: "bg-warning/15 text-warning border-warning/25",           // Draft
    1: "bg-primary-500/15 text-primary-500 border-primary-500/25", // OutForDelivery
    2: "bg-secondary-500/15 text-secondary-500 border-secondary-500/25", // Completed
    3: "bg-error/15 text-error border-error/25",                 // Cancelled
  };

  const style = statusMap[key] || "bg-background-hover text-text-muted border-border-primary";

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border ${style}`}>
      {label}
    </span>
  );
}

export default function OrderTable({ orders = [], loading = false, onOrderClick }) {
  const { t } = useTranslation("orders");

  if (loading) {
    return (
      <div className="bg-background-card rounded-2xl border border-border-primary overflow-hidden animate-fadeIn">
        <div className="p-8 flex items-center justify-center gap-3">
          <Loader2 size={20} className="animate-spin text-primary-500" />
          <span className="text-sm text-text-muted">{t("table.loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-card rounded-2xl border border-border-primary overflow-hidden shadow-sm animate-fadeIn">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-primary/50 bg-background-hover/30">
              <th className="text-start px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                {t("table.orderId")}
              </th>
              <th className="text-start px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                {t("table.status")}
              </th>
              <th className="text-start px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider hidden md:table-cell">
                {t("table.orderType")}
              </th>
              <th className="text-start px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider hidden lg:table-cell">
                {t("table.cashier")}
              </th>
              <th className="text-start px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider hidden md:table-cell">
                {t("table.paymentMethod")}
              </th>
              <th className="text-start px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                {t("table.orderDate")}
              </th>
              <th className="text-start px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                {t("table.finalTotal")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary/20">
            {orders.map((order, idx) => (
              <tr
                key={order.orderId || order.id || idx}
                className="transition-colors duration-200 group hover:bg-background-hover/30 cursor-pointer"
                onClick={() => onOrderClick?.(order)}
              >
                {/* Order ID */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold bg-primary-500/10 text-primary-500 border border-primary-500/20">
                      <ShoppingCart size={14} />
                    </div>
                    <span className="font-semibold text-text-primary">
                      #{order.orderId ?? order.id}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <StatusBadge status={order.status} />
                </td>

                {/* Order Type */}
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="text-text-secondary text-xs">
                    {getOrderTypeLabel(order.type)}
                  </span>
                </td>

                {/* Cashier */}
                <td className="px-5 py-4 hidden lg:table-cell">
                  <span className="text-text-secondary text-xs truncate block max-w-[180px]">
                    {order.cashierName || "—"}
                  </span>
                </td>

                {/* Payment Method */}
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="text-text-secondary text-xs">
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </span>
                </td>

                {/* Date */}
                <td className="px-5 py-4">
                  <span className="text-text-secondary text-xs">
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      : "—"}
                  </span>
                </td>

                {/* Final Total */}
                <td className="px-5 py-4">
                  <span className="font-bold text-text-primary tabular-nums">
                    {order.finalTotal != null
                      ? `$${Number(order.finalTotal).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                      : "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
