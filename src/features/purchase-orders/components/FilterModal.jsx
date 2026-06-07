/**
 * @component FilterModal
 * @description Modal for filtering purchase orders.
 * Contains: Supplier dropdown, Date range (required), Price range slider,
 * Sort direction (Asc/Desc), Sort by (Date/Price).
 * Smooth open/close animation with fade + slide transitions.
 */
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  X,
  Search,
  RotateCcw,
  CalendarDays,
  ArrowUpDown,
  ArrowUpAZ,
  ArrowDownAZ,
  Truck,
  DollarSign,
  Clock,
  Banknote,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui";
import { DEFAULT_FILTERS, SORT_BY_OPTIONS } from "../types/purchaseOrderTypes";
import { useSupplierOptions } from "../hooks/useSupplierOptions";
import RangeSlider from "./RangeSlider";

export default function FilterModal({ isOpen, onClose, onApply, activeFilters }) {
  const { t } = useTranslation("purchaseOrders");
  const { suppliers, loading: loadingSuppliers } = useSupplierOptions();

  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });
  const [errors, setErrors] = useState({});
  // Animation states: "entering" | "visible" | "leaving" | "hidden"
  const [animState, setAnimState] = useState("hidden");

  // ── Handle open/close animation lifecycle ──
  useEffect(() => {
    if (isOpen) {
      setAnimState("entering");
      // Allow one frame for the entering styles, then switch to visible
      const raf = requestAnimationFrame(() => {
        setAnimState("visible");
      });
      return () => cancelAnimationFrame(raf);
    } else if (animState === "visible" || animState === "entering") {
      setAnimState("leaving");
      const timer = setTimeout(() => setAnimState("hidden"), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Sync with active filters when modal opens
  useEffect(() => {
    if (isOpen && activeFilters) {
      setFilters({ ...DEFAULT_FILTERS, ...activeFilters });
    } else if (isOpen) {
      setFilters({ ...DEFAULT_FILTERS });
    }
    // Clear errors when opening
    if (isOpen) setErrors({});
  }, [isOpen, activeFilters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    // Clear specific error when user starts fixing it
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleReset = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setErrors({});
  };

  /**
   * Validate required fields before submitting.
   */
  const validate = useCallback(() => {
    const newErrors = {};

    if (!filters.DateFrom) {
      newErrors.DateFrom = t("filter.dateFromRequired");
    }
    if (!filters.DateTo) {
      newErrors.DateTo = t("filter.dateToRequired");
    }
    // If both dates present, ensure DateFrom <= DateTo
    if (filters.DateFrom && filters.DateTo && filters.DateFrom > filters.DateTo) {
      newErrors.DateTo = t("filter.dateToAfterFrom");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [filters, t]);

  const handleApply = () => {
    if (!validate()) return;
    onApply(filters);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  // Don't render if fully hidden
  if (animState === "hidden") return null;

  const isVisible = animState === "visible";
  const isLeaving = animState === "leaving";

  // Find selected supplier name for display
  const selectedSupplier = suppliers.find(
    (s) => s.supplierId === filters.SupplierId
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isVisible
          ? "bg-background-app/70 backdrop-blur-sm opacity-100"
          : "bg-transparent backdrop-blur-none opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-background-card rounded-2xl shadow-[var(--shadow-modal)] w-full max-w-lg overflow-hidden border border-border-primary transition-all duration-300 ease-out ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-border-primary/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
              <Search size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">
                {t("filter.title")}
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                {t("filter.subtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-background-hover text-text-muted hover:text-error hover:bg-error/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* ── Supplier Select ── */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
              <Truck size={14} className="text-primary-500" />
              {t("filter.supplier")}
            </label>
            <div className="relative">
              <select
                value={filters.SupplierId || ""}
                onChange={(e) =>
                  updateFilter(
                    "SupplierId",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="w-full rounded-xl border border-border-primary bg-background-input px-4 py-3 text-sm text-text-primary outline-none transition-all duration-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-500/8 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] appearance-none cursor-pointer"
              >
                <option value="">{t("filter.allSuppliers")}</option>
                {loadingSuppliers ? (
                  <option disabled>{t("filter.loadingSuppliers")}</option>
                ) : (
                  suppliers.map((s) => (
                    <option key={s.supplierId} value={s.supplierId}>
                      {s.supplierName || s.name}
                    </option>
                  ))
                )}
              </select>
              {/* Custom chevron */}
              <div className="absolute end-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* ── Date Range (Required) ── */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
              <CalendarDays size={14} className="text-primary-500" />
              {t("filter.dateRange")}
              <span className="text-error text-xs">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-text-muted font-medium mb-1 block">
                  {t("filter.dateFrom")}
                </label>
                <input
                  type="date"
                  value={filters.DateFrom}
                  onChange={(e) => updateFilter("DateFrom", e.target.value)}
                  className={`w-full rounded-xl border bg-background-input px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-500/8 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] ${
                    errors.DateFrom
                      ? "border-error ring-2 ring-error/20"
                      : "border-border-primary"
                  }`}
                />
                {errors.DateFrom && (
                  <p className="flex items-center gap-1 mt-1 text-[11px] text-error font-medium">
                    <AlertCircle size={10} />
                    {errors.DateFrom}
                  </p>
                )}
              </div>
              <div>
                <label className="text-[11px] text-text-muted font-medium mb-1 block">
                  {t("filter.dateTo")}
                </label>
                <input
                  type="date"
                  value={filters.DateTo}
                  onChange={(e) => updateFilter("DateTo", e.target.value)}
                  className={`w-full rounded-xl border bg-background-input px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-500/8 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] ${
                    errors.DateTo
                      ? "border-error ring-2 ring-error/20"
                      : "border-border-primary"
                  }`}
                />
                {errors.DateTo && (
                  <p className="flex items-center gap-1 mt-1 text-[11px] text-error font-medium">
                    <AlertCircle size={10} />
                    {errors.DateTo}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Price Range Slider ── */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
              <DollarSign size={14} className="text-primary-500" />
              {t("filter.totalRange")}
            </label>
            <div className="px-1">
              <RangeSlider
                min={0}
                max={100000}
                value={[filters.MinTotal, filters.MaxTotal]}
                onChange={([min, max]) => {
                  updateFilter("MinTotal", min);
                  updateFilter("MaxTotal", max);
                }}
                step={500}
              />
            </div>
          </div>

          {/* ── Sort By ── */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
              <ArrowUpDown size={14} className="text-primary-500" />
              {t("filter.sortBy")}
            </label>
            <div className="flex gap-3">
              {/* Date */}
              <button
                type="button"
                onClick={() => updateFilter("SortBy", SORT_BY_OPTIONS.DATE)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  filters.SortBy === SORT_BY_OPTIONS.DATE
                    ? "bg-primary-500/10 border-primary-500/30 text-primary-500 shadow-sm shadow-primary-500/10"
                    : "bg-background-input border-border-primary text-text-muted hover:border-border-secondary hover:text-text-secondary"
                }`}
              >
                <Clock size={16} />
                {t("filter.sortByDate")}
              </button>

              {/* Price */}
              <button
                type="button"
                onClick={() => updateFilter("SortBy", SORT_BY_OPTIONS.PRICE)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  filters.SortBy === SORT_BY_OPTIONS.PRICE
                    ? "bg-primary-500/10 border-primary-500/30 text-primary-500 shadow-sm shadow-primary-500/10"
                    : "bg-background-input border-border-primary text-text-muted hover:border-border-secondary hover:text-text-secondary"
                }`}
              >
                <Banknote size={16} />
                {t("filter.sortByPrice")}
              </button>
            </div>
          </div>

          {/* ── Sort Direction ── */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
              <ArrowUpDown size={14} className="text-primary-500" />
              {t("filter.sortOrder")}
            </label>
            <div className="flex gap-3">
              {/* Ascending */}
              <button
                type="button"
                onClick={() => updateFilter("SortDescending", false)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  !filters.SortDescending
                    ? "bg-primary-500/10 border-primary-500/30 text-primary-500 shadow-sm shadow-primary-500/10"
                    : "bg-background-input border-border-primary text-text-muted hover:border-border-secondary hover:text-text-secondary"
                }`}
              >
                <ArrowUpAZ size={16} />
                {t("filter.ascending")}
              </button>

              {/* Descending */}
              <button
                type="button"
                onClick={() => updateFilter("SortDescending", true)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  filters.SortDescending
                    ? "bg-primary-500/10 border-primary-500/30 text-primary-500 shadow-sm shadow-primary-500/10"
                    : "bg-background-input border-border-primary text-text-muted hover:border-border-secondary hover:text-text-secondary"
                }`}
              >
                <ArrowDownAZ size={16} />
                {t("filter.descending")}
              </button>
            </div>
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div className="px-6 py-4 bg-background-hover/50 border-t border-border-primary flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-muted hover:text-error transition-colors"
          >
            <RotateCcw size={14} />
            {t("filter.reset")}
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
            >
              {t("filter.cancel")}
            </button>
            <Button size="sm" onClick={handleApply}>
              <Search size={14} />
              {t("filter.search")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
