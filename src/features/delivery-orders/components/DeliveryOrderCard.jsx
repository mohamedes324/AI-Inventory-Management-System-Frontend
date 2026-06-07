/**
 * @component DeliveryOrderCard
 * @description Card for displaying a delivery order in the list.
 * Shows id, orderDate, cashierName, paymentMethod, finalTotal.
 */
import { useTranslation } from "react-i18next";
import { Truck } from "lucide-react";

export default function DeliveryOrderCard({ order, delay = 0, onClick }) {
  const { t } = useTranslation("deliveryOrders");

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
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
          <Truck size={16} className="text-blue-500" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-text-primary text-sm">
              #{order.id}
            </span>
            {order.paymentMethod && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-primary-500/10 text-primary-600 border-primary-500/20">
                {order.paymentMethod}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
            <span>{formattedDate}</span>
            <span className="w-1 h-1 rounded-full bg-border-secondary" />
            <span>{order.cashierName || "—"}</span>
          </div>
        </div>

        {/* Final Total */}
        <div className="text-end shrink-0">
          <span className="font-bold text-text-primary text-sm tabular-nums">
            {formattedTotal}
          </span>
          <p className="text-[10px] text-text-muted mt-0.5">{t("card.total")}</p>
        </div>
      </div>
    </div>
  );
}
