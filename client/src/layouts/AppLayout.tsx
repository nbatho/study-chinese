import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import ErrorBoundary from "../components/ErrorBoundary";
import Navbar from "../components/Navbar";
import Navigation from "../components/Navigation";
import { useUserProfileQuery } from "../api/users/queries";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAppearance, setOnboardingCompleted } from "../store/modules/appSlice";

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
      !isHomePath &&
      location.pathname !== "/onboarding"
    ) {
      navigate("/onboarding", { replace: true });
    }
  }, [hasCompletedOnboarding, isAuthenticated, isHomePath, location.pathname, navigate, profileQuery.isLoading]);

  if (isAuthenticated && !isHomePath && (profileQuery.isLoading || !hasCompletedOnboarding)) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Navigation
        collapsed={isSidebarCollapsed}
        onToggleCollapsed={() => setIsSidebarCollapsed((value) => !value)}
      />

      <main className="min-w-0 flex-1 overflow-y-auto bg-background">
        <Navbar />
        <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-6 lg:px-7">
          <ErrorBoundary resetKey={location.pathname}>
            <Outlet context={{ selectedLessonId, setSelectedLessonId }} />
          </ErrorBoundary>
        </div>
      </main>

      <Toaster richColors position="top-right" />
    </div>
  );
}
