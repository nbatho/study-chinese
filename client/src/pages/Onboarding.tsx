import { useState, useEffect } from "react";
import { useStore } from "../store/store";
import type { SkillLevel, LearningGoal } from "../store/store";
import { useUpdateProfileMutation } from "../api/users/queries";
import { ArrowRight, Sparkles, BookOpen, Target } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Onboarding() {
  const store = useStore();
  const updateProfileMutation = useUpdateProfileMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>("beginner");
  const [selectedGoal, setSelectedGoal] = useState<LearningGoal>("travel");
  const [selectedAvatar, setSelectedAvatar] = useState("🐼");

  useEffect(() => {
    if (store.profile.hasCompletedOnboarding && location.pathname === "/onboarding") {
      navigate("/home", { replace: true });
    }
  }, [location.pathname, store.profile.hasCompletedOnboarding, navigate]);

  const avatars = ["🐼", "🐯", "🐉", "🦊", "🐒", "🦁", "🐱", "🐶", "🦉", "🐨"];

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      const profileUpdates = {
        name: name.trim() || "Learner",
        avatar: selectedAvatar,
        startLevel: selectedLevel,
        goalPurpose: selectedGoal,
        hasCompletedOnboarding: true,
        joinDate: new Date().toISOString()
      };

      await updateProfileMutation.mutateAsync(profileUpdates);
      store.updateProfile(profileUpdates);
      store.recordActivityXP();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      background: "linear-gradient(135deg, var(--bg-app), rgba(217, 63, 71, 0.05))"
    }}>
      <div className="card anim-pop" style={{
        maxWidth: "480px",
        width: "100%",
        padding: "36px",
        borderRadius: "24px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.06)"
      }}>
        {/* Progress Bar */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "32px" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              flex: 1,
              height: "6px",
              borderRadius: "3px",
              backgroundColor: i <= step ? "var(--primary-red)" : "var(--border-color)",
              transition: "var(--transition-smooth)"
            }} />
          ))}
        </div>

        {step === 1 && (
          <div className="anim-slide">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <Sparkles className="tone-t1" size={24} />
              <h2 style={{ fontSize: "1.7rem" }}>Welcome to Chinese!</h2>
            </div>
            <p style={{ color: "var(--text-muted)", marginBottom: "28px" }}>
              Let's customize your learning experience. First, what should we call you?
            </p>
            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.9rem", marginBottom: "8px" }}>Your Name</label>
              <input
                type="text"
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  border: "2px solid var(--border-color)",
                  backgroundColor: "var(--bg-app)",
                  color: "var(--text-main)",
                  fontSize: "1rem",
                  fontWeight: 500,
                  outline: "none",
                  transition: "var(--transition-smooth)"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--primary-red)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border-color)"}
              />
            </div>
            
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.9rem", marginBottom: "12px" }}>Select Avatar</label>
              <div className="avatar-select-grid">
                {avatars.map((av) => (
                  <button
                    key={av}
                    onClick={() => setSelectedAvatar(av)}
                    className={`avatar-option ${selectedAvatar === av ? "selected" : ""}`}
                    style={{ border: "none" }}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="anim-slide">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <BookOpen className="tone-t2" size={24} />
              <h2 style={{ fontSize: "1.7rem" }}>Your Chinese Level</h2>
            </div>
            <p style={{ color: "var(--text-muted)", marginBottom: "28px" }}>
              Choose your current speaking and reading familiarity.
            </p>
            <div style={{ display: "grid", gap: "12px", marginBottom: "32px" }}>
              {[
                { id: "beginner", title: "Beginner", emoji: "🌱", sub: "New to Chinese (Start HSK 1)" },
                { id: "elementary", title: "Elementary", emoji: "🌿", sub: "Know simple phrases (Start HSK 2)" },
                { id: "intermediate", title: "Intermediate", emoji: "🌳", sub: "Hold simple conversations (Start HSK 3)" },
                { id: "advanced", title: "Advanced", emoji: "🏔️", sub: "Deep reading/listening practice" }
              ].map((lvl) => (
                <div
                  key={lvl.id}
                  onClick={() => setSelectedLevel(lvl.id as SkillLevel)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "16px",
                    borderRadius: "14px",
                    border: `2px solid ${selectedLevel === lvl.id ? "var(--primary-red)" : "var(--border-color)"}`,
                    backgroundColor: selectedLevel === lvl.id ? "rgba(217, 63, 71, 0.04)" : "var(--bg-card)",
                    cursor: "pointer",
                    transition: "var(--transition-smooth)"
                  }}
                >
                  <span style={{ fontSize: "1.8rem" }}>{lvl.emoji}</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{lvl.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{lvl.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="anim-slide">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <Target className="tone-t3" size={24} />
              <h2 style={{ fontSize: "1.7rem" }}>Learning Focus</h2>
            </div>
            <p style={{ color: "var(--text-muted)", marginBottom: "28px" }}>
              Why are you learning Chinese? We'll tailor exercises for your goals.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "32px" }}>
              {[
                { id: "travel", title: "Travel", emoji: "✈️", desc: "Food, hotels, transit" },
                { id: "business", title: "Career", emoji: "💼", desc: "Meetings, emails" },
                { id: "hskExam", title: "HSK Exams", emoji: "🎓", desc: "Formal certifications" },
                { id: "culture", title: "Culture", emoji: "🏯", desc: "History, idioms" },
                { id: "family", title: "Family", emoji: "👨‍👩‍👧", desc: "Relatives, heritage" },
                { id: "casual", title: "Casual", emoji: "☕", desc: "Daily fun exercises" }
              ].map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id as LearningGoal)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: "16px",
                    borderRadius: "14px",
                    border: `2px solid ${selectedGoal === goal.id ? "var(--primary-red)" : "var(--border-color)"}`,
                    backgroundColor: selectedGoal === goal.id ? "rgba(217, 63, 71, 0.04)" : "var(--bg-card)",
                    cursor: "pointer",
                    transition: "var(--transition-smooth)",
                    textAlign: "left"
                  }}
                >
                  <span style={{ fontSize: "1.6rem", marginBottom: "8px" }}>{goal.emoji}</span>
                  <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>{goal.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>{goal.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="anim-slide" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "4.5rem", marginBottom: "16px" }}>{selectedAvatar}</div>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "8px" }}>Ready to Learn, {name || "Learner"}?</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "32px", fontSize: "0.95rem" }}>
              Level: <strong style={{ color: "var(--text-main)" }}>{selectedLevel.toUpperCase()}</strong> · Goal: <strong style={{ color: "var(--text-main)" }}>{selectedGoal.toUpperCase()}</strong>
              <br />
              We have initialized a customized path. Let's start step-by-step!
            </p>
            <div style={{
              padding: "16px 20px",
              borderRadius: "12px",
              backgroundColor: "rgba(16, 185, 129, 0.08)",
              border: "1px dashed var(--jade)",
              color: "var(--jade)",
              fontSize: "0.9rem",
              fontWeight: 600,
              marginBottom: "36px"
            }}>
              🎉 Seed package unlocked: 250+ vocabulary words & 18 grammar lessons ready!
            </div>
          </div>
        )}

        {/* Buttons Controls */}
        <div style={{ display: "flex", gap: "12px", justifyContent: step > 1 ? "space-between" : "flex-end" }}>
          {step > 1 && (
            <button className="btn btn-secondary" onClick={handleBack} style={{ flex: 1 }}>
              Back
            </button>
          )}
          <button className="btn btn-primary" onClick={handleNext} disabled={updateProfileMutation.isPending} style={{ flex: step > 1 ? 1 : 0 }}>
            {updateProfileMutation.isPending ? "Saving..." : step === 4 ? "Let's Go!" : "Continue"}
            {step < 4 && <ArrowRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
