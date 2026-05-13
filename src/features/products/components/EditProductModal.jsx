/**
 * @component EditProductModal
 * @description Modal for editing product name and category.
 * Only accessible by InventoryStaff role.
 */
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { X, Pencil } from "lucide-react";
import { Input, Select, Button } from "@/shared/components/ui";
import { useRequest } from "@/shared/hooks/useRequest";
import { getCategories } from "@/features/categories/api/getCategories";

export default function EditProductModal({ isOpen, onClose, onSubmit, loading, product }) {
  const { t } = useTranslation("products");
  const [form, setForm] = useState({ name: "", categoryId: "" });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const { execute: fetchCategories } = useRequest(getCategories);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (isOpen && product) {
      setForm({
        name: product.name || "",
        categoryId: product.category?.id || "",
      });
      if (!fetchedRef.current) {
        fetchedRef.current = true;
        fetchCategories()
          .then((data) => setCategories(data || []))
          .catch(() => {});
      }
    }
    if (!isOpen) {
      fetchedRef.current = false;
      setErrors({});
    }
  }, [isOpen, product]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t("validation.nameRequired");
    if (!form.categoryId) e.categoryId = t("validation.categoryRequired");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: form.name.trim(),
      categoryId: Number(form.categoryId),
    });
  };

  const updateField = (field) => (e) => {
    const val = e?.target ? e.target.value : e;
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background-app/70 backdrop-blur-sm animate-fadeIn p-4"
      onClick={onClose}
    >
      <div
        className="bg-background-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/25">
                <Pencil size={18} />
              </div>
              <h3 className="text-lg font-bold text-text-primary">{t("editModal.title")}</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-background-hover text-text-muted hover:text-error hover:bg-error/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="h-px mt-4 bg-gradient-to-r from-transparent via-border-primary to-transparent" />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-1">
          <Input
            label={t("fields.name")}
            placeholder={t("fields.namePlaceholder")}
            value={form.name}
            onChange={updateField("name")}
            error={errors.name}
          />

          <Select
            label={t("fields.category")}
            placeholder={t("fields.categoryPlaceholder")}
            options={categories.map((c) => c.id)}
            value={form.categoryId}
            onChange={updateField("categoryId")}
            getLabel={(id) => categories.find((c) => c.id === id)?.name || ""}
            error={errors.categoryId}
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
              <Pencil size={14} />
              {t("editModal.submit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
