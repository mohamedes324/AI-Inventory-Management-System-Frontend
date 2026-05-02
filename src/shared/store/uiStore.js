import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUIStore = create(
  persist(
    (set) => ({
      // Desktop collapsed state (persisted)
      isSidebarCollapsed: false,

      toggleSidebarCollapse: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

      collapseSidebar: () => set({ isSidebarCollapsed: true }),
      expandSidebar: () => set({ isSidebarCollapsed: false }),

      // Mobile drawer state (NOT persisted — always starts closed)
      isMobileDrawerOpen: false,

      openMobileDrawer: () => set({ isMobileDrawerOpen: true }),
      closeMobileDrawer: () => set({ isMobileDrawerOpen: false }),
      toggleMobileDrawer: () =>
        set((state) => ({ isMobileDrawerOpen: !state.isMobileDrawerOpen })),
    }),
    {
      name: "ui-storage",
      // Only persist the desktop collapse preference, not the mobile drawer
      partialize: (state) => ({
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
    }
  )
);
