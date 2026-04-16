import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import { Mail, Lock } from "lucide-react";
import { Package } from "lucide-react";
import { loginRequest } from "../api/login";
import { useRequest } from "@/shared/hooks/useRequest";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initAuth } from "@/shared/utils/initAuth";

export default function Login() {
  const [form, setForm] = useState({
    userName: "",
    password: "",
  });

  const navigate = useNavigate();
  const { execute: login, loading, error } = useRequest(loginRequest);
  const { t } = useTranslation();
  
// Login.jsx



const handleLogin = async (e) => {
  try {
    if (e) e.preventDefault();
    // 1. عملية الـ Login بس عشان السيرفر يحط الـ Refresh Token في الكوكي
    await login(form); 
    // 2. ننادي initAuth وهي تتولى الباقي (التوكن، الـ Role، الـ Status، والـ Loading)
    await initAuth();

    // 3. لما تخلص، الستور هيكون كامل، والـ redirect هيشتغل صح
    navigate("/redirect");  
  } catch (err) {
    console.log(err);
  }
};

return (
  <div className="min-h-screen flex">
    {/* LEFT SIDE */}
    <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-light px-6 lg:px-16">
      <div className="w-full max-w-md animate-slideLeft bg-white p-8 rounded-2xl shadow-sm">
        
        {/* Language Switch */}
        <button onClick={() => i18n.changeLanguage("en")}>English</button>
        <button onClick={() => i18n.changeLanguage("ar")}>عربي</button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-md">
            <Package size={20} />
          </div>
          <h1 className="font-semibold text-lg tracking-wide">
            Inventory<span className="text-primary-500">Market</span>
          </h1>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-semibold mb-2">
          {t("auth:login.title")}
        </h2>

        <p className="text-gray text-sm mb-8">
          {t("auth:login.description")}
        </p>

        {/* Form */}
        <div className="flex flex-col gap-5">
          <Input
            label={t("auth:login.email")}
            placeholder="admin@inventorymarket.com"
            icon={<Mail size={18} />}
            value={form.userName}
            onChange={(e) =>
              setForm({ ...form, userName: e.target.value })
            }
          />

          <Input
            label={t("auth:login.password")}
            type="password"
            placeholder={t("auth:login.enterPassword")}
            icon={<Lock size={18} />}
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          {error && (
            <div className="text-error text-sm text-center">
              {typeof error === "string" ? error : error.message}
            </div>
          )}

          {/* Button */}
          <Button
            fullWidth
            size="lg"
            className="shadow-md"
            onClick={handleLogin}
            loading={loading}
            disabled={!form.userName || !form.password}
          >
            {t("auth:login.signIn")}
          </Button>
        </div>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="hidden lg:flex w-1/2 relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d"
        alt="warehouse"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/50 to-transparent"></div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-6 w-80 animate-slideUp">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-500 text-white p-2 rounded-lg">📊</div>
            <div>
              <h3 className="font-semibold">
                {t("auth:login.metricsTitle")}
              </h3>
              <p className="text-sm text-gray">
                {t("auth:login.metricsSub")}
              </p>
            </div>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>{t("auth:login.activeSkus")}</span>
            <span className="font-semibold">14,204</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>{t("auth:login.stockHealth")}</span>
            <span className="bg-secondary-500 text-white px-2 py-1 rounded-md text-xs">
              ↑ 98.5%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}