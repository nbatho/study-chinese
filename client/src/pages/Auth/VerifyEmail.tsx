import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, MailWarning } from "lucide-react";
import { useVerifyEmailMutation } from "../../api/auth/queries";
import { useI18n } from "../../i18n";
import { Button } from "../../components/ui/button";

export default function VerifyEmail() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const verifyMutation = useVerifyEmailMutation();
  // Tokens are single-use; guard against StrictMode double-invoking the effect.
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!token || requestedRef.current) return;
    requestedRef.current = true;
    verifyMutation.mutate(token);
  }, [token, verifyMutation]);

  const isError = !token || verifyMutation.isError;
  const isSuccess = verifyMutation.isSuccess;

  return (
    <main className="app-workspace-bg grid min-h-[100dvh] place-items-center p-4">
      <section className="anim-slide w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        {isSuccess ? (
          <>
            <CheckCircle2 className="mx-auto mb-4 size-12 text-jade" />
            <h1 className="mb-2 text-xl font-extrabold">{t("verifyEmail.successTitle")}</h1>
            <p className="mb-6 text-sm text-muted-foreground">{t("verifyEmail.successBody")}</p>
            <Button asChild className="h-11 w-full rounded-xl">
              <Link to="/home">{t("verifyEmail.continue")}</Link>
            </Button>
          </>
        ) : isError ? (
          <>
            <MailWarning className="mx-auto mb-4 size-12 text-destructive" />
            <h1 className="mb-2 text-xl font-extrabold">{t("verifyEmail.errorTitle")}</h1>
            <p className="mb-6 text-sm text-muted-foreground">{t("verifyEmail.errorBody")}</p>
            <Button asChild variant="secondary" className="h-11 w-full rounded-xl">
              <Link to="/settings">{t("verifyEmail.goSettings")}</Link>
            </Button>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto mb-4 size-12 animate-spin text-primary" />
            <h1 className="text-xl font-extrabold">{t("verifyEmail.verifying")}</h1>
          </>
        )}
      </section>
    </main>
  );
}
