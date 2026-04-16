import { useState } from "react";
import Button from "@/shared/components/ui/Button";
import { useTranslation } from "react-i18next";
import { uploadDocumentRequest } from "../api/uploadDocument";
import { useRequest } from "@/shared/hooks/useRequest";

export default function UploadDocuments() {
  const { t } = useTranslation();

  const [preview, setPreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [file, setFile] = useState(null);
  const { execute: upload, loading, error } = useRequest(uploadDocumentRequest);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile); // 👈 ده المهم
    setPreview(URL.createObjectURL(selectedFile));
    setCurrentStep(2);
  };

  const handleRemove = () => {
    setPreview(null);
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    if (!file) return;

    try {
      await upload(file);
      console.log("Uploaded successfully");
    } catch (err) {
      console.log(err);
    }
  };

return (
  <div
    className="min-h-screen flex items-center justify-center px-4 md:px-6 animate-fadeIn bg-gray-light"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full max-w-6xl">
      {/* LEFT */}
      <div className="bg-white p-5 md:p-6 rounded-2xl shadow-lg animate-slideUp order-2 md:order-1">
        <h2 className="text-base md:text-lg font-semibold mb-2 animate-slideLeft">
          {t("onboarding:uploadDocuments.title")}
        </h2>

        <p className="text-sm text-gray-500 mb-6 animate-slideRight">
          {t("onboarding:uploadDocuments.description")}
        </p>

        {/* Upload */}
        {!preview ? (
          <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 md:p-12 h-[200px] md:h-[260px] flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition animate-scaleIn">
            <div className="text-3xl md:text-4xl mb-3">📤</div>

            <p className="font-medium text-gray-700 text-center text-sm md:text-base">
              {t("onboarding:uploadDocuments.uploadText")}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              {t("onboarding:uploadDocuments.formats")}
            </p>

            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="flex flex-col items-center gap-3 animate-scaleIn">
            <img
              src={preview}
              alt="preview"
              onClick={() => setShowPreview(true)}
              className="w-full h-[200px] md:h-[260px] object-contain rounded-xl bg-gray-100 cursor-pointer"
            />

            <button
              onClick={handleRemove}
              className="text-error text-sm hover:underline"
            >
              {t("onboarding:uploadDocuments.remove")}
            </button>
          </div>
        )}

        {/* Info */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 mt-6 text-[10px] md:text-xs">
          <div className="bg-gray-50 p-2 md:p-3 rounded-lg text-center">
            📄 {t("onboarding:uploadDocuments.idPassport")}
          </div>
          <div className="bg-gray-50 p-2 md:p-3 rounded-lg text-center">
            📷 {t("onboarding:uploadDocuments.clearPhoto")}
          </div>
          <div className="bg-gray-50 p-2 md:p-3 rounded-lg text-center">
            ⚡ {t("onboarding:uploadDocuments.fastReview")}
          </div>
        </div>

        {/* Button */}
        <div className="mt-6">
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={!file}
            loading={loading}
          >
            {t("onboarding:uploadDocuments.submit")}
          </Button>
          {error && (
            <div className="text-error text-sm text-center mt-3 animate-fadeIn">
              {error.message}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-col justify-center animate-slideRight text-center md:text-left hidden md:flex">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {t("onboarding:uploadDocuments.rightTitle")}
        </h1>

        <p className="text-gray-500 mb-6 text-sm md:text-base">
          {t("onboarding:uploadDocuments.rightDesc")}
        </p>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div
            className={`flex-1 p-3 md:p-4 rounded-xl transition ${
              currentStep === 1
                ? "bg-gradient-to-r from-primary-500/20 to-primary-500/10 scale-105 animate-glow"
                : "bg-white opacity-70"
            }`}
          >
            <div className="text-xs md:text-sm font-semibold mb-1">
              {t("onboarding:uploadDocuments.step1")}
            </div>
            {t("onboarding:uploadDocuments.step1Text")}
          </div>

          <div
            className={`flex-1 p-3 md:p-4 rounded-xl transition ${
              currentStep === 2
                ? "bg-gradient-to-r from-primary-500/20 to-primary-500/10 scale-105 animate-glow"
                : "bg-white opacity-70"
            }`}
          >
            <div className="text-xs md:text-sm font-semibold mb-1">
              {t("onboarding:uploadDocuments.step2")}
            </div>
            {t("onboarding:uploadDocuments.step2Text")}
          </div>
        </div>
      </div>
    </div>

    {/* Preview */}
    {showPreview && (
      <div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn"
        onClick={() => setShowPreview(false)}
      >
        <div
          className="relative animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={preview}
            alt="full-preview"
            className="max-w-[90vw] max-h-[85vh] rounded-xl"
          />

          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 shadow hover:scale-110 transition"
          >
            ✕
          </button>
        </div>
      </div>
    )}
  </div>
);
}
