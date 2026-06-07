/**
 * @component AddReturnOrderModal
 * @description Modal for creating a new return order.
 * Supports dynamic item addition with originalOrderItemId, quantity, newExpiryDate.
 */
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  X,
  Plus,
  Trash2,
  RotateCcw,
  Send,
  AlertCircle,
  Package,
} from "lucide-react";
import { Button } from "@/shared/components/ui";
import { useRequest } from "@/shared/hooks/useRequest";
import { createReturnOrder } from "../api/createReturnOrder";

const EMPTY_ITEM = {
  originalOrderItemId: "",
  quantity: "",
  newExpiryDate: "",
};

export default function AddReturnOrderModal({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslation("returnOrders");
  const { execute, loading } = useRequest(createReturnOrder);

  const [originalOrderId, setOriginalOrderId] = useState("");
  const [reason, setReason] = useState("");
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const resetForm = useCallback(() => {
    setOriginalOrderId("");
    setReason("");
    setItems([{ ...EMPTY_ITEM }]);
    setErrors({});
    setSubmitError("");
  }, []);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addItem = () => {
    setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  };

  const removeItem = (index) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`item_${index}`];
      return next;
    });
  };

  const updateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
    // Clear error for this field
    setErrors((prev) => {
      const next = { ...prev };
      if (next[`item_${index}`]) {
        delete next[`item_${index}`][field];
        if (Object.keys(next[`item_${index}`]).length === 0) {
          delete next[`item_${index}`];
        }
      }
      return next;
    });
  };

  const validate = () => {
    const newErrors = {};
    let valid = true;

    if (!originalOrderId.trim()) {
      newErrors.originalOrderId = t("addModal.originalOrderRequired");
      valid = false;
    }

    items.forEach((item, i) => {
      const itemErrors = {};
      if (!item.originalOrderItemId.trim()) {
        itemErrors.originalOrderItemId = t("addModal.itemIdRequired");
        valid = false;
      }
      if (!item.quantity || Number(item.quantity) < 1) {
        itemErrors.quantity = t("addModal.quantityRequired");
        valid = false;
      }
      if (!item.newExpiryDate) {
        itemErrors.newExpiryDate = t("addModal.expiryRequired");
        valid = false;
      }
      if (Object.keys(itemErrors).length > 0) {
        newErrors[`item_${i}`] = itemErrors;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitError("");

    try {
      const payload = {
        originalOrderId: originalOrderId.trim(),
        reason: reason.trim() || null,
        items: items.map((item) => ({
          originalOrderItemId: item.originalOrderItemId.trim(),
          quantity: item.quantity.toString(),
          newExpiryDate: new Date(item.newExpiryDate).toISOString(),
        })),
      };

      await execute(payload);
      resetForm();
      onSuccess?.();
      onClose();
    } catch (err) {
      setSubmitError(err?.message || t("addModal.submitFailed"));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-background-app/60 backdrop-blur-sm animate-fadeIn"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-background-card rounded-2xl border border-border-primary shadow-2xl w-full max-w-2xl pointer-events-auto animate-fadeIn max-h-[90vh] flex flex-col"
          style={{ animationDelay: "50ms" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/15 to-orange-600/10 border border-orange-500/20 flex items-center justify-center">
                <RotateCcw size={18} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-text-primary">
                  {t("addModal.title")}
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  {t("addModal.subtitle")}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-background-hover border border-border-primary hover:border-border-secondary transition-all duration-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Original Order ID */}
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
                {t("addModal.originalOrderId")}
              </label>
              <input
                type="text"
                value={originalOrderId}
                onChange={(e) => {
                  setOriginalOrderId(e.target.value);
                  setErrors((prev) => {
                    const { originalOrderId: _, ...rest } = prev;
                    return rest;
                  });
                }}
                placeholder={t("addModal.originalOrderPlaceholder")}
                className={`
                  w-full rounded-xl border bg-background-input
                  px-3 py-2.5 outline-none text-sm text-text-primary
                  placeholder:text-text-muted/60
                  transition-all duration-200
                  focus:border-border-focus focus:ring-2 focus:ring-primary-500/20
                  shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]
                  ${errors.originalOrderId ? "border-error" : "border-border-primary"}
                `}
              />
              {errors.originalOrderId && (
                <p className="text-[11px] text-error font-medium mt-1 animate-fadeIn">
                  {errors.originalOrderId}
                </p>
              )}
            </div>

            {/* Reason */}
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
                {t("addModal.reason")}
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t("addModal.reasonPlaceholder")}
                className="
                  w-full rounded-xl border border-border-primary bg-background-input
                  px-3 py-2.5 outline-none text-sm text-text-primary
                  placeholder:text-text-muted/60
                  transition-all duration-200
                  focus:border-border-focus focus:ring-2 focus:ring-primary-500/20
                  shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]
                "
              />
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Package size={14} className="text-orange-500" />
                  <span className="text-xs font-semibold text-text-secondary">
                    {t("addModal.items")} ({items.length})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary-500 hover:text-primary-400 transition-colors"
                >
                  <Plus size={14} />
                  {t("addModal.addItem")}
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, idx) => {
                  const itemErrors = errors[`item_${idx}`] || {};
                  return (
                    <div
                      key={idx}
                      className="bg-background-hover/30 rounded-xl border border-border-primary/50 p-4 space-y-3 animate-fadeIn"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-text-muted">
                          {t("addModal.itemNumber", { num: idx + 1 })}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-error hover:bg-error/10 transition-all duration-200"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Original Order Item ID */}
                        <div>
                          <label className="text-[11px] text-text-muted font-medium mb-1 block">
                            {t("addModal.originalOrderItemId")}
                          </label>
                          <input
                            type="text"
                            value={item.originalOrderItemId}
                            onChange={(e) =>
                              updateItem(idx, "originalOrderItemId", e.target.value)
                            }
                            placeholder="e.g. 12"
                            className={`
                              w-full rounded-lg border bg-background-input
                              px-3 py-2 outline-none text-sm text-text-primary
                              placeholder:text-text-muted/60
                              transition-all duration-200
                              focus:border-border-focus focus:ring-2 focus:ring-primary-500/20
                              shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]
                              ${itemErrors.originalOrderItemId ? "border-error" : "border-border-primary"}
                            `}
                          />
                          {itemErrors.originalOrderItemId && (
                            <p className="text-[10px] text-error font-medium mt-0.5">
                              {itemErrors.originalOrderItemId}
                            </p>
                          )}
                        </div>

                        {/* Quantity */}
                        <div>
                          <label className="text-[11px] text-text-muted font-medium mb-1 block">
                            {t("addModal.quantity")}
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(idx, "quantity", e.target.value)
                            }
                            placeholder="1"
                            className={`
                              w-full rounded-lg border bg-background-input
                              px-3 py-2 outline-none text-sm text-text-primary
                              placeholder:text-text-muted/60
                              transition-all duration-200
                              focus:border-border-focus focus:ring-2 focus:ring-primary-500/20
                              shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]
                              ${itemErrors.quantity ? "border-error" : "border-border-primary"}
                            `}
                          />
                          {itemErrors.quantity && (
                            <p className="text-[10px] text-error font-medium mt-0.5">
                              {itemErrors.quantity}
                            </p>
                          )}
                        </div>

                        {/* New Expiry Date */}
                        <div>
                          <label className="text-[11px] text-text-muted font-medium mb-1 block">
                            {t("addModal.newExpiryDate")}
                          </label>
                          <input
                            type="date"
                            value={item.newExpiryDate}
                            onChange={(e) =>
                              updateItem(idx, "newExpiryDate", e.target.value)
                            }
                            className={`
                              w-full rounded-lg border bg-background-input
                              px-3 py-2 outline-none text-sm text-text-primary
                              transition-all duration-200
                              focus:border-border-focus focus:ring-2 focus:ring-primary-500/20
                              shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]
                              ${itemErrors.newExpiryDate ? "border-error" : "border-border-primary"}
                            `}
                          />
                          {itemErrors.newExpiryDate && (
                            <p className="text-[10px] text-error font-medium mt-0.5">
                              {itemErrors.newExpiryDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error Banner */}
            {submitError && (
              <div className="flex items-center gap-3 bg-error/10 border border-error/20 rounded-xl px-4 py-3 animate-fadeIn">
                <AlertCircle size={18} className="text-error shrink-0" />
                <span className="text-sm font-medium text-error">
                  {submitError}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-primary/50 shrink-0">
            <Button variant="ghost" size="sm" onClick={handleClose}>
              {t("addModal.cancel")}
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              loading={loading}
            >
              <Send size={14} />
              {t("addModal.submit")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
