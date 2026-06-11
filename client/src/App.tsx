import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navigation from "./components/Navigation";
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
  const serverProfile = profileQuery.data?.profile;

  useEffect(() => {
    if (!serverProfile) return;
    dispatch(setAppearance(serverProfile.appAppearance));
    dispatch(setOnboardingCompleted(serverProfile.hasCompletedOnboarding));
  }, [dispatch, serverProfile]);

  useEffect(() => {
    if (appAppearance === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [appAppearance]);

  useEffect(() => {
    if (!profileQuery.isLoading && !hasCompletedOnboarding && location.pathname !== "/onboarding") {
      navigate("/onboarding", { replace: true });
    }
  }, [hasCompletedOnboarding, location.pathname, navigate, profileQuery.isLoading]);

  if (profileQuery.isLoading || !hasCompletedOnboarding) {
    return null;
  }

  return (
    <div className="app-container">
      <main className="main-content">
        <Outlet context={{ selectedLessonId, setSelectedLessonId }} />
      </main>

      <Navigation />
    </div>
  );
}
