/**
 * @component Breadcrumb
 * @description Nested navigation breadcrumb trail. Each item can be
 * a link (with `href` or `onClick`) or plain text for the current page.
 *
 * @prop {Array<{label: string, href?: string, onClick?: Function}>} items - Breadcrumb segments
 * @prop {string} className - Additional CSS classes
 *
 * @example
 *   <Breadcrumb
 *     items={[
 *       { label: "Dashboard", onClick: () => navigate("/") },
 *       { label: "Products", onClick: () => navigate("/products") },
 *       { label: "Edit Product" },
 *     ]}
 *   />
 */
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ items = [], className = "" }) {
  if (!items.length) return null;

  return (
    <nav className={`flex items-center gap-1.5 text-sm ${className}`}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const isClickable = item.href || item.onClick;

        return (
          <div key={idx} className="flex items-center gap-1.5">
            {/* Separator */}
            {idx > 0 && (
              <ChevronRight size={14} className="text-gray/40 shrink-0" />
            )}

            {/* Segment */}
            {isLast || !isClickable ? (
              <span
                className={`${
                  isLast
                    ? "font-semibold text-gray-dark"
                    : "text-gray"
                }`}
              >
                {item.label}
              </span>
            ) : item.href ? (
              <a
                href={item.href}
                className="text-gray hover:text-primary-500 transition-colors duration-200"
              >
                {item.label}
              </a>
            ) : (
              <button
                onClick={item.onClick}
                className="text-gray hover:text-primary-500 transition-colors duration-200"
              >
                {item.label}
              </button>
            )}
          </div>
        );
      })}
    </nav>
  );
}
