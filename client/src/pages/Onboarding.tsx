import { useEffect, useState } from "react";
import type { LearningGoal, SkillLevel } from "../api/users";
import { useAddActivityMutation, useUpdateProfileMutation, useUserProfileQuery } from "../api/users/queries";
import { ArrowRight, BookOpen, Sparkles, Target } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAppearance, setOnboardingCompleted } from "../store/modules/appSlice";
import { useI18n } from "../i18n";

export default function Onboarding() {
  const dispatch = useAppDispatch();
  const { t } = useI18n();
  const hasCompletedOnboarding = useAppSelector((state) => state.app.hasCompletedOnboarding);
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const profileQuery = useUserProfileQuery(isAuthenticated);
  const updateProfileMutation = useUpdateProfileMutation();
  const addActivityMutation = useAddActivityMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>("beginner");
  const [selectedGoal, setSelectedGoal] = useState<LearningGoal>("travel");
  const [selectedAvatar, setSelectedAvatar] = useState("🐼");

  useEffect(() => {
    const serverCompleted = profileQuery.data?.profile.hasCompletedOnboarding;
    if ((hasCompletedOnboarding || serverCompleted) && location.pathname === "/onboarding") {
      navigate("/home", { replace: true });
    }
  }, [hasCompletedOnboarding, location.pathname, navigate, profileQuery.data]);

  const avatars = ["🐼", "🐯", "🐉", "🦊", "🐵", "🦁", "🐱", "🐶", "🦉", "🐨"];
  const levels: Array<{ id: SkillLevel; title: string; emoji: string; sub: string }> = [
    { id: "beginner", title: t("onboarding.beginner"), emoji: "🌱", sub: t("onboarding.beginnerSub") },
    { id: "elementary", title: t("onboarding.elementary"), emoji: "🌿", sub: t("onboarding.elementarySub") },
    { id: "intermediate", title: t("onboarding.intermediate"), emoji: "🌳", sub: t("onboarding.intermediateSub") },
    { id: "advanced", title: t("onboarding.advanced"), emoji: "🏔️", sub: t("onboarding.advancedSub") },
  ];
  const goals: Array<{ id: LearningGoal; title: string; emoji: string; desc: string }> = [
    { id: "travel", title: t("onboarding.travel"), emoji: "✈️", desc: t("onboarding.travelDesc") },
    { id: "business", title: t("onboarding.business"), emoji: "💼", desc: t("onboarding.businessDesc") },
    { id: "hskExam", title: t("onboarding.hskExam"), emoji: "🎓", desc: t("onboarding.hskExamDesc") },
    { id: "culture", title: t("onboarding.culture"), emoji: "🏯", desc: t("onboarding.cultureDesc") },
    { id: "family", title: t("onboarding.family"), emoji: "👨‍👩‍👧", desc: t("onboarding.familyDesc") },
    { id: "casual", title: t("onboarding.casual"), emoji: "☕", desc: t("onboarding.casualDesc") },
  ];

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    const profileUpdates = {
      name: name.trim() || t("common.learner"),
      avatar: selectedAvatar,
      startLevel: selectedLevel,
      goalPurpose: selectedGoal,
      hasCompletedOnboarding: true,
      joinDate: new Date().toISOString(),
    };

    await updateProfileMutation.mutateAsync(profileUpdates);
    dispatch(setOnboardingCompleted(true));
    dispatch(setAppearance(profileQuery.data?.profile.appAppearance ?? "light"));
    await addActivityMutation.mutateAsync({ xp: 5 });
    navigate("/home", { replace: true });
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
      background: "linear-gradient(135deg, var(--bg-app), rgba(217, 63, 71, 0.05))",
    }}>
      <div className="card anim-pop" style={{
        maxWidth: "480px",
        width: "100%",
        padding: "36px",
        borderRadius: "24px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", gap: "6px", marginBottom: "32px" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              flex: 1,
              height: "6px",
              borderRadius: "3px",
              backgroundColor: i <= step ? "var(--primary-red)" : "var(--border-color)",
              transition: "var(--transition-smooth)",
            }} />
          ))}
        </div>

        {step === 1 && (
          <div className="anim-slide">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <Sparkles className="tone-t1" size={24} />
              <h2 style={{ fontSize: "1.7rem" }}>{t("onboarding.welcome")}</h2>
            </div>
            <p style={{ color: "var(--text-muted)", marginBottom: "28px" }}>
              {t("onboarding.welcomeBody")}
            </p>
            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.9rem", marginBottom: "8px" }}>{t("onboarding.yourName")}</label>
              <input
                type="text"
                placeholder={t("onboarding.namePlaceholder")}
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
                  transition: "var(--transition-smooth)",
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--primary-red)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border-color)"}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.9rem", marginBottom: "12px" }}>{t("onboarding.avatar")}</label>
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
              <h2 style={{ fontSize: "1.7rem" }}>{t("onboarding.levelTitle")}</h2>
            </div>
            <p style={{ color: "var(--text-muted)", marginBottom: "28px" }}>
              {t("onboarding.levelBody")}
            </p>
            <div style={{ display: "grid", gap: "12px", marginBottom: "32px" }}>
              {levels.map((lvl) => (
                <div
                  key={lvl.id}
                  onClick={() => setSelectedLevel(lvl.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "16px",
                    borderRadius: "14px",
                    border: `2px solid ${selectedLevel === lvl.id ? "var(--primary-red)" : "var(--border-color)"}`,
                    backgroundColor: selectedLevel === lvl.id ? "rgba(217, 63, 71, 0.04)" : "var(--bg-card)",
                    cursor: "pointer",
                    transition: "var(--transition-smooth)",
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
              <h2 style={{ fontSize: "1.7rem" }}>{t("onboarding.goalTitle")}</h2>
            </div>
            <p style={{ color: "var(--text-muted)", marginBottom: "28px" }}>
              {t("onboarding.goalBody")}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "32px" }}>
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
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
                    textAlign: "left",
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
            <h2 style={{ fontSize: "1.8rem", marginBottom: "8px" }}>
              {t("onboarding.ready", { name: name || t("common.learner") })}
            </h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "32px", fontSize: "0.95rem" }}>
              {t("common.level")}: <strong style={{ color: "var(--text-main)" }}>{selectedLevel.toUpperCase()}</strong> · {t("common.goal")}: <strong style={{ color: "var(--text-main)" }}>{selectedGoal.toUpperCase()}</strong>
              <br />
              {t("onboarding.readyBody")}
            </p>
            <div style={{
              padding: "16px 20px",
              borderRadius: "12px",
              backgroundColor: "rgba(16, 185, 129, 0.08)",
              border: "1px dashed var(--jade)",
              color: "var(--jade)",
              fontSize: "0.9rem",
              fontWeight: 600,
              marginBottom: "36px",
            }}>
              {t("onboarding.seed")}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", justifyContent: step > 1 ? "space-between" : "flex-end" }}>
          {step > 1 && (
            <button className="btn btn-secondary" onClick={handleBack} style={{ flex: 1 }}>
              {t("common.back")}
            </button>
          )}
          <button className="btn btn-primary" onClick={handleNext} disabled={updateProfileMutation.isPending || addActivityMutation.isPending} style={{ flex: step > 1 ? 1 : 0 }}>
            {updateProfileMutation.isPending || addActivityMutation.isPending ? t("common.saving") : step === 4 ? t("onboarding.letsGo") : t("common.continue")}
            {step < 4 && <ArrowRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
