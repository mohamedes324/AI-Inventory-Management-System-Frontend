/**
 * @component DeleteProductDialog
 * @description Confirmation dialog before deleting a product.
 */
import { useTranslation } from "react-i18next";
import { Trash2, AlertTriangle, RefreshCw } from "lucide-react";

export default function DeleteProductDialog({ isOpen, onClose, onConfirm, loading, product }) {
  const { t } = useTranslation("products");
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
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center mb-4">
              <AlertTriangle size={28} className="text-error" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">{t("deleteDialog.title")}</h3>
            <p className="text-sm text-text-secondary mt-2 max-w-[280px]">
              {t("deleteDialog.description", { name: product.name })}
            </p>
          </div>
          <div className="flex items-center gap-3 bg-background-hover/60 rounded-xl px-4 py-3 border border-border-primary/50 mb-5">
            <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center">
              <Trash2 size={14} className="text-error" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">{product.name}</p>
              <p className="text-xs text-text-muted font-mono">{product.sku}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-background-hover/50 border-t border-border-primary flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={() => onConfirm(product.id)}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-error text-text-inverse hover:bg-error/90 disabled:opacity-50 transition-all shadow-sm shadow-error/20"
          >
            {loading && <RefreshCw size={14} className="animate-spin" />}
            {t("deleteDialog.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
