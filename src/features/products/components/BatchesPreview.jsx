/**
 * @component BatchesPreview
 * @description Lightweight batch summary for the Product Details page.
 * Shows only: Batch name, Qty (remaining/original), Expiry, Status.
 * NO accordion, NO edit/delete, NO detailed fields.
 * Full management lives at /products/:id/stock-batches.
 */
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Boxes, ArrowRight, Package, Calendar } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import BatchStatusBadge from "./BatchStatusBadge";

function BatchRow({ batch, index }) {
  const { t } = useTranslation("stockBatches");

  return (
    <div
      className="flex items-center justify-between px-4 py-3 hover:bg-background-hover/30 transition-colors animate-fadeIn"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Left: name + qty + expiry */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-background-hover/70 flex items-center justify-center shrink-0">
          <Package size={14} className="text-text-muted" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">
            {t("batch.label", { number: index + 1 })}
          </p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-text-muted">
            <span>{batch.remainingQuantity} / {batch.originalQuantity}</span>
            <span className="w-1 h-1 rounded-full bg-border-secondary" />
            <span className="flex items-center gap-1">
              <Calendar size={10} className="opacity-50" />
              {formatDate(batch.expireDate, "short")}
            </span>
          </div>
        </div>
      </div>

      {/* Right: status badge */}
      <BatchStatusBadge batch={batch} />
    </div>
  );
}

export default function BatchesPreview({ batches = [], loading = false, productId, canManage = false }) {
  const { t } = useTranslation("stockBatches");
  const navigate = useNavigate();

  return (
    <div className="bg-background-card rounded-2xl border border-border-primary shadow-sm overflow-hidden">
      {/* ── Header ── */}
      <div className="px-5 py-4 border-b border-border-primary/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary-500/15 to-secondary-600/10 border border-secondary-500/20 flex items-center justify-center">
            <Boxes size={16} className="text-secondary-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary tracking-tight">{t("title")}</h3>
            <p className="text-xs text-text-muted mt-0.5">
              {batches.length > 0 ? t("count", { count: batches.length }) : t("empty")}
            </p>
          </div>
        </div>

        {batches.length > 0 && (
          <span className="inline-flex items-center bg-secondary-500/10 border border-secondary-500/20 text-secondary-400 text-xs font-bold px-2.5 py-1 rounded-full">
            {batches.length}
          </span>
        )}
      </div>

      {/* ── Batch rows ── */}
      <div className="divide-y divide-border-primary/20">
        {loading ? (
          <div className="p-4 space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-background-hover/50 animate-pulse" />
            ))}
          </div>
        ) : batches.length === 0 ? (
          <div className="text-center py-10">
            <Boxes size={28} className="text-text-muted mx-auto mb-3 opacity-40" />
            <p className="text-sm text-text-muted">{t("noBatches")}</p>
          </div>
        ) : (
          batches.map((batch, idx) => (
            <BatchRow key={batch.id || idx} batch={batch} index={idx} />
          ))
        )}
      </div>

      {/* ── Footer: Manage Inventory link (InventoryStaff only) ── */}
      {canManage && productId && (
        <div className="px-5 py-3 border-t border-border-primary/40 bg-background-hover/20">
          <button
            onClick={() => navigate(`/products/${productId}/stock-batches`)}
            className="flex items-center gap-2 text-sm font-semibold text-primary-500 hover:text-primary-400 transition-colors group"
          >
            {t("manageInventory")}
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      )}
    </div>
  );
}
