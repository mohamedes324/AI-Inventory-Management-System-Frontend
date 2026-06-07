/**
 * @component PaymentMethodsPreview
 * @description Lightweight navigation card for the payment analytics report.
 * Does NOT fetch any data — acts as a quick-access preview that navigates
 * to the dedicated /reports/payment-methods page.
 */
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, BarChart3 } from "lucide-react";

export default function PaymentMethodsPreview() {
  const { t } = useTranslation("reports");
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate("/reports/payment-methods")}
      className="
        w-full text-start rounded-2xl border border-border-primary
        bg-background-card shadow-[var(--shadow-card)]
        hover:shadow-[var(--shadow-elevated)] hover:border-blue-500/20
        transition-all duration-300 p-5 group cursor-pointer
      "
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Wallet size={20} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">{t("paymentMethods.title")}</h3>
            <p className="text-xs text-text-muted mt-0.5">{t("paymentMethods.subtitle")}</p>
          </div>
        </div>
        <ArrowUpRight
          size={16}
          className="text-text-muted/40 group-hover:text-primary-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 mt-1 rtl:-scale-x-100"
        />
      </div>

      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
        <BarChart3 size={14} className="text-blue-400/70 shrink-0" />
        <span className="text-xs text-text-muted">
          {t("paymentMethods.viewAll")}
        </span>
      </div>
    </motion.button>
  );
}
