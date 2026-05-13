/**
 * @component StarRating
 * @description Displays a star rating (1-5). Read-only display.
 */
import { Star } from "lucide-react";

export default function StarRating({ rating = 0, max = 5 }) {
  const rounded = Math.round(rating);

  return (
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
      {rating > 0 && (
        <span className="text-[11px] font-medium text-text-muted ml-1.5">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
