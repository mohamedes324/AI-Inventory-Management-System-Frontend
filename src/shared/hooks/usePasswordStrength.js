/**
 * @hook usePasswordStrength
 * @description Validates a password against the project's security rules and
 * returns per-constraint results plus overall validity.
 *
 * Rules:
 *  - Minimum 6 characters
 *  - At least one uppercase letter
 *  - At least one lowercase letter
 *  - At least one special character (@, #, $, _, !, %, *, ?, &)
 *  - At least one numeric digit
 */
export function usePasswordStrength(password = "", confirmPassword = "") {
  const checks = {
    length:    password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    special:   /[@#$_!%*?&]/.test(password),
    number:    /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(checks).every(Boolean);
  const passwordsMatch  = password.length > 0 && password === confirmPassword;
  const isFormValid     = isPasswordValid && passwordsMatch;

  return { checks, isPasswordValid, passwordsMatch, isFormValid };
}
