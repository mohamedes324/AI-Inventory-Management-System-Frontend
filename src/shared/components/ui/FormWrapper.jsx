/**
 * @component FormWrapper
 * @description Layout component that provides a unified form structure
 * for auth pages (Login, Register, etc.) and settings forms.
 * Uses the `.form-container` utility for consistent styling.
 *
 * @prop {ReactNode} children - Form content
 * @prop {string} title - Form heading
 * @prop {string} description - Subtitle / helper text
 * @prop {ReactNode} logo - Optional logo element at the top
 * @prop {ReactNode} footer - Optional footer content below the form
 * @prop {'sm'|'md'|'lg'} maxWidth - Maximum width of the form
 * @prop {string} className - Additional CSS classes
 *
 * @example
 *   <FormWrapper
 *     title={t("auth:login.title")}
 *     description={t("auth:login.description")}
 *     logo={<Logo />}
 *   >
 *     <Input label="Email" ... />
 *     <Button>Sign In</Button>
 *   </FormWrapper>
 */
export default function FormWrapper({
  children,
  title,
  description,
  logo,
  footer,
  maxWidth = "md",
  animation = "animate-slideUp",
  compact = false,
  className = "",
}) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <div className={`w-full ${maxWidthClasses[maxWidth]} mx-auto ${animation} ${className}`}>
      {/* ── Logo ── */}
      {logo && <div className={compact ? "mb-4" : "mb-8"}>{logo}</div>}

      {/* ── Form Card ── */}
      <div className={compact ? "form-container form-container--compact" : "form-container"}>
        {/* Heading Block */}
        {(title || description) && (
          <div className={compact ? "mb-3" : "mb-6"}>
            {title && (
              <h2 className={`font-bold text-gray-dark tracking-tight ${
                compact ? "text-2xl mb-1" : "text-3xl mb-2"
              }`}>
                {title}
              </h2>
            )}
            {description && (
              <p className={`text-gray leading-relaxed ${
                compact ? "text-[13px]" : "text-[15px]"
              }`}>
                {description}
              </p>
            )}
          </div>
        )}

        {/* Form Content */}
        <div className={`flex flex-col ${compact ? "gap-3" : "gap-6"}`}>{children}</div>
      </div>

      {/* ── Footer ── */}
      {footer && (
        <div className="mt-6 text-center text-sm text-gray">{footer}</div>
      )}
    </div>
  );
}
