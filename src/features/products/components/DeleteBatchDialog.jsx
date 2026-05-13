/**
 * @component DeleteBatchDialog
 * @description Confirmation dialog before deleting a stock batch.
 * DELETE /api/StockBatches/{id} — only sends the batch id.
 */
import { useTranslation } from "react-i18next";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/shared/components/ui";

export default function DeleteBatchDialog({ isOpen, onClose, onConfirm, loading, batch }) {
  const { t } = useTranslation("stockBatches");

  if (!isOpen || !batch) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background-app/70 backdrop-blur-sm animate-fadeIn p-4"
      onClick={onClose}
    >
      <div
        className="bg-background-card rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          {/* Warning icon */}
          <div className="w-14 h-14 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} className="text-error" />
          </div>

          <h3 className="text-lg font-bold text-text-primary mb-2">
            {t("deleteDialog.title")}
          </h3>
          <p className="text-sm text-text-muted leading-relaxed">
            {t("deleteDialog.description", { id: batch.id })}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-text-muted hover:text-text-primary transition-colors rounded-xl border border-border-primary hover:border-border-secondary"
            >
              {t("common.cancel")}
            </button>
            <Button
              size="sm"
              variant="primary"
              loading={loading}
              onClick={() => onConfirm(batch.id)}
              className="!bg-error hover:!bg-error/80 !shadow-error/25"
            >
              {t("deleteDialog.confirm")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
