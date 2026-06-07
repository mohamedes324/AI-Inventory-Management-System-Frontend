/**
 * @component StarRating
 * @description Displays a star rating (1-5). Read-only display.
 * When showValue is true, displays "X.X / 5" underneath the stars.
 */
import { Star } from "lucide-react";

export default function StarRating({ rating = 0, max = 5, showValue = false }) {
  const rounded = Math.round(rating);

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`
              transition-colors
              ${i < rounded
                ? "fill-warning text-warning"
                : "fill-none text-border-secondary"
              }
            `}
          />
        ))}
        {!showValue && rating > 0 && (
          <span className="text-[11px] font-medium text-text-muted ml-1.5">{rating.toFixed(1)}</span>
        )}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-text-secondary">
          {rating > 0 ? rating.toFixed(1) : "0.0"} / {max}
        </span>
      )}
    </div>
  );
}
