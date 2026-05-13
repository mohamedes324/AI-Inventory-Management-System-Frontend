/**
 * @component BatchCard
 * @description Clean outer accordion card — summary only.
 * Shows: Batch title, Quantity, Expiry Date, Status, Expand toggle.
 * No edit/delete — those live in BatchCardDetails.
 */
import { useTranslation } from "react-i18next";
import { ChevronDown, Calendar, Package, Layers } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import BatchStatusBadge from "./BatchStatusBadge";
import BatchCardDetails from "./BatchCardDetails";

export default function BatchCard({ batch, index, isOpen, onToggle, canManage, onEdit, onDelete }) {
  const { t } = useTranslation("stockBatches");

  return (
    <div
      className={`
        rounded-2xl overflow-hidden transition-all duration-300 animate-fadeIn
        ${isOpen
          ? "bg-background-card border border-primary-500/25 shadow-[0_0_20px_rgba(34,197,94,0.05)]"
          : "bg-background-card/60 border border-border-primary/50 hover:border-border-secondary hover:bg-background-card"
        }
      `}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* ── Summary row (always visible) ── */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-all duration-200 group cursor-pointer"
      >
        {/* Left: icon + title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={`
            w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
            ${isOpen
              ? "bg-primary-500/15 text-primary-400"
              : "bg-background-hover text-text-muted group-hover:text-primary-500"
            }
          `}>
            <Layers size={16} />
          </div>
          <span className="text-sm font-bold text-text-primary truncate">
            {t("batch.label", { number: index + 1 })}
          </span>
        </div>

        {/* Right: chips + badge + chevron */}
        <div className="flex items-center gap-2.5 shrink-0 ml-3">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-text-muted bg-background-hover/70 px-2 py-1 rounded-lg border border-border-primary/30">
            <Package size={11} className="opacity-50" />
            {batch.remainingQuantity}/{batch.originalQuantity}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-text-muted bg-background-hover/70 px-2 py-1 rounded-lg border border-border-primary/30">
            <Calendar size={11} className="opacity-50" />
            {formatDate(batch.expireDate, "short")}
          </span>
          <BatchStatusBadge batch={batch} />
          <div className={`
            w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300
            ${isOpen ? "text-primary-500" : "text-text-muted"}
          `}>
            <ChevronDown
              size={15}
              className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </button>

      {/* ── Expanded: BatchCardDetails (visually separate) ── */}
      <div
        className={`
          grid transition-all duration-300 ease-in-out
          ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
        `}
      >
        <div className="overflow-hidden">
          <BatchCardDetails
            batch={batch}
            canManage={canManage}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
