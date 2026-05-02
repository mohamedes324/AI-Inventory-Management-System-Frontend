/**
 * @module toastStore
 * @description Zustand-based toast notification store.
 * Provides a global state for toast messages with auto-dismiss.
 *
 * Usage (from any file, no hooks required):
 *   import { toast } from "@/shared/store/toastStore";
 *   toast.success("Profile updated!");
 *   toast.error("Failed to save changes.");
 */
import { create } from "zustand";

let _toastId = 0;

export const useToastStore = create((set) => ({
  toasts: [],

  /**
   * Add a new toast notification.
   * @param {'success'|'error'|'warning'|'info'} type
   * @param {string} message
   * @param {number} duration - Auto-dismiss time in ms (0 = manual dismiss)
   */
  addToast: ({ type = "info", message, duration = 4000 }) => {
    const id = ++_toastId;
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }

    return id;
  },

  /** Remove a specific toast by ID */
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

/**
 * Convenience helper — call from anywhere without hooks.
 * @example toast.success("Saved!")
 */
export const toast = {
  success: (message, duration) =>
    useToastStore.getState().addToast({ type: "success", message, duration }),
  error: (message, duration) =>
    useToastStore.getState().addToast({ type: "error", message, duration }),
  warning: (message, duration) =>
    useToastStore.getState().addToast({ type: "warning", message, duration }),
  info: (message, duration) =>
    useToastStore.getState().addToast({ type: "info", message, duration }),
};
