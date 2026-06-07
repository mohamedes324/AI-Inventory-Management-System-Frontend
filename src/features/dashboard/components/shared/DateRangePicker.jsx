/**
 * @component DateRangePicker
 * @description Date filter with preset options (Today, Last 7 Days, Last 30 Days)
 * and a Custom Range modal with start/end date pickers.
 * All dates are output in RFC 3339 / ISO 8601 format (e.g. "2026-05-13T00:00:00Z").
 */
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, X } from "lucide-react";

const PRESETS = ["today", "last7Days", "last30Days", "customRange"];

/** Convert a Date to RFC 3339 start-of-day UTC string */
function toISO(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return d.toISOString(); // e.g. "2026-05-13T00:00:00.000Z"
}

/** Get ISO now (end-of-current-moment) */
function nowISO() {
  return new Date().toISOString();
}

/** Compute preset date ranges in ISO 8601 format */
function getPresetRange(key) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (key) {
    case "today":
      return { startDate: toISO(startOfDay), endDate: nowISO() };
    case "last7Days": {
      const start = new Date(startOfDay);
      start.setDate(start.getDate() - 6); // today + previous 6 days
      return { startDate: toISO(start), endDate: nowISO() };
    }
    case "last30Days": {
      const start = new Date(startOfDay);
      start.setDate(start.getDate() - 29); // today + previous 29 days
      return { startDate: toISO(start), endDate: nowISO() };
    }
    default:
      return { startDate: undefined, endDate: undefined };
  }
}

/** Format "YYYY-MM-DD" input value to ISO 8601 */
function inputToISO(value, isEnd = false) {
  if (!value) return undefined;
  if (isEnd) {
    // End of day
    return new Date(`${value}T23:59:59`).toISOString();
  }
  return new Date(`${value}T00:00:00`).toISOString();
}

export default function DateRangePicker({ value = "last30Days", onChange }) {
  const { t } = useTranslation("dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handlePresetSelect = (key) => {
    if (key === "customRange") {
      setIsOpen(false);
      setShowCustomModal(true);
      return;
    }
    const range = getPresetRange(key);
    onChange?.({ key, ...range });
    setIsOpen(false);
  };

  const handleCustomApply = () => {
    if (!customStart || !customEnd) return;
    onChange?.({
      key: "customRange",
      startDate: inputToISO(customStart, false),
      endDate: inputToISO(customEnd, true),
    });
    setShowCustomModal(false);
    setCustomStart("");
    setCustomEnd("");
  };

  const handleCustomCancel = () => {
    setShowCustomModal(false);
    setCustomStart("");
    setCustomEnd("");
  };

  return (
    <>
      {/* ── Trigger Button ── */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="
            inline-flex items-center gap-2 px-4 py-2.5
            rounded-xl text-sm font-medium
            bg-background-card border border-border-primary
            text-text-secondary hover:text-text-primary
            hover:border-border-secondary hover:bg-background-hover
            transition-all duration-200 shadow-[var(--shadow-card)]
          "
        >
          <Calendar size={16} />
          <span>{t(`dateRange.${value}`)}</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* ── Dropdown ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="
                absolute top-full mt-2 end-0 z-50
                min-w-[200px] rounded-xl overflow-hidden
                bg-background-elevated border border-border-primary
                shadow-[var(--shadow-elevated)]
              "
            >
              {PRESETS.map((key) => (
                <button
                  key={key}
                  onClick={() => handlePresetSelect(key)}
                  className={`
                    w-full px-4 py-2.5 text-sm text-start
                    transition-colors duration-150
                    ${value === key
                      ? "bg-primary-500/10 text-primary-400 font-medium"
                      : "text-text-secondary hover:bg-background-hover hover:text-text-primary"
                    }
                  `}
                >
                  {t(`dateRange.${key}`)}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Custom Range Modal ── */}
      <AnimatePresence>
        {showCustomModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={handleCustomCancel}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="
                w-full max-w-sm mx-4 rounded-2xl
                bg-background-card border border-border-primary
                shadow-[var(--shadow-modal)] p-6
              "
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-text-primary">
                  {t("dateRange.customRange")}
                </h3>
                <button
                  onClick={handleCustomCancel}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-background-hover transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Date Inputs */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
                    {t("dateRange.from")}
                  </label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    max={customEnd || undefined}
                    className="
                      w-full px-3 py-2.5 rounded-xl text-sm
                      bg-background-input border border-border-primary
                      text-text-primary outline-none
                      focus:border-border-focus focus:ring-1 focus:ring-primary-500/20
                      transition-all duration-200
                      [color-scheme:dark]
                    "
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
                    {t("dateRange.to")}
                  </label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    min={customStart || undefined}
                    className="
                      w-full px-3 py-2.5 rounded-xl text-sm
                      bg-background-input border border-border-primary
                      text-text-primary outline-none
                      focus:border-border-focus focus:ring-1 focus:ring-primary-500/20
                      transition-all duration-200
                      [color-scheme:dark]
                    "
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCustomCancel}
                  className="
                    flex-1 px-4 py-2.5 rounded-xl text-sm font-medium
                    bg-background-elevated border border-border-primary
                    text-text-secondary hover:text-text-primary
                    hover:bg-background-hover transition-all duration-200
                  "
                >
                  {t("dateRange.cancel")}
                </button>
                <button
                  onClick={handleCustomApply}
                  disabled={!customStart || !customEnd}
                  className="
                    flex-1 px-4 py-2.5 rounded-xl text-sm font-medium
                    bg-gradient-to-b from-primary-500 to-primary-600
                    text-text-inverse
                    hover:from-primary-400 hover:to-primary-600
                    shadow-lg shadow-primary-500/20
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all duration-200
                  "
                >
                  {t("dateRange.apply")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
