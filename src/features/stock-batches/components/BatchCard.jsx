/**
 * @component BatchCard
 * @description Expandable batch card showing real API fields:
 * Batch ID, Original Qty, Remaining Qty, Unit Cost, Purchase Date, Expiry Date.
 * Quantity shown as "remaining / original" format.
 */
import { useTranslation } from "react-i18next";
import { ChevronDown, Hash, Calendar, DollarSign, Boxes, Package } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import BatchStatusBadge from "./BatchStatusBadge";

function InfoCell({ icon: Icon, iconColor, label, value }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconColor}`}>
        <Icon size={14} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium leading-none mb-1">{label}</p>
        <p className="text-[13px] font-bold text-text-primary truncate">{value}</p>
      </div>
    </div>
  );
}

export default function BatchCard({ batch, index, isOpen, onToggle }) {
  const { t } = useTranslation("stockBatches");

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
      {/* ── Header ── */}
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
        <div className="flex items-center gap-3">
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
            ${isOpen
              ? "bg-primary-500/15 text-primary-500"
              : "bg-background-hover text-text-muted group-hover:text-primary-500"
            }
          `}>
            <Boxes size={14} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-text-primary">
                {t("batch.label", { number: index + 1 })}
              </p>
              <span className="text-[11px] font-mono text-text-muted bg-background-hover/60 px-1.5 py-0.5 rounded border border-border-primary/40">
                #{batch.id}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              {batch.remainingQuantity} / {batch.originalQuantity} {t("batch.units")} · {formatDate(batch.expireDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <BatchStatusBadge batch={batch} />
          <ChevronDown
            size={16}
            className={`text-text-muted transition-transform duration-300 ${isOpen ? "rotate-180 text-primary-500" : ""}`}
          />
        </div>
      </button>

      {/* ── Expandable Content ── */}
      <div className={`
        overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}
      `}>
        <div className="px-4 py-4 border-t border-border-primary/30 bg-background-app/30">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Remaining / Original */}
            <InfoCell
              icon={Package}
              iconColor="bg-primary-500/10 text-primary-500"
              label={t("batch.quantity")}
              value={`${batch.remainingQuantity} / ${batch.originalQuantity}`}
            />

            {/* Unit Cost */}
            <InfoCell
              icon={DollarSign}
              iconColor="bg-secondary-500/10 text-secondary-500"
              label={t("batch.unitCost")}
              value={`$${batch.unitCost?.toFixed(2) ?? "—"}`}
            />

            {/* Batch ID */}
            <InfoCell
              icon={Hash}
              iconColor="bg-gray-500/10 text-gray-400"
              label={t("batch.batchId")}
              value={`#${batch.id}`}
            />

            {/* Purchase Date */}
            <InfoCell
              icon={Calendar}
              iconColor="bg-info/10 text-info"
              label={t("batch.purchaseDate")}
              value={formatDate(batch.purchaseDate)}
            />

            {/* Expiry Date */}
            <InfoCell
              icon={Calendar}
              iconColor="bg-warning/10 text-warning"
              label={t("batch.expiryDate")}
              value={formatDate(batch.expireDate)}
            />

            {/* Supplier ID */}
            <InfoCell
              icon={Boxes}
              iconColor="bg-gray-500/10 text-gray-400"
              label={t("batch.supplier")}
              value={batch.supplierId ? `#${batch.supplierId}` : "—"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
