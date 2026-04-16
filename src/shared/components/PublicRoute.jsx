import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/shared/store/authStore";

export default function PublicRoute({ children }) {
  // اقرأ التوكن من الستور مش من الـ service
  const token = useAuthStore((s) => s.accessToken);

  if (token) {
    // لو مسجل دخول، ممنوع يروح للـ login، وّديه للـ redirect اللي هتوزعه صح
    return <Navigate to="/redirect" replace />;
  }

  return children;
}