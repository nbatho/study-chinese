import { useEffect, useState } from "react";
import type { LearningGoal, SkillLevel } from "../../api/users";
import { useAddActivityMutation, useUpdateProfileMutation, useUserProfileQuery } from "../../api/users/queries";
import { ArrowRight, BookOpen, Sparkles, Target } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setAppearance, setOnboardingCompleted } from "../../store/modules/appSlice";
import { useI18n } from "../../i18n";
import { cn } from "../../utils/cn";

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
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,var(--bg-app),rgba(217,63,71,0.05))] p-4 sm:p-6">
      <div className="anim-pop w-full max-w-120 rounded-3xl border bg-card p-5 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:p-9">
        <div className="mb-8 flex gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={cn("h-1.5 flex-1 rounded-[3px] transition", i <= step ? "bg-primary" : "bg-border")} />
          ))}
        </div>

        {step === 1 && (
          <div className="anim-slide">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="text-tone-1" size={24} />
              <h2 className="text-2xl sm:text-[1.7rem]">{t("onboarding.welcome")}</h2>
            </div>
            <p className="mb-7 text-muted-foreground">
              {t("onboarding.welcomeBody")}
            </p>
            <div className="mb-8">
              <label className="mb-2 block text-[0.9rem] font-semibold">{t("onboarding.yourName")}</label>
              <input
                type="text"
                placeholder={t("onboarding.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border-2 bg-background px-4.5 py-3.5 text-base font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="mb-6">
              <label className="mb-3 block text-[0.9rem] font-semibold">{t("onboarding.avatar")}</label>
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-4 sm:gap-3">
                {avatars.map((av) => (
                  <button
                    key={av}
                    onClick={() => setSelectedAvatar(av)}
                    className={cn(
                      "rounded-lg border-2 border-transparent bg-secondary p-2 text-center text-3xl transition hover:scale-105 sm:p-3 sm:text-4xl",
                      selectedAvatar === av && "border-primary bg-primary/10",
                    )}
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
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="text-tone-2" size={24} />
              <h2 className="text-2xl sm:text-[1.7rem]">{t("onboarding.levelTitle")}</h2>
            </div>
            <p className="mb-7 text-muted-foreground">
              {t("onboarding.levelBody")}
            </p>
            <div className="mb-8 grid gap-3">
              {levels.map((lvl) => (
                <div
                  key={lvl.id}
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-[14px] border-2 bg-card p-4 transition",
                    selectedLevel === lvl.id ? "border-primary bg-primary/5" : "border-border",
                  )}
                >
                  <span className="text-[1.8rem]">{lvl.emoji}</span>
                  <div className="text-left">
                    <div className="font-bold">{lvl.title}</div>
                    <div className="text-[0.8rem] text-muted-foreground">{lvl.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="anim-slide">
            <div className="mb-3 flex items-center gap-2">
              <Target className="text-tone-3" size={24} />
              <h2 className="text-2xl sm:text-[1.7rem]">{t("onboarding.goalTitle")}</h2>
            </div>
            <p className="mb-7 text-muted-foreground">
              {t("onboarding.goalBody")}
            </p>
            <div className="mb-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={cn(
                    "flex cursor-pointer flex-col items-start rounded-[14px] border-2 bg-card p-4 text-left transition",
                    selectedGoal === goal.id ? "border-primary bg-primary/5" : "border-border",
                  )}
                >
                  <span className="mb-2 text-[1.6rem]">{goal.emoji}</span>
                  <div className="text-[0.95rem] font-bold">{goal.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{goal.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="anim-slide text-center">
            <div className="mb-4 text-7xl">{selectedAvatar}</div>
            <h2 className="mb-2 text-3xl">
              {t("onboarding.ready", { name: name || t("common.learner") })}
            </h2>
            <p className="mb-8 text-[0.95rem] text-muted-foreground">
              {t("common.level")}: <strong className="text-foreground">{selectedLevel.toUpperCase()}</strong> · {t("common.goal")}: <strong className="text-foreground">{selectedGoal.toUpperCase()}</strong>
              <br />
              {t("onboarding.readyBody")}
            </p>
            <div className="mb-9 rounded-xl border border-dashed border-jade bg-jade/10 px-5 py-4 text-[0.9rem] font-semibold text-jade">
              {t("onboarding.seed")}
            </div>
          </div>
        )}

        <div className={cn("flex gap-3", step > 1 ? "justify-between" : "justify-end")}>
          {step > 1 && (
            <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition hover:bg-accent" onClick={handleBack}>
              {t("common.back")}
            </button>
          )}
          <button className={cn("inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground", step > 1 && "flex-1")} onClick={handleNext} disabled={updateProfileMutation.isPending || addActivityMutation.isPending}>
            {updateProfileMutation.isPending || addActivityMutation.isPending ? t("common.saving") : step === 4 ? t("onboarding.letsGo") : t("common.continue")}
            {step < 4 && <ArrowRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
