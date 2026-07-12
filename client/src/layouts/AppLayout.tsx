import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import ErrorBoundary from "../components/ErrorBoundary";
import Navbar from "../components/Navbar";
import Navigation from "../components/Navigation";
import BottomNav from "../components/BottomNav";
import { HanziLookupProvider } from "../components/HanziLookup";
import { useUserProfileQuery } from "../api/users/queries";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAppearance, setOnboardingCompleted } from "../store/modules/appSlice";
import { cn } from "../utils/cn";
import { useI18n } from "../i18n";
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
  const hasCompletedOnboarding = useAppSelector((state) => state.app.hasCompletedOnboarding);
  const language = useAppSelector((state) => state.app.language);
  const serverProfile = profileQuery.data?.profile;
  const isHomePath = location.pathname === "/home";
  const { t } = useI18n();
  const studiedToday = profileQuery.data?.streak?.lastStudyDateKey === todayKey();

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

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (
      isAuthenticated &&
      !profileQuery.isLoading &&
      !hasCompletedOnboarding &&
      location.pathname !== "/onboarding"
    ) {
      navigate("/onboarding", { replace: true });
    }
  }, [hasCompletedOnboarding, isAuthenticated, location.pathname, navigate, profileQuery.isLoading]);

  if (isAuthenticated && !hasCompletedOnboarding) {
    return null;
  }

  return (
    <HanziLookupProvider>
      <div className="app-workspace-bg flex h-[100dvh] overflow-hidden">
        <Navigation
          collapsed={isSidebarCollapsed}
          onToggleCollapsed={() => setIsSidebarCollapsed((value) => !value)}
        />

        <main className="relative flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <Navbar />
          <div className="flex w-full min-w-0 flex-1 justify-center overflow-x-hidden">
            <div
              className={cn(
                "box-border w-full min-w-0 px-3 py-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:px-5 sm:py-6 md:pb-6 lg:px-8",
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

        <Toaster richColors position="top-right" />
      </div>
    </HanziLookupProvider>
  );
}
