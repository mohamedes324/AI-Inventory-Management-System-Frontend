/**
 * @component Loader
 * @description Flexible loading indicator with two variants:
 * - "spinner": Animated spinning circle (for buttons, inline, overlays)
 * - "shimmer": Skeleton placeholder blocks (for content placeholders)
 *
 * Uses custom animate-shimmer utility from index.css and design tokens.
 *
 * @prop {'spinner'|'shimmer'} variant - Visual style
 * @prop {'sm'|'md'|'lg'} size - Size of the spinner
 * @prop {number} lines - Number of shimmer lines to render
 * @prop {string} className - Additional CSS classes
 *
 * @example
 *   <Loader />
 *   <Loader variant="shimmer" lines={4} />
 */
export default function Loader({
  variant = "spinner",
  size = "md",
  lines = 3,
  className = "",
}) {
  /* ── Spinner Variant ── */
  if (variant === "spinner") {
    const sizeClasses = {
      sm: "w-5 h-5 border-2",
      md: "w-8 h-8 border-[3px]",
      lg: "w-12 h-12 border-4",
    };

    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div
          className={`
            ${sizeClasses[size]}
            border-primary-500/30 border-t-primary-500
            rounded-full animate-spin
          `}
        />
      </div>
    );
  }

  /* ── Shimmer / Skeleton Variant ── */
  const shimmerWidths = ["w-full", "w-3/4", "w-5/6", "w-2/3", "w-4/5", "w-1/2"];

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`
            h-4 rounded-lg animate-shimmer
            ${shimmerWidths[i % shimmerWidths.length]}
          `}
        />
      ))}
    </div>
  );
}
