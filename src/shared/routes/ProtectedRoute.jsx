import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/shared/store/authStore";
// import { getUserRoleFromToken } from "@/shared/utils/jwt";

export default function ProtectedRoute({ children, roles, pageStatus }) {
  const { accessToken, status, role } = useAuthStore();

  // 1️⃣ مش محتاجين useEffect ولا setLoading هنا خالص!
  // لأن الـ App.jsx مش هيفتح الـ Router أصلاً غير لما الـ Auth يخلص.
  console.log(accessToken, status, role);
  // 2️⃣ فحص تسجيل الدخول
  if (!accessToken) return <Navigate to="/login" />;

  // 3️⃣ فحص الصلاحيات (Role)
  if (roles && !roles.includes(role)) {
    console.warn("🚫 Role mismatch, redirecting...");
    return <Navigate to="/redirect" replace />;
  }

  // 4️⃣ فحص الحالة (Status)
  if (pageStatus && !pageStatus.includes(status)) {
    // لو حالته مش مطابقة للصفحة، نرجعه للـ Redirect عشان يوجهه صح
    console.warn("⚠️ Status mismatch, redirecting...");
    return <Navigate to="/redirect" replace />;
  }

  return children;
}
