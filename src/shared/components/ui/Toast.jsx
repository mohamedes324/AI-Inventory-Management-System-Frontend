/**
 * @component Toast / ToastContainer
 * @description Lightweight notification system.
 * - `ToastContainer` renders all active toasts (place once in App root).
 * - Toasts auto-dismiss and can be manually closed.
 * - Uses the `toast` helper from toastStore for easy triggering.
 *
 * Supports four types: success, error, warning, info.
 * Each type uses the corresponding theme color.
 *
 * @example
 *   // In App.jsx:
 *   import { ToastContainer } from "@/shared/components/ui/Toast";
 *   <ToastContainer />
 *
 *   // Anywhere else:
 *   import { toast } from "@/shared/store/toastStore";
 *   toast.success("Item created!");
 */
import { useToastStore } from "@/shared/store/toastStore";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

const typeConfig = {
  success: {
    bgClass: "bg-secondary-500",
    Icon: CheckCircle,
  },
  error: {
    bgClass: "bg-error",
    Icon: AlertCircle,
  },
  warning: {
    bgClass: "bg-warning",
    Icon: AlertTriangle,
  },
  info: {
    bgClass: "bg-primary-500",
    Icon: Info,
  },
};

/** Single toast item */
function ToastItem({ id, type, message }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const { bgClass, Icon } = typeConfig[type] || typeConfig.info;

  return (
    <div
      className={`
        ${bgClass} text-white
        flex items-center gap-3 px-5 py-3.5 rounded-xl
        shadow-xl shadow-gray-dark/10
        animate-slideRight
        min-w-[280px] max-w-md
      `}
    >
      <Icon size={20} className="shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={() => removeToast(id)}
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  );
}

/** Container — renders in a fixed position. Place once in your App root. */
export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (!toasts.length) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  );
}

export default ToastContainer;
