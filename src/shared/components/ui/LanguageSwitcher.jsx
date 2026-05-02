/**
 * @component LanguageSwitcher
 * @description Stylish pill-toggle for switching between English and Arabic.
 * Highlights the active language with a primary-colored pill and
 * smooth transition animations. Uses i18next for language management.
 *
 * @prop {string} className - Additional CSS classes for the outer wrapper
 *
 * @example
 *   <LanguageSwitcher className="absolute top-6 end-6" />
 */
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher({ className = "" }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const languages = [
    { code: "en", label: "EN", icon: true },
    { code: "ar", label: "عربي", icon: false },
  ];

  return (
    <div className={className}>
      <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm border border-gray/10">
        {languages.map(({ code, label, icon }) => {
          const isActive = currentLang === code;
          return (
            <button
              key={code}
              onClick={() => i18n.changeLanguage(code)}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-full
                text-xs font-semibold tracking-wide uppercase
                transition-all duration-300
                ${
                  isActive
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                    : "text-gray hover:text-gray-dark hover:bg-gray-light"
                }
              `}
            >
              {icon && <Globe size={13} />}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
