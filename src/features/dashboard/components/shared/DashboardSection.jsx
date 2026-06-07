/**
 * @component DashboardSection
 * @description Semantic section wrapper with title, optional subtitle, and RevealOnScroll animation.
 */
import RevealOnScroll from "@/shared/components/RevealOnScroll";

export default function DashboardSection({ title, subtitle, children, delay = 0, className = "" }) {
  return (
    <RevealOnScroll direction="up" delay={delay} distance={20} duration={500}>
      <section className={`mb-10 ${className}`}>
        {(title || subtitle) && (
          <div className="mb-5">
            {title && <h2 className="text-lg font-semibold text-text-primary tracking-tight">{title}</h2>}
            {subtitle && <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>}
          </div>
        )}
        {children}
      </section>
    </RevealOnScroll>
  );
}
