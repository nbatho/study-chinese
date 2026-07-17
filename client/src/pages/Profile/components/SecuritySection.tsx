import { useState } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { useChangePasswordMutation, useChangePasswordOtpMutation } from "../../../api/auth/queries";
import { useI18n } from "../../../i18n";
import { getErrorMessage as getMutationError } from "../../../utils/errorUtils";
import { isStrongPassword } from "../../../utils/passwordPolicy";
import PasswordField from "./PasswordField";

export default function SecuritySection() {
  const { t } = useI18n();
  const changePasswordMutation = useChangePasswordMutation();
  const changePasswordOtpMutation = useChangePasswordOtpMutation();

  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "", otp: "" });
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordOtpSent, setPasswordOtpSent] = useState(false);

  const sendPasswordOtp = async () => {
    setPasswordError("");

    try {
      await changePasswordOtpMutation.mutateAsync();
      setPasswordOtpSent(true);
      toast.success(t("security.otpSent"));
    } catch (error) {
      setPasswordError(getMutationError(error, t("security.otpSendFailed")));
    }
  };

  const submitChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError("");

    if (!isStrongPassword(passwordForm.next)) {
      setPasswordError(t("security.weakPassword"));
      return;
    }

    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError(t("security.mismatch"));
      return;
    }

    if (!/^\d{6}$/.test(passwordForm.otp.trim())) {
      setPasswordError(t("security.otpInvalid"));
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordForm.current,
        newPassword: passwordForm.next,
        otp: passwordForm.otp.trim(),
      });
      setPasswordForm({ current: "", next: "", confirm: "", otp: "" });
      setPasswordOtpSent(false);
      toast.success(t("security.changed"));
    } catch (error) {
      setPasswordError(getMutationError(error, t("security.changeFailed")));
    }
  };

  return (
    <section className="app-surface-padded mb-5 text-left">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <KeyRound size={18} />
        </span>
        <div>
          <h2 className="text-lg font-extrabold">{t("security.title")}</h2>
          <p className="text-sm font-medium text-muted-foreground">{t("security.body")}</p>
        </div>
      </div>
      <form onSubmit={submitChangePassword} className="grid gap-4">
        <PasswordField
          label={t("security.currentPassword")}
          value={passwordForm.current}
          onChange={(value) => setPasswordForm((form) => ({ ...form, current: value }))}
          autoComplete="current-password"
          shown={showPasswords}
          onToggleShown={() => setShowPasswords((value) => !value)}
          toggleAriaLabel={showPasswords ? t("auth.hidePassword") : t("auth.showPassword")}
        />
        <PasswordField
          label={t("security.newPassword")}
          value={passwordForm.next}
          onChange={(value) => setPasswordForm((form) => ({ ...form, next: value }))}
          autoComplete="new-password"
          placeholder={t("auth.newPasswordPlaceholder")}
          shown={showPasswords}
          onToggleShown={() => setShowPasswords((value) => !value)}
          toggleAriaLabel={showPasswords ? t("auth.hidePassword") : t("auth.showPassword")}
        >
          <p className="mt-1.5 text-xs font-medium text-muted-foreground">{t("security.policyHint")}</p>
        </PasswordField>
        <PasswordField
          label={t("security.confirmPassword")}
          value={passwordForm.confirm}
          onChange={(value) => setPasswordForm((form) => ({ ...form, confirm: value }))}
          autoComplete="new-password"
          shown={showPasswords}
          onToggleShown={() => setShowPasswords((value) => !value)}
          toggleAriaLabel={showPasswords ? t("auth.hidePassword") : t("auth.showPassword")}
        />
        <div>
          <label className="mb-1.5 block text-[0.8rem] font-bold text-muted-foreground">{t("security.otpLabel")}</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={passwordForm.otp}
              onChange={(e) => setPasswordForm((form) => ({ ...form, otp: e.target.value.replace(/\D/g, "") }))}
              placeholder="123456"
              autoComplete="one-time-code"
              className="app-control w-full text-foreground tracking-[0.3em]"
            />
            <button
              type="button"
              onClick={sendPasswordOtp}
              disabled={changePasswordOtpMutation.isPending}
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-primary/40 px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {changePasswordOtpMutation.isPending
                ? t("common.saving")
                : passwordOtpSent
                  ? t("security.otpResend")
                  : t("security.otpSend")}
            </button>
          </div>
          <p className="mt-1.5 text-xs font-medium text-muted-foreground">{t("security.otpHint")}</p>
        </div>
        {passwordError && (
          <div role="alert" className="rounded-xl border border-destructive/25 bg-destructive/10 px-3.5 py-3 text-sm font-bold text-destructive">
            {passwordError}
          </div>
        )}
        <button
          type="submit"
          disabled={
            changePasswordMutation.isPending ||
            !passwordForm.current ||
            !passwordForm.next ||
            !passwordForm.confirm ||
            !passwordForm.otp
          }
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:translate-y-px disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
        >
          {changePasswordMutation.isPending ? t("common.saving") : t("security.submit")}
        </button>
        <p className="text-xs font-medium text-muted-foreground">{t("security.note")}</p>
      </form>
    </section>
  );
}
