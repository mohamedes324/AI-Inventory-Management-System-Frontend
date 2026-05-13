/**
 * @component Table
 * @description Clean, responsive data table with striped rows,
 * hover effects, and loading/empty state support.
 * Integrates with the Loader shimmer for async data.
 *
 * @prop {Array<{key: string, label: string, render?: Function}>} columns - Column definitions
 * @prop {Array<Object>} data - Row data (each row is an object keyed by column.key)
 * @prop {boolean} loading - Show shimmer skeleton
 * @prop {boolean} striped - Alternate row backgrounds
 * @prop {string} className - Additional CSS classes
 * @prop {Function} onRowClick - Optional row click handler (receives row data)
 *
 * @example
 *   <Table
 *     columns={[
 *       { key: "name", label: "Product Name" },
 *       { key: "price", label: "Price", render: (val) => `$${val}` },
 *     ]}
 *     data={products}
 *     loading={isLoading}
 *   />
 */
import Loader from "./Loader";
import EmptyState from "./EmptyState";

export default function Table({
  columns = [],
  data = [],
  loading = false,
  striped = true,
  className = "",
  onRowClick,
}) {
  /* ── Loading State ── */
  if (loading) {
    return (
      <div className={`bg-background-card rounded-2xl border border-border-primary p-6 ${className}`}>
        <Loader variant="shimmer" lines={6} />
      </div>
    );
  }

  /* ── Empty State ── */
  if (!data.length) {
    return (
      <div className={`bg-background-card rounded-2xl border border-border-primary p-8 ${className}`}>
        <EmptyState message="No data found" />
      </div>
    );
  }

  return (
    <div className={`bg-background-card rounded-2xl border border-border-primary overflow-hidden shadow-[var(--shadow-card)] ring-1 ring-inset ring-white/[0.03] ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* ── Header ── */}
          <thead>
            <tr className="border-b border-border-secondary bg-background-sidebar/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-5 py-3.5 font-semibold text-text-muted text-[11px] uppercase tracking-widest"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody>
            {data.map((row, rowIdx) => (
              <tr
                key={row.id ?? rowIdx}
                onClick={() => onRowClick?.(row)}
                className={`
                  border-b border-border-primary/20 transition-all duration-150
                  ${onRowClick ? "cursor-pointer" : ""}
                  ${striped && rowIdx % 2 === 1 ? "bg-background-app/20" : ""}
                  hover:bg-primary-500/[0.04]
                `}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3.5 text-text-primary">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
