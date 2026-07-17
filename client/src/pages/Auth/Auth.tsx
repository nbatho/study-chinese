import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Eye, EyeOff, Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import {
  useGoogleLoginMutation,
  useLoginMutation,
  useRegisterMutation,
  useResendRegistrationOtpMutation,
  useVerifyRegistrationMutation,
} from "../../api/auth/queries";
import { GoogleSignInButton } from "../../components/auth/GoogleSignInButton";
import { useAppSelector } from "../../store/hooks";
import { getErrorMessage as getErrorMessageWithFallback } from "../../utils/errorUtils";
import { useI18n } from "../../i18n";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { cn } from "../../utils/cn";
import { isStrongPassword } from "../../utils/passwordPolicy";

type AuthMode = "login" | "register";

const getErrorMessage = (error: unknown) =>
  getErrorMessageWithFallback(error, "Something went wrong. Please try again.");

export default function Auth() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const authStatus = useAppSelector((state) => state.auth.status);
  const loginMutation = useLoginMutation();
  const googleLoginMutation = useGoogleLoginMutation();
  const registerMutation = useRegisterMutation();
  const verifyRegistrationMutation = useVerifyRegistrationMutation();
  const resendRegistrationMutation = useResendRegistrationOtpMutation();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  // When set, registration succeeded and we're collecting the emailed OTP for this address.
  const [pendingEmail, setPendingEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verifyError, setVerifyError] = useState("");

  const isRegister = mode === "register";
  const isSubmitting = loginMutation.isPending || registerMutation.isPending;
  const title = isRegister ? t("auth.registerTitle") : t("auth.loginTitle");
  const submitLabel = isRegister ? t("auth.submitRegister") : t("auth.submitLogin");
  const subtitle = isRegister ? t("auth.registerSubtitle") : t("auth.loginSubtitle");

  const canSubmit = useMemo(() => {
    if (!email.trim() || !password) {
      return false;
    }

    if (isRegister && !isStrongPassword(password)) {
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

  const finishAuth = (destination: string) => {
    navigate(destination, { replace: true });
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
        const result = await registerMutation.mutateAsync({
          name: name.trim(),
          email: email.trim(),
          password,
        });
        // No account yet — move to OTP entry. It's created only after verification.
        setOtp("");
        setVerifyError("");
        setPendingEmail(result.email);
        toast.success(t("register.otpSent"));
      } else {
        await loginMutation.mutateAsync({
          email: email.trim(),
          password,
        });
        finishAuth("/home");
      }
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setVerifyError("");

    if (!/^\d{6}$/.test(otp.trim())) {
      setVerifyError(t("register.otpInvalid"));
      return;
    }

    try {
      await verifyRegistrationMutation.mutateAsync({ email: pendingEmail, otp: otp.trim() });
      // New accounts must complete onboarding (profile + placement test) first.
      finishAuth("/onboarding");
    } catch (error) {
      setVerifyError(getErrorMessage(error));
    }
  };

  const handleGoogleCredential = async (credential: string) => {
    setFormError("");

    try {
      const data = await googleLoginMutation.mutateAsync({ credential });
      // New Google accounts still need onboarding; returning users go straight home.
      finishAuth(data.isNewUser ? "/onboarding" : "/home");
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  const resendRegistrationOtp = async () => {
    setVerifyError("");

    try {
      await resendRegistrationMutation.mutateAsync(pendingEmail);
      toast.success(t("register.otpResent"));
    } catch (error) {
      setVerifyError(getErrorMessage(error));
    }
  };

  const cancelVerification = () => {
    setPendingEmail("");
    setOtp("");
    setVerifyError("");
  };

  return (
    <main className="app-workspace-bg grid min-h-[100dvh] place-items-center p-4 sm:p-6">
      <section
        className="anim-slide grid w-full max-w-245 overflow-hidden rounded-2xl border bg-card shadow-[0_18px_60px_rgba(26,26,30,0.08)] md:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)]"
      >
        <aside className="flex min-h-auto flex-col justify-between border-b bg-primary/10 p-5 sm:p-7 md:min-h-140 md:border-b-0 md:border-r md:p-9">
          <div>
            <div className="mb-9 inline-flex items-center gap-2.5">
              <span className="inline-flex size-10.5 items-center justify-center rounded-xl bg-primary text-primary-foreground">
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
          {pendingEmail ? (
            <form onSubmit={handleVerify} className="w-full animate-[auth-panel-in_0.32s_cubic-bezier(0.16,1,0.3,1)]">
              <button
                type="button"
                onClick={cancelVerification}
                className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground transition hover:text-primary"
              >
                <ArrowLeft size={16} /> {t("register.back")}
              </button>

              <span className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck size={24} />
              </span>
              <h2 className="mb-2 text-2xl sm:text-[1.9rem]">{t("register.verifyTitle")}</h2>
              <p className="text-muted-foreground">
                {t("register.verifyBody").replace("{email}", pendingEmail)}
              </p>

              <label className="mt-6 grid gap-2 font-bold">
                {t("register.otpLabel")}
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  autoComplete="one-time-code"
                  autoFocus
                  className="h-12 border-2 bg-background text-center text-lg tracking-[0.5em]"
                />
              </label>

              {verifyError && (
                <div
                  role="alert"
                  className="mt-4 rounded-xl border border-destructive/25 bg-destructive/10 px-3.5 py-3 text-sm font-bold text-destructive"
                >
                  {verifyError}
                </div>
              )}

              <Button
                type="submit"
                variant={otp.trim().length === 6 && !verifyRegistrationMutation.isPending ? "default" : "secondary"}
                disabled={otp.trim().length !== 6 || verifyRegistrationMutation.isPending}
                className="mt-5.5 h-12 w-full rounded-xl"
              >
                {verifyRegistrationMutation.isPending ? t("auth.wait") : t("register.verifySubmit")}
              </Button>

              <p className="mt-4.5 text-center text-sm text-muted-foreground">
                {t("register.otpNotReceived")}{" "}
                <button
                  type="button"
                  onClick={resendRegistrationOtp}
                  disabled={resendRegistrationMutation.isPending}
                  className="font-extrabold text-primary disabled:opacity-60"
                >
                  {resendRegistrationMutation.isPending ? t("auth.wait") : t("register.otpResend")}
                </button>
              </p>
            </form>
          ) : (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-7">
              <div
                className="relative isolate mb-6 inline-flex rounded-xl border bg-secondary p-1"
              >
                <span
                  className="absolute bottom-1 left-1 top-1 z-0 w-[calc(50%-4px)] rounded-lg bg-primary shadow-[0_6px_18px_rgba(217,63,71,0.24)] transition-transform duration-300 ease-out"
                  style={{
                    transform: mode === "register" ? "translateX(100%)" : "translateX(0)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={cn(
                    "relative z-10 rounded-lg px-4.5 py-2.25 font-extrabold transition hover:-translate-y-px",
                    mode === "login" ? "text-white" : "text-muted-foreground",
                  )}
                >
                  {t("auth.login")}
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className={cn(
                    "relative z-10 rounded-lg px-4.5 py-2.25 font-extrabold transition hover:-translate-y-px",
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

              {isRegister && (
                <p className="text-xs font-medium text-muted-foreground">{t("security.policyHint")}</p>
              )}

              {!isRegister && (
                <Link to="/forgot-password" className="justify-self-end text-sm font-bold text-primary">
                  {t("auth.forgotPassword")}
                </Link>
              )}
            </div>

            {formError && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-destructive/25 bg-destructive/10 px-3.5 py-3 text-sm font-bold text-destructive"
              >
                {formError}
              </div>
            )}

            <Button
              type="submit"
              variant={canSubmit && !isSubmitting ? "default" : "secondary"}
              disabled={!canSubmit || isSubmitting}
              className="mt-5.5 h-12 w-full rounded-xl"
            >
              {isSubmitting ? t("auth.wait") : submitLabel}
            </Button>

            <div className="my-5 flex items-center gap-3 text-xs font-bold text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              {t("auth.orContinue")}
              <span className="h-px flex-1 bg-border" />
            </div>

            <GoogleSignInButton
              onCredential={handleGoogleCredential}
              text={isRegister ? "signup_with" : "signin_with"}
            />

            {googleLoginMutation.isPending && (
              <p className="mt-3 text-center text-sm text-muted-foreground">{t("auth.wait")}</p>
            )}

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
          )}
        </div>
      </section>
    </main>
  );
}
