/**
 * @component SearchInput
 * @description Search-specific input field with a leading search icon,
 * an optional clear button, and focus ring animation.
 * Designed for table filters, header search bars, etc.
 *
 * @prop {string} value - Current search value
 * @prop {Function} onChange - Change handler (receives event)
 * @prop {Function} onClear - Called when clear button is clicked
 * @prop {string} placeholder - Placeholder text
 * @prop {string} className - Additional CSS classes
 *
 * @example
 *   <SearchInput
 *     value={query}
 *     onChange={(e) => setQuery(e.target.value)}
 *     onClear={() => setQuery("")}
 *     placeholder="Search products…"
 *   />
 */
import { Search, X } from "lucide-react";

export default function SearchInput({
  value = "",
  onChange,
  onClear,
  placeholder = "Search…",
  className = "",
  ...props
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
        <Search size={18} />
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full rounded-xl border border-border-primary bg-background-input
          pl-11 pr-10 py-2.5 outline-none text-sm text-text-primary
          placeholder:text-text-muted
          transition-all duration-200
          focus:border-border-focus focus:ring-2 focus:ring-primary-500/20
        "
        {...props}
      />

      {/* Clear Button */}
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            text-text-muted hover:text-text-primary transition-colors
            p-0.5 rounded-full hover:bg-background-hover
          "
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
