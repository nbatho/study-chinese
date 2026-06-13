import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import Navigation from "./components/Navigation";
import ErrorBoundary from "./components/ErrorBoundary";
import { useUserProfileQuery } from "./api/users/queries";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setAppearance, setOnboardingCompleted } from "./store/modules/appSlice";

export default function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const profileQuery = useUserProfileQuery();
  const appAppearance = useAppSelector((state) => state.app.appAppearance);
  const hasCompletedOnboarding = useAppSelector((state) => state.app.hasCompletedOnboarding);
  const language = useAppSelector((state) => state.app.language);
  const serverProfile = profileQuery.data?.profile;

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
    if (!profileQuery.isLoading && !hasCompletedOnboarding && location.pathname !== "/onboarding") {
      navigate("/onboarding", { replace: true });
    }
  }, [hasCompletedOnboarding, location.pathname, navigate, profileQuery.isLoading]);

  if (profileQuery.isLoading || !hasCompletedOnboarding) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-3xl flex-1 px-3 pb-24 pt-4 sm:px-4 sm:pt-6 lg:max-w-5xl lg:px-6">
        <ErrorBoundary resetKey={location.pathname}>
          <Outlet context={{ selectedLessonId, setSelectedLessonId }} />
        </ErrorBoundary>
      </main>

      <Navigation />
      <Toaster richColors position="top-right" />
    </div>
  );
}
