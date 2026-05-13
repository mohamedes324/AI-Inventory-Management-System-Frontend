import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  LanguageSwitcher,
  FormWrapper,
  LogoutButton,
} from "@/shared/components/ui";
import { Lock, ShieldCheck, Package, CheckCircle2, XCircle } from "lucide-react";
import { useRequest } from "@/shared/hooks/useRequest";
import { changePasswordRequest } from "@/features/auth/api/changePassword";
import { useTranslation } from "react-i18next";
import { toast } from "@/shared/store/toastStore";
import { initAuth } from "@/shared/utils/initAuth";
import { usePasswordStrength } from "@/shared/hooks/usePasswordStrength";

export default function SetPassword() {
  const [form, setForm] = useState({
    currentPassword: "Welcome123@", // Predefined as per backend agreement
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const { execute: setPassword, loading } = useRequest(changePasswordRequest);
  const { t } = useTranslation();

  // ── Real-time Password Validation ──
  const { checks, isPasswordValid, passwordsMatch, isFormValid } =
    usePasswordStrength(form.newPassword, form.confirmPassword);

  // Build constraint rule list with i18n labels
  const rules = [
    { key: "length",    label: t("onboarding:setPassword.ruleLength") },
    { key: "uppercase", label: t("onboarding:setPassword.ruleUppercase") },
    { key: "lowercase", label: t("onboarding:setPassword.ruleLowercase") },
    { key: "special",   label: t("onboarding:setPassword.ruleSpecial") },
    { key: "number",    label: t("onboarding:setPassword.ruleNumber") },
  ];

  // ── Submit Handler ──
  const handleSetPassword = async (e) => {
    if (e) e.preventDefault();
    if (!isFormValid) return;

    try {
      await setPassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmNewPassword: form.confirmPassword,
      });

      toast.success(t("onboarding:setPassword.success"));
      await initAuth();
      navigate("/redirect");
    } catch (err) {
      const message = err?.message || "Failed to update password";
      toast.error(message);
    }
  };

  // ── Confirm field visual status ──
  const confirmStatus = !form.confirmPassword
    ? "default"
    : passwordsMatch
    ? "success"
    : "error";

  const logo = (
    <div className="flex items-center justify-center gap-3.5 mb-2">
      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/25">
        <Package size={24} />
      </div>
      <h1 className="font-bold text-xl tracking-tight text-text-primary">
        Inventory
        <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
          Market
        </span>
      </h1>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-app flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute top-8 end-8 z-20 flex items-center gap-2">
        <LogoutButton variant="icon" />
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md animate-slideUp">
        <FormWrapper
          title={t("onboarding:setPassword.title")}
          description={t("onboarding:setPassword.description")}
          logo={logo}
        >
          <div className="flex flex-col gap-3">
            {/* Current Password (pre-filled) */}
            <Input
              label={t("onboarding:setPassword.currentPassword")}
              type="password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            />

            {/* New Password */}
            <div className="flex flex-col gap-2">
              <Input
                label={t("onboarding:setPassword.newPassword")}
                type="password"
                placeholder={t("onboarding:setPassword.enterPassword")}
                icon={<ShieldCheck size={18} />}
                value={form.newPassword}
                status={
                  !form.newPassword ? "default" : isPasswordValid ? "success" : "default"
                }
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              />

              {/* ── Constraint Checklist (animated) ── */}
              {form.newPassword && (
                <ul className="animate-fadeIn grid grid-cols-1 gap-1.5 pt-1 ps-1">
                  {rules.map(({ key, label }) => {
                    const passed = checks[key];
                    return (
                      <li
                        key={key}
                        className={`
                          flex items-center gap-2.5 text-[13px] font-medium
                          transition-colors duration-300
                          ${passed ? "text-secondary-600" : "text-error/80"}
                        `}
                      >
                        {passed ? (
                          <CheckCircle2
                            size={15}
                            className="text-secondary-500 shrink-0 transition-all duration-300"
                          />
                        ) : (
                          <XCircle
                            size={15}
                            className="text-error/60 shrink-0 transition-all duration-300"
                          />
                        )}
                        {label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <Input
                label={t("onboarding:setPassword.confirmPassword")}
                type="password"
                placeholder={t("onboarding:setPassword.confirmYourPassword")}
                icon={<ShieldCheck size={18} />}
                value={form.confirmPassword}
                status={confirmStatus}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />

              {/* Match indicator */}
              {form.confirmPassword && (
                <p
                  className={`
                    animate-fadeIn text-[13px] font-medium flex items-center gap-2 ps-1
                    transition-colors duration-300
                    ${passwordsMatch ? "text-secondary-600" : "text-error/80"}
                  `}
                >
                  {passwordsMatch ? (
                    <CheckCircle2 size={14} className="text-secondary-500 shrink-0" />
                  ) : (
                    <XCircle size={14} className="text-error/60 shrink-0" />
                  )}
                  {passwordsMatch
                    ? t("onboarding:setPassword.passwordsMatch")
                    : t("onboarding:setPassword.passwordsNoMatch")}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              fullWidth
              size="lg"
              onClick={handleSetPassword}
              loading={loading}
              disabled={!isFormValid}
              className="mt-1"
            >
              {t("onboarding:setPassword.savePassword")}
            </Button>
          </div>
        </FormWrapper>
      </div>
    </div>
  );
}