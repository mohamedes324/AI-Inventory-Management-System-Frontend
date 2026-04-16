import { useState } from "react";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import { Mail, User, Phone, ChevronDown } from "lucide-react";
import { Package } from "lucide-react";
import { useRequest } from "@/shared/hooks/useRequest";
import { registerRequest } from "../api/register";
import { useTranslation } from "react-i18next";
import Select from "@/shared/components/ui/Select";

export default function Register() {
  const [form, setForm] = useState({
    userName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    roles: ["Cashier"],
  });

  const [localError, setLocalError] = useState("");

  const { execute: register, loading, error } = useRequest(registerRequest);
  const { t } = useTranslation();

  // 🔥 حل مشكلة الترجمة
  const roleKeyMap = {
    Cashier: "cashier",
    InventoryStaff: "inventoryStaff",
    Admin: "admin",
  };

  const handleRegister = async () => {
    setLocalError("");

    if (!form.userName || !form.fullName || !form.email || !form.phoneNumber) {
      setLocalError(t("auth:register.fillAllFields"));
      return;
    }

    try {
      const data = await register(form);
      console.log("User Created:", data);
    } catch (err) {
      // 👈 هنا تقدر تعمل logic إضافي
      console.log("Caught in component:", err);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* LEFT */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <Package size={20} />
            </div>
            <h1 className="font-semibold text-lg">
              Inventory<span className="text-blue-600">Market</span>
            </h1>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold mb-1">
            {t("auth:register.title")}
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            {t("auth:register.description")}
          </p>

          {/* Form */}
          <div className="flex flex-col gap-4">
            <Input
              label={t("auth:register.userName")}
              placeholder={t("auth:register.enterUserName")}
              icon={<User size={18} />}
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
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
              placeholder={t("auth:register.enterEmail")}
              icon={<Mail size={18} />}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <Input
              label={t("auth:register.phone")}
              placeholder={t("auth:register.enterPhone")}
              icon={<Phone size={18} />}
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
            />

            {/* 🔥 Dropdown */}
            <Select
              label={t("auth:register.role")}
              options={["Cashier", "InventoryStaff", "Admin"]}
              value={form.roles[0]}
              onChange={(val) => setForm({ ...form, roles: [val] })}
              getLabel={(role) => t(`auth:register.${roleKeyMap[role]}`)}
            />

            {/* Errors */}
            {localError && (
              <div className="text-red-500 text-sm text-center">
                {localError}
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm text-center">{error.message}</div>
            )}

            {/* Button */}
            <Button
              fullWidth
              size="lg"
              className="shadow-md mt-2"
              onClick={handleRegister}
              loading={loading}
            >
              {t("auth:register.createAccount")}
            </Button>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden lg:flex w-1/2">
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
