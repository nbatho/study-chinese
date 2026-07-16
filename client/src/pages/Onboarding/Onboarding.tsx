import { useEffect, useState } from "react";
import type { CefrLevel, LearningGoal, SkillLevel } from "../../api/users";
import { useAddActivityMutation, useUpdateProfileMutation, useUserProfileQuery } from "../../api/users/queries";
import { ArrowRight, BookOpen, ClipboardCheck, GraduationCap, Sparkles, Target } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setAppearance, setOnboardingCompleted } from "../../store/modules/appSlice";
import { useI18n } from "../../i18n";
import { cn } from "../../utils/cn";
import PlacementTest from "../PlacementTest/PlacementTest";

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
  const [selectedCefrLevel, setSelectedCefrLevel] = useState<CefrLevel>("A1");
  const [selectedGoal, setSelectedGoal] = useState<LearningGoal>("travel");
  const [selectedAvatar, setSelectedAvatar] = useState("🐼");
  const [isTakingPlacement, setIsTakingPlacement] = useState(false);

  useEffect(() => {
    const serverCompleted = profileQuery.data?.profile.hasCompletedOnboarding;
    if ((hasCompletedOnboarding || serverCompleted) && location.pathname === "/onboarding") {
      navigate("/home", { replace: true });
    }
  }, [hasCompletedOnboarding, location.pathname, navigate, profileQuery.data]);

  const avatars = ["🐼", "🐯", "🐉", "🦊", "🐵", "🦁", "🐱", "🐶", "🦉", "🐨"];
  const highlights: Array<{ emoji: string; title: string; desc: string }> = [
    { emoji: "📖", title: t("onboarding.why1"), desc: t("onboarding.why1Sub") },
    { emoji: "⚡", title: t("onboarding.why2"), desc: t("onboarding.why2Sub") },
    { emoji: "🎵", title: t("onboarding.why3"), desc: t("onboarding.why3Sub") },
  ];
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

  const cefrBySkillLevel: Record<SkillLevel, CefrLevel> = {
    beginner: "A1",
    elementary: "A2",
    intermediate: "B1",
    upper_intermediate: "B2",
    advanced: "C1",
    mastery: "C2",
  };

  const chooseLevel = (level: SkillLevel) => {
    setSelectedLevel(level);
    setSelectedCefrLevel(cefrBySkillLevel[level]);
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    const profileUpdates = {
      name: name.trim() || t("common.learner"),
      avatar: selectedAvatar,
      startLevel: selectedLevel,
      cefrLevel: selectedCefrLevel,
      goalPurpose: selectedGoal,
      hasCompletedOnboarding: true,
      joinDate: new Date().toISOString(),
    };

    await updateProfileMutation.mutateAsync(profileUpdates);
    dispatch(setOnboardingCompleted(true));
    dispatch(setAppearance(profileQuery.data?.profile.appAppearance ?? "light"));
    await addActivityMutation.mutateAsync({ xp: 5 });
    // Send brand-new learners straight into the pinyin/tones foundation course.
    const destination = selectedLevel === "beginner" ? "/foundation" : "/home";
    navigate(destination, { replace: true });
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="app-workspace-bg flex min-h-[100dvh] items-center justify-center p-4 sm:p-6">
      <div className="anim-pop w-full max-w-120 rounded-2xl border bg-card p-5 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:p-9">
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
            <p className="mb-5 text-muted-foreground">
              {t("onboarding.welcomeBody")}
            </p>
            <div className="mb-7 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4">
              <p className="mb-3 text-[0.8rem] font-extrabold uppercase tracking-wide text-primary">{t("onboarding.whyTitle")}</p>
              <div className="grid gap-2.5">
                {highlights.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="text-xl leading-none">{item.emoji}</span>
                    <div>
                      <div className="text-[0.9rem] font-bold leading-tight">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                      "rounded-xl border-2 border-transparent bg-secondary p-2 text-center text-3xl transition hover:scale-105 sm:p-3 sm:text-4xl",
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
              {isTakingPlacement ? <ClipboardCheck className="text-tone-2" size={24} /> : <BookOpen className="text-tone-2" size={24} />}
              <h2 className="text-2xl sm:text-[1.7rem]">{t("onboarding.levelTitle")}</h2>
            </div>
            <p className="mb-7 text-muted-foreground">
              {t("onboarding.levelBody")}
            </p>
            {isTakingPlacement ? (
              <div className="mb-8">
                <PlacementTest
                  embedded
                  onComplete={(result) => {
                    setSelectedLevel(result.startLevel);
                    setSelectedCefrLevel(result.cefrLevel);
                    setIsTakingPlacement(false);
                    setStep(3);
                  }}
                  onSkip={() => {
                    chooseLevel("beginner");
                    setIsTakingPlacement(false);
                  }}
                />
              </div>
            ) : (
              <>
                <div className="mb-4 grid gap-3">
                  <button
                    type="button"
                    onClick={() => setIsTakingPlacement(true)}
                    className="flex items-center gap-4 rounded-xl border-2 border-primary bg-primary/5 p-4 text-left transition hover:bg-primary/10 active:translate-y-px"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <ClipboardCheck size={22} />
                    </span>
                    <span>
                      <span className="block font-bold">{t("onboarding.placementCta")}</span>
                      <span className="block text-[0.8rem] text-muted-foreground">
                        {t("onboarding.placementDesc")}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      chooseLevel("beginner");
                      setStep(3);
                    }}
                    className="rounded-xl border bg-secondary px-4 py-3 text-left text-sm font-bold transition hover:bg-secondary/80 active:translate-y-px"
                  >
                    {t("onboarding.placementSkip")}
                  </button>
                </div>
                <div className="mb-8 grid gap-3">
                  {levels.map((lvl) => (
                    <div
                      key={lvl.id}
                      onClick={() => chooseLevel(lvl.id)}
                      className={cn(
                        "flex cursor-pointer items-center gap-4 rounded-xl border-2 bg-card p-4 transition",
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
              </>
            )}
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
                    "flex cursor-pointer flex-col items-start rounded-xl border-2 bg-card p-4 text-left transition",
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
              {t("common.level")}: <strong className="text-foreground">{selectedCefrLevel}</strong> / <strong className="text-foreground">{selectedLevel.toUpperCase()}</strong> · {t("common.goal")}: <strong className="text-foreground">{selectedGoal.toUpperCase()}</strong>
              <br />
              {t("onboarding.readyBody")}
            </p>
            <div className="mb-4 rounded-xl border border-dashed border-jade bg-jade/10 px-5 py-4 text-[0.9rem] font-semibold text-jade">
              {t("onboarding.seed")}
            </div>
            {selectedLevel === "beginner" && (
              <div className="mb-9 flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/5 px-5 py-4 text-left text-[0.85rem] font-semibold text-primary">
                <GraduationCap size={20} className="shrink-0" />
                {t("onboarding.foundationNote")}
              </div>
            )}
          </div>
        )}

        {!isTakingPlacement && <div className={cn("flex gap-3", step > 1 ? "justify-between" : "justify-end")}>
          {step > 1 && (
            <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition hover:bg-accent active:translate-y-px" onClick={handleBack}>
              {t("common.back")}
            </button>
          )}
          <button className={cn("inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:translate-y-px disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground", step > 1 && "flex-1")} onClick={handleNext} disabled={updateProfileMutation.isPending || addActivityMutation.isPending}>
            {updateProfileMutation.isPending || addActivityMutation.isPending ? t("common.saving") : step === 4 ? t("onboarding.letsGo") : t("common.continue")}
            {step < 4 && <ArrowRight size={18} />}
          </button>
        </div>}
      </div>
    </div>
  );
}
