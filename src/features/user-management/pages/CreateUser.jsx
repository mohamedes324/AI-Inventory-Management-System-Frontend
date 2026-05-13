import { useState, useRef, useCallback } from "react";
import {
  Button,
  Input,
  Select,
} from "@/shared/components/ui";
import {
  Mail,
  User,
  Phone,
  UserPlus,
  Shield,
  Users,
  Sparkles,
} from "lucide-react";
import { registerRequest } from "@/features/auth/api/register";
import { checkUsernameRequest } from "@/features/auth/api/checkUsername";
import { checkEmailRequest } from "@/features/auth/api/checkEmail";
import { checkPhoneNumberRequest } from "@/features/auth/api/checkPhoneNumber";
import { useRequest } from "@/shared/hooks/useRequest";
import { useTranslation } from "react-i18next";
import { toast } from "@/shared/store/toastStore";
import Layout from "@/shared/components/Layout";

const DEBOUNCE_MS = 600;

/* ── Floating Decorative Shape ── */
function FloatingShape({ className, children, delay = "0s" }) {
  return (
    <div
      className={`absolute opacity-50 animate-float ${className}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}

export default function CreateUser() {
  const [form, setForm] = useState({
    userName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    roles: ["Cashier"],
  });

  const [fieldErrors, setFieldErrors] = useState({
    userName: null,
    email: null,
    phoneNumber: null,
  });

  const [checking, setChecking] = useState({
    userName: false,
    email: false,
    phoneNumber: false,
  });

  const timers = useRef({ userName: null, email: null, phoneNumber: null });

  const { execute: register, loading } = useRequest(registerRequest);
  const { t } = useTranslation("admin");

  const roleKeyMap = {
    Cashier: "cashier",
    InventoryStaff: "inventoryStaff",
    Admin: "admin",
    Manager: "manager",
  };

  const scheduleCheck = useCallback(
    (field, value, apiFn, takenKey) => {
      if (timers.current[field]) clearTimeout(timers.current[field]);

      setFieldErrors((prev) => ({ ...prev, [field]: null }));
      setChecking((prev) => ({ ...prev, [field]: false }));

      if (!value.trim()) return;

      timers.current[field] = setTimeout(async () => {
        setChecking((prev) => ({ ...prev, [field]: true }));
        try {
          const data = await apiFn({ [field === "userName" ? "userName" : field === "email" ? "email" : "phoneNumber"]: value });
          if (data?.exists) {
            setFieldErrors((prev) => ({
              ...prev,
              [field]: t(`createUserPage.${takenKey}`),
            }));
          } else {
            setFieldErrors((prev) => ({ ...prev, [field]: "" }));
          }
        } catch {
          setFieldErrors((prev) => ({ ...prev, [field]: null }));
        } finally {
          setChecking((prev) => ({ ...prev, [field]: false }));
        }
      }, DEBOUNCE_MS);
    },
    [t]
  );

  const handleUserNameChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, userName: value }));
    scheduleCheck("userName", value, checkUsernameRequest, "usernameTaken");
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, email: value }));
    scheduleCheck("email", value, checkEmailRequest, "emailTaken");
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, phoneNumber: value }));
    scheduleCheck("phoneNumber", value, checkPhoneNumberRequest, "phoneTaken");
  };

  const isAnyChecking = Object.values(checking).some(Boolean);
  const hasFieldError = Object.values(fieldErrors).some((v) => v);

  const inputStatus = (field) => {
    if (fieldErrors[field]) return "error";
    if (fieldErrors[field] === "" && !checking[field]) return "success";
    return "default";
  };

  const inputError = (field) => {
    if (checking[field]) return t("createUserPage.checking");
    return fieldErrors[field] || undefined;
  };

  const handleRegister = async (e) => {
    try {
      if (e) e.preventDefault();

      if (!form.userName || !form.fullName || !form.email || !form.phoneNumber) {
        toast.error(t("createUserPage.fillAllFields") || "Please fill all fields");
        return;
      }

      if (hasFieldError || isAnyChecking) return;

      await register(form);
      toast.success(t("createUserPage.success") || "Account created successfully!");
      setForm({ userName: "", fullName: "", email: "", phoneNumber: "", roles: ["Cashier"] });
    } catch (err) {
      const message = err?.message || "Registration failed";
      toast.error(message);
    }
  };

  return (
    <Layout>
      <div className="create-user-page">
        {/* ═══════════════════════════════════════════
            LEFT — Decorative Visual Panel
            ═══════════════════════════════════════════ */}
        <div className="create-user-visual">
          {/* Gradient overlay mesh */}
          <div className="create-user-visual__mesh" />

          {/* Floating decorative elements */}
          <FloatingShape className="top-[12%] left-[10%]" delay="0s">
            <div className="w-16 h-16 rounded-2xl border-2 border-white/30 rotate-12" />
          </FloatingShape>
          <FloatingShape className="top-[35%] right-[15%]" delay="0.8s">
            <Shield size={40} className="text-white/40" />
          </FloatingShape>
          <FloatingShape className="bottom-[25%] left-[18%]" delay="1.6s">
            <div className="w-10 h-10 rounded-full border-2 border-white/25" />
          </FloatingShape>
          <FloatingShape className="bottom-[12%] right-[12%]" delay="0.4s">
            <Users size={32} className="text-white/30" />
          </FloatingShape>
          <FloatingShape className="top-[60%] left-[50%]" delay="1.2s">
            <Sparkles size={24} className="text-white/35" />
          </FloatingShape>

          {/* Central hero content */}
          <div className="create-user-visual__hero animate-fadeIn">
            <div className="create-user-visual__icon-ring animate-float">
              <UserPlus size={36} className="text-white" />
            </div>
            <h2 className="text-white text-2xl font-bold mt-6 tracking-tight">
              {t("createUserPage.title")}
            </h2>
            <p className="text-white/70 text-sm mt-2 max-w-[220px] text-center leading-relaxed">
              {t("createUserPage.description")}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            RIGHT — Form Panel
            ═══════════════════════════════════════════ */}
        <div className="create-user-form-panel">
          <div className="create-user-card animate-slideUp">
            {/* Card Header */}
            <div className="create-user-card__header">
              <div className="create-user-card__icon">
                <UserPlus size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary tracking-tight">
                  {t("createUserPage.title")}
                </h2>
                <p className="text-[13px] text-text-secondary mt-0.5">
                  {t("createUserPage.description")}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="create-user-card__divider" />

            {/* Form Fields */}
            <div className="flex flex-col">
              <Input
                label={t("createUserPage.userName")}
                placeholder={t("createUserPage.enterUserName")}
                icon={<User size={18} />}
                value={form.userName}
                onChange={handleUserNameChange}
                status={inputStatus("userName")}
                error={inputError("userName")}
              />
              <Input
                label={t("createUserPage.fullName")}
                placeholder={t("createUserPage.enterFullName")}
                icon={<User size={18} />}
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
              <Input
                label={t("createUserPage.email")}
                type="email"
                placeholder={t("createUserPage.enterEmail")}
                icon={<Mail size={18} />}
                value={form.email}
                onChange={handleEmailChange}
                status={inputStatus("email")}
                error={inputError("email")}
              />
              <Input
                label={t("createUserPage.phone")}
                placeholder={t("createUserPage.enterPhone")}
                icon={<Phone size={18} />}
                value={form.phoneNumber}
                onChange={handlePhoneChange}
                status={inputStatus("phoneNumber")}
                error={inputError("phoneNumber")}
              />
              <Select
                label={t("createUserPage.role")}
                options={["Cashier", "InventoryStaff", "Admin", "Manager"]}
                value={form.roles[0]}
                onChange={(val) => setForm({ ...form, roles: [val] })}
                getLabel={(role) => t(`createUserPage.${roleKeyMap[role]}`)}
              />

              <Button
                fullWidth
                size="lg"
                onClick={handleRegister}
                loading={loading || isAnyChecking}
                disabled={hasFieldError || isAnyChecking}
                className="mt-1"
              >
                {t("createUserPage.createAccount")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
