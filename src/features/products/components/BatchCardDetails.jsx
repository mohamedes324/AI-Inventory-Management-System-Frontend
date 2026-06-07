/**
 * @component BatchCardDetails
 * @description Expanded details panel for a stock batch.
 * Visually separate from the outer BatchCard.
 * Contains: Quantity, Unit Cost, Purchase Date, Expiry Date, Supplier, Discount Percentage.
 * Edit/Delete actions live here only.
 */
import { useTranslation } from "react-i18next";
import {
  Calendar, DollarSign, Package, Truck, Percent, Pencil, Trash2,
} from "lucide-react";
import { formatDate } from "../utils/formatDate";

function DetailTile({ icon: Icon, iconBg, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-background-hover/40 rounded-xl px-3.5 py-3 border border-border-primary/20">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={14} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium leading-none mb-1">
          {label}
        </p>
        <p className="text-[13px] font-bold text-text-primary truncate">{value}</p>
      </div>
    </div>
  );
}

export default function BatchCardDetails({ batch, canManage = false, onEdit, onDelete }) {
  const { t } = useTranslation("stockBatches");

  return (
    <div className="mx-4 mb-4 rounded-xl bg-background-app/60 border border-border-primary/25 p-4 animate-fadeIn">
      {/* Detail tiles grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        <DetailTile
          icon={Package}
          iconBg="bg-primary-500/10 text-primary-400"
          label={t("batch.quantity")}
          value={`${batch.remainingQuantity} / ${batch.originalQuantity}`}
        />
        <DetailTile
          icon={DollarSign}
          iconBg="bg-secondary-500/10 text-secondary-400"
          label={t("batch.unitCost")}
          value={`$${batch.unitCost?.toFixed(2) ?? "—"}`}
        />
        <DetailTile
          icon={Calendar}
          iconBg="bg-info/10 text-info"
          label={t("batch.purchaseDate")}
          value={formatDate(batch.purchaseDate)}
        />
        <DetailTile
          icon={Calendar}
          iconBg="bg-warning/10 text-warning"
          label={t("batch.expiryDate")}
          value={formatDate(batch.expireDate)}
        />
        <DetailTile
          icon={Truck}
          iconBg="bg-gray-500/10 text-gray-400"
          label={t("batch.supplier")}
          value={batch.supplierId ? `Supplier #${batch.supplierId}` : "—"}
        />
        <DetailTile
          icon={Percent}
          iconBg="bg-secondary-500/10 text-secondary-400"
          label={t("batch.discountPercentage")}
          value={`${batch.discountPercentage ?? 0}%`}
        />
      </div>

      {/* Actions — only inside details */}
      {canManage && (
        <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-border-primary/20">
          <button
            type="button"
            onClick={() => onEdit?.(batch)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-primary-500 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/20 rounded-xl transition-all"
          >
            <Pencil size={13} />
            {t("actions.edit")}
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(batch)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-error bg-error/10 hover:bg-error/20 border border-error/20 rounded-xl transition-all"
          >
            <Trash2 size={13} />
            {t("actions.delete")}
          </button>
        </div>
      )}
    </div>
  );
}
