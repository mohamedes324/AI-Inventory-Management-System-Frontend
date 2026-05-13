/**
 * @component ConfirmDeleteModal
 * @description Confirmation dialog for deleting a category.
 * Shows category name and requires explicit confirmation.
 */
import { useEffect, useCallback } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { useTranslation } from "react-i18next";

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  categoryName = "",
}) {
  const { t } = useTranslation("categories");

  const handleKeyDown = useCallback(
    (e) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background-app/70 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm mx-4 bg-background-card rounded-2xl shadow-2xl animate-scaleIn overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-error/10 flex items-center justify-center text-error">
              <AlertTriangle size={18} />
            </div>
            <h3 className="text-lg font-bold text-text-primary">
              {t("deleteModalTitle")}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-error/10 hover:text-error transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-text-secondary leading-relaxed">
            {t("deleteModalDesc", { name: categoryName })}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-primary flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm} loading={loading}>
            {t("confirmDelete")}
          </Button>
        </div>
      </div>
    </div>
  );
}
