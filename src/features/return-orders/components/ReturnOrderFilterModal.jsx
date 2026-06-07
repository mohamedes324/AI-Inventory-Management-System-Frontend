/**
 * @component ReturnOrderFilterModal
 * @description Filter modal for return orders with Start Date & End Date.
 * Dates are sent in RFC3339 format (e.g., 2024-03-20T13:45:30Z).
 */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  X,
  Calendar,
  Filter,
  RotateCcw,
  Search,
} from "lucide-react";
import { Button } from "@/shared/components/ui";

export default function ReturnOrderFilterModal({
  isOpen,
  onClose,
  onApply,
  activeFilters,
}) {
  const { t } = useTranslation("returnOrders");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState("");

  // Sync from external active filters when modal opens
  useEffect(() => {
    if (isOpen && activeFilters) {
      // Convert RFC3339 back to date input value
      if (activeFilters.startDate) {
        setStartDate(activeFilters.startDate.split("T")[0]);
      }
      if (activeFilters.endDate) {
        setEndDate(activeFilters.endDate.split("T")[0]);
      }
    } else if (isOpen) {
      setStartDate("");
      setEndDate("");
      setDateError("");
    }
  }, [isOpen, activeFilters]);

  const handleApply = () => {
    setDateError("");

    // Validate: if one date is set, both must be set
    if (startDate && !endDate) {
      setDateError(t("filter.endDateRequired"));
      return;
    }
    if (!startDate && endDate) {
      setDateError(t("filter.startDateRequired"));
      return;
    }
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setDateError(t("filter.endAfterStart"));
      return;
    }

    const filters = {};
    if (startDate) {
      filters.startDate = new Date(startDate + "T00:00:00").toISOString();
    }
    if (endDate) {
      // Set end date to end of day
      filters.endDate = new Date(endDate + "T23:59:59").toISOString();
    }

    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setDateError("");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-background-app/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-background-card rounded-2xl border border-border-primary shadow-2xl w-full max-w-md pointer-events-auto animate-fadeIn"
          style={{ animationDelay: "50ms" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/15 to-orange-600/10 border border-orange-500/20 flex items-center justify-center">
                <Filter size={18} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-text-primary">
                  {t("filter.title")}
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  {t("filter.subtitle")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-background-hover border border-border-primary hover:border-border-secondary transition-all duration-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5">
            {/* Date Range */}
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <Calendar size={14} className="text-orange-500" />
                <span className="text-xs font-semibold text-text-secondary">
                  {t("filter.dateRange")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Start Date */}
                <div>
                  <label className="text-[11px] text-text-muted font-medium mb-1 block">
                    {t("filter.startDate")}
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setDateError("");
                    }}
                    className="
                      w-full rounded-xl border border-border-primary bg-background-input
                      px-3 py-2.5 outline-none text-sm text-text-primary
                      transition-all duration-200
                      focus:border-border-focus focus:ring-2 focus:ring-primary-500/20
                      shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]
                    "
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="text-[11px] text-text-muted font-medium mb-1 block">
                    {t("filter.endDate")}
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setDateError("");
                    }}
                    className="
                      w-full rounded-xl border border-border-primary bg-background-input
                      px-3 py-2.5 outline-none text-sm text-text-primary
                      transition-all duration-200
                      focus:border-border-focus focus:ring-2 focus:ring-primary-500/20
                      shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]
                    "
                  />
                </div>
              </div>

              {dateError && (
                <p className="text-[11px] text-error font-medium mt-2 animate-fadeIn">
                  {dateError}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border-primary/50">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw size={14} />
              {t("filter.reset")}
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                {t("filter.cancel")}
              </Button>
              <Button size="sm" onClick={handleApply}>
                <Search size={14} />
                {t("filter.search")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
