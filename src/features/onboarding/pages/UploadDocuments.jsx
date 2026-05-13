import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  LanguageSwitcher,
  Card,
  LogoutButton,
} from "@/shared/components/ui";
import {
  Upload,
  FileCheck2,
  X,
  Zap,
  FileImage,
  ImageIcon,
  Package,
} from "lucide-react";
import { uploadDocumentRequest } from "../api/uploadDocument";
import { useRequest } from "@/shared/hooks/useRequest";
import { useTranslation } from "react-i18next";
import { toast } from "@/shared/store/toastStore";
import { initAuth } from "@/shared/utils/initAuth";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function UploadDocuments() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const inputRef = useRef(null);

  const navigate = useNavigate();
  const { execute: upload, loading } = useRequest(uploadDocumentRequest);
  const { t } = useTranslation();

  // ── File Validation ──
  const validateFile = useCallback(
    (selectedFile) => {
      if (!ALLOWED_TYPES.includes(selectedFile.type)) {
        toast.error(t("onboarding:uploadDocuments.errorFormat"));
        return false;
      }
      if (selectedFile.size > MAX_SIZE) {
        toast.error(t("onboarding:uploadDocuments.errorSize"));
        return false;
      }
      return true;
    },
    [t]
  );

  // ── Handle File Selection ──
  const handleFile = useCallback(
    (selectedFile) => {
      if (!selectedFile || !validateFile(selectedFile)) return;
      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setPreview(null);
      }
    },
    [validateFile]
  );

  const handleFileChange = (e) => handleFile(e.target.files[0]);

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // ── Drag & Drop ──
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (!file) { toast.error(t("onboarding:uploadDocuments.errorNoFile")); return; }
    try {
      await upload(file);
      toast.success(t("onboarding:uploadDocuments.success"));
      await initAuth();
      navigate("/redirect");
    } catch (err) {
      toast.error(err?.message || "Upload failed");
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="min-h-screen bg-background-app flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-secondary-500/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Language Switcher + Logout — top end */}
      <div className="absolute top-8 end-8 z-20 flex items-center gap-2">
        <LogoutButton variant="icon" />
        <LanguageSwitcher />
      </div>

      {/* Main Card */}
      <div className="w-full max-w-lg animate-slideUp">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3.5 mb-8 animate-fadeIn">
          <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/25">
            <Package size={22} />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-text-primary">
            Inventory
            <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              Market
            </span>
          </h1>
        </div>

        <Card className="animate-slideUp shadow-xl shadow-background-app/30">
          <div className="p-8 flex flex-col gap-6">
            {/* Heading */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-2">
                {t("onboarding:uploadDocuments.title")}
              </h2>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                {t("onboarding:uploadDocuments.description")}
              </p>
            </div>

            {/* ── Drop Zone / File Preview ── */}
            {!file ? (
              <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  relative flex flex-col items-center justify-center w-full
                  rounded-2xl border-2 border-dashed cursor-pointer
                  transition-all duration-500 group overflow-hidden
                  h-64
                  ${
                    isDragging
                      ? "border-primary-500 bg-primary-50/70 scale-[1.01] shadow-lg shadow-primary-500/10"
                      : "border-border-secondary bg-background-hover/60 hover:border-primary-400 hover:bg-primary-50/30 hover:scale-[1.005]"
                  }
                `}
              >
                {/* Dot grid background */}
                <div
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle, var(--color-primary-500, #6366f1) 1px, transparent 1px)`,
                    backgroundSize: "22px 22px",
                  }}
                />

                {/* Upload icon */}
                <div
                  className={`
                    w-20 h-20 rounded-3xl flex items-center justify-center mb-5
                    transition-all duration-500
                    ${
                      isDragging
                         ? "bg-primary-500 text-text-inverse scale-110 shadow-2xl shadow-primary-500/40"
                         : "bg-background-card text-primary-500 shadow-md group-hover:bg-primary-50 group-hover:scale-105 group-hover:shadow-primary-500/10"
                    }
                  `}
                >
                  <Upload
                    size={36}
                    strokeWidth={1.8}
                    className={isDragging ? "animate-bounce" : ""}
                  />
                </div>

                <p className="font-bold text-text-primary text-lg mb-1.5">
                  {isDragging
                    ? t("onboarding:uploadDocuments.activeDropText")
                    : t("onboarding:uploadDocuments.dragTitle")}
                </p>
                <p className="text-text-muted text-sm mb-4">
                  {t("onboarding:uploadDocuments.dragSubtitle")}
                </p>
                <span className="text-xs font-medium text-text-muted bg-background-card/80 px-4 py-1.5 rounded-full border border-border-primary">
                  {t("onboarding:uploadDocuments.formats")}
                </span>

                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              /* ── File Preview ── */
              <div className="rounded-2xl border border-border-primary bg-background-hover/50 overflow-hidden animate-slideUp">
                {preview ? (
                  <div
                    className="h-52 flex items-center justify-center cursor-pointer group overflow-hidden bg-background-card"
                    onClick={() => setShowPreview(true)}
                  >
                    <img
                      src={preview}
                      alt="preview"
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="h-52 bg-gradient-to-br from-primary-50 to-primary-100/40 flex flex-col items-center justify-center">
                    <FileImage size={52} className="text-primary-300 mb-3" />
                    <span className="text-sm text-primary-400 font-medium">PDF Document</span>
                  </div>
                )}

                {/* File info */}
                <div className="flex items-center justify-between px-5 py-4 bg-background-card border-t border-border-primary">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary-500/10 flex items-center justify-center">
                      <FileCheck2 size={20} className="text-secondary-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary truncate max-w-[220px]">
                        {file.name}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">{formatSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemove}
                    className="w-9 h-9 rounded-xl bg-error/8 flex items-center justify-center text-error/70 hover:bg-error/15 hover:text-error transition-all duration-200"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ── Info Badges ── */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <ImageIcon size={14} />, label: t("onboarding:uploadDocuments.idPassport") },
                { icon: <FileCheck2 size={14} />, label: t("onboarding:uploadDocuments.clearPhoto") },
                { icon: <Zap size={14} />,       label: t("onboarding:uploadDocuments.fastReview") },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center justify-center gap-2 bg-background-hover rounded-xl py-2.5 px-2 text-xs font-medium text-text-secondary border border-border-primary"
                >
                  <span className="text-primary-500 shrink-0">{badge.icon}</span>
                  <span className="truncate">{badge.label}</span>
                </div>
              ))}
            </div>

            {/* ── Submit Button ── */}
            <Button
              fullWidth
              size="lg"
              onClick={handleSubmit}
              loading={loading}
              disabled={!file}
            >
              {loading
                ? t("onboarding:uploadDocuments.submitting")
                : t("onboarding:uploadDocuments.submit")}
            </Button>
          </div>
        </Card>
      </div>

      {/* ── Full-Screen Image Preview Modal ── */}
      {showPreview && preview && (
        <div
          className="fixed inset-0 bg-background-app/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="relative animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={preview}
              alt="full preview"
              className="max-w-[90vw] max-h-[85vh] rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setShowPreview(false)}
              className="absolute -top-3 -right-3 w-10 h-10 bg-background-card rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform text-text-primary"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
