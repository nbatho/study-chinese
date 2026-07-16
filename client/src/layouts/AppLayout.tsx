import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MailWarning } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useResendVerificationMutation } from "../api/auth/queries";
import ErrorBoundary from "../components/ErrorBoundary";
import Navbar from "../components/Navbar";
import Navigation from "../components/Navigation";
import BottomNav from "../components/BottomNav";
import { HanziLookupProvider } from "../components/HanziLookup";
import { useUserProfileQuery } from "../api/users/queries";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAppearance, setOnboardingCompleted } from "../store/modules/appSlice";
import { cn } from "../utils/cn";
import { useDocumentLanguage, useI18n } from "../i18n";
import { useStudyReminder } from "../hooks/useStudyReminder";
import { todayKey } from "../utils/studyReminder";

export default function AppLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 900 : false,
  );
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const profileQuery = useUserProfileQuery(isAuthenticated);
  const appAppearance = useAppSelector((state) => state.app.appAppearance);
  useDocumentLanguage();
  const serverProfile = profileQuery.data?.profile;
  const isHomePath = location.pathname === "/home";
  const { t } = useI18n();
  const studiedToday = profileQuery.data?.streak?.lastStudyDateKey === todayKey();
  const resendVerificationMutation = useResendVerificationMutation();
  const [verifyBannerDismissed, setVerifyBannerDismissed] = useState(false);
  const showVerifyBanner =
    isAuthenticated && !verifyBannerDismissed && serverProfile?.emailVerified === false;

  const resendVerification = async () => {
    try {
      const result = await resendVerificationMutation.mutateAsync();
      toast.success(result.alreadyVerified ? t("emailVerify.already") : t("emailVerify.sent"));
      setVerifyBannerDismissed(true);
    } catch {
      toast.error(t("emailVerify.failed"));
    }
  };

  useStudyReminder({
    studiedToday: isAuthenticated ? studiedToday : true,
    title: t("reminder.notifTitle"),
    body: t("reminder.notifBody"),
    href: "/learn",
  });

  useEffect(() => {
    if (!serverProfile) return;
    dispatch(setAppearance(serverProfile.appAppearance));
    dispatch(setOnboardingCompleted(serverProfile.hasCompletedOnboarding));
  }, [dispatch, serverProfile]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyAppearance = () => {
      const prefersDark = appAppearance === "system" ? mediaQuery.matches : appAppearance === "dark";
      document.body.classList.toggle("dark", prefersDark);
    };

    applyAppearance();

    if (appAppearance !== "system") return;
    mediaQuery.addEventListener("change", applyAppearance);
    return () => mediaQuery.removeEventListener("change", applyAppearance);
  }, [appAppearance]);

  // Only the server's answer decides this. The store's `hasCompletedOnboarding`
  // defaults to false and is filled in by the effect above once the profile
  // lands, and `isLoading` stays false while the query is still disabled on
  // unresolved auth — so gating on either bounces signed-in users to
  // /onboarding, which sends them straight on to /home.
  const needsOnboarding = serverProfile?.hasCompletedOnboarding === false;

  useEffect(() => {
    if (needsOnboarding && location.pathname !== "/onboarding") {
      navigate("/onboarding", { replace: true });
    }
  }, [location.pathname, navigate, needsOnboarding]);

  if (needsOnboarding) {
    return null;
  }

  return (
    <HanziLookupProvider>
      <div className="app-workspace-bg flex h-[100dvh] overflow-hidden">
        <Navigation
          collapsed={isSidebarCollapsed}
          onToggleCollapsed={() => setIsSidebarCollapsed((value) => !value)}
        />

        {/* BottomNav sits in normal flow below the scroll area: a fixed bar tied to
            the visual viewport drifts on iOS while Safari's chrome expands or
            collapses, leaving a phantom band above the tabs. */}
        <div className="flex min-w-0 flex-1 flex-col">
        <main className="relative flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <Navbar />
          {showVerifyBanner && (
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                <MailWarning size={14} className="shrink-0 text-amber-600" />
                {t("emailVerify.banner")}
              </span>
              <button
                type="button"
                onClick={resendVerification}
                disabled={resendVerificationMutation.isPending}
                className="text-xs font-extrabold text-primary underline-offset-2 hover:underline disabled:opacity-60"
              >
                {t("emailVerify.resend")}
              </button>
            </div>
          )}
          <div className="flex w-full min-w-0 flex-1 justify-center overflow-x-hidden">
            <div
              className={cn(
                "box-border w-full min-w-0 px-3 py-4 pb-6 sm:px-5 sm:py-6 lg:px-8",
                isHomePath ? "max-w-[1500px]" : "max-w-7xl",
              )}
            >
              <ErrorBoundary resetKey={location.pathname}>
                <Outlet context={{ selectedLessonId, setSelectedLessonId }} />
              </ErrorBoundary>
            </div>
          </div>
        </main>

        <BottomNav />
        </div>

        <Toaster richColors position="top-right" />
      </div>
    </HanziLookupProvider>
  );
}
