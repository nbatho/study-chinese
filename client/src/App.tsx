import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useStore } from "./store/store";
import Navigation from "./components/Navigation";
import type { Lesson } from "./resources/lessons";

export default function App() {
  const store = useStore();
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Sync dark appearance on mount
  useEffect(() => {
    if (store.profile.appAppearance === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [store.profile.appAppearance]);

  // If user hasn't finished Onboarding, force onboarding page
  useEffect(() => {
    if (!store.profile.hasCompletedOnboarding) {
      navigate("/onboarding", { replace: true });
    }
  }, [store.profile.hasCompletedOnboarding, navigate]);

  if (!store.profile.hasCompletedOnboarding) {
    return null;
  }

  return (
    <div className="app-container">
      {/* Global Achievement Toast Notify */}
      {store.recentlyUnlocked && (
        <div className="achievement-toast anim-pop">
          <span style={{ fontSize: "2.4rem" }}>{store.recentlyUnlocked.emoji}</span>
          <div style={{ textAlign: "left" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, display: "block" }}>
              ACHIEVEMENT UNLOCKED
            </span>
            <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-main)" }}>
              {store.recentlyUnlocked.title}
            </h4>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {store.recentlyUnlocked.description}
            </p>
          </div>
        </div>
      )}

      {/* Main Screen Body View Router */}
      <main className="main-content">
        <Outlet context={{ selectedLesson, setSelectedLesson }} />
      </main>

      {/* Global Tab Navigation */}
      <Navigation />
    </div>
  );
}
