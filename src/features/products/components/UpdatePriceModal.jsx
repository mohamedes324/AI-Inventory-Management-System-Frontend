/**
 * @component UpdatePriceModal
 * @description Small dialog for updating a product's selling price.
 * Only accessible by InventoryStaff role.
 */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, DollarSign } from "lucide-react";
import { Input, Button } from "@/shared/components/ui";

export default function UpdatePriceModal({ isOpen, onClose, onSubmit, loading, product }) {
  const { t } = useTranslation("products");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && product) {
      setPrice(product.sellingPrice?.toString() || "");
    }
    if (!isOpen) {
      setPrice("");
      setError("");
    }
  }, [isOpen, product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!price || Number(price) <= 0) {
      setError(t("validation.priceRequired"));
      return;
    }
    onSubmit(Number(price));
  };

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background-app/70 backdrop-blur-sm animate-fadeIn p-4"
      onClick={onClose}
    >
      <div
        className="bg-background-card rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-white shadow-lg shadow-secondary-500/25">
                <DollarSign size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">{t("priceModal.title")}</h3>
                <p className="text-xs text-text-muted">{product.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-background-hover text-text-muted hover:text-error hover:bg-error/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label={t("priceModal.label")}
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (error) setError("");
              }}
              error={error}
              icon={<DollarSign size={18} />}
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
              >
                {t("common.cancel")}
              </button>
              <Button type="submit" size="sm" variant="secondary" loading={loading}>
                {t("priceModal.submit")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
