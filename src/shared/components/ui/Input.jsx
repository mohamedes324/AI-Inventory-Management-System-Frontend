/**
 * @component Input
 * @description Reusable text input with icon support, password toggle,
 * validation status styling, and built-in error text display.
 * Automatically adapts to RTL/LTR document direction.
 *
 * @prop {string} label - Field label
 * @prop {'text'|'password'|'email'|'number'|'tel'} type - Input type
 * @prop {string} placeholder - Placeholder text
 * @prop {ReactNode} icon - Leading icon element
 * @prop {string} error - Error message to display below the field
 * @prop {'default'|'error'|'success'} status - Visual validation state
 * @prop {string} className - Additional CSS classes for the input element
 *
 * @example
 *   <Input
 *     label="Email"
 *     icon={<Mail size={18} />}
 *     error={errors.email}
 *     status={errors.email ? "error" : "default"}
 *   />
 */
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
      "border-gray/30 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
    error:
      "border-error focus:border-error focus:ring-2 focus:ring-error/20",
    success:
      "border-secondary-500 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20",
  };

  return (
    <div className="flex flex-col gap-1 w-full relative pb-5">
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
              isRTL ? "right-3.5" : "left-3.5"
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
            w-full rounded-xl border bg-white px-4.5 py-3 outline-none
            transition-all duration-200 text-sm text-gray-dark placeholder:text-gray/50
            ${icon ? (isRTL ? "pr-11 pl-10" : "pl-11 pr-10") : ""}
            ${statusStyles[error ? "error" : status]}
            ${className}
          `}
          {...props}
        />

        {/* PASSWORD TOGGLE */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute top-1/2 -translate-y-1/2 text-gray hover:text-gray-dark transition-colors ${
              isRTL ? "left-3.5" : "right-3.5"
            }`}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* ERROR MESSAGE */}
      <div className="absolute bottom-0 left-0 right-0 h-4">
        {error && (
          <span className="text-[11px] text-error animate-fadeIn block truncate" title={error}>
            {error}
          </span>
        )}
      </div>
    </div>
  );
}