import { useState, useEffect } from "react";
import { useStore } from "./store/store";
import Navigation from "./components/Navigation";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Practice from "./pages/Practice";
import Review from "./pages/Review";
import Profile from "./pages/Profile";
import AITutor from "./pages/AITutor";
import CameraTranslator from "./pages/CameraTranslator";
import type { Lesson } from "./resources/lessons";

export default function App() {
  const store = useStore();
  const [activeTab, setActiveTab] = useState<"home" | "learn" | "practice" | "review" | "profile">("home");
  const [showAITutor, setShowAITutor] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Sync dark appearance on mount
  useEffect(() => {
    if (store.profile.appAppearance === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [store.profile.appAppearance]);

  // If user hasn't finished Onboarding, force onboarding wizard
  if (!store.profile.hasCompletedOnboarding) {
    return <Onboarding />;
  }

  const handleSelectLessonFromHome = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setActiveTab("learn");
  };

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
        {activeTab === "home" && (
          <Home
            onLaunchAITutor={() => setShowAITutor(true)}
            onLaunchCamera={() => setShowCamera(true)}
            onSelectLesson={handleSelectLessonFromHome}
            onTabChange={setActiveTab}
          />
        )}

        {activeTab === "learn" && (
          <Learn
            selectedLesson={selectedLesson}
            onSelectLesson={setSelectedLesson}
          />
        )}

        {activeTab === "practice" && <Practice />}

        {activeTab === "review" && <Review />}

        {activeTab === "profile" && <Profile />}
      </main>

      {/* Fullscreen Overlay Sheets / covers */}
      {showAITutor && (
        <AITutor onClose={() => setShowAITutor(false)} />
      )}

      {showCamera && (
        <CameraTranslator onClose={() => setShowCamera(false)} />
      )}

      {/* Global Tab Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
