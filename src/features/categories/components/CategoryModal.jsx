/**
 * @component CategoryModal
 * @description Modal for creating or editing a category.
 * - Create mode: Name input + Image upload with preview, remove, and full-view
 * - Edit mode: Name input only (image update is separate via PATCH)
 */
import { useState, useEffect, useCallback } from "react";
import { X, Upload, FolderPlus, Pencil, Trash2, ZoomIn } from "lucide-react";
import { Button, Input, ImageModal } from "@/shared/components/ui";
import { useTranslation } from "react-i18next";

export default function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  category = null,  // null = create mode, object = edit mode
}) {
  const { t } = useTranslation("categories");
  const isEditMode = Boolean(category);

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(category?.name || "");
      setImage(null);
      setPreview(null);
      setShowPreviewModal(false);
    }
  }, [isOpen, category]);

  const handleKeyDown = useCallback(
    (e) => { if (e.key === "Escape" && !showPreviewModal) onClose(); },
    [onClose, showPreviewModal]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      // Revoke old preview URL to avoid memory leaks
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    if (!isEditMode && !image) return;
    onSubmit({ name: name.trim(), image });
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background-app/70 backdrop-blur-sm animate-fadeIn"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md mx-4 bg-background-card rounded-2xl shadow-2xl animate-scaleIn overflow-hidden"
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-text-inverse shadow-md shadow-primary-500/20">
                {isEditMode ? <Pencil size={16} /> : <FolderPlus size={16} />}
              </div>
              <h3 className="text-lg font-bold text-text-primary">
                {isEditMode ? t("editCategory") : t("addCategory")}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-error/10 hover:text-error transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="px-6 py-5 flex flex-col gap-4">
            <Input
              label={t("categoryName")}
              placeholder={t("enterCategoryName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Image upload — only in create mode */}
            {!isEditMode && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">
                  {t("categoryImage")}
                </label>

                {preview ? (
                  /* ── Image Preview ── */
                  <div className="category-modal__preview-container">
                    <img
                      src={preview}
                      alt="Preview"
                      className="category-modal__preview-image"
                      onClick={() => setShowPreviewModal(true)}
                    />
                    {/* Overlay actions */}
                    <div className="category-modal__preview-actions">
                      <button
                        type="button"
                        onClick={() => setShowPreviewModal(true)}
                        className="category-modal__preview-btn hover:bg-white/30"
                        title={t("viewImage")}
                      >
                        <ZoomIn size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="category-modal__preview-btn hover:bg-error/30"
                        title={t("removeImage")}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── Upload Zone ── */
                  <label className="category-modal__upload-zone cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                    <div className="flex flex-col items-center gap-2 text-text-muted">
                      <Upload size={28} />
                      <span className="text-xs font-medium">{t("uploadImage")}</span>
                    </div>
                  </label>
                )}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="px-6 py-4 border-t border-border-primary flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              loading={loading}
              disabled={!name.trim() || (!isEditMode && !image)}
            >
              {isEditMode ? t("save") : t("create")}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Full-size Image Preview Modal ── */}
      <ImageModal
        isOpen={showPreviewModal}
        src={preview}
        alt={name || "Category image"}
        onClose={() => setShowPreviewModal(false)}
        closeLabel={t("cancel")}
      />
    </>
  );
}
