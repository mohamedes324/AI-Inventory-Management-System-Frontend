/**
 * @component AnimatedCounter
 * @description Smoothly animates a number from 0 to its target value.
 * Uses requestAnimationFrame for butter-smooth 60fps counting.
 *
 * @prop {number} value - Target number to count to
 * @prop {number} duration - Animation duration in ms (default: 1200)
 * @prop {Function} formatter - Optional formatting function (e.g. currency)
 * @prop {string} className - Additional CSS classes
 */
import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({
  value = 0,
  duration = 1200,
  formatter,
  className = "",
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);
  const prevValueRef = useRef(0);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;
    prevValueRef.current = value;

    if (startValue === endValue) {
      setDisplayValue(endValue);
      return;
    }

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * eased;

      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
      }
    };

    startTimeRef.current = null;
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  const formatted = formatter
    ? formatter(displayValue)
    : Math.round(displayValue).toLocaleString();

  return <span className={className}>{formatted}</span>;
}
