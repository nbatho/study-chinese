import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, KeyRound, Lock } from "lucide-react";
import { useResetPasswordMutation } from "../../api/auth/queries";
import { useI18n } from "../../i18n";
import { ApiError } from "../../utils/errorUtils";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function ResetPassword() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const resetMutation = useResetPasswordMutation();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (password.length < 8) {
      setFormError(t("security.tooShort"));
      return;
    }

    if (password !== confirm) {
      setFormError(t("security.mismatch"));
      return;
    }

    try {
      await resetMutation.mutateAsync({ token, password });
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : t("reset.error"));
    }
  };

  if (!token) {
    return (
      <main className="app-workspace-bg grid min-h-[100dvh] place-items-center p-4">
        <section className="anim-slide w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
          <KeyRound className="mx-auto mb-4 size-12 text-destructive" />
          <h1 className="mb-2 text-xl font-extrabold">{t("reset.invalidTitle")}</h1>
          <p className="mb-6 text-sm text-muted-foreground">{t("reset.invalidBody")}</p>
          <Button asChild variant="secondary" className="h-11 w-full rounded-xl">
            <Link to="/forgot-password">{t("reset.requestAgain")}</Link>
          </Button>
        </section>
      </main>
    );
  }

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
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <h1 className="mb-2 text-xl font-extrabold">{t("reset.title")}</h1>
              <p className="text-sm text-muted-foreground">{t("reset.body")}</p>
            </div>
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
              disabled={!password || !confirm || resetMutation.isPending}
              className="h-11 w-full rounded-xl"
            >
              {resetMutation.isPending ? t("auth.wait") : t("reset.submit")}
            </Button>
          </form>
        )}
      </section>
    </main>
  );
}
