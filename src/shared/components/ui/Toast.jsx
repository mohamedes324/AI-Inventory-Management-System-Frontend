import { useToastStore } from "@/shared/store/toastStore";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

const typeConfig = {
  success: { bgClass: "bg-secondary-500", Icon: CheckCircle },
  error: { bgClass: "bg-error", Icon: AlertCircle },
  warning: { bgClass: "bg-warning", Icon: AlertTriangle },
  info: { bgClass: "bg-primary-500", Icon: Info },
};

function ToastItem({ id, type, message }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const { bgClass, Icon } = typeConfig[type] || typeConfig.info;

  return (
    <div className={`${bgClass} text-text-inverse flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl shadow-gray-900/10 animate-slideRight min-w-[280px] max-w-md`}>
      <Icon size={20} className="shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={() => removeToast(id)} className="shrink-0 opacity-70 hover:opacity-100 transition-opacity">
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  if (!toasts.length) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
      {toasts.map((t) => (<ToastItem key={t.id} {...t} />))}
    </div>
  );
}

export default ToastContainer;
