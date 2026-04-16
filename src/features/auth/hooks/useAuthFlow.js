import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/shared/store/authStore";

import { STATUS } from "@/shared/constants/status";
import { statusRedirectMap, roleHomeMap } from "@/shared/routes/authFlow";

export const useAuthFlow = () => {
  const navigate = useNavigate();
  const { accessToken, status, role, isAuthLoading } = useAuthStore();

  useEffect(() => {
    // 1. استنى التحميل
    if (isAuthLoading) return;

    // 2. مفيش توكن
    if (!accessToken) {
      navigate("/login", { replace: true });
      return;
    }

    // 3. onboarding (مش active)
    if (status && status !== STATUS.ACTIVE) {
      const redirectPath = statusRedirectMap[status];

      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      }

      return;
    }

    // 4. active → روح home حسب role
    if (status === STATUS.ACTIVE && role) {
      const homePath = roleHomeMap[role] || "/login";

      navigate(homePath, { replace: true });
    }
  }, [accessToken, status, role, isAuthLoading, navigate]);
};