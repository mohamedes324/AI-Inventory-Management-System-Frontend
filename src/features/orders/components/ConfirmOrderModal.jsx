/**
 * @component ConfirmOrderModal
 * @description Modal for selecting payment method & order type before confirming.
 * Uses visual card-style selection matching project patterns.
 */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  Banknote,
  CreditCard,
  Building2,
  Store,
  Truck,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui";

const PAYMENT_OPTIONS = [
  { value: 0, labelKey: "addOrder.cash", Icon: Banknote },
  { value: 1, labelKey: "addOrder.visa", Icon: CreditCard },
  { value: 2, labelKey: "addOrder.bankTransfer", Icon: Building2 },
];

const TYPE_OPTIONS = [
  { value: 0, labelKey: "addOrder.inStore", Icon: Store },
  { value: 1, labelKey: "addOrder.delivery", Icon: Truck },
];

export default function ConfirmOrderModal({ onConfirm, onClose, loading }) {
  const { t } = useTranslation("orders");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [orderType, setOrderType] = useState(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const canConfirm = paymentMethod !== null && orderType !== null && !loading;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-background-card rounded-2xl border border-border-primary shadow-2xl p-6 sm:p-8 max-w-lg w-full mx-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{ animationDelay: "50ms" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 border border-primary-500/20 flex items-center justify-center">
              <CheckCircle2 size={22} className="text-primary-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">
                {t("addOrder.confirmTitle")}
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                {t("addOrder.confirmSubtitle")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-background-hover transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Payment Method */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-text-secondary mb-3 block">
            {t("addOrder.paymentMethodLabel")}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_OPTIONS.map(({ value, labelKey, Icon }) => {
              const selected = paymentMethod === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPaymentMethod(value)}
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                    ${
                      selected
                        ? "border-primary-500 bg-primary-500/10 shadow-md shadow-primary-500/10"
                        : "border-border-primary bg-background-app hover:border-primary-500/40 hover:bg-primary-500/5"
                    }
                  `}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      selected
                        ? "bg-primary-500/20 text-primary-500"
                        : "bg-background-hover text-text-muted"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      selected ? "text-primary-500" : "text-text-secondary"
                    }`}
                  >
                    {t(labelKey)}
                  </span>
                  {selected && (
                    <CheckCircle2
                      size={14}
                      className="text-primary-500 absolute -top-1 -right-1"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Order Type */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-text-secondary mb-3 block">
            {t("addOrder.orderTypeLabel")}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TYPE_OPTIONS.map(({ value, labelKey, Icon }) => {
              const selected = orderType === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setOrderType(value)}
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                    ${
                      selected
                        ? "border-primary-500 bg-primary-500/10 shadow-md shadow-primary-500/10"
                        : "border-border-primary bg-background-app hover:border-primary-500/40 hover:bg-primary-500/5"
                    }
                  `}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      selected
                        ? "bg-primary-500/20 text-primary-500"
                        : "bg-background-hover text-text-muted"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      selected ? "text-primary-500" : "text-text-secondary"
                    }`}
                  >
                    {t(labelKey)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            {t("addOrder.cancelBtn")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!canConfirm}
            loading={loading}
            onClick={() => onConfirm({ paymentMethod, orderType })}
          >
            <CheckCircle2 size={16} />
            {t("addOrder.confirmBtn")}
          </Button>
        </div>
      </div>
    </div>
  );
}
