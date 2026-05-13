/**
 * @component SupplierTable
 * @description Table listing suppliers with Name, Phone, Contact, Address, Rating, Actions.
 * Delete/Restore toggle similar to AllUsers page.
 */
import { useTranslation } from "react-i18next";
import { Trash2, RotateCcw, Loader2 } from "lucide-react";
import StarRating from "./StarRating";

export default function SupplierTable({ suppliers = [], loading = false, actionLoading, onDelete, onRestore }) {
  const { t } = useTranslation("suppliers");

  if (loading) {
    return (
      <div className="bg-background-card rounded-2xl border border-border-primary overflow-hidden animate-fadeIn">
        <div className="p-8 flex items-center justify-center gap-3">
          <Loader2 size={20} className="animate-spin text-primary-500" />
          <span className="text-sm text-text-muted">{t("table.loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-card rounded-2xl border border-border-primary overflow-hidden shadow-sm animate-fadeIn">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-primary/50 bg-background-hover/30">
              <th className="text-start px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">{t("table.name")}</th>
              <th className="text-start px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">{t("table.phone")}</th>
              <th className="text-start px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider hidden md:table-cell">{t("table.contact")}</th>
              <th className="text-start px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider hidden lg:table-cell">{t("table.address")}</th>
              <th className="text-start px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">{t("table.rating")}</th>
              <th className="text-center px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary/20">
            {suppliers.map((supplier) => {
              const isDeleted = supplier.isDeleted ?? false;
              const isActionLoading = actionLoading === supplier.id;

              return (
                <tr
                  key={supplier.id}
                  className={`
                    transition-colors duration-200 group
                    ${isDeleted ? "opacity-50 bg-error/[0.02]" : "hover:bg-background-hover/30"}
                  `}
                >
                  {/* Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold
                        ${isDeleted
                          ? "bg-error/10 text-error border border-error/20"
                          : "bg-primary-500/10 text-primary-500 border border-primary-500/20"
                        }
                      `}>
                        {supplier.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className={`font-semibold truncate max-w-[180px] ${isDeleted ? "line-through text-text-muted" : "text-text-primary"}`}>
                          {supplier.name}
                        </p>
                        {isDeleted && (
                          <span className="text-[10px] font-medium text-error uppercase tracking-wide">{t("table.deleted")}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-5 py-4">
                    <span className="text-text-secondary font-mono text-xs">{supplier.phoneNumber || "—"}</span>
                  </td>

                  {/* Contact */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-text-secondary text-xs truncate block max-w-[160px]">{supplier.contactInfo || "—"}</span>
                  </td>

                  {/* Address */}
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-text-secondary text-xs truncate block max-w-[200px]">{supplier.address || "—"}</span>
                  </td>

                  {/* Rating */}
                  <td className="px-5 py-4">
                    {supplier.rating ? <StarRating rating={supplier.rating} /> : <span className="text-text-muted text-xs">—</span>}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center">
                      {isDeleted ? (
                        <button
                          onClick={() => onRestore?.(supplier)}
                          disabled={isActionLoading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-500 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/20 rounded-xl transition-all disabled:opacity-50"
                        >
                          {isActionLoading ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
                          {t("actions.restore")}
                        </button>
                      ) : (
                        <button
                          onClick={() => onDelete?.(supplier)}
                          disabled={isActionLoading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-error bg-error/10 hover:bg-error/20 border border-error/20 rounded-xl transition-all disabled:opacity-50"
                        >
                          {isActionLoading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                          {t("actions.delete")}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
