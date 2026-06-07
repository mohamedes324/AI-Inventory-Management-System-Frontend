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
import { useTranslation } from "react-i18next";

export default function Pagination({
  page = 1,
  totalPages = 1,
  hasNextPage = false,
  hasPreviousPage = false,
  onPageChange,
  className = "",
}) {
  const { t, i18n } = useTranslation("suppliers");
  const isRtl = i18n.language === "ar";

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
        (i >= page - delta && i <= page + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "…") {
        pages.push("…");
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  const prevLabel = t("pagination.previous", "Previous");
  const nextLabel = t("pagination.next", "Next");

  return (
    <nav className={`flex items-center justify-center gap-3 ${className}`} dir={isRtl ? "rtl" : "ltr"}>
      {/* ── Prev ── */}
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPreviousPage}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          !hasPreviousPage
            ? "text-text-muted/30 cursor-not-allowed"
            : "text-text-muted hover:bg-background-hover hover:text-text-primary active:scale-95"
        }`}
      >
        <ChevronLeft size={16} className={isRtl ? "rotate-180" : ""} />
        <span>{prevLabel}</span>
      </button>

      {/* ── Page Numbers ── */}
      <div className="flex items-center gap-1">
        {pages.map((p, idx) =>
          p === "…" ? (
            <span key={`ellipsis-${idx}`} className="w-9 text-center text-text-muted/50 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold transition-all duration-200 ${
                p === page
                  ? "bg-primary-500 text-white shadow-md shadow-primary-500/25 scale-105"
                  : "text-text-muted hover:bg-background-hover hover:text-text-primary active:scale-95"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      {/* ── Next ── */}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          !hasNextPage
            ? "text-text-muted/30 cursor-not-allowed"
            : "text-text-muted hover:bg-background-hover hover:text-text-primary active:scale-95"
        }`}
      >
        <span>{nextLabel}</span>
        <ChevronRight size={16} className={isRtl ? "rotate-180" : ""} />
      </button>
    </nav>
  );
}
