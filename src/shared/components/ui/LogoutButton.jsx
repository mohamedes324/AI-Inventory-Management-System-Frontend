/**
 * @component LogoutButton
 * @description Reusable logout button that uses the correct logout flow:
 * 1. Calls the backend logout API (via shared/utils/auth)
 * 2. Clears the Zustand auth store
 * 3. Navigates to /login
 *
 * Comes in two variants:
 * - "full"  — Sidebar-style row with icon + label (default)
 * - "icon"  — Small icon-only button for onboarding / compact headers
 *
 * @prop {'full'|'icon'} variant - Visual style
 * @prop {string} className - Additional CSS classes
 *
 * @example
 *   <LogoutButton />
 *   <LogoutButton variant="icon" />
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";
import { logout } from "@/shared/utils/auth";
import { useAuthStore } from "@/shared/store/authStore";

export default function LogoutButton({ variant = "full", className = "" }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    clearAuth();
    navigate("/login");
  };

  /* ── Icon-only variant (onboarding pages) ── */
  if (variant === "icon") {
    return (
      <button
        onClick={handleLogout}
        disabled={loading}
        className={`
          w-10 h-10 flex items-center justify-center rounded-xl
          bg-white/80 backdrop-blur-sm border border-gray/10 shadow-sm
          text-gray hover:text-error hover:bg-error/10 hover:border-error/20
          transition-all duration-200 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        title={t("auth:logout", "Logout")}
        aria-label={t("auth:logout", "Logout")}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-error/30 border-t-error rounded-full animate-spin" />
        ) : (
          <LogOut size={16} />
        )}
      </button>
    );
  }

  /* ── Full variant (sidebar-style row) ── */
  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
        text-sm font-medium text-gray
        hover:text-error hover:bg-error/10
        transition-all duration-200 group
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? (
        <span className="w-[18px] h-[18px] border-2 border-error/30 border-t-error rounded-full animate-spin shrink-0" />
      ) : (
        <LogOut
          size={18}
          className="shrink-0 transition-transform duration-300 group-hover:ltr:-translate-x-0.5 group-hover:rtl:translate-x-0.5"
        />
      )}
      <span className="truncate">
        {t("auth:logout", "Logout")}
      </span>
    </button>
  );
}
