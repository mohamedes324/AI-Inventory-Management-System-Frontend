/**
 * @component EmptyState
 * @description Placeholder displayed when a list, table, or section
 * has no data. Shows an icon plus a message, with optional action button.
 *
 * @prop {ReactNode} icon - Lucide icon or any React node
 * @prop {string} message - Main message to display
 * @prop {string} description - Secondary help text
 * @prop {ReactNode} action - Optional action element (e.g. a Button)
 * @prop {string} className - Additional CSS classes
 *
 * @example
 *   <EmptyState
 *     icon={<Inbox size={48} />}
 *     message="No products found"
 *     description="Try adjusting your search filters"
 *     action={<Button variant="ghost">Clear Filters</Button>}
 *   />
 */
import { PackageOpen } from "lucide-react";

export default function EmptyState({
  icon,
  message = "No data found",
  description,
  action,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-6 text-center animate-fadeIn ${className}`}
    >
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-background-hover flex items-center justify-center text-text-muted mb-5 animate-float">
        {icon || <PackageOpen size={32} />}
      </div>

      {/* Message */}
      <h3 className="text-lg font-semibold text-text-primary mb-1.5">
        {message}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-text-muted max-w-xs mb-5">
          {description}
        </p>
      )}

      {/* Action */}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
