import { useState, useRef } from "react";
import { Pencil, Trash2, ImagePlus, ArrowRight, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { baseURL } from "@/shared/api/axios";
export default function CategoryCard({
  category,
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
  onUpdateImage,
  onClick,
}) {
  const { t, i18n } = useTranslation("categories");
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);

  const isRtl = i18n.dir() === "rtl";

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onUpdateImage) {
      onUpdateImage(category.id, file);
    }
    // Reset input so the same file can be selected again if needed
    e.target.value = null;
  };

  const imageUrl = category.imgUrl
    ? `${baseURL}${category.imgUrl}`
    : null;

  return (
    <div
      className="group relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-background-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(category)}
    >
      {/* ── Background Image / Empty State ── */}
      {imageUrl && !imgError ? (
        <img
          src={imageUrl}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setImgError(true)}
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-background-hover/80 to-gray-400/20 flex flex-col items-center justify-center text-text-muted/40 transition-transform duration-700 group-hover:scale-110">
          <div className="animate-pulse flex flex-col items-center gap-2">
            <ImagePlus size={40} strokeWidth={1.5} />
          </div>
        </div>
      )}

      {/* ── Gradient Overlay for Text Readability & Bright Images ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none transition-opacity duration-300" />

      {/* ── Soft Dark Overlay on Hover ── */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* ── Category Name (Bottom Start) ── */}
      <div className="absolute bottom-0 start-0 w-full p-4 sm:p-5 flex flex-col z-10 pointer-events-none">
        <h3 className="text-white font-bold text-lg sm:text-xl drop-shadow-md line-clamp-2 leading-tight">
          {category.name}
        </h3>
        
        {/* View Products text (fades in and slides up slightly) */}
        <div className="flex items-center gap-1.5 text-white/90 text-sm font-medium tracking-wide opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 mt-1">
          <span>{t("viewProducts")}</span>
          {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
        </div>
      </div>

      {/* ── Action Buttons (Top End) ── */}
      {(canEdit || canDelete) && (
        <div className="absolute top-3 end-3 flex items-center gap-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
          {canEdit && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit?.(category); }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white text-white hover:text-primary-600 backdrop-blur-md transition-all shadow-sm"
                title={t("editCategory")}
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white text-white hover:text-secondary-600 backdrop-blur-md transition-all shadow-sm"
                title={t("updateImage")}
              >
                <ImagePlus size={14} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </>
          )}
          {canDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete?.(category); }}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white text-white hover:text-error backdrop-blur-md transition-all shadow-sm"
              title={t("deleteCategory")}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
