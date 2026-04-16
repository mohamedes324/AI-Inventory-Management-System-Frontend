import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function Select({
  label,
  options = [],
  value,
  onChange,
  getLabel,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  // 🔥 يقفل لما تدوس برا
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {label && (
        <label className="text-sm font-medium text-gray-dark mb-1 block">
          {label}
        </label>
      )}

      {/* Selected */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between border border-gray rounded-lg px-4 py-2.5 cursor-pointer bg-white hover:border-primary-500 transition"
      >
        <span className="text-gray font-medium">
          {getLabel ? getLabel(value) : value}
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown */}
      <div
        className={`
          absolute left-0 top-full mt-2 w-full bg-white border border-gray-light rounded-xl shadow-xl z-50
          transform transition-all duration-300 ease-out origin-top

          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }
        `}
      >
        {options.map((option) => {
          const isSelected = option === value;

          return (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`
                px-4 py-3 cursor-pointer text-sm transition-all duration-200

                ${
                  isSelected
                    ? "bg-primary-500/10 text-primary-500 font-semibold"
                    : "text-gray"
                }

                hover:bg-primary-500/10 hover:text-primary-500
                hover:scale-[1.03]
              `}
            >
              {getLabel ? getLabel(option) : option}
            </div>
          );
        })}
      </div>
    </div>
  );
}