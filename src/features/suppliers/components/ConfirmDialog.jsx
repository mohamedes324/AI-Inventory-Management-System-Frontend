/**
 * @component ConfirmDialog
 * @description Reusable confirmation dialog for delete/restore.
 */
import { useTranslation } from "react-i18next";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/shared/components/ui";

export default function ConfirmDialog({ isOpen, onClose, onConfirm, loading, title, description, confirmLabel, variant = "danger" }) {
  const { t } = useTranslation("suppliers");

  if (!isOpen) return null;

  const isRestore = variant === "restore";

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
          <div className={`
            w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border
            ${isRestore ? "bg-primary-500/10 border-primary-500/20" : "bg-error/10 border-error/20"}
          `}>
            <AlertTriangle size={28} className={isRestore ? "text-primary-500" : "text-error"} />
          </div>

          <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
          <p className="text-sm text-text-muted leading-relaxed">{description}</p>

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
              loading={loading}
              onClick={onConfirm}
              className={isRestore ? "" : "!bg-error hover:!bg-error/80 !shadow-error/25"}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
