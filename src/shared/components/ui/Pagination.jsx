/**
 * @component Pagination
 * @description Page navigation with numbered pages, prev/next buttons,
 * and an active-page indicator using primary theme color.
 *
 * @prop {number} currentPage - Current active page (1-indexed)
 * @prop {number} totalPages - Total number of pages
 * @prop {Function} onPageChange - Called with the new page number
 * @prop {string} className - Additional CSS classes
 *
 * @example
 *   <Pagination
 *     currentPage={page}
 *     totalPages={10}
 *     onPageChange={setPage}
 *   />
 */
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}) {
  if (totalPages <= 1) return null;

  /**
   * Build an array of page numbers to display.
   * Shows first, last, current ± 1, and "…" for gaps.
   */
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1; // pages around current

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "…") {
        pages.push("…");
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  const btnBase =
    "flex items-center justify-center w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200";

  return (
    <nav className={`flex items-center justify-center gap-1.5 ${className}`}>
      {/* ── Prev ── */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} ${
          currentPage === 1
            ? "text-gray/30 cursor-not-allowed"
            : "text-gray hover:bg-gray-light hover:text-gray-dark"
        }`}
      >
        <ChevronLeft size={18} />
      </button>

      {/* ── Page Numbers ── */}
      {pages.map((page, idx) =>
        page === "…" ? (
          <span key={`ellipsis-${idx}`} className="w-9 text-center text-gray/50 text-sm">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${btnBase} ${
              page === currentPage
                ? "bg-primary-500 text-white shadow-md shadow-primary-500/25"
                : "text-gray hover:bg-gray-light hover:text-gray-dark"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* ── Next ── */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} ${
          currentPage === totalPages
            ? "text-gray/30 cursor-not-allowed"
            : "text-gray hover:bg-gray-light hover:text-gray-dark"
        }`}
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
