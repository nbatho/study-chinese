import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useI18n } from "../../../i18n";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

interface VerifyOtpFormProps {
  pendingEmail: string;
  otp: string;
  verifyError: string;
  isVerifying: boolean;
  isResending: boolean;
  onOtpChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
  onResend: () => void;
}

export default function VerifyOtpForm({
  pendingEmail,
  otp,
  verifyError,
  isVerifying,
  isResending,
  onOtpChange,
  onSubmit,
  onCancel,
  onResend,
}: VerifyOtpFormProps) {
  const { t } = useI18n();

  return (
    <form onSubmit={onSubmit} className="w-full animate-[auth-panel-in_0.32s_cubic-bezier(0.16,1,0.3,1)]">
      <button
        type="button"
        onClick={onCancel}
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
          onChange={(event) => onOtpChange(event.target.value.replace(/\D/g, ""))}
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
        variant={otp.trim().length === 6 && !isVerifying ? "default" : "secondary"}
        disabled={otp.trim().length !== 6 || isVerifying}
        className="mt-5.5 h-12 w-full rounded-xl"
      >
        {isVerifying ? t("auth.wait") : t("register.verifySubmit")}
      </Button>

      <p className="mt-4.5 text-center text-sm text-muted-foreground">
        {t("register.otpNotReceived")}{" "}
        <button
          type="button"
          onClick={onResend}
          disabled={isResending}
          className="font-extrabold text-primary disabled:opacity-60"
        >
          {isResending ? t("auth.wait") : t("register.otpResend")}
        </button>
      </p>
    </form>
  );
}
