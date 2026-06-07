/**
 * @component RangeSlider
 * @description Dual-thumb range slider for min/max price filtering.
 * Premium styling with gradient track and animated thumbs.
 * Uses refs for drag state to avoid re-render jitter.
 * (Reused from Purchase Orders)
 */
import { useCallback, useRef, useEffect, useState } from "react";

export default function RangeSlider({
  min = 0,
  max = 100000,
  value = [0, 100000],
  onChange,
  step = 100,
  label,
  formatValue = (v) => `$${v.toLocaleString()}`,
}) {
  const trackRef = useRef(null);
  const draggingRef = useRef(null); // "min" | "max" | null
  const localRef = useRef(value);
  const [displayValue, setDisplayValue] = useState(value);

  // Sync external value → display when not dragging
  useEffect(() => {
    if (!draggingRef.current) {
      localRef.current = value;
      setDisplayValue(value);
    }
  }, [value]);

  const getPercent = useCallback(
    (val) => ((val - min) / (max - min)) * 100,
    [min, max]
  );

  const getValueFromPosition = useCallback(
    (clientX) => {
      if (!trackRef.current) return min;
      const rect = trackRef.current.getBoundingClientRect();
      const isRtl = document.documentElement.dir === "rtl";
      let percent;
      if (isRtl) {
        percent = ((rect.right - clientX) / rect.width) * 100;
      } else {
        percent = ((clientX - rect.left) / rect.width) * 100;
      }
      percent = Math.max(0, Math.min(100, percent));
      const rawValue = min + (percent / 100) * (max - min);
      return Math.round(rawValue / step) * step;
    },
    [min, max, step]
  );

  const handlePointerDown = (thumb) => (e) => {
    e.preventDefault();
    draggingRef.current = thumb;
    // Force a re-render to show active state
    setDisplayValue([...localRef.current]);

    const handleMove = (moveEvent) => {
      const clientX = moveEvent.touches
        ? moveEvent.touches[0].clientX
        : moveEvent.clientX;
      const newVal = getValueFromPosition(clientX);
      const prev = localRef.current;

      let next;
      if (draggingRef.current === "min") {
        const clamped = Math.min(newVal, prev[1] - step);
        next = [Math.max(min, clamped), prev[1]];
      } else {
        const clamped = Math.max(newVal, prev[0] + step);
        next = [prev[0], Math.min(max, clamped)];
      }

      // Only update if actually changed
      if (next[0] !== prev[0] || next[1] !== prev[1]) {
        localRef.current = next;
        setDisplayValue(next);
      }
    };

    const handleUp = () => {
      draggingRef.current = null;
      onChange?.(localRef.current);
      // Re-render to remove active state
      setDisplayValue([...localRef.current]);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);
  };

  const minPercent = getPercent(displayValue[0]);
  const maxPercent = getPercent(displayValue[1]);
  const isDragging = draggingRef.current;

  return (
    <div className="flex flex-col gap-3 w-full">
      {label && (
        <label className="text-sm font-semibold text-text-secondary tracking-tight">
          {label}
        </label>
      )}

      {/* Value Display */}
      <div className="flex items-center justify-between text-xs">
        <span className="px-2.5 py-1 rounded-lg bg-primary-500/10 text-primary-500 font-bold border border-primary-500/20 tabular-nums">
          {formatValue(displayValue[0])}
        </span>
        <span className="text-text-muted font-medium">—</span>
        <span className="px-2.5 py-1 rounded-lg bg-primary-500/10 text-primary-500 font-bold border border-primary-500/20 tabular-nums">
          {formatValue(displayValue[1])}
        </span>
      </div>

      {/* Track */}
      <div className="relative h-10 flex items-center">
        <div
          ref={trackRef}
          className="absolute inset-x-0 h-2 bg-background-hover rounded-full"
        >
          {/* Active Range */}
          <div
            className="absolute h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-sm shadow-primary-500/30"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />
        </div>

        {/* Min Thumb */}
        <div
          className={`absolute w-5 h-5 -translate-x-1/2 rounded-full bg-white border-[3px] border-primary-500 shadow-lg shadow-primary-500/25 cursor-grab z-10 transition-transform duration-100 ${
            isDragging === "min" ? "scale-125 cursor-grabbing" : "hover:scale-110"
          }`}
          style={{ left: `${minPercent}%` }}
          onMouseDown={handlePointerDown("min")}
          onTouchStart={handlePointerDown("min")}
        />

        {/* Max Thumb */}
        <div
          className={`absolute w-5 h-5 -translate-x-1/2 rounded-full bg-white border-[3px] border-primary-500 shadow-lg shadow-primary-500/25 cursor-grab z-10 transition-transform duration-100 ${
            isDragging === "max" ? "scale-125 cursor-grabbing" : "hover:scale-110"
          }`}
          style={{ left: `${maxPercent}%` }}
          onMouseDown={handlePointerDown("max")}
          onTouchStart={handlePointerDown("max")}
        />
      </div>

      {/* Min/Max Labels */}
      <div className="flex items-center justify-between text-[10px] text-text-muted font-medium">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}
