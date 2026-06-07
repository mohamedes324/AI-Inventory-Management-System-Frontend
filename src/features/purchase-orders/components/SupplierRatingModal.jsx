/**
 * @component SupplierRatingModal
 * @description Modal that requires supplier rating before purchase order submission.
 * Displays interactive star rating with optional note input.
 * Must rate before the order can be submitted.
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Star, X, MessageSquare, Send } from "lucide-react";
import { Button } from "@/shared/components/ui";

export default function SupplierRatingModal({
  isOpen,
  supplierName,
  onSubmit,
  onClose,
  loading = false,
}) {
  const { t } = useTranslation("purchaseOrders");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) {
      setError(t("addOrder.ratingRequired"));
      return;
    }
    setError("");
    onSubmit({ rating, note: note.trim() || null });
  };

  const ratingLabels = [
    t("addOrder.ratingPoor"),
    t("addOrder.ratingFair"),
    t("addOrder.ratingGood"),
    t("addOrder.ratingVeryGood"),
    t("addOrder.ratingExcellent"),
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-background-elevated border border-border-secondary rounded-3xl shadow-[var(--shadow-elevated)] overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-background-hover transition-all"
          >
            <X size={18} />
          </button>

          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-warning/20 to-warning/5 border border-warning/20 flex items-center justify-center mx-auto mb-3">
              <Star size={24} className="text-warning" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">
              {t("addOrder.rateSupplier")}
            </h3>
            <p className="text-sm text-text-muted mt-1">
              {t("addOrder.rateSupplierDesc", { name: supplierName })}
            </p>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            {Array.from({ length: 5 }).map((_, i) => {
              const starIndex = i + 1;
              const isActive = starIndex <= (hoveredStar || rating);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(starIndex)}
                  onMouseEnter={() => setHoveredStar(starIndex)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className={`
                    w-11 h-11 rounded-xl flex items-center justify-center
                    transition-all duration-200 transform
                    ${isActive
                      ? "bg-warning/15 border border-warning/30 scale-110"
                      : "bg-background-hover border border-border-primary hover:border-warning/20 hover:scale-105"
                    }
                  `}
                >
                  <Star
                    size={22}
                    className={`transition-colors duration-200 ${
                      isActive
                        ? "fill-warning text-warning"
                        : "fill-none text-text-muted"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Rating label */}
          <div className="text-center h-6">
            {(hoveredStar || rating) > 0 && (
              <span className="text-sm font-semibold text-warning animate-fadeIn">
                {ratingLabels[(hoveredStar || rating) - 1]}
              </span>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-center text-xs text-error font-medium mt-1 animate-fadeIn">
              {error}
            </p>
          )}

          {/* Note Input */}
          <div className="mt-4">
            <label className="text-sm font-semibold text-text-secondary tracking-tight ml-1 flex items-center gap-1.5 mb-1.5">
              <MessageSquare size={14} />
              {t("addOrder.ratingNote")}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("addOrder.ratingNotePlaceholder")}
              rows={3}
              className="
                w-full rounded-xl border border-border-primary bg-background-input
                px-4 py-3 outline-none text-sm text-text-primary
                placeholder:text-text-muted/60 resize-none
                transition-all duration-200
                focus:border-border-focus focus:ring-2 focus:ring-primary-500/20
                shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]
              "
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={onClose}
          >
            {t("addOrder.cancel")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            loading={loading}
            onClick={handleSubmit}
            disabled={rating === 0}
          >
            <Send size={16} />
            {t("addOrder.submitRating")}
          </Button>
        </div>
      </div>
    </div>
  );
}
