/**
 * @component EditBatchModal
 * @description Modal for editing stock batch fields:
 * Expiry Date, Remaining Quantity, Unit Cost.
 * Sends PUT /api/StockBatches/{id} with ISO date format.
 */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Pencil, Calendar, Package, DollarSign, Percent } from "lucide-react";
import { Input, Button } from "@/shared/components/ui";

export default function EditBatchModal({ isOpen, onClose, onSubmit, loading, batch }) {
  const { t } = useTranslation("stockBatches");
  const [expiryDate, setExpiryDate] = useState("");
  const [remainingQuantity, setRemainingQuantity] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && batch) {
      // Convert ISO date to YYYY-MM-DD for date input
      const expiry = batch.expireDate ? new Date(batch.expireDate).toISOString().split("T")[0] : "";
      setExpiryDate(expiry);
      setRemainingQuantity(batch.remainingQuantity?.toString() || "");
      setUnitCost(batch.unitCost?.toString() || "");
      setDiscountPercentage(batch.discountPercentage?.toString() || "0");
    }
    if (!isOpen) {
      setExpiryDate("");
      setRemainingQuantity("");
      setUnitCost("");
      setDiscountPercentage("");
      setErrors({});
    }
  }, [isOpen, batch]);

  const validate = () => {
    const errs = {};
    if (!expiryDate) errs.expiryDate = t("validation.expiryRequired");
    if (!remainingQuantity || Number(remainingQuantity) < 0) errs.remainingQuantity = t("validation.quantityRequired");
    if (!unitCost || Number(unitCost) <= 0) errs.unitCost = t("validation.costRequired");
    if (discountPercentage !== "" && discountPercentage != null) {
      const disc = Number(discountPercentage);
      if (isNaN(disc) || disc < 0 || disc > 100) errs.discountPercentage = t("validation.discountInvalid");
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Convert date to ISO format for the API
    const isoDate = new Date(expiryDate).toISOString();

    onSubmit(batch.id, {
      expireDate: isoDate,
      remainingQuantity: Number(remainingQuantity),
      unitCost: Number(unitCost),
      discountPercentage: discountPercentage !== "" && discountPercentage != null
        ? Number(discountPercentage)
        : 0,
    });
  };

  if (!isOpen || !batch) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background-app/70 backdrop-blur-sm animate-fadeIn p-4"
      onClick={onClose}
    >
      <div
        className="bg-background-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/25">
                <Pencil size={16} />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">{t("editModal.title")}</h3>
                <p className="text-xs text-text-muted">{t("batch.label", { number: "" })} #{batch.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-background-hover text-text-muted hover:text-error hover:bg-error/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-1">
            {/* Expiry Date */}
            <div className="flex flex-col gap-1 w-full relative pb-5">
              <label className="text-sm font-semibold text-text-secondary tracking-tight">
                {t("editModal.expiryDate")}
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                  <Calendar size={18} />
                </div>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => {
                    setExpiryDate(e.target.value);
                    if (errors.expiryDate) setErrors((p) => ({ ...p, expiryDate: "" }));
                  }}
                  className={`
                    w-full rounded-xl border bg-background-input py-3 pl-11 pr-4 outline-none
                    transition-all duration-200 text-sm text-text-primary
                    shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]
                    ${errors.expiryDate
                      ? "border-error/60 focus:border-error focus:ring-2 focus:ring-error/15"
                      : "border-border-primary focus:border-primary-400 focus:ring-2 focus:ring-primary-500/15"
                    }
                  `}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-4">
                {errors.expiryDate && (
                  <span className="text-[11px] text-error animate-fadeIn block truncate">{errors.expiryDate}</span>
                )}
              </div>
            </div>

            {/* Remaining Quantity */}
            <Input
              label={t("editModal.remainingQuantity")}
              type="number"
              placeholder="0"
              value={remainingQuantity}
              onChange={(e) => {
                setRemainingQuantity(e.target.value);
                if (errors.remainingQuantity) setErrors((p) => ({ ...p, remainingQuantity: "" }));
              }}
              error={errors.remainingQuantity}
              icon={<Package size={18} />}
            />

            {/* Unit Cost */}
            <Input
              label={t("editModal.unitCost")}
              type="number"
              placeholder="0.00"
              step="0.01"
              value={unitCost}
              onChange={(e) => {
                setUnitCost(e.target.value);
                if (errors.unitCost) setErrors((p) => ({ ...p, unitCost: "" }));
              }}
              error={errors.unitCost}
              icon={<DollarSign size={18} />}
            />

            {/* Discount Percentage */}
            <Input
              label={t("editModal.discountPercentage")}
              type="number"
              placeholder="0"
              min="0"
              max="100"
              step="0.01"
              value={discountPercentage}
              onChange={(e) => {
                setDiscountPercentage(e.target.value);
                if (errors.discountPercentage) setErrors((p) => ({ ...p, discountPercentage: "" }));
              }}
              error={errors.discountPercentage}
              icon={<Percent size={18} />}
            />

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
              >
                {t("common.cancel")}
              </button>
              <Button type="submit" size="sm" loading={loading}>
                {t("editModal.submit")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
