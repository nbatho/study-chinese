import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useGoogleLoginMutation,
  useLoginMutation,
  useRegisterMutation,
  useResendRegistrationOtpMutation,
  useVerifyRegistrationMutation,
} from "../../api/auth/queries";
import { useAppSelector } from "../../store/hooks";
import { getErrorMessage as getErrorMessageWithFallback } from "../../utils/errorUtils";
import { useI18n } from "../../i18n";
import { isStrongPassword } from "../../utils/passwordPolicy";
import AuthHero from "./components/AuthHero";
import VerifyOtpForm from "./components/VerifyOtpForm";
import CredentialsForm, { type AuthMode } from "./components/CredentialsForm";

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
    // Blur the focused field before navigating so the on-screen keyboard
    // starts dismissing (and the browser's chrome starts re-expanding) while
    // we're still on this min-height page, instead of mid-animation once
    // AppLayout's fixed-height shell has already mounted and taken its first
    // measurement. Applies to both iOS Safari and Android Chrome.
    (document.activeElement as HTMLElement | null)?.blur();
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
      <section className="anim-slide grid w-full max-w-245 overflow-hidden rounded-2xl border bg-card shadow-[0_18px_60px_rgba(26,26,30,0.08)] md:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)]">
        <AuthHero />

        <div className="flex items-center p-5 sm:p-7 md:p-9">
          {pendingEmail ? (
            <VerifyOtpForm
              pendingEmail={pendingEmail}
              otp={otp}
              verifyError={verifyError}
              isVerifying={verifyRegistrationMutation.isPending}
              isResending={resendRegistrationMutation.isPending}
              onOtpChange={setOtp}
              onSubmit={handleVerify}
              onCancel={cancelVerification}
              onResend={resendRegistrationOtp}
            />
          ) : (
            <CredentialsForm
              mode={mode}
              name={name}
              email={email}
              password={password}
              showPassword={showPassword}
              formError={formError}
              canSubmit={canSubmit}
              isSubmitting={isSubmitting}
              googleLoading={googleLoginMutation.isPending}
              isAuthenticated={authStatus === "authenticated"}
              onNameChange={setName}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onToggleShowPassword={() => setShowPassword((value) => !value)}
              onSwitchMode={switchMode}
              onSubmit={handleSubmit}
              onGoogleCredential={handleGoogleCredential}
            />
          )}
        </div>
      </section>
    </main>
  );
}
