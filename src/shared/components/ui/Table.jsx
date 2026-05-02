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
      <div className={`bg-white rounded-2xl border border-gray/10 p-6 ${className}`}>
        <Loader variant="shimmer" lines={6} />
      </div>
    );
  }

  /* ── Empty State ── */
  if (!data.length) {
    return (
      <div className={`bg-white rounded-2xl border border-gray/10 p-8 ${className}`}>
        <EmptyState message="No data found" />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border border-gray/10 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* ── Header ── */}
          <thead>
            <tr className="border-b border-gray/10 bg-gray-light/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-5 py-3.5 font-semibold text-gray-dark text-xs uppercase tracking-wider"
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
                  border-b border-gray/5 transition-colors duration-150
                  ${onRowClick ? "cursor-pointer" : ""}
                  ${striped && rowIdx % 2 === 1 ? "bg-gray-light/30" : ""}
                  hover:bg-primary-500/5
                `}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3.5 text-gray-dark">
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
