export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  ...props
}) {
  const base =
    "rounded-lg font-medium transition-all duration-200 flex items-center justify-center";

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-5 py-3 text-lg",
  };

  // 🎯 بدل style → classes
  const variantClasses = {
    primary: "bg-primary-500 text-white hover:bg-primary-600",
    secondary: "bg-secondary-500 text-white hover:bg-secondary-600",
  };

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
        ${className}
      `}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}