/**
 * @component ProductInfoCard
 * @description Card displaying detailed product information on the details page.
 * Shows SKU, price, stock quantity, reorder point, and category.
 */
import { useTranslation } from "react-i18next";
import { Tag, DollarSign, Boxes, RotateCcw, FolderOpen } from "lucide-react";

function InfoRow({ icon: Icon, iconColor, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border-primary/30 last:border-b-0">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-text-muted uppercase tracking-wider font-medium">{label}</p>
        <p className="text-sm font-semibold text-text-primary mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function ProductInfoCard({ product, className = "" }) {
  const { t } = useTranslation("products");
  if (!product) return null;

  return (
    <div className={`bg-background-card rounded-2xl border border-border-primary shadow-sm overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-border-primary/50">
        <h3 className="text-base font-bold text-text-primary">{t("details.infoTitle")}</h3>
        <p className="text-xs text-text-muted mt-0.5">{t("details.infoSubtitle")}</p>
      </div>

      <div className="px-6 py-2">
        <InfoRow
          icon={Tag}
          iconColor="bg-primary-500/10 text-primary-500"
          label={t("fields.sku")}
          value={product.sku}
        />
        <InfoRow
          icon={DollarSign}
          iconColor="bg-secondary-500/10 text-secondary-500"
          label={t("fields.price")}
          value={`$${product.sellingPrice?.toFixed(2)}`}
        />
        <InfoRow
          icon={Boxes}
          iconColor="bg-info-bg text-info-text"
          label={t("details.stockQuantity")}
          value={product.stockQuantity}
        />
        <InfoRow
          icon={RotateCcw}
          iconColor="bg-warning/10 text-warning"
          label={t("fields.reorderPoint")}
          value={product.reorderPoint}
        />
        <InfoRow
          icon={FolderOpen}
          iconColor="bg-primary-500/10 text-primary-500"
          label={t("fields.category")}
          value={product.category?.name || "—"}
        />
      </div>
    </div>
  );
}
