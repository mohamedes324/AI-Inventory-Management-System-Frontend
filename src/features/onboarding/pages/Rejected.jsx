import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, LanguageSwitcher, LogoutButton } from "@/shared/components/ui";
import { useRequest } from "@/shared/hooks/useRequest";
import { getRejectionReason } from "../api/getRejectionReason";

export default function Rejected() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [reason, setReason] = useState("");

  const { execute: fetchReason, loading } = useRequest(getRejectionReason);

  useEffect(() => {
    const loadReason = async () => {
      try {
        const data = await fetchReason();
        // Handle different possible payload structures from the backend
        const fetchedReason = typeof data === 'string' 
          ? data 
          : (data?.reason || data?.rejectionReason || data?.message || "");
        setReason(fetchedReason);
      } catch (err) {
        console.error("Failed to fetch rejection reason", err);
      }
    };
    loadReason();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-fadeIn bg-background-app relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] bg-secondary-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Language Switcher + Logout */}
      <div className="absolute top-5 end-5 z-20 flex items-center gap-2">
        <LogoutButton variant="icon" />
        <LanguageSwitcher />
      </div>

      <div className="bg-background-card rounded-2xl shadow-xl border border-border-primary p-8 w-full max-w-md text-center animate-scaleIn">
        
        {/* Icon */}
        <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5 animate-pulse bg-error">
          <span className="text-text-inverse text-2xl">❌</span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold mb-3 text-text-primary">
          {t("onboarding:rejected.title")}
        </h1>

        {/* Description */}
        <p className="text-sm mb-4 text-text-secondary">
          {t("onboarding:rejected.description")}
        </p>

        {/* 🔴 Dynamic Reason */}
        <div className="bg-error/10 text-error text-sm rounded-lg py-3 px-4 mb-6 min-h-[52px] flex items-center justify-center">
          {loading ? (
            <span className="flex items-center gap-2 text-error/60 animate-pulse">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-error/20 border-t-error animate-spin" />
              Loading...
            </span>
          ) : reason ? (
            <span className="font-medium">⚠️ {reason}</span>
          ) : (
            <span className="font-medium">⚠️ {t("onboarding:rejected.reason")}</span>
          )}
        </div>

        {/* Button */}
        <Button
          fullWidth
          onClick={() => navigate("/upload-documents")}
        >
          {t("onboarding:rejected.retry")}
        </Button>
      </div>
    </div>
  );
}