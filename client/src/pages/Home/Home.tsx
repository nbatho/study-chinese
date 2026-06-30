import { useNavigate, useOutletContext } from "react-router-dom";
import {
  useAchievementsQuery,
  useDailyContentQuery,
  useDueSrsCardsQuery,
  useLessonsQuery,
  useTodayPlanQuery,
  useUserProfileQuery,
  useUserStatsQuery,
} from "../../api";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Brain,
  Camera,
  CheckCircle2,
  Clock3,
  Flame,
  PencilLine,
  PlayCircle,
  RefreshCw,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import { useI18n } from "../../i18n";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";
import TtsButton from "../../components/TtsButton";

export default function Home() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { setSelectedLessonId } = useOutletContext<{
    setSelectedLessonId: (lessonId: string | null) => void;
  }>();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const profileQuery = useUserProfileQuery(isAuthenticated);
  const statsQuery = useUserStatsQuery(7, isAuthenticated);
  const lessonsQuery = useLessonsQuery(isAuthenticated);
  const dueCardsQuery = useDueSrsCardsQuery(20, isAuthenticated);
  const achievementsQuery = useAchievementsQuery(isAuthenticated);
  const dailyContentQuery = useDailyContentQuery(isAuthenticated);
  const todayPlanQuery = useTodayPlanQuery(isAuthenticated);

  const profile = profileQuery.data?.profile;
  const streak = profileQuery.data?.streak;
  const stats = statsQuery.data?.stats ?? [];
  const lessons = lessonsQuery.data?.lessons ?? [];
  const dueCount = dueCardsQuery.data?.cards.length ?? 0;
  const unlockedAchievements = achievementsQuery.data?.achievements.filter((item) => item.unlockedAt) ?? [];
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayStat = stats.find((item) => item.dateKey === todayKey) ?? {
    dateKey: todayKey,
    xp: 0,
    minutesStudied: 0,
    lessonsCompleted: 0,
    wordsReviewed: 0,
    exercisesCorrect: 0,
    exercisesTotal: 0,
  };
  const totalXp = stats.reduce((sum, item) => sum + item.xp, 0);
  const completedLessons = lessons.filter((lesson) => lesson.completedAt).length;
  const nextLesson = lessons.find((lesson) => !lesson.completedAt) ?? lessons[0];
  const currentPhrase = dailyContentQuery.data?.phrase;
  const todayPlan = todayPlanQuery.data?.plan;
  const xpTarget = Math.max((profile?.dailyMinutes ?? 15) * 3, 45);
  const xpProgress = Math.min(todayStat.xp, xpTarget);

  return (
    <div className="anim-slide pb-8">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full border bg-card text-[2.25rem] sm:size-16 sm:text-[2.8rem]">
            {profile?.avatar || "学"}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-extrabold sm:text-[1.4rem]">
              {t("home.greeting", { name: profile?.name || t("common.learner") })}
            </h1>
            <p className="truncate text-xs font-medium text-muted-foreground sm:text-[0.8rem]">
              {(profile?.startLevel || "beginner").toUpperCase()} · {t("common.goal")}: {(profile?.goalPurpose || "travel").toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Flame size={28} className="text-tone-4" fill="var(--tone-4)" />
          <span className="text-xl font-extrabold">{streak?.current ?? 0}</span>
        </div>
      </header>

      <section className="mb-5 rounded-lg border bg-card p-4 shadow-sm sm:p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold sm:text-[0.95rem]">{t("home.todayGoal")}</h3>
          <span className="text-xs font-semibold text-muted-foreground sm:text-[0.85rem]">
            {todayStat.xp} / {Math.round(xpTarget)} XP
          </span>
        </div>
        <div className="mb-5 h-3 w-full overflow-hidden rounded-md border bg-background">
          <div className="h-full rounded-md bg-[linear-gradient(90deg,var(--primary-red),var(--accent-red))]" style={{ width: `${(xpProgress / xpTarget) * 100}%` }} />
        </div>
        <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4 sm:gap-2.5">
          {[
            { label: t("home.xpTotal"), value: totalXp, icon: Star, cls: "text-tone-3" },
            { label: t("home.streak"), value: streak?.current ?? 0, icon: Flame, cls: "text-tone-4" },
            { label: t("home.lessons"), value: completedLessons, icon: BookOpen, cls: "text-tone-2" },
            { label: t("home.reviews"), value: todayStat.wordsReviewed, icon: Brain, cls: "text-tone-1" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex flex-col items-center rounded-md bg-secondary/50 px-2 py-3 sm:bg-transparent sm:p-0">
                <Icon size={20} className={item.cls} />
                <span className="mt-1 text-[1.1rem] font-extrabold">{item.value}</span>
                <span className="text-[0.65rem] text-muted-foreground">{item.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {isAuthenticated && todayPlan && (
        <section className="mb-5 rounded-lg border bg-card p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold">Hôm nay học gì</h3>
              <p className="text-xs font-semibold text-muted-foreground">
                {todayPlan.todayXp} / {todayPlan.xpTarget} XP - mục tiêu {todayPlan.dailyMinutes} phút
              </p>
            </div>
            <Clock3 size={20} className="text-primary" />
          </div>
          <div className="grid gap-2.5">
            {todayPlan.steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (step.kind === "lesson" && typeof step.meta?.lessonId === "string") {
                    setSelectedLessonId(step.meta.lessonId);
                    navigate("/learn");
                    return;
                  }
                  navigate(step.href);
                }}
                className="flex items-center gap-3 rounded-lg border bg-background px-3 py-3 text-left transition hover:border-primary/50 hover:bg-secondary/60"
              >
                <span className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-extrabold",
                  step.status === "current" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                )}>
                  {step.status === "done" ? <CheckCircle2 size={16} /> : index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-extrabold">{step.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{step.description}</span>
                </span>
                <span className="shrink-0 text-xs font-bold text-primary">{step.estimateMinutes}m</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mb-6 overflow-x-auto pb-2">
        <div className="flex w-max gap-4">
          {[
            { label: t("home.aiTutor"), icon: Sparkles, cls: "bg-tone-3", action: () => navigate("/ai-tutor") },
            { label: t("home.scanOcr"), icon: Camera, cls: "bg-jade", action: () => navigate("/translate") },
            { label: t("home.toneDrill"), icon: Activity, cls: "bg-tone-1", action: () => navigate("/practice") },
            { label: t("home.srsCards"), icon: RefreshCw, cls: "bg-primary", action: () => navigate("/review") },
            { label: t("home.writeHanzi"), icon: PencilLine, cls: "bg-gold", action: () => navigate("/practice") }
          ].map((act) => {
            const Icon = act.icon;
            return (
              <button key={act.label} onClick={act.action} className="flex w-[72px] flex-col items-center gap-1.5 text-foreground">
                <div className={cn("flex size-14 items-center justify-center rounded-full text-white", act.cls)}>
                  <Icon size={24} />
                </div>
                <span className="text-xs font-semibold">{act.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-5 rounded-lg border border-primary/20 bg-[linear-gradient(135deg,rgba(217,63,71,0.15),rgba(242,89,82,0.05))] p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-base font-bold">{t("home.continueLearning")}</h3>
          <button onClick={() => navigate("/learn")} className="flex items-center gap-1 text-[0.85rem] font-bold text-primary">
            {t("home.allLessons")} <ArrowRight size={14} />
          </button>
        </div>
        {nextLesson ? (
          <div
            onClick={() => {
              setSelectedLessonId(nextLesson.id);
              navigate("/learn");
            }}
            className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="min-w-0">
              <div className="mb-0.5 text-xs font-bold text-primary">
                HSK {nextLesson.hskLevel} · {t("home.lessons")} {nextLesson.order}
              </div>
              <h4 className="truncate text-[1.1rem] font-extrabold">{nextLesson.title}</h4>
              <p className="mt-px line-clamp-2 text-[0.8rem] text-muted-foreground">{nextLesson.subtitle}</p>
              <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                <span>{nextLesson.estimatedMinutes} min</span>
                <span>+{nextLesson.xpReward} XP</span>
              </div>
            </div>
            <PlayCircle size={44} className="shrink-0 text-tone-4" fill="rgba(217, 63, 71, 0.1)" />
          </div>
        ) : (
          <div className="p-4 text-center font-bold text-muted-foreground">
            {t("home.noLessons")}
          </div>
        )}
      </section>

      {currentPhrase && (
        <section className="mb-5 rounded-lg border bg-card p-4 shadow-sm sm:p-5">
          <h3 className="mb-3.5 text-base font-bold">{t("home.phrase")}</h3>
          <div className="flex flex-col gap-1.5">
            <h2 className="font-serif text-4xl font-extrabold tracking-[1px] text-primary sm:text-[2.4rem]">
              {currentPhrase.simplified}
            </h2>
            <div className="text-base font-medium text-muted-foreground">{currentPhrase.pinyin}</div>
            <p className="mt-1 text-base font-medium">"{currentPhrase.english}"</p>
            <p className="mt-1 border-l-2 pl-2 text-[0.8rem] italic text-muted-foreground">
              {currentPhrase.note}
            </p>
            <TtsButton text={currentPhrase.simplified} className="mt-4 w-fit">
              {t("common.listen")}
            </TtsButton>
          </div>
        </section>
      )}

      <section className="mb-6 rounded-lg border border-gold/20 bg-[linear-gradient(135deg,rgba(242,191,76,0.15),rgba(242,191,76,0.05))] p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold">{t("home.readyReview")}</h3>
            <p className="mt-0.5 text-[0.8rem] text-muted-foreground">
              {t("home.cardsDue", { count: dueCount })}
            </p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-[18px] py-2.5 text-[0.85rem] font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90" onClick={() => navigate("/review")}>
            {t("home.startReview", { count: dueCount })}
          </button>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-gold" />
            <h3 className="text-[1.05rem] font-bold">{t("home.badges")}</h3>
          </div>
          <button onClick={() => navigate("/achievements")} className="text-xs font-bold text-primary">
            {t("achievements.title")}
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2.5">
          {unlockedAchievements.length === 0 ? (
            <div className="p-2 text-[0.85rem] text-muted-foreground">
              {t("home.noBadges")}
            </div>
          ) : (
            unlockedAchievements.map((ach) => (
              <div key={ach.id} className="flex min-w-24 flex-col items-center rounded-[14px] border border-gold/25 bg-gold/10 p-2.5 text-center">
                <span className="text-3xl">{ach.emoji}</span>
                <span className="mt-1.5 w-20 truncate text-[0.7rem] font-bold">
                  {ach.title}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
