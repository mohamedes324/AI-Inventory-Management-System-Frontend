/**
 * @component ProductStatusBadge
 * @description Reusable badge showing product stock status with semantic colors.
 * Uses getProductStatus utility for consistent status logic across the app.
 */
import { useTranslation } from "react-i18next";
import { getProductStatus, PRODUCT_STATUS_STYLES } from "../utils/getProductStatus";

export default function ProductStatusBadge({ stockQuantity, reorderPoint }) {
  const { t } = useTranslation("products");
  const { key, color } = getProductStatus(stockQuantity, reorderPoint);

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
        border ${PRODUCT_STATUS_STYLES[color]}
      `}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {t(`status.${key}`)}
    </span>
  );
}
