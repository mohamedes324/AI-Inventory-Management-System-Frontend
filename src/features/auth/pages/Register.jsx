import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Select,
  LanguageSwitcher,
  FormWrapper,
  Card,
} from "@/shared/components/ui";
import {
  Mail,
  User,
  Phone,
  Package,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Users,
} from "lucide-react";
import { registerRequest } from "../api/register";
import { checkUsernameRequest } from "../api/checkUsername";
import { checkEmailRequest } from "../api/checkEmail";
import { checkPhoneNumberRequest } from "../api/checkPhoneNumber";
import { useRequest } from "@/shared/hooks/useRequest";
import { useTranslation } from "react-i18next";
import { toast } from "@/shared/store/toastStore";

const DEBOUNCE_MS = 600;

export default function Register() {
  const [form, setForm] = useState({
    userName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    roles: ["Cashier"],
  });

  // Per-field error messages (null = no error / not yet checked)
  const [fieldErrors, setFieldErrors] = useState({
    userName: null,
    email: null,
    phoneNumber: null,
  });

  // Per-field "checking in progress" flags
  const [checking, setChecking] = useState({
    userName: false,
    email: false,
    phoneNumber: false,
  });

  // Debounce timers
  const timers = useRef({ userName: null, email: null, phoneNumber: null });

  const navigate = useNavigate();
  const { execute: register, loading } = useRequest(registerRequest);
  const { t } = useTranslation();

  const roleKeyMap = {
    Cashier: "cashier",
    InventoryStaff: "inventoryStaff",
    Admin: "admin",
  };

  // ─── Generic debounced uniqueness checker ─────────────────────────────────
  const scheduleCheck = useCallback(
    (field, value, apiFn, takenKey) => {
      // Clear any pending timer for this field
      if (timers.current[field]) clearTimeout(timers.current[field]);

      // Reset state while the user is still typing
      setFieldErrors((prev) => ({ ...prev, [field]: null }));
      setChecking((prev) => ({ ...prev, [field]: false }));

      if (!value.trim()) return;

      // Show "checking" hint after a short delay
      timers.current[field] = setTimeout(async () => {
        setChecking((prev) => ({ ...prev, [field]: true }));
        try {
          const data = await apiFn({ [field === "userName" ? "userName" : field === "email" ? "email" : "phoneNumber"]: value });
          if (data?.exists) {
            setFieldErrors((prev) => ({
              ...prev,
              [field]: t(`auth:register.${takenKey}`),
            }));
          } else {
            setFieldErrors((prev) => ({ ...prev, [field]: "" }));
          }
        } catch {
          // Silently ignore network errors; don't block the user
          setFieldErrors((prev) => ({ ...prev, [field]: null }));
        } finally {
          setChecking((prev) => ({ ...prev, [field]: false }));
        }
      }, DEBOUNCE_MS);
    },
    [t]
  );

  // ─── Per-field onChange handlers ──────────────────────────────────────────
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

  // ─── Derived helpers ──────────────────────────────────────────────────────
  const isAnyChecking = Object.values(checking).some(Boolean);
  const hasFieldError = Object.values(fieldErrors).some((v) => v);

  // Helper: resolve Input status for a field
  const inputStatus = (field) => {
    if (fieldErrors[field]) return "error";
    if (fieldErrors[field] === "" && !checking[field]) return "success";
    return "default";
  };

  // Helper: resolve error message (show "Checking…" while in-flight)
  const inputError = (field) => {
    if (checking[field]) return t("auth:register.checking");
    return fieldErrors[field] || undefined;
  };

  const handleRegister = async (e) => {
    try {
      if (e) e.preventDefault();

      if (!form.userName || !form.fullName || !form.email || !form.phoneNumber) {
        toast.error(t("auth:register.fillAllFields") || "Please fill all fields");
        return;
      }

      if (hasFieldError || isAnyChecking) return;

      await register(form);
      toast.success(t("auth:register.success") || "Account created successfully!");
      navigate("/login");
    } catch (err) {
      const message = err?.message || "Registration failed";
      toast.error(message);
      console.log("Registration Error:", err);
    }
  };

  const logo = (
    <div className="flex items-center gap-3.5">
      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/25 animate-scaleIn">
        <Package size={24} />
      </div>
      <h1 className="font-bold text-xl tracking-tight text-gray-dark">
        Inventory
        <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
          Market
        </span>
      </h1>
    </div>
  );



  return (
    <div className="h-screen flex overflow-hidden">
      {/* ═══════════ LEFT SIDE — Register Form ═══════════ */}
      <div className="w-full lg:w-[48%] flex flex-col items-center justify-center bg-gray-light px-4 lg:px-12 py-3 relative overflow-y-auto">
        <LanguageSwitcher className="absolute top-5 end-5 z-20" />

        <FormWrapper
          title={t("auth:register.title")}
          description={t("auth:register.description")}
          logo={logo}
          compact
        >
          <div className="flex flex-col gap-1">
            <Input
              label={t("auth:register.userName")}
              placeholder={t("auth:register.enterUserName")}
              icon={<User size={18} />}
              value={form.userName}
              onChange={handleUserNameChange}
              status={inputStatus("userName")}
              error={inputError("userName")}
            />
            <Input
              label={t("auth:register.fullName")}
              placeholder={t("auth:register.enterFullName")}
              icon={<User size={18} />}
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <Input
              label={t("auth:register.email")}
              type="email"
              placeholder={t("auth:register.enterEmail")}
              icon={<Mail size={18} />}
              value={form.email}
              onChange={handleEmailChange}
              status={inputStatus("email")}
              error={inputError("email")}
            />
            <Input
              label={t("auth:register.phone")}
              placeholder={t("auth:register.enterPhone")}
              icon={<Phone size={18} />}
              value={form.phoneNumber}
              onChange={handlePhoneChange}
              status={inputStatus("phoneNumber")}
              error={inputError("phoneNumber")}
            />
            <Select
              label={t("auth:register.role")}
              options={["Cashier", "InventoryStaff", "Admin"]}
              value={form.roles[0]}
              onChange={(val) => setForm({ ...form, roles: [val] })}
              getLabel={(role) => t(`auth:register.${roleKeyMap[role]}`)}
            />

            <Button
              fullWidth
              size="lg"
              onClick={handleRegister}
              loading={loading || isAnyChecking}
              disabled={hasFieldError || isAnyChecking}
              className="mt-0"
            >
              {t("auth:register.createAccount")}
            </Button>
          </div>
        </FormWrapper>


      </div>

      {/* ═══════════ RIGHT SIDE — Visual Showcase ═══════════ */}
      <div className="hidden lg:flex w-[52%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d"
          alt="warehouse"
          className="w-full h-full object-cover scale-110"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700/90 via-primary-600/80 to-secondary-500/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-dark/40 via-transparent to-primary-700/30" />

        {/* Decorative Orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-secondary-400/20 rounded-full blur-[100px] animate-float" />
        <div
          className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-primary-400/20 rounded-full blur-[80px] animate-float"
          style={{ animationDelay: "2s" }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-10 xl:px-16 z-10 text-center">
          <div className="mb-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white/90 text-xs sm:text-sm font-medium mb-4">
              <Zap size={14} className="text-secondary-400 fill-secondary-400" />
              Join the future of Logistics
            </div>
            <h2 className="text-3xl xl:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-xl">
              Scale Your Business<br />with Intelligence
            </h2>
            <p className="text-white/80 text-sm xl:text-xl max-w-md mx-auto leading-relaxed">
              Start managing your inventory with AI-driven automation in minutes.
            </p>
          </div>

          {/* Feature Highlights Card */}
          <Card
            variant="glass"
            padding="lg"
            className="animate-float w-full max-w-sm shadow-2xl border-white/20 backdrop-blur-2xl"
          >
            <div className="space-y-5">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
                  <ShieldCheck size={24} className="text-secondary-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Enterprise Security</h4>
                  <p className="text-white/60 text-sm">Bank-grade data encryption and RBAC</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
                  <Users size={24} className="text-secondary-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Team Collaboration</h4>
                  <p className="text-white/60 text-sm">Multi-user support with custom permissions</p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 mt-2">
                <div className="flex items-center gap-2 text-secondary-400 font-semibold text-sm">
                  <CheckCircle2 size={16} />
                  <span>99.9% Uptime SLA Guaranteed</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Trust Badge */}
          <div
            className="animate-float mt-6 flex -space-x-3 overflow-hidden"
            style={{ animationDelay: "1.5s" }}
          >
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white/20 bg-gray-300"
                src={`https://i.pravatar.cc/100?img=${i + 10}`}
                alt="user"
              />
            ))}
            <div className="flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white/20 bg-primary-600 text-[10px] font-bold text-white">
              +2k
            </div>
          </div>
          <p className="text-white/50 text-xs mt-3">Trusted by 2,000+ companies worldwide</p>
        </div>
      </div>
    </div>
  );
}
