import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { useLoginMutation, useRegisterMutation } from "../api/auth/queries";
import { useStore } from "../store/store";
import { useAppSelector } from "../store/hooks";
import { ApiError } from "../utils/errorUtils";

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
  const localStore = useStore();
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
  const title = isRegister ? "Create your account" : "Welcome back";
  const submitLabel = isRegister ? "Create account" : "Sign in";
  const subtitle = isRegister
    ? "Set up your Chinese learning path with lessons, review, and daily practice."
    : "Continue your lessons, vocabulary reviews, and conversation practice.";

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

  const finishAuth = (displayName?: string) => {
    if (displayName) {
      localStore.updateProfile({ name: displayName });
    }

    navigate(localStore.profile.hasCompletedOnboarding ? "/home" : "/onboarding", {
      replace: true,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (!canSubmit) {
      setFormError(
        isRegister
          ? "Please enter your name, email, and a password with at least 8 characters."
          : "Please enter a valid email and password.",
      );
      return;
    }

    try {
      if (isRegister) {
        const response = await registerMutation.mutateAsync({
          name: name.trim(),
          email: email.trim(),
          password,
        });
        finishAuth(response.user.name || name.trim());
      } else {
        const response = await loginMutation.mutateAsync({
          email: email.trim(),
          password,
        });
        finishAuth(response.user.name);
      }
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background:
          "radial-gradient(circle at 15% 10%, rgba(217, 63, 71, 0.12), transparent 28%), var(--bg-app)",
      }}
    >
      <section
        className="auth-shell anim-slide"
        style={{
          width: "100%",
          maxWidth: "980px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.95fr) minmax(360px, 1.05fr)",
          overflow: "hidden",
          borderRadius: "20px",
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-card)",
          boxShadow: "0 18px 60px rgba(26, 26, 30, 0.08)",
        }}
      >
        <aside
          style={{
            padding: "36px",
            background:
              "linear-gradient(145deg, rgba(217, 63, 71, 0.14), rgba(16, 185, 129, 0.08))",
            borderRight: "1px solid var(--border-color)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "560px",
          }}
        >
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "36px" }}>
              <span
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "var(--primary-red)",
                  color: "white",
                }}
              >
                <BookOpen size={21} />
              </span>
              <strong style={{ fontSize: "1.05rem" }}>Study Chinese</strong>
            </div>

            <h1 style={{ fontSize: "2.4rem", lineHeight: 1.1, marginBottom: "16px" }}>
              Learn Chinese with progress that follows you.
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "360px" }}>
              Build steady habits with HSK lessons, smart vocabulary review, handwriting support, and guided conversation practice.
            </p>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            {["Personalized HSK path", "Daily vocabulary review", "AI tutor conversations"].map((item) => (
              <div
                key={item}
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "1px solid rgba(217, 63, 71, 0.12)",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  fontWeight: 700,
                  color: "var(--text-main)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </aside>

        <div style={{ padding: "36px", display: "flex", alignItems: "center" }}>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <div style={{ marginBottom: "28px" }}>
              <div
                className="auth-tab-switch"
                style={{
                  display: "inline-flex",
                  padding: "4px",
                  borderRadius: "12px",
                  backgroundColor: "var(--bg-card-hover)",
                  border: "1px solid var(--border-color)",
                  marginBottom: "24px",
                  position: "relative",
                }}
              >
                <span
                  className="auth-tab-indicator"
                  style={{
                    transform: mode === "register" ? "translateX(100%)" : "translateX(0)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="auth-tab-button"
                  style={{
                    padding: "9px 18px",
                    border: "none",
                    borderRadius: "9px",
                    cursor: "pointer",
                    fontWeight: 800,
                    color: mode === "login" ? "white" : "var(--text-muted)",
                    backgroundColor: "transparent",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="auth-tab-button"
                  style={{
                    padding: "9px 18px",
                    border: "none",
                    borderRadius: "9px",
                    cursor: "pointer",
                    fontWeight: 800,
                    color: mode === "register" ? "white" : "var(--text-muted)",
                    backgroundColor: "transparent",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  Register
                </button>
              </div>

              <div key={`copy-${mode}`} className="auth-mode-copy">
                <h2 style={{ fontSize: "1.9rem", marginBottom: "8px" }}>{title}</h2>
                <p style={{ color: "var(--text-muted)" }}>{subtitle}</p>
              </div>
            </div>

            <div key={`fields-${mode}`} className="auth-mode-panel" style={{ display: "grid", gap: "14px" }}>
              {isRegister && (
                <label className="auth-field-enter" style={{ display: "grid", gap: "8px", fontWeight: 700 }}>
                  Name
                  <span style={{ position: "relative" }}>
                    <UserRound size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Nguyen Van A"
                      autoComplete="name"
                      style={{
                        width: "100%",
                        padding: "14px 16px 14px 44px",
                        borderRadius: "12px",
                        border: "2px solid var(--border-color)",
                        backgroundColor: "var(--bg-app)",
                        color: "var(--text-main)",
                        fontSize: "1rem",
                        outline: "none",
                      }}
                    />
                  </span>
                </label>
              )}

              <label style={{ display: "grid", gap: "8px", fontWeight: 700 }}>
                Email
                <span style={{ position: "relative" }}>
                  <Mail size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="learner@example.com"
                    autoComplete="email"
                    style={{
                      width: "100%",
                      padding: "14px 16px 14px 44px",
                      borderRadius: "12px",
                      border: "2px solid var(--border-color)",
                      backgroundColor: "var(--bg-app)",
                      color: "var(--text-main)",
                      fontSize: "1rem",
                      outline: "none",
                    }}
                  />
                </span>
              </label>

              <label style={{ display: "grid", gap: "8px", fontWeight: 700 }}>
                Password
                <span style={{ position: "relative" }}>
                  <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={isRegister ? "At least 8 characters" : "Your password"}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    style={{
                      width: "100%",
                      padding: "14px 48px 14px 44px",
                      borderRadius: "12px",
                      border: "2px solid var(--border-color)",
                      backgroundColor: "var(--bg-app)",
                      color: "var(--text-main)",
                      fontSize: "1rem",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "transparent",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </label>
            </div>

            {formError && (
              <div
                role="alert"
                style={{
                  marginTop: "16px",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "1px solid rgba(239, 68, 68, 0.24)",
                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                  color: "var(--tone-4)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                {formError}
              </div>
            )}

            <button
              type="submit"
              className={`btn ${canSubmit && !isSubmitting ? "btn-primary" : "btn-disabled"}`}
              disabled={!canSubmit || isSubmitting}
              style={{ width: "100%", marginTop: "22px", padding: "14px 18px" }}
            >
              {isSubmitting ? "Please wait..." : submitLabel}
            </button>

            <p style={{ marginTop: "18px", color: "var(--text-muted)", textAlign: "center", fontSize: "0.9rem" }}>
              {isRegister ? "Already have an account?" : "New to Study Chinese?"}{" "}
              <button
                type="button"
                onClick={() => switchMode(isRegister ? "login" : "register")}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "var(--primary-red)",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                {isRegister ? "Log in" : "Create one"}
              </button>
            </p>

            {authStatus === "authenticated" && (
              <p style={{ marginTop: "12px", color: "var(--jade)", textAlign: "center", fontWeight: 700 }}>
                You are signed in. Preparing your study space...
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
