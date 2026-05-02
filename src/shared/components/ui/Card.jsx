/**
 * @component Card
 * @description Flexible container component that supports a standard
 * elevated look or a frosted-glass (glassmorphism) variant.
 * Uses the `.glass-card` utility class defined in index.css.
 *
 * @prop {'default'|'glass'} variant - Visual style
 * @prop {'sm'|'md'|'lg'|'none'} padding - Internal spacing
 * @prop {boolean} animate - Apply animate-slideUp entry animation
 * @prop {boolean} hoverable - Add lift effect on hover
 * @prop {string} className - Additional CSS classes
 *
 * @example
 *   <Card variant="glass" hoverable>
 *     <h3>Dashboard Stats</h3>
 *   </Card>
 */
export default function Card({
  children,
  variant = "default",
  padding = "md",
  animate = false,
  hoverable = false,
  className = "",
  ...props
}) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const variantClasses = {
    default:
      "bg-white rounded-2xl shadow-lg shadow-gray-dark/5 border border-gray/5",
    glass: "glass-card",
  };

  return (
    <div
      className={`
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${animate ? "animate-slideUp" : ""}
        ${hoverable ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
