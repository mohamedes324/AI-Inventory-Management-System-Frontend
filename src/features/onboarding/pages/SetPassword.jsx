import { useState } from "react";
import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";
import { useTranslation } from "react-i18next";

export default function SetPassword() {
  const { t } = useTranslation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const validatePassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!value) return t("onboarding:setPassword.required");

    if (!regex.test(value)) {
      return t("onboarding:setPassword.weakPassword");
    }

    return "";
  };

  const handlePasswordChange = (value) => {
    setPassword(value);

    const error = validatePassword(value);
    setPasswordError(error);

    if (confirmPassword && value !== confirmPassword) {
      setConfirmError(t("onboarding:setPassword.notMatch"));
    } else {
      setConfirmError("");
    }
  };

  const handleConfirmChange = (value) => {
    setConfirmPassword(value);

    if (!value) {
      setConfirmError(t("onboarding:setPassword.confirmRequired"));
    } else if (value !== password) {
      setConfirmError(t("onboarding:setPassword.notMatch"));
    } else {
      setConfirmError("");
    }
  };

  const isValid =
    !passwordError && !confirmError && password && confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    console.log("Password Saved:", password);
  };

  return (
    <div className="h-screen flex items-center justify-center animate-fadeIn bg-gray-light">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[380px] animate-slideUp">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-dark">
          {t("onboarding:setPassword.title")}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label={t("onboarding:setPassword.newPassword")}
            type="password"
            value={password}
            placeholder={t("onboarding:setPassword.enterPassword")}
            onChange={(e) => handlePasswordChange(e.target.value)}
            error={passwordError}
            status={
              password ? (passwordError ? "error" : "success") : "default"
            }
          />

          <Input
            label={t("onboarding:setPassword.confirmPassword")}
            type="password"
            value={confirmPassword}
            placeholder={t("onboarding:setPassword.confirmYourPassword")}
            onChange={(e) => handleConfirmChange(e.target.value)}
            error={confirmError}
            status={
              confirmPassword
                ? confirmError
                  ? "error"
                  : "success"
                : "default"
            }
          />

          <Button type="submit" fullWidth disabled={!isValid}>
            {t("onboarding:setPassword.savePassword")}
          </Button>
        </form>
      </div>
    </div>
  );
}