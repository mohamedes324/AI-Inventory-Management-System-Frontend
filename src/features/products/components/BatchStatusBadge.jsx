/**
 * @component BatchStatusBadge
 * @description Status badge for stock batches. Status is calculated from data.
 */
import { useTranslation } from "react-i18next";
import { getBatchStatus, BATCH_STATUS_STYLES } from "../utils/getBatchStatus";

export default function BatchStatusBadge({ batch }) {
  const { t } = useTranslation("stockBatches");
  const { key, color } = getBatchStatus(batch);

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
        text-[11px] font-semibold border
        ${BATCH_STATUS_STYLES[color]}
      `}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {t(`status.${key}`)}
    </span>
  );
}
