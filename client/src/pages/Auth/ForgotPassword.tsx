import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MailCheck } from "lucide-react";
import { useForgotPasswordMutation } from "../../api/auth/queries";
import { useI18n } from "../../i18n";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function ForgotPassword() {
  const { t } = useI18n();
  const forgotMutation = useForgotPasswordMutation();
  const [email, setEmail] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || forgotMutation.isPending) return;
    await forgotMutation.mutateAsync(email.trim()).catch(() => undefined);
  };

  return (
    <main className="app-workspace-bg grid min-h-[100dvh] place-items-center p-4">
      <section className="anim-slide w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        {forgotMutation.isSuccess ? (
          <div className="text-center">
            <MailCheck className="mx-auto mb-4 size-12 text-jade" />
            <h1 className="mb-2 text-xl font-extrabold">{t("forgot.sentTitle")}</h1>
            <p className="mb-6 text-sm text-muted-foreground">{t("forgot.sentBody")}</p>
            <Button asChild variant="secondary" className="h-11 w-full rounded-xl">
              <Link to="/auth">{t("forgot.backToLogin")}</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
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
        )}
      </section>
    </main>
  );
}
