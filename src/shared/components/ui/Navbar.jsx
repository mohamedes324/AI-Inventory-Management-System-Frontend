import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Package, Bell, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import SearchInput from "./SearchInput";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar({ toggleSidebar, isCollapsed, toggleCollapse }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  return (
    <nav className="sticky top-0 z-30 w-full bg-background-card/80 backdrop-blur-md border-b border-border-primary px-4 sm:px-6 py-3 shadow-sm shadow-gray-900/5 transition-all duration-300">
      <div className="flex items-center justify-between w-full gap-4">

        {/* ── Left Section ── */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Mobile hamburger */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-transparent border border-border-primary text-text-muted hover:text-primary-600 hover:bg-primary-500/10 transition-all duration-200 active:scale-95"
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Desktop collapse/expand toggle */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex w-10 h-10 items-center justify-center rounded-xl bg-transparent border border-border-primary text-text-muted hover:text-primary-600 hover:bg-primary-500/10 hover:border-primary-500/20 transition-all duration-200 active:scale-95"
            aria-label={isCollapsed ? t("admin:sidebar.expand") : t("admin:sidebar.collapse")}
            title={isCollapsed ? t("admin:sidebar.expand") : t("admin:sidebar.collapse")}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>

          {/* Mobile-only logo */}
          <div className="flex items-center gap-3 cursor-pointer group lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-text-inverse shadow-md shadow-primary-500/20 shrink-0 transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
              <Package size={18} strokeWidth={2.5} />
            </div>
            <h1 className="font-bold text-lg tracking-tight text-text-primary hidden sm:block truncate">
              Inventory
              <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent ml-0.5">
                Market
              </span>
            </h1>
          </div>
        </div>

        {/* ── Center: Search ── */}
        {/* <div className="flex-1 flex justify-center max-w-md mx-auto">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            placeholder={t("common.search", "Search everywhere...")}
            className="w-full"
          />
        </div> */}

        {/* ── Right Section ── */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Notifications */}
          <button
            className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-transparent border border-border-primary text-text-muted hover:text-primary-600 hover:bg-primary-500/10 hover:border-primary-500/20 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            aria-label="Notifications"
          >
            <Bell size={19} />
            {/* Badge */}
            <span className="absolute top-2 end-2 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error border-2 border-background-card" />
            </span>
          </button>

          {/* Divider */}
          <div className="hidden sm:block w-[1px] h-8 bg-border-primary rounded-full" />

          {/* Language Switcher */}
          <LanguageSwitcher />
        </div>

      </div>
    </nav>
  );
}
