/**
 * @component Avatar
 * @description Profile image with automatic fallback to initials.
 * Supports multiple sizes and an optional status indicator dot.
 *
 * @prop {string} src - Image URL
 * @prop {string} name - User name (used to derive initials fallback)
 * @prop {'sm'|'md'|'lg'|'xl'} size - Avatar dimensions
 * @prop {'online'|'offline'|'busy'} status - Optional status dot
 * @prop {string} className - Additional CSS classes
 *
 * @example
 *   <Avatar name="Mohamed Ahmed" size="lg" status="online" />
 *   <Avatar src="/user.jpg" name="Sara" />
 */
export default function Avatar({
  src,
  name = "",
  size = "md",
  status,
  className = "",
}) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const statusColors = {
    online: "bg-secondary-500",
    offline: "bg-gray",
    busy: "bg-error",
  };

  const statusSizes = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-3.5 h-3.5",
  };

  /** Extract up to 2 initials from the name */
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white shadow-sm`}
        />
      ) : (
        <div
          className={`
            ${sizeClasses[size]}
            rounded-full flex items-center justify-center
            bg-gradient-to-br from-primary-500 to-primary-600
            text-white font-semibold ring-2 ring-white shadow-sm
          `}
        >
          {initials || "?"}
        </div>
      )}

      {/* Status Dot */}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${statusSizes[size]}
            ${statusColors[status]}
            rounded-full ring-2 ring-white
          `}
        />
      )}
    </div>
  );
}
