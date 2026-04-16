import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  label,
  type = "text",
  placeholder,
  icon,
  error,
  status = "default",
  className = "",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  // 👇 الاتجاه من الموقع
  const isRTL = document.documentElement.dir === "rtl";

  const statusStyles = {
    default:
      "border-gray focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
    error:
      "border-error focus:border-error focus:ring-2 focus:ring-error/20",
    success:
      "border-secondary-500 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20",
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-gray-dark">
          {label}
        </label>
      )}

      <div className="relative">
        {/* LEFT / RIGHT ICON */}
        {icon && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 text-gray ${
              isRTL ? "right-3" : "left-3"
            }`}
          >
            {icon}
          </div>
        )}

        {/* INPUT */}
        <input
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          dir={isRTL ? "rtl" : "ltr"}
          className={`
            w-full rounded-lg border px-4 py-3 outline-none transition
            ${icon ? "pl-10 pr-10" : ""}
            ${statusStyles[status]}
            ${className}
          `}
          {...props}
        />

        {/* PASSWORD ICON */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute top-1/2 -translate-y-1/2 text-gray hover:text-gray-dark ${
              isRTL ? "left-3" : "right-3"
            }`}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <span className="text-sm text-error">
          {error}
        </span>
      )}
    </div>
  );
}