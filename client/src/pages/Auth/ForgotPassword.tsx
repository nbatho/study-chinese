import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, KeyRound, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { useForgotPasswordMutation, useResetPasswordMutation } from "../../api/auth/queries";
import { useI18n } from "../../i18n";
import { ApiError } from "../../utils/errorUtils";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function ForgotPassword() {
  const { t } = useI18n();
  const forgotMutation = useForgotPasswordMutation();
  const resetMutation = useResetPasswordMutation();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formError, setFormError] = useState("");

  const submitEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || forgotMutation.isPending) return;

    try {
      await forgotMutation.mutateAsync(email.trim());
      setStep("otp");
    } catch {
      // Toast interceptor already surfaced the error.
    }
  };

  const resendCode = async () => {
    if (forgotMutation.isPending) return;
    try {
      await forgotMutation.mutateAsync(email.trim());
      toast.success(t("forgot.resent"));
    } catch {
      // Toast interceptor already surfaced the error.
    }
  };

  const submitReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (!/^\d{6}$/.test(otp.trim())) {
      setFormError(t("forgot.otpInvalid"));
      return;
    }

    if (password.length < 8) {
      setFormError(t("security.tooShort"));
      return;
    }

    if (password !== confirm) {
      setFormError(t("security.mismatch"));
      return;
    }

    try {
      await resetMutation.mutateAsync({ email: email.trim(), otp: otp.trim(), password });
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : t("reset.error"));
    }
  };

  return (
    <main className="app-workspace-bg grid min-h-[100dvh] place-items-center p-4">
      <section className="anim-slide w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        {resetMutation.isSuccess ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto mb-4 size-12 text-jade" />
            <h1 className="mb-2 text-xl font-extrabold">{t("reset.successTitle")}</h1>
            <p className="mb-6 text-sm text-muted-foreground">{t("reset.successBody")}</p>
            <Button asChild className="h-11 w-full rounded-xl">
              <Link to="/auth">{t("forgot.backToLogin")}</Link>
            </Button>
          </div>
        ) : step === "email" ? (
          <form onSubmit={submitEmail}>
            <h1 className="mb-2 text-xl font-extrabold">{t("forgot.title")}</h1>
            <p className="mb-6 text-sm text-muted-foreground">{t("forgot.body")}</p>
            <label className="grid gap-2 font-bold">
              {t("auth.email")}
              <span className="relative">
                <Mail className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="learner@example.com"
                  autoComplete="email"
                  className="h-12 border-2 bg-background pl-11 text-base"
                />
              </span>
            </label>
            <Button
              type="submit"
              disabled={!email.trim() || forgotMutation.isPending}
              className="mt-5 h-11 w-full rounded-xl"
            >
              {forgotMutation.isPending ? t("auth.wait") : t("forgot.submit")}
            </Button>
            <Link
              to="/auth"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary"
            >
              <ArrowLeft size={15} /> {t("forgot.backToLogin")}
            </Link>
          </form>
        ) : (
          <form onSubmit={submitReset} className="grid gap-4">
            <div>
              <h1 className="mb-2 text-xl font-extrabold">{t("forgot.otpTitle")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("forgot.otpBody", { email: email.trim() })}
              </p>
            </div>
            <label className="grid gap-2 font-bold">
              {t("forgot.otpLabel")}
              <span className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  autoComplete="one-time-code"
                  className="h-12 border-2 bg-background pl-11 text-base tracking-[0.4em]"
                />
              </span>
            </label>
            <label className="grid gap-2 font-bold">
              {t("security.newPassword")}
              <span className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t("auth.newPasswordPlaceholder")}
                  autoComplete="new-password"
                  className="h-12 border-2 bg-background pl-11 text-base"
                />
              </span>
            </label>
            <label className="grid gap-2 font-bold">
              {t("security.confirmPassword")}
              <span className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  placeholder={t("auth.newPasswordPlaceholder")}
                  autoComplete="new-password"
                  className="h-12 border-2 bg-background pl-11 text-base"
                />
              </span>
            </label>
            {formError && (
              <div role="alert" className="rounded-xl border border-destructive/25 bg-destructive/10 px-3.5 py-3 text-sm font-bold text-destructive">
                {formError}
              </div>
            )}
            <Button
              type="submit"
              disabled={!otp || !password || !confirm || resetMutation.isPending}
              className="h-11 w-full rounded-xl"
            >
              {resetMutation.isPending ? t("auth.wait") : t("reset.submit")}
            </Button>
            <div className="flex items-center justify-between text-sm font-bold">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={15} /> {t("forgot.changeEmail")}
              </button>
              <button
                type="button"
                onClick={resendCode}
                disabled={forgotMutation.isPending}
                className="text-primary disabled:opacity-60"
              >
                {t("forgot.resend")}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
