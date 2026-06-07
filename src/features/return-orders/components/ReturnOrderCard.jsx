/**
 * @component ReturnOrderCard
 * @description Card for displaying a return order in the list.
 * Shows id, originalOrderId, returnDate, reason, totalRefundAmount.
 */
import { useTranslation } from "react-i18next";
import { RotateCcw } from "lucide-react";

export default function ReturnOrderCard({ order, delay = 0, onClick }) {
  const { t } = useTranslation("returnOrders");

  const formattedDate = order.returnDate
    ? new Date(order.returnDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const formattedAmount =
    order.totalRefundAmount != null
      ? `$${Number(order.totalRefundAmount).toLocaleString("en-US", {
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
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/15 to-orange-600/10 border border-orange-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
          <RotateCcw size={16} className="text-orange-500" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-text-primary text-sm">
              #{order.id}
            </span>
            {order.reason && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-warning/15 text-warning border-warning/25">
                {order.reason}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
            <span>{formattedDate}</span>
            <span className="w-1 h-1 rounded-full bg-border-secondary" />
            <span>
              {t("card.originalOrder")}: #{order.originalOrderId}
            </span>
          </div>
        </div>

        {/* Total Refund */}
        <div className="text-end shrink-0">
          <span className="font-bold text-text-primary text-sm tabular-nums">
            {formattedAmount}
          </span>
          <p className="text-[10px] text-text-muted mt-0.5">{t("card.refund")}</p>
        </div>
      </div>
    </div>
  );
}
