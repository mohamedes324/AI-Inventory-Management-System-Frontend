import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/shared/store/authStore";
import { LogoutButton } from "@/shared/components/ui";
import {
  LayoutDashboard,
  UserCheck,
  Users,
  UserPlus,
  Package,
  ShoppingCart,
  FolderOpen,
  Truck,
  X,
} from "lucide-react";

// ── Role-based navigation config ──
const ADMIN_LINKS = [
  { path: "/dashboard",        icon: LayoutDashboard, labelKey: "sidebar.dashboard" },
  { path: "/categories",       icon: FolderOpen,      labelKey: "sidebar.categories", ns: "categories" },
  { path: "/pending-accounts", icon: UserCheck,       labelKey: "sidebar.pendingAccounts" },
  { path: "/users-management", icon: Users,           labelKey: "sidebar.usersManagement" },
  { path: "/create-user",      icon: UserPlus,        labelKey: "sidebar.createUser" },
];

const MANAGER_LINKS = [
  { path: "/dashboard",        icon: LayoutDashboard, labelKey: "sidebar.dashboard" },
  { path: "/categories",       icon: FolderOpen,      labelKey: "sidebar.categories", ns: "categories" },
  { path: "/products",         icon: Package,         labelKey: "sidebar.products" },
  { path: "/suppliers",        icon: Truck,           labelKey: "sidebar.suppliers", ns: "suppliers" },
  { path: "/users-management", icon: Users,           labelKey: "sidebar.usersManagement" },
];

const STAFF_LINKS = [
  { path: "/dashboard",        icon: LayoutDashboard, labelKey: "sidebar.dashboard" },
  { path: "/categories", icon: FolderOpen,    labelKey: "sidebar.categories", ns: "categories" },
  { path: "/products",   icon: Package,       labelKey: "sidebar.products" },
  { path: "/suppliers",  icon: Truck,         labelKey: "sidebar.suppliers", ns: "suppliers" },
  { path: "/orders",     icon: ShoppingCart,   labelKey: "sidebar.orders" },
];

const CASHIER_LINKS = [
  { path: "/dashboard",        icon: LayoutDashboard, labelKey: "sidebar.dashboard" },
  { path: "/categories", icon: FolderOpen,    labelKey: "sidebar.categories", ns: "categories" },
  { path: "/products",   icon: Package,       labelKey: "sidebar.products" },
  { path: "/orders",     icon: ShoppingCart,   labelKey: "sidebar.orders" },
];

// ── Tooltip for collapsed icons ──
function Tooltip({ text, show, children }) {
  if (!show) return children;
  return (
    <div className="relative group/tip">
      {children}
      <div className="
        absolute start-full top-1/2 -translate-y-1/2 ms-3
        px-3 py-1.5 rounded-lg bg-background-elevated text-text-primary text-xs font-medium whitespace-nowrap
        opacity-0 group-hover/tip:opacity-100 pointer-events-none
        transition-all duration-200 scale-95 group-hover/tip:scale-100
        shadow-lg z-[100]
      ">
        {text}
        <span className="absolute end-full top-1/2 -translate-y-1/2 border-[5px] border-transparent ltr:border-r-background-elevated rtl:border-l-background-elevated" />
      </div>
    </div>
  );
}

export default function Sidebar({ isOpen, isCollapsed, closeSidebar }) {
  const { t, i18n } = useTranslation("admin");
  const { role } = useAuthStore();

  const links =
    role === "Admin" ? ADMIN_LINKS :
    role === "Manager" ? MANAGER_LINKS :
    role === "InventoryStaff" ? STAFF_LINKS :
    role === "Cashier" ? CASHIER_LINKS :
    [];
  const { i18n: i18nInstance } = useTranslation();
  const isRTL = i18nInstance.language === "ar";

  /** Resolve label: use link.ns namespace if provided, else admin */
  const getLabel = (link) =>
    link.ns ? i18n.t(link.labelKey, { ns: link.ns }) : t(link.labelKey);

  // Mobile hide direction — plain classes, no ltr:/rtl: variants
  // This avoids the Tailwind variant specificity conflict with lg:translate-x-0
  const mobileHideClass = isRTL ? "translate-x-full" : "-translate-x-full";

  return (
    <>
      {/* ── Mobile Overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background-app/60 backdrop-blur-sm lg:hidden animate-fadeIn"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={[
          // Base styles (always applied)
          "z-50 flex flex-col bg-background-sidebar border-e border-border-primary shrink-0",
          "transition-all duration-300 ease-in-out",

          // Mobile: fixed drawer
          "fixed inset-y-0 start-0 w-64 shadow-xl shadow-gray-900/10",
          isOpen ? "translate-x-0" : mobileHideClass,

          // Desktop: override to in-flow flex child, always visible
          "lg:relative lg:inset-auto lg:translate-x-0 lg:shadow-none",
          isCollapsed ? "lg:w-[72px]" : "lg:w-64",

          // Fix scroll issue: use h-screen and overflow-hidden when collapsed
          "h-screen",
          isCollapsed ? "lg:overflow-hidden" : "",
        ].join(" ")}
      >
        {/* ── Header ── */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border-primary/30 shrink-0">
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isCollapsed ? "lg:justify-center lg:w-full" : ""}`}>
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-text-inverse shadow-md shadow-primary-500/20 shrink-0">
              <Package size={18} strokeWidth={2.5} />
            </div>
            <span className={`font-bold text-base tracking-tight text-text-primary truncate transition-all duration-300 ${isCollapsed ? "lg:hidden" : ""}`}>
              Inventory<span className="text-primary-600">Market</span>
            </span>
          </div>

          {/* Mobile close */}
          <button
            onClick={closeSidebar}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-error/10 hover:text-error transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Nav Links ── */}
        <div className={`flex-1 py-4 px-3 space-y-1 ${isCollapsed ? "lg:overflow-hidden" : "overflow-y-auto"}`}>
          {links.map((link) => (
            <Tooltip key={link.path} text={getLabel(link)} show={isCollapsed}>
              <NavLink
                to={link.path}
                onClick={closeSidebar}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group relative overflow-hidden
                  ${isCollapsed ? "lg:justify-center lg:px-0" : ""}
                  ${isActive
                    ? "text-primary-700 bg-primary-500/10 shadow-sm shadow-primary-500/10"
                    : "text-text-muted hover:text-primary-600 hover:bg-primary-500/5"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute start-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary-500 rounded-e-full" />
                    )}
                    <link.icon
                      size={18}
                      className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-primary-600" : ""}`}
                    />
                    <span className={`truncate transition-all duration-300 ${isCollapsed ? "lg:hidden" : ""}`}>
                      {getLabel(link)}
                    </span>
                  </>
                )}
              </NavLink>
            </Tooltip>
          ))}
        </div>

        {/* ── Logout ── */}
        <div className="p-3 border-t border-border-primary/30 shrink-0">
          <Tooltip text={t("sidebar.logout")} show={isCollapsed}>
            <LogoutButton
              className={isCollapsed ? "lg:justify-center lg:px-0" : ""}
            />
          </Tooltip>
        </div>
      </aside>
    </>
  );
}
