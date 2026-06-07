/**
 * @component OrderCard
 * @description Clean stacked card for the initial "recent activity" view.
 * Displays order ID, status, type, cashier, payment method, date, and total.
 * Consistent with Purchase Orders RecentOrderCard styling.
 */
import { useTranslation } from "react-i18next";
import { ShoppingCart } from "lucide-react";
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

export default function OrderCard({ order, delay = 0, onClick }) {
    console.log("ORDER =", order);
  const { t } = useTranslation("orders");

  const formattedDate = order.orderDate
    ? new Date(order.orderDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const formattedTotal =
    order.finalTotal != null
      ? `$${Number(order.finalTotal).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "—";

  return (
    <div
      className="bg-background-card rounded-2xl border border-border-primary p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-primary-500/20 transition-all duration-300 group animate-fadeIn cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick?.(); }}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/15 to-primary-600/10 border border-primary-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
          <ShoppingCart size={16} className="text-primary-500" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-text-primary text-sm">
              #{order.orderId ?? order.id}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-text-muted flex-wrap">
            <span>{formattedDate}</span>
            {order.cashierName && (
              <>
                <span className="w-1 h-1 rounded-full bg-border-secondary" />
                <span className="truncate max-w-[120px]">
                  {order.cashierName}
                </span>
              </>
            )}
            <span className="w-1 h-1 rounded-full bg-border-secondary" />
            <span>{getOrderTypeLabel(order.type)}</span>
            <span className="w-1 h-1 rounded-full bg-border-secondary" />
            <span>{getPaymentMethodLabel(order.paymentMethod)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="text-end shrink-0">
          <span className="font-bold text-text-primary text-sm tabular-nums">
            {formattedTotal}
          </span>
        </div>
      </div>
    </div>
  );
}
