import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Input,
  LanguageSwitcher,
  FormWrapper,
  Card,
} from "@/shared/components/ui";
import { Mail, Lock, Package, BarChart3, ArrowUpRight, TrendingUp } from "lucide-react";
import { loginRequest } from "../api/login";
import { useRequest } from "@/shared/hooks/useRequest";
import { useTranslation } from "react-i18next";
import { initAuth } from "@/shared/utils/initAuth";
import { toast } from "@/shared/store/toastStore";

export default function Login() {
  const [form, setForm] = useState({
    userName: "super_admin",
    password: "AdminPassword123!",
  });

  const navigate = useNavigate();
  const { execute: login, loading } = useRequest(loginRequest);
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    try {
      if (e) e.preventDefault();
      await login(form);
      await initAuth();

      toast.success(t("auth:login.welcomeBack") || "Welcome Back!");
      navigate("/redirect");
    } catch (err) {
      const message = err?.message || "Something went wrong";
      toast.error(message);
      console.log(err);
    }
  };

  const logo = (
    <div className="flex items-center gap-3.5">
      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/25 animate-scaleIn">
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
    <div className="min-h-screen flex">
      {/* ═══════════ LEFT SIDE — Login Form ═══════════ */}
      <div className="w-full lg:w-[48%] flex flex-col items-center justify-center bg-background-app px-6 lg:px-16 py-12 relative">

        <LanguageSwitcher className="absolute top-7 end-7 z-20" />

        <FormWrapper
          title={t("auth:login.title")}
          description={t("auth:login.description")}
          logo={logo}
        >
          <Input
            label={t("auth:login.email")}
            placeholder="admin@inventorymarket.com"
            icon={<Mail size={18} />}
            value={form.userName}
            onChange={(e) => setForm({ ...form, userName: e.target.value })}
          />

          <Input
            label={t("auth:login.password")}
            type="password"
            placeholder={t("auth:login.enterPassword")}
            icon={<Lock size={18} />}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Button
            fullWidth
            size="lg"
            onClick={handleLogin}
            loading={loading}
            disabled={!form.userName || !form.password}
          >
            {t("auth:login.signIn")}
          </Button>
        </FormWrapper>

      </div>

      {/* ═══════════ RIGHT SIDE — Visual Showcase ═══════════ */}
      <div className="hidden lg:flex w-[52%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d"
          alt="warehouse"
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700/90 via-primary-600/70 to-secondary-500/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background-app/30 via-transparent to-primary-700/20" />

        {/* Decorative Orbs */}
        <div className="absolute top-24 right-24 w-72 h-72 bg-secondary-500/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-32 left-16 w-64 h-64 bg-primary-500/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-12 z-10">
          <div className="text-center mb-10 animate-fadeIn">
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              Smart Inventory<br />Management
            </h2>
            <p className="text-white/70 text-lg max-w-sm mx-auto leading-relaxed">
              AI-powered insights for your supply chain
            </p>
          </div>

          {/* Floating Metrics Card */}
          <Card variant="glass" padding="lg" className="animate-float w-80 shadow-2xl border-white/20">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-2.5 rounded-xl shadow-lg shadow-primary-500/25">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="font-bold text-text-primary text-[15px]">
                  {t("auth:login.metricsTitle")}
                </h3>
                <p className="text-sm text-text-muted">
                  {t("auth:login.metricsSub")}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm bg-background-app/70 rounded-xl px-4 py-3">
                <span className="text-text-muted">{t("auth:login.activeSkus")}</span>
                <span className="font-bold text-text-primary">14,204</span>
              </div>
              <div className="flex justify-between items-center text-sm bg-background-app/70 rounded-xl px-4 py-3">
                <span className="text-text-muted">{t("auth:login.stockHealth")}</span>
                <span className="inline-flex items-center gap-1 bg-secondary-500 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-sm">
                  <ArrowUpRight size={12} />
                  98.5%
                </span>
              </div>
            </div>
          </Card>

          {/* Floating Badge */}
          <div
            className="animate-float mt-6 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/20 flex items-center gap-2"
            style={{ animationDelay: "1s" }}
          >
            <TrendingUp size={16} className="text-secondary-500" />
            <span className="text-white/90 text-sm font-medium">
              Real-time Analytics
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}