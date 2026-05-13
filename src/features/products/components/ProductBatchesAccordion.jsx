/**
 * @component ProductBatchesAccordion
 * @description Expandable/collapsible accordion for stock batches.
 * Read-only display inside Product Details page.
 * "Manage Inventory" link only visible to InventoryStaff.
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Boxes, Calendar, Hash, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Loader } from "@/shared/components/ui";

function BatchItem({ batch, isOpen, onToggle, index }) {
  const { t } = useTranslation("products");

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "expired") return "bg-error/15 text-error border-error/30";
    if (s === "active" || s === "available") return "bg-primary-500/15 text-primary-400 border-primary-500/30";
    return "bg-warning/15 text-warning border-warning/30";
  };

  return (
    <div
      className="border border-border-primary/60 rounded-xl overflow-hidden transition-all duration-300 animate-fadeIn"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Accordion Header */}
      <button
        type="button"
        onClick={onToggle}
        className={`
          w-full flex items-center justify-between px-5 py-4 text-left
          transition-all duration-200 group
          ${isOpen
            ? "bg-primary-500/[0.06] border-b border-border-primary/40"
            : "hover:bg-background-hover/60"
          }
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`
            w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors
            ${isOpen
              ? "bg-primary-500/15 text-primary-500"
              : "bg-background-hover text-text-muted group-hover:text-primary-500"
            }
          `}>
            <Boxes size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {t("batches.batchLabel", { number: index + 1 })}
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              {t("batches.qty")}: {batch.quantity} · {formatDate(batch.expiryDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border
            ${getStatusStyle(batch.status)}
          `}>
            {batch.status || "Active"}
          </span>
          <ChevronDown
            size={18}
            className={`text-text-muted transition-transform duration-300 ${isOpen ? "rotate-180 text-primary-500" : ""}`}
          />
        </div>
      </button>

      {/* Accordion Content */}
      <div className={`
        overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}
      `}>
        <div className="px-5 py-4 grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-secondary-500/10 flex items-center justify-center">
              <Hash size={14} className="text-secondary-500" />
            </div>
            <div>
              <p className="text-[11px] text-text-muted uppercase tracking-wider">{t("batches.quantity")}</p>
              <p className="text-sm font-bold text-text-primary">{batch.quantity}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
              <Calendar size={14} className="text-primary-500" />
            </div>
            <div>
              <p className="text-[11px] text-text-muted uppercase tracking-wider">{t("batches.expiry")}</p>
              <p className="text-sm font-bold text-text-primary">{formatDate(batch.expiryDate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
              <Boxes size={14} className="text-warning" />
            </div>
            <div>
              <p className="text-[11px] text-text-muted uppercase tracking-wider">{t("batches.status")}</p>
              <p className="text-sm font-bold text-text-primary">{batch.status || "Active"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductBatchesAccordion({ batches = [], loading = false, canManage = false }) {
  const { t } = useTranslation("products");
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-background-card rounded-2xl border border-border-primary shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-4 border-b border-border-primary/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-secondary-500/10 border border-secondary-500/20 flex items-center justify-center">
            <Boxes size={16} className="text-secondary-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">{t("batches.title")}</h3>
            <p className="text-xs text-text-muted mt-0.5">
              {batches.length > 0
                ? t("batches.count", { count: batches.length })
                : t("batches.empty")
              }
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <Loader variant="shimmer" lines={4} />
        ) : batches.length === 0 ? (
          <div className="text-center py-8">
            <Boxes size={32} className="text-text-muted mx-auto mb-3 opacity-40" />
            <p className="text-sm text-text-muted">{t("batches.noBatches")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {batches.map((batch, idx) => (
              <BatchItem
                key={batch.id || idx}
                batch={batch}
                index={idx}
                isOpen={openIndex === idx}
                onToggle={() => handleToggle(idx)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer — Manage Inventory link (InventoryStaff only) */}
      {canManage && (
        <div className="px-6 py-3 border-t border-border-primary/40 bg-background-hover/30">
          <button
            onClick={() => navigate("/inventory")}
            className="flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-400 transition-colors group"
          >
            {t("batches.manageInventory")}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
