/**
 * @component Button
 * @description Premium, multi-variant button with built-in loading state
 * and interactive halo glow animation on hover/focus.
 *
 * @prop {'primary'|'secondary'|'ghost'|'danger'} variant - Visual style
 * @prop {'sm'|'md'|'lg'} size - Padding & font scale
 * @prop {boolean} fullWidth - Stretch to container width
 * @prop {boolean} loading - Show loading indicator & disable
 * @prop {boolean} disabled - Disable interactions
 * @prop {boolean} halo - Enable halo glow animation on hover/focus (default: true for primary)
 * @prop {string} className - Additional CSS classes
 *
 * @example
 *   <Button variant="primary" size="lg" halo onClick={handleSubmit}>
 *     Save Changes
 *   </Button>
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  halo,
  type = "button",
  className = "",
  ...props
}) {
  const base =
    "rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95";

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-b from-primary-500 to-primary-600 text-text-inverse hover:from-primary-400 hover:to-primary-600 shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 ring-1 ring-primary-400/20",
    secondary:
      "bg-gradient-to-b from-secondary-500 to-secondary-600 text-text-inverse hover:from-secondary-400 hover:to-secondary-600 shadow-lg shadow-secondary-500/20 hover:shadow-xl hover:shadow-secondary-500/30 ring-1 ring-secondary-400/20",
    ghost:
      "bg-background-elevated/50 text-text-secondary hover:text-text-primary hover:bg-background-elevated border border-border-primary hover:border-border-secondary hover:shadow-sm",
    danger:
      "bg-gradient-to-b from-error to-error/80 text-text-inverse hover:from-error/90 hover:to-error/70 shadow-lg shadow-error/20 hover:shadow-xl hover:shadow-error/30 ring-1 ring-error/20",
  };

  // Halo is on by default for primary & secondary, off for ghost & danger
  const showHalo = halo ?? (variant === "primary" || variant === "secondary");

  const haloClass = showHalo && !disabled ? "hover:animate-halo focus:animate-halo" : "";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        ${base}
        ${sizes[size]}
        ${variantClasses[variant]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${haloClass}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 border-3 border-text-inverse/30 border-t-text-inverse rounded-full animate-spin" />
          <span>{children}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}