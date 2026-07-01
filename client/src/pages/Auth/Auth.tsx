import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { useLoginMutation, useRegisterMutation } from "../../api/auth/queries";
import { useAppSelector } from "../../store/hooks";
import { ApiError } from "../../utils/errorUtils";
import { useI18n } from "../../i18n";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { cn } from "../../utils/cn";

type AuthMode = "login" | "register";

const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

export default function Auth() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const authStatus = useAppSelector((state) => state.auth.status);
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const isRegister = mode === "register";
  const isSubmitting = loginMutation.isPending || registerMutation.isPending;
  const title = isRegister ? t("auth.registerTitle") : t("auth.loginTitle");
  const submitLabel = isRegister ? t("auth.submitRegister") : t("auth.submitLogin");
  const subtitle = isRegister ? t("auth.registerSubtitle") : t("auth.loginSubtitle");

  const canSubmit = useMemo(() => {
    if (!email.trim() || !password) {
      return false;
    }

    if (isRegister && password.length < 8) {
      return false;
    }

    if (isRegister && !name.trim()) {
      return false;
    }

    return true;
  }, [email, isRegister, name, password]);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setFormError("");
  };

  const finishAuth = () => {
    navigate("/home", { replace: true });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (!canSubmit) {
      setFormError(
        isRegister
          ? t("auth.invalidRegister")
          : t("auth.invalidLogin"),
      );
      return;
    }

    try {
      if (isRegister) {
        await registerMutation.mutateAsync({
          name: name.trim(),
          email: email.trim(),
          password,
        });
        finishAuth();
      } else {
        await loginMutation.mutateAsync({
          email: email.trim(),
          password,
        });
        finishAuth();
      }
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_15%_10%,rgba(217,63,71,0.12),transparent_28%),var(--bg-app)] p-4 sm:p-6">
      <section
        className="anim-slide grid w-full max-w-245 overflow-hidden rounded-lg border bg-card shadow-[0_18px_60px_rgba(26,26,30,0.08)] md:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)]"
      >
        <aside className="flex min-h-auto flex-col justify-between border-b bg-[linear-gradient(145deg,rgba(217,63,71,0.14),rgba(16,185,129,0.08))] p-5 sm:p-7 md:min-h-140 md:border-b-0 md:border-r md:p-9">
          <div>
            <div className="mb-9 inline-flex items-center gap-2.5">
              <span className="inline-flex size-10.5 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen size={21} />
              </span>
              <strong className="text-[1.05rem]">Study Chinese</strong>
            </div>

            <h1 className="mb-4 text-3xl leading-[1.1] sm:text-[2.4rem]">
              {t("auth.heroTitle")}
            </h1>
            <p className="max-w-90 text-base text-muted-foreground">
              {t("auth.heroSubtitle")}
            </p>
          </div>

          <div className="grid gap-3">
            {[t("auth.featurePath"), t("auth.featureReview"), t("auth.featureTutor")].map((item) => (
              <Card key={item} className="border-primary/10 bg-white/50 p-3.5 font-bold shadow-none dark:bg-white/5">
                {item}
              </Card>
            ))}
          </div>
        </aside>

        <div className="flex items-center p-5 sm:p-7 md:p-9">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-7">
              <div
                className="relative isolate mb-6 inline-flex rounded-lg border bg-secondary p-1"
              >
                <span
                  className="absolute bottom-1 left-1 top-1 z-0 w-[calc(50%-4px)] rounded-[9px] bg-[linear-gradient(135deg,var(--primary-red),var(--accent-red))] shadow-[0_6px_18px_rgba(217,63,71,0.24)] transition-transform duration-300 ease-out"
                  style={{
                    transform: mode === "register" ? "translateX(100%)" : "translateX(0)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={cn(
                    "relative z-10 rounded-md px-4.5 py-2.25 font-extrabold transition hover:-translate-y-px",
                    mode === "login" ? "text-white" : "text-muted-foreground",
                  )}
                >
                  {t("auth.login")}
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className={cn(
                    "relative z-10 rounded-md px-4.5 py-2.25 font-extrabold transition hover:-translate-y-px",
                    mode === "register" ? "text-white" : "text-muted-foreground",
                  )}
                >
                  {t("auth.register")}
                </button>
              </div>

              <div key={`copy-${mode}`} className="animate-[auth-copy-in_0.28s_cubic-bezier(0.16,1,0.3,1)]">
                <h2 className="mb-2 text-2xl sm:text-[1.9rem]">{title}</h2>
                <p className="text-muted-foreground">{subtitle}</p>
              </div>
            </div>

            <div key={`fields-${mode}`} className="grid origin-top gap-3.5 animate-[auth-panel-in_0.32s_cubic-bezier(0.16,1,0.3,1)]">
              {isRegister && (
                <label className="grid gap-2 overflow-hidden font-bold animate-[auth-field-in_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                  {t("auth.name")}
                  <span className="relative">
                    <UserRound className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Nguyen Van A"
                      autoComplete="name"
                      className="h-12 border-2 bg-background pl-11 text-base"
                    />
                  </span>
                </label>
              )}

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

              <label className="grid gap-2 font-bold">
                {t("auth.password")}
                <span className="relative">
                  <Lock className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={isRegister ? t("auth.newPasswordPlaceholder") : t("auth.passwordPlaceholder")}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    className="h-12 border-2 bg-background px-12 pl-11 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </label>
            </div>

            {formError && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-destructive/25 bg-destructive/10 px-3.5 py-3 text-sm font-bold text-destructive"
              >
                {formError}
              </div>
            )}

            <Button
              type="submit"
              variant={canSubmit && !isSubmitting ? "default" : "secondary"}
              disabled={!canSubmit || isSubmitting}
              className="mt-5.5 h-12 w-full"
            >
              {isSubmitting ? t("auth.wait") : submitLabel}
            </Button>

            <p className="mt-4.5 text-center text-sm text-muted-foreground">
              {isRegister ? t("auth.hasAccount") : t("auth.newHere")}{" "}
              <button
                type="button"
                onClick={() => switchMode(isRegister ? "login" : "register")}
                className="font-extrabold text-primary"
              >
                {isRegister ? t("auth.logIn") : t("auth.createOne")}
              </button>
            </p>

            {authStatus === "authenticated" && (
              <p className="mt-3 text-center font-bold text-jade">
                {t("auth.signedIn")}
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
