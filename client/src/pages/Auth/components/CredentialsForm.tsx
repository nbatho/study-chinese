import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { GoogleSignInButton } from "../../../components/auth/GoogleSignInButton";
import { useI18n } from "../../../i18n";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { cn } from "../../../utils/cn";

export type AuthMode = "login" | "register";

interface CredentialsFormProps {
  mode: AuthMode;
  name: string;
  email: string;
  password: string;
  showPassword: boolean;
  formError: string;
  canSubmit: boolean;
  isSubmitting: boolean;
  googleLoading: boolean;
  isAuthenticated: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onToggleShowPassword: () => void;
  onSwitchMode: (mode: AuthMode) => void;
  onSubmit: (event: React.FormEvent) => void;
  onGoogleCredential: (credential: string) => void;
}

export default function CredentialsForm({
  mode,
  name,
  email,
  password,
  showPassword,
  formError,
  canSubmit,
  isSubmitting,
  googleLoading,
  isAuthenticated,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onToggleShowPassword,
  onSwitchMode,
  onSubmit,
  onGoogleCredential,
}: CredentialsFormProps) {
  const { t } = useI18n();
  const isRegister = mode === "register";
  const title = isRegister ? t("auth.registerTitle") : t("auth.loginTitle");
  const submitLabel = isRegister ? t("auth.submitRegister") : t("auth.submitLogin");
  const subtitle = isRegister ? t("auth.registerSubtitle") : t("auth.loginSubtitle");

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="mb-7">
        <div className="relative isolate mb-6 inline-flex rounded-xl border bg-secondary p-1">
          <span
            className="absolute bottom-1 left-1 top-1 z-0 w-[calc(50%-4px)] rounded-lg bg-primary shadow-[0_6px_18px_rgba(217,63,71,0.24)] transition-transform duration-300 ease-out"
            style={{
              transform: mode === "register" ? "translateX(100%)" : "translateX(0)",
            }}
          />
          <button
            type="button"
            onClick={() => onSwitchMode("login")}
            className={cn(
              "relative z-10 rounded-lg px-4.5 py-2.25 font-extrabold transition hover:-translate-y-px",
              mode === "login" ? "text-white" : "text-muted-foreground",
            )}
          >
            {t("auth.login")}
          </button>
          <button
            type="button"
            onClick={() => onSwitchMode("register")}
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
                onChange={(event) => onNameChange(event.target.value)}
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
              onChange={(event) => onEmailChange(event.target.value)}
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
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder={isRegister ? t("auth.newPasswordPlaceholder") : t("auth.passwordPlaceholder")}
              autoComplete={isRegister ? "new-password" : "current-password"}
              className="h-12 border-2 bg-background px-12 pl-11 text-base"
            />
            <button
              type="button"
              onClick={onToggleShowPassword}
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
        onCredential={onGoogleCredential}
        text={isRegister ? "signup_with" : "signin_with"}
      />

      {googleLoading && (
        <p className="mt-3 text-center text-sm text-muted-foreground">{t("auth.wait")}</p>
      )}

      <p className="mt-4.5 text-center text-sm text-muted-foreground">
        {isRegister ? t("auth.hasAccount") : t("auth.newHere")}{" "}
        <button
          type="button"
          onClick={() => onSwitchMode(isRegister ? "login" : "register")}
          className="font-extrabold text-primary"
        >
          {isRegister ? t("auth.logIn") : t("auth.createOne")}
        </button>
      </p>

      {isAuthenticated && (
        <p className="mt-3 text-center font-bold text-jade">
          {t("auth.signedIn")}
        </p>
      )}
    </form>
  );
}
