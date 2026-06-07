/**
 * @component OrderItemCard
 * @description Enhanced item card for the Add Order page.
 * Shows product name, editable quantity, unit price, prominent total price,
 * delete icon, and collapsible allocation accordion.
 */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Package,
  Trash2,
  ChevronDown,
  Layers,
} from "lucide-react";

function formatCurrency(val) {
  if (val == null) return "$0.00";
  return `$${Number(val).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatPercent(val) {
  if (val == null) return "0%";
  return `${Number(val).toFixed(2)}%`;
}

export default function OrderItemCard({
  item,
  index,
  expandedItems,
  onToggle,
  onQuantityChange,
  onDelete,
}) {
  const { t } = useTranslation("orders");
  const itemKey = item.productId ?? item.id ?? index;
  const isExpanded = expandedItems.has(itemKey);
  const allocations = item.allocations || [];

  const [localQty, setLocalQty] = useState(item.quantity ?? 1);

  // Sync state if item quantity prop changes
  useEffect(() => {
    setLocalQty(item.quantity ?? 1);
  }, [item.quantity]);

  return (
    <div
      onClick={() => onToggle?.(itemKey)}
      className="bg-background-card rounded-2xl border border-border-primary shadow-sm hover:shadow-md transition-all duration-300 animate-fadeIn overflow-hidden cursor-pointer hover:border-border-secondary"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* ── Item Content ── */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Icon + Info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/15 to-primary-600/10 border border-primary-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Package size={18} className="text-primary-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-text-primary text-sm truncate mb-2">
                {item.productName || `Product #${item.productId}`}
              </h3>

              {/* Quantity + Unit Price row */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Editable Quantity */}
                <div
                  className="flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                    {t("addOrder.qty")}:
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={localQty}
                    onChange={(e) => setLocalQty(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const val = parseInt(localQty, 10);
                        if (!isNaN(val) && val >= 1) {
                          onQuantityChange?.(itemKey, val);
                          e.target.blur();
                        }
                      }
                    }}
                    className="w-16 h-8 text-center text-xs font-bold text-text-primary bg-background-input border border-border-primary rounded-lg outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                {/* Unit Price */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                    {t("addOrder.unitPriceLabel")}:
                  </span>
                  <span className="text-xs font-bold text-text-primary tabular-nums">
                    {formatCurrency(item.unitPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Total Price + Actions */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            {/* Prominent Total Price */}
            <div className="text-right">
              <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider block mb-0.5">
                {t("details.totalPrice")}
              </span>
              <span className="text-xl font-extrabold text-primary-500 tabular-nums leading-tight">
                {formatCurrency(item.totalPrice)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5">
              {/* Delete */}
              <button
                type="button"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-text-muted hover:text-error hover:bg-error/10 border border-transparent hover:border-error/20 transition-all duration-200"
                title="Delete item"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(item.productId ?? itemKey);
                }}
              >
                <Trash2 size={15} />
              </button>

              {/* Expand allocations chevron */}
              {allocations.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(itemKey);
                  }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-text-muted hover:text-primary-500 hover:bg-primary-500/10 border border-transparent hover:border-primary-500/20 transition-all duration-200"
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      isExpanded ? "rotate-180 text-primary-500" : ""
                    }`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Allocations Accordion ── */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {allocations.length > 0 && (
          <div className="border-t border-border-primary bg-background-app/30 px-5 sm:px-6 py-4">
            <div className="flex items-center gap-2 mb-3">
              <Layers size={13} className="text-primary-400" />
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                {t("details.allocations")} ({allocations.length})
              </span>
            </div>

            <div className="space-y-2">
              {allocations.map((alloc, aIdx) => (
                <div
                  key={aIdx}
                  className="bg-background-card rounded-xl border border-border-primary/60 p-3 sm:p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-primary-500 bg-primary-500/10 border border-primary-500/20 px-2 py-0.5 rounded-lg font-mono">
                      Batch #{alloc.stockBatchId}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                        {t("details.quantity")}
                      </span>
                      <p className="text-xs font-bold text-text-primary tabular-nums">
                        {alloc.quantity}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                        {t("details.unitPrice")}
                      </span>
                      <p className="text-xs font-bold text-text-primary tabular-nums">
                        {formatCurrency(alloc.unitPrice)}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                        {t("details.discountPercentage")}
                      </span>
                      <p className="text-xs font-bold text-text-primary tabular-nums">
                        {formatPercent(alloc.discountPercentage)}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                        {t("details.finalPrice")}
                      </span>
                      <p className="text-xs font-bold text-text-primary tabular-nums">
                        {formatCurrency(alloc.finalPrice)}
                      </p>
                    </div>
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
}
