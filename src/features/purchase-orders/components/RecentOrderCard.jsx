/**
 * @component RecentOrderCard
 * @description Clean stacked card for the initial "recent activity" view.
 * Displays order ID, date, supplier, status, and total with good spacing
 * and premium styling. Supports click to navigate to details.
 */
import { useTranslation } from "react-i18next";
import { ShoppingCart } from "lucide-react";

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
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border ${style}`}>
      {status || "—"}
    </span>
  );
}

export default function RecentOrderCard({ order, delay = 0, onClick }) {
  const { t } = useTranslation("purchaseOrders");

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
              #{order.purchaseOrderId ?? order.id}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
            <span>{formattedDate}</span>
            {order.supplierName && (
              <>
                <span className="w-1 h-1 rounded-full bg-border-secondary" />
                <span className="truncate max-w-[160px]">
                  {order.supplierName}
                </span>
              </>
            )}
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
