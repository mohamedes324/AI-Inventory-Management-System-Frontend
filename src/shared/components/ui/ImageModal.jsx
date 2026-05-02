/**
 * @component ImageModal
 * @description Animated inline lightbox for displaying identity / document images.
 *
 * Features:
 *  - Backdrop blur overlay — click outside the image to close
 *  - CSS `animate-scaleIn` entrance driven by the project's animation tokens
 *  - Keyboard accessible: Escape key closes the modal
 *  - RTL safe: uses logical CSS classes
 *
 * @prop {boolean}  isOpen   – whether the modal is visible
 * @prop {string}   src      – full-resolution image URL
 * @prop {string}   alt      – accessible alt text (e.g. user name)
 * @prop {Function} onClose  – callback to close the modal
 * @prop {string}   [closeLabelKey] – i18n key for the close button label
 *                                    (defaults to the value passed via `closeLabel`)
 * @prop {string}   [closeLabel]    – plain string label for the close button
 *
 * @example
 *   <ImageModal
 *     isOpen={open}
 *     src={identityImgUrl}
 *     alt={userName}
 *     onClose={() => setOpen(false)}
 *     closeLabel={t("pendingAccounts.closeModal")}
 *   />
 */

import { useEffect, useCallback } from "react";
import { X, ZoomIn } from "lucide-react";

export default function ImageModal({ isOpen, src, alt = "", onClose, closeLabel = "Close" }) {
  /** Close on Escape key */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    // Prevent background scroll while modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !src) return null;

  return (
    /* ── Overlay ───────────────────────────────────────────────── */
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-gray-dark/70 backdrop-blur-sm
        animate-fadeIn
      "
    >
      {/* ── Modal Panel ──────────────────────────────────────── */}
      <div
        onClick={(e) => e.stopPropagation()} // prevent overlay click from propagating
        className="
          relative
          max-w-[90vw] max-h-[90vh]
          rounded-2xl overflow-hidden
          shadow-2xl
          animate-scaleIn
          ring-1 ring-white/10
        "
      >
        {/* Image */}
        <img
          src={src}
          alt={alt}
          className="block max-w-full max-h-[80vh] w-auto h-auto object-contain bg-gray-dark/5"
          draggable="false"
        />

        {/* ── Top-right close button ── */}
        <button
          onClick={onClose}
          aria-label={closeLabel}
          title={closeLabel}
          className="
            absolute top-3 end-3
            flex items-center justify-center
            w-9 h-9 rounded-full
            bg-gray-dark/60 hover:bg-gray-dark/90
            text-white
            backdrop-blur-sm
            transition-all duration-200
            hover:scale-110
            focus:outline-none focus:ring-2 focus:ring-white/50
          "
        >
          <X size={18} />
        </button>

        {/* ── Bottom label bar ── */}
        <div className="
          absolute bottom-0 inset-x-0
          px-4 py-2.5
          bg-gradient-to-t from-gray-dark/70 to-transparent
          flex items-center gap-2
        ">
          <ZoomIn size={14} className="text-white/70 shrink-0" />
          <span className="text-white/80 text-xs font-medium truncate">{alt}</span>
        </div>
      </div>
    </div>
  );
}
