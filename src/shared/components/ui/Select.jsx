import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

/**
 * @component Select
 * @description Professional custom select component with smart positioning,
 * glassmorphism dropdown, and smooth bounce animations.
 */
export default function Select({
  label,
  options = [],
  value,
  onChange,
  getLabel,
  error,
  status = "default",
  placeholder = "Select an option",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const ref = useRef();
  const dropdownRef = useRef();

  // Smart Positioning: Detect if dropdown should open upwards
  useLayoutEffect(() => {
    if (isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 260; // Max height of dropdown
      setDropUp(spaceBelow < dropdownHeight && rect.top > dropdownHeight);
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusStyles = {
    default:
      "border-border-primary focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-500/8 focus-within:shadow-[0_0_0_4px_rgba(34,197,94,0.06)]",
    error:
      "border-error/60 focus-within:border-error focus-within:ring-4 focus-within:ring-error/8",
    success:
      "border-secondary-500/60 focus-within:border-secondary-400 focus-within:ring-4 focus-within:ring-secondary-500/8",
  };

  const displayLabel = value ? (getLabel ? getLabel(value) : value) : placeholder;

  return (
    <div className="flex flex-col gap-1 w-full relative pb-5" ref={ref}>
      {/* Label */}
      {label && (
        <label className="text-sm font-semibold text-text-secondary tracking-tight ml-1">
          {label}
        </label>
      )}

      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group flex items-center justify-between w-full rounded-xl border bg-background-input px-5 py-3 cursor-pointer
          transition-all duration-300 outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]
          ${statusStyles[error ? "error" : status]}
          ${isOpen ? "border-primary-400 shadow-[var(--shadow-elevated)]" : "hover:border-border-secondary"}
        `}
      >
        <span className={`font-medium text-sm transition-colors leading-none flex items-center ${!value ? "text-text-muted" : "text-text-primary"}`}>
          {displayLabel}
        </span>

        <ChevronDown
          size={18}
          className={`text-text-muted transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${
            isOpen ? "rotate-180 text-primary-500" : "group-hover:text-text-primary"
          }`}
        />
      </div>

      {/* Dropdown Menu (Glassmorphism) */}
      <div
        ref={dropdownRef}
        className={`
          absolute left-0 right-0 w-full bg-background-elevated/95 backdrop-blur-xl border border-border-secondary rounded-2xl shadow-[var(--shadow-elevated)] z-[100]
          overflow-hidden transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) origin-center
          ${dropUp ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"}
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : `opacity-0 scale-95 pointer-events-none ${dropUp ? "translate-y-4" : "-translate-y-4"}`
          }
        `}
      >
        <div className="max-h-[240px] overflow-y-auto py-2 custom-scrollbar">
          {options.length > 0 ? (
            options.map((option, idx) => {
              const isSelected = option === value;
              const labelText = getLabel ? getLabel(option) : option;

              return (
                <div
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`
                    flex items-center justify-between px-5 py-3 cursor-pointer text-[14px] transition-all duration-200
                    ${
                      isSelected
                        ? "bg-gradient-to-r from-primary-500 to-primary-600 text-text-inverse font-bold"
                        : "text-text-primary hover:bg-background-hover hover:text-primary-400"
                    }
                  `}
                >
                  <span>{labelText}</span>
                  {isSelected && <Check size={16} className="text-text-inverse" />}
                </div>
              );
            })
          ) : (
            <div className="px-5 py-4 text-sm text-text-muted text-center italic">
              No options available
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      <div className="absolute bottom-0 left-1 right-1 h-4">
        {error && (
          <span className="text-[11px] text-error font-medium animate-fadeIn block truncate" title={error}>
            {error}
          </span>
        )}
      </div>
    </div>
  );
}