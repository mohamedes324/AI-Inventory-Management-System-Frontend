import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./ui";
import Sidebar from "./Sidebar";
import { useUIStore } from "@/shared/store/uiStore";

export default function Layout({ children }) {
  const location = useLocation();

  const isMobileOpen      = useUIStore((s) => s.isMobileDrawerOpen);
  const isCollapsed        = useUIStore((s) => s.isSidebarCollapsed);
  const closeMobileDrawer  = useUIStore((s) => s.closeMobileDrawer);
  const toggleMobileDrawer = useUIStore((s) => s.toggleMobileDrawer);
  const toggleCollapse     = useUIStore((s) => s.toggleSidebarCollapse);

  // Close mobile drawer on route change
  useEffect(() => {
    closeMobileDrawer();
  }, [location.pathname, closeMobileDrawer]);

  return (
    <div className="h-screen bg-background-app flex font-sans">

      {/* ── Sidebar ── */}
      <Sidebar
        isOpen={isMobileOpen}
        isCollapsed={isCollapsed}
        closeSidebar={closeMobileDrawer}
      />

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Navbar
          toggleSidebar={toggleMobileDrawer}
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
        />
        <main className="flex-1 overflow-auto bg-background-app">
          {children || <Outlet />}
        </main>
      </div>

    </div>
  );
}
