/**
 * @component BatchesPreview
 * @description Preview/summary section for stock batches inside Product Details.
 * Shows batch count, a compact list preview (max 3), and a "Manage Inventory" link.
 */
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Boxes, ArrowRight, Package } from "lucide-react";
import { Loader } from "@/shared/components/ui";
import { formatDate } from "../utils/formatDate";
import { getBatchStatus, BATCH_STATUS_STYLES } from "../utils/getBatchStatus";
import BatchStatusBadge from "./BatchStatusBadge";

function PreviewRow({ batch, index }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary/30 last:border-b-0 animate-fadeIn" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-background-hover flex items-center justify-center shrink-0">
          <Package size={13} className="text-text-muted" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-primary">
            #{batch.id}
            <span className="text-text-muted font-normal ml-2">
              {batch.remainingQuantity} / {batch.originalQuantity}
            </span>
          </p>
          <p className="text-[11px] text-text-muted mt-0.5">
            {formatDate(batch.expireDate)}
          </p>
        </div>
      </div>
      <BatchStatusBadge batch={batch} />
    </div>
  );
}

export default function BatchesPreview({ batches = [], loading = false, productId, canManage = false }) {
  const { t } = useTranslation("stockBatches");
  const navigate = useNavigate();

  const previewBatches = batches.slice(0, 3);
  const hasMore = batches.length > 3;

  return (
    <div className="bg-background-card rounded-2xl border border-border-primary shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border-primary/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-secondary-500/10 border border-secondary-500/20 flex items-center justify-center">
            <Boxes size={16} className="text-secondary-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">{t("title")}</h3>
            <p className="text-xs text-text-muted mt-0.5">
              {batches.length > 0
                ? t("count", { count: batches.length })
                : t("empty")
              }
            </p>
          </div>
        </div>
      </div>

      {/* Preview List */}
      <div>
        {loading ? (
          <div className="px-5 py-6">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-lg bg-background-hover/60 animate-pulse" />
              ))}
            </div>
          </div>
        ) : batches.length === 0 ? (
          <div className="text-center py-10 px-5">
            <Boxes size={32} className="text-text-muted mx-auto mb-3 opacity-40" />
            <p className="text-sm text-text-muted">{t("noBatches")}</p>
          </div>
        ) : (
          <>
            {previewBatches.map((batch, idx) => (
              <PreviewRow key={batch.id || idx} batch={batch} index={idx} />
            ))}
            {hasMore && (
              <div className="px-4 py-2.5 text-center">
                <span className="text-xs text-text-muted">
                  {t("andMore", { count: batches.length - 3 })}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer — Manage Inventory (InventoryStaff only) */}
      {canManage && productId && (
        <div className="px-5 py-3 border-t border-border-primary/40 bg-background-hover/30">
          <button
            onClick={() => navigate(`/products/${productId}/stock-batches`)}
            className="flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-400 transition-colors group"
          >
            {t("manageInventory")}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
