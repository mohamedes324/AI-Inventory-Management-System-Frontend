/**
 * @component PurchaseOrderItemCard
 * @description Card for a single purchase order line item.
 * Shows product name (read-only), quantity, unit cost, selling price, and expiry date.
 * Supplier is handled at the page level (one supplier for the whole order).
 *
 * Validation:
 * - Quantity: min 1, no negatives
 * - Unit Cost: min 0.01, no negatives
 * - Selling Price: optional, no negatives
 */
import { useTranslation } from "react-i18next";
import { Package, Trash2 } from "lucide-react";
import Input from "@/shared/components/ui/Input";

export default function PurchaseOrderItemCard({
  item,
  index,
  onChange,
  onRemove,
  errors = {},
}) {
  const { t } = useTranslation("purchaseOrders");

  const handleChange = (field, value) => {
    onChange(index, { ...item, [field]: value });
  };

  return (
    <div
      className="bg-background-card rounded-2xl border border-border-primary p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-primary-500/15 transition-all duration-300 animate-fadeIn group"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Header: Product Name + Remove */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/15 to-primary-600/10 border border-primary-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Package size={18} className="text-primary-500" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-sm">
              {item.productName}
            </h3>
            <span className="text-xs text-text-muted font-mono">
              {item.sku || `ID: ${item.productId}`}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(index)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-error hover:bg-error/10 border border-transparent hover:border-error/20 transition-all duration-200"
          title={t("addOrder.removeItem")}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Quantity */}
        <div>
          <Input
            label={t("addOrder.quantity")}
            type="number"
            placeholder="1"
            min="1"
            step="1"
            value={item.quantity}
            onChange={(e) => {
              const val = e.target.value;
              // Allow empty (for clearing) or positive integers >= 1
              if (val === "" || Number(val) >= 0) handleChange("quantity", val);
            }}
            onBlur={() => {
              // Enforce min=1 on blur if value is set but below 1
              if (item.quantity !== "" && Number(item.quantity) < 1) {
                handleChange("quantity", "1");
              }
            }}
            error={errors.quantity}
            status={errors.quantity ? "error" : "default"}
          />
        </div>

        {/* Unit Cost */}
        <div>
          <Input
            label={t("addOrder.unitCost")}
            type="number"
            placeholder="0.00"
            min="0.01"
            step="0.01"
            value={item.unitCost}
            onChange={(e) => {
              const val = e.target.value;
              // Allow empty (for clearing) or non-negative values
              if (val === "" || Number(val) >= 0) handleChange("unitCost", val);
            }}
            onBlur={() => {
              // Enforce min on blur
              if (item.unitCost !== "" && Number(item.unitCost) < 0.01) {
                handleChange("unitCost", "0.01");
              }
            }}
            error={errors.unitCost}
            status={errors.unitCost ? "error" : "default"}
          />
        </div>

        {/* Selling Price (optional) */}
        <div>
          <Input
            label={
              <div className="flex items-center gap-1">
                <span>{t("addOrder.sellingPrice")}</span>
                <p className="text-xs text-gray-500">
                  {t("addOrder.Optional")}
                </p>
              </div>
            }
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={item.sellingPrice || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || Number(val) >= 0)
                handleChange("sellingPrice", val);
            }}
            onBlur={() => {
              if (
                item.sellingPrice !== "" &&
                item.sellingPrice != null &&
                Number(item.sellingPrice) < 0
              ) {
                handleChange("sellingPrice", "");
              }
            }}
          />
        </div>

        {/* Expiry Date */}
        <div>
          <Input
            label={t("addOrder.expiryDate")}
            type="date"
            value={item.expiryDate}
            onChange={(e) => handleChange("expiryDate", e.target.value)}
            error={errors.expiryDate}
            status={errors.expiryDate ? "error" : "default"}
          />
        </div>

        {/* Discount Percentage */}
        <div>
          <Input
            label={t("addOrder.discountPercentage")}
            type="number"
            placeholder="0"
            min="0"
            max="100"
            step="0.01"
            value={item.discountPercentage ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || (Number(val) >= 0 && Number(val) <= 100))
                handleChange("discountPercentage", val);
            }}
            onBlur={() => {
              if (
                item.discountPercentage !== "" &&
                item.discountPercentage != null
              ) {
                const num = Number(item.discountPercentage);
                if (num < 0) handleChange("discountPercentage", "0");
                if (num > 100) handleChange("discountPercentage", "100");
              }
            }}
            error={errors.discountPercentage}
            status={errors.discountPercentage ? "error" : "default"}
          />
        </div>
      </div>

      {/* Item Total Preview */}
      {item.quantity &&
        item.unitCost &&
        Number(item.quantity) > 0 &&
        Number(item.unitCost) > 0 && (
          <div className="mt-4 pt-4 border-t border-border-primary/30 flex items-center justify-between animate-fadeIn">
            <span className="text-xs text-text-muted font-medium">
              {t("addOrder.lineTotal")}
            </span>
            <span className="text-sm font-bold text-primary-500 tabular-nums">
              $
              {(Number(item.quantity) * Number(item.unitCost)).toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )}
            </span>
          </div>
        )}
    </div>
  );
}
