/**
 * @component RevealOnScroll
 * @description Reusable scroll-triggered reveal animation using IntersectionObserver.
 * Elements start hidden (opacity 0, slight translate) and smoothly animate into
 * view when they enter the viewport. Configurable direction, delay, and threshold.
 *
 * @prop {ReactNode} children - Content to reveal
 * @prop {'up'|'down'|'left'|'right'} direction - Direction the element slides from
 * @prop {number} delay - Animation delay in ms (useful for staggering grid items)
 * @prop {number} distance - Translate distance in px (default: 24)
 * @prop {number} duration - Animation duration in ms (default: 600)
 * @prop {number} threshold - IntersectionObserver threshold 0–1 (default: 0.1)
 * @prop {boolean} once - If true, animate only the first time (default: true)
 * @prop {string} className - Additional CSS classes on the wrapper
 *
 * @example
 *   <RevealOnScroll direction="up" delay={100}>
 *     <Card>...</Card>
 *   </RevealOnScroll>
 */
import { useRef, useEffect, useState } from "react";

export default function RevealOnScroll({
  children,
  direction = "up",
  delay = 0,
  distance = 24,
  duration = 600,
  threshold = 0.1,
  once = true,
  className = "",
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, once]);

  const translateMap = {
    up: `translateY(${distance}px)`,
    down: `translateY(-${distance}px)`,
    left: `translateX(${distance}px)`,
    right: `translateX(-${distance}px)`,
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0, 0)" : translateMap[direction],
        transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
