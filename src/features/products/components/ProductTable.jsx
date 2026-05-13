/**
 * @component ProductTable
 * @description Enterprise-grade product data table with animated rows,
 * skeleton loading, empty states, and role-based action column.
 * Follows the same table architecture as PendingAccounts.
 */
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Pencil,
  Trash2,
  DollarSign,
  RotateCcw,
} from "lucide-react";
import ProductStatusBadge from "./ProductStatusBadge";

// ── Skeleton Row ─────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-border-primary/30">
      {[44, 24, 28, 20, 20, 20, 24, 36].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className={`h-4 bg-background-hover rounded-lg`} style={{ width: `${w * 2.5}px` }} />
        </td>
      ))}
    </tr>
  );
}

// ── Product Row ──────────────────────────────────────────────────
function ProductRow({
  product,
  idx,
  canManage,
  onEdit,
  onUpdatePrice,
  onUpdateReorder,
  onDelete,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation("products");

  const handleRowClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <tr
      onClick={handleRowClick}
      className="border-b border-border-primary/30 hover:bg-primary-500/[0.04] transition-colors duration-200 cursor-pointer group animate-fadeIn"
      style={{ animationDelay: `${(idx ?? 0) * 50}ms` }}
    >
      {/* Product Name */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500/15 to-primary-600/10 border border-primary-500/20 flex items-center justify-center shrink-0">
            <Package size={16} className="text-primary-500" />
          </div>
          <span className="font-semibold text-text-primary text-[14px] leading-tight group-hover:text-primary-500 transition-colors">
            {product.name}
          </span>
        </div>
      </td>

      {/* SKU */}
      <td className="px-5 py-4">
        <span className="text-xs font-mono text-text-muted bg-background-hover/60 px-2 py-1 rounded-lg border border-border-primary/40">
          {product.sku}
        </span>
      </td>

      {/* Category */}
      <td className="px-5 py-4">
        <span className="text-sm text-text-secondary">
          {product.category?.name || "—"}
        </span>
      </td>

      {/* Price */}
      <td className="px-5 py-4">
        <span className="text-sm font-semibold text-text-primary">
          ${product.sellingPrice?.toFixed(2)}
        </span>
      </td>

      {/* Stock Quantity */}
      <td className="px-5 py-4">
        <span className="text-sm text-text-primary font-medium">
          {product.stockQuantity}
        </span>
      </td>

      {/* Reorder Point */}
      <td className="px-5 py-4">
        <span className="text-sm text-text-muted">
          {product.reorderPoint}
        </span>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <ProductStatusBadge
          stockQuantity={product.stockQuantity}
          reorderPoint={product.reorderPoint}
        />
      </td>

      {/* Actions */}
      {canManage && (
        <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(product)}
              title={t("actions.edit")}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-primary-500 hover:bg-primary-500/10 transition-all"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onUpdatePrice(product)}
              title={t("actions.updatePrice")}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-secondary-500 hover:bg-secondary-500/10 transition-all"
            >
              <DollarSign size={14} />
            </button>
            <button
              onClick={() => onUpdateReorder(product)}
              title={t("actions.updateReorder")}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-warning hover:bg-warning/10 transition-all"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={() => onDelete(product)}
              title={t("actions.delete")}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-error hover:bg-error/10 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}

// ── Main Table ───────────────────────────────────────────────────
export default function ProductTable({
  products = [],
  loading = false,
  canManage = false,
  onEdit,
  onUpdatePrice,
  onUpdateReorder,
  onDelete,
}) {
  const { t } = useTranslation("products");

  const columns = [
    "colName",
    "colSku",
    "colCategory",
    "colPrice",
    "colStock",
    "colReorder",
    "colStatus",
    ...(canManage ? ["colActions"] : []),
  ];

  return (
    <div className="bg-background-card rounded-2xl shadow-sm border border-border-primary overflow-hidden animate-slideUp overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead className="border-b border-border-primary bg-background-app/60">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-5 py-3.5 text-start text-xs font-bold text-text-muted uppercase tracking-wider"
              >
                {t(`table.${col}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            : products.map((product, idx) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  idx={idx}
                  canManage={canManage}
                  onEdit={onEdit}
                  onUpdatePrice={onUpdatePrice}
                  onUpdateReorder={onUpdateReorder}
                  onDelete={onDelete}
                />
              ))}
        </tbody>
      </table>
    </div>
  );
}
