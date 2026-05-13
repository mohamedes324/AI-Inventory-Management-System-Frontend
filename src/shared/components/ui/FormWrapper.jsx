export default function FormWrapper({ children, title, description, logo, footer, maxWidth = "md", animation = "animate-slideUp", compact = false, className = "" }) {
  const maxWidthClasses = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" };

  return (
    <div className={`w-full ${maxWidthClasses[maxWidth]} mx-auto ${animation} ${className}`}>
      {logo && <div className={compact ? "mb-4" : "mb-8"}>{logo}</div>}
      <div className={compact ? "form-container form-container--compact" : "form-container"}>
        {(title || description) && (
          <div className={compact ? "mb-3" : "mb-6"}>
            {title && (<h2 className={`font-bold text-text-primary tracking-tight ${compact ? "text-2xl mb-1" : "text-3xl mb-2"}`}>{title}</h2>)}
            {description && (<p className={`text-text-secondary leading-relaxed ${compact ? "text-[13px]" : "text-[15px]"}`}>{description}</p>)}
          </div>
        )}
        <div className={`flex flex-col ${compact ? "gap-3" : "gap-6"}`}>{children}</div>
      </div>
      {footer && (<div className="mt-6 text-center text-sm text-text-muted">{footer}</div>)}
    </div>
  );
}
