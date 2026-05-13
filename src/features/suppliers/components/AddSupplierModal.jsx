/**
 * @component AddSupplierModal
 * @description Modal form for creating a new supplier.
 * Fields: Name, Phone Number, Contact Info, Address.
 */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Truck, User, Phone, MapPin, Mail } from "lucide-react";
import { Input, Button } from "@/shared/components/ui";

export default function AddSupplierModal({ isOpen, onClose, onSubmit, loading }) {
  const { t } = useTranslation("suppliers");
  const [form, setForm] = useState({ name: "", phoneNumber: "", contactInfo: "", address: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setForm({ name: "", phoneNumber: "", contactInfo: "", address: "" });
      setErrors({});
    }
  }, [isOpen]);

  const update = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t("validation.nameRequired");
    if (!form.phoneNumber.trim()) errs.phoneNumber = t("validation.phoneRequired");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background-app/70 backdrop-blur-sm animate-fadeIn p-4"
      onClick={onClose}
    >
      <div
        className="bg-background-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/25">
                <Truck size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">{t("addModal.title")}</h3>
                <p className="text-xs text-text-muted">{t("addModal.description")}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-background-hover text-text-muted hover:text-error hover:bg-error/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-1">
            <Input
              label={t("fields.name")}
              placeholder={t("fields.namePlaceholder")}
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              error={errors.name}
              icon={<User size={18} />}
            />
            <Input
              label={t("fields.phone")}
              placeholder={t("fields.phonePlaceholder")}
              value={form.phoneNumber}
              onChange={(e) => update("phoneNumber", e.target.value)}
              error={errors.phoneNumber}
              icon={<Phone size={18} />}
            />
            <Input
              label={t("fields.contact")}
              placeholder={t("fields.contactPlaceholder")}
              value={form.contactInfo}
              onChange={(e) => update("contactInfo", e.target.value)}
              icon={<Mail size={18} />}
            />
            <Input
              label={t("fields.address")}
              placeholder={t("fields.addressPlaceholder")}
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              icon={<MapPin size={18} />}
            />

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
              >
                {t("common.cancel")}
              </button>
              <Button type="submit" size="sm" loading={loading}>
                {t("addModal.submit")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
