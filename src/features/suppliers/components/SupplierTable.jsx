/**
 * @component SupplierTable
 * @description Table listing suppliers with Name, Phone, Contact, Address, Rating.
 * Rows are clickable and navigate to the supplier details page.
 */
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Loader2, ChevronRight, Trash2, RotateCcw } from "lucide-react";
import StarRating from "./StarRating";

export default function SupplierTable({ suppliers = [], loading = false, onAction, actionLoading }) {
  const { t } = useTranslation("suppliers");
  const navigate = useNavigate();

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
              <th className="text-start px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">{t("table.actions")}</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary/20">
            {suppliers.map((supplier) => {
              const name = supplier.supplierName || supplier.name || "—";
              const rating = supplier.avgRating ?? supplier.rating ?? 0;
              const deleted = supplier.isDeleted || supplier.isDeleted === true || supplier.accountStatus === "Deleted";

              return (
                <tr
                  key={supplier.supplierId}
                  onClick={() => navigate(`/suppliers/${supplier.supplierId}`)}
                  className={`transition-colors duration-200 group hover:bg-background-hover/30 cursor-pointer ${deleted ? "opacity-60" : ""}`}
                >
                  {/* Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold bg-primary-500/10 text-primary-500 border border-primary-500/20">
                        {name.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold truncate max-w-[180px] text-text-primary">
                          {name}
                        </p>
                        {deleted && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-background-elevated text-text-muted border border-border-secondary">
                            {t("table.deleted")}
                          </span>
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
                    {rating > 0 ? (
                      <StarRating rating={rating} showValue />
                    ) : (
                      <span className="text-text-muted text-xs">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    {deleted ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAction(supplier, "restore");
                        }}
                        disabled={actionLoading === supplier.supplierId}
                        className={`
                          flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-bold
                          border border-secondary-200 text-secondary-700 bg-secondary-50
                          hover:bg-secondary-500 hover:text-white hover:border-secondary-500
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transition-all duration-200 shadow-sm whitespace-nowrap
                        `}
                      >
                        <RotateCcw size={13} />
                        {actionLoading === supplier.supplierId
                          ? t("actions.restoring")
                          : t("actions.restore")}
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAction(supplier, "delete");
                        }}
                        disabled={actionLoading === supplier.supplierId}
                        className={`
                          flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-bold
                          border border-error/20 text-error/80 bg-error/5
                          hover:bg-error hover:text-white hover:border-error
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transition-all duration-200 shadow-sm whitespace-nowrap
                        `}
                      >
                        <Trash2 size={13} />
                        {actionLoading === supplier.supplierId
                          ? t("actions.deleting")
                          : t("actions.delete")}
                      </button>
                    )}
                  </td>

                  {/* Chevron */}
                  <td className="px-3 py-4">
                    <ChevronRight size={16} className="text-text-muted/40 group-hover:text-primary-500 transition-colors" />
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
