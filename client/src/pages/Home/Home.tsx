import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock3,
  Flame,
  Gem,
  Medal,
  Play,
  RefreshCw,
  ShieldCheck,
  Star,
  Trophy,
} from "lucide-react";
import {
  type LeaderboardScope,
  useAchievementsQuery,
  useDailyContentQuery,
  useLeaderboardQuery,
  useLessonsQuery,
  usePurchaseShopItemMutation,
  useTodayPlanQuery,
  useUserProfileQuery,
  useUserStatsQuery,
} from "../../api";
import TtsButton from "../../components/TtsButton";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { useI18n } from "../../i18n";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";

const formatNumber = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

const clampPercent = (current: number, goal: number) => {
  if (!goal) return 0;
  return Math.max(0, Math.min(100, Math.round((current / goal) * 100)));
};

function DashboardAvatar({ avatar, name }: { avatar?: string | null; name: string }) {
  const isImage = Boolean(avatar && /^(https?:|data:image|blob:)/.test(avatar));

  return (
    <span className="flex size-[5.5rem] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/25 bg-white/20 text-6xl font-extrabold shadow-lg backdrop-blur sm:size-[6.5rem]">
      {isImage ? (
        <img src={avatar ?? ""} alt={name} className="size-full object-cover" />
      ) : (
        <span aria-hidden="true">{avatar || "学"}</span>
      )}
    </span>
  );
}

export default function Home() {
  const { language, t } = useI18n();
  const navigate = useNavigate();
  const { setSelectedLessonId } = useOutletContext<{
    setSelectedLessonId: (lessonId: string | null) => void;
  }>();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const [leaderboardScope, setLeaderboardScope] = useState<LeaderboardScope>("global");

  const profileQuery = useUserProfileQuery(isAuthenticated);
  const statsQuery = useUserStatsQuery(7, isAuthenticated);
  const lessonsQuery = useLessonsQuery(isAuthenticated);
  const achievementsQuery = useAchievementsQuery(isAuthenticated);
  const dailyContentQuery = useDailyContentQuery(isAuthenticated);
  const todayPlanQuery = useTodayPlanQuery(isAuthenticated);
  const leaderboardQuery = useLeaderboardQuery({
    scope: leaderboardScope,
    timeframe: "weekly",
    enabled: isAuthenticated,
  });
  const purchaseMutation = usePurchaseShopItemMutation();

  const profile = profileQuery.data?.profile;
  const streak = profileQuery.data?.streak;
  const wallet = profileQuery.data?.wallet;
  const stats = useMemo(() => statsQuery.data?.stats ?? [], [statsQuery.data?.stats]);
  const lessons = lessonsQuery.data?.lessons ?? [];
  const unlockedAchievements = achievementsQuery.data?.achievements.filter((item) => item.unlockedAt) ?? [];
  const leaderboardEntries = leaderboardQuery.data?.entries.slice(0, 5) ?? [];
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
  const displayName = profile?.name || t("common.learner");
  const xpTarget = todayPlan?.xpTarget ?? Math.max((profile?.dailyMinutes ?? 15) * 3, 50);
  const lessonTarget = 1;
  const reviewTarget = 10;
  const lessonProgress = lessons.length ? clampPercent(completedLessons, lessons.length) : 0;

  const dailyChallenges = [
    {
      title: t("home.challengeXp", { goal: xpTarget }),
      current: todayStat.xp,
      goal: xpTarget,
      icon: Star,
      tone: "text-gold",
    },
    {
      title: t("home.challengeLesson", { goal: lessonTarget }),
      current: todayStat.lessonsCompleted,
      goal: lessonTarget,
      icon: BookOpen,
      tone: "text-tone-2",
    },
    {
      title: t("home.challengeReview", { goal: reviewTarget }),
      current: todayStat.wordsReviewed,
      goal: reviewTarget,
      icon: RefreshCw,
      tone: "text-tone-1",
    },
  ];

  const handleLessonStart = () => {
    if (!nextLesson) {
      navigate("/learn");
      return;
    }

    setSelectedLessonId(nextLesson.id);
    navigate("/learn");
  };

  const handlePlanStep = (stepHref: string, lessonId?: unknown) => {
    if (typeof lessonId === "string") {
      setSelectedLessonId(lessonId);
      navigate("/learn");
      return;
    }

    navigate(stepHref);
  };

  const handleBuyFreeze = async () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    try {
      await purchaseMutation.mutateAsync("streak_freeze_1");
      toast.success(t("home.freezePurchaseSuccess"));
    } catch {
      toast.error(t("home.freezePurchaseError"));
    }
  };

  return (
    <div className="app-page">
      <div className="grid min-w-0 gap-5 lg:grid-cols-12">
        <div className="grid min-w-0 gap-5 lg:col-span-8">
          <section className="overflow-hidden rounded-2xl border border-primary/20 bg-[linear-gradient(135deg,var(--primary-red),var(--accent-red))] p-5 text-white shadow-lg shadow-primary/15 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <Badge className="mb-4 bg-white/20 text-white shadow-none backdrop-blur hover:bg-white/25">
                  {profile?.cefrLevel ?? "A1"} · {lessonProgress}%
                </Badge>
                <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
                  {t("home.greeting", { name: displayName })}
                </h1>
                <p className="mt-2 max-w-2xl text-sm font-semibold text-white/82">
                  {t("home.dashboardSubtitle")}
                </p>
                <div className="mt-5 grid max-w-lg grid-cols-3 gap-2">
                  <div className="rounded-xl bg-white/16 p-3 backdrop-blur">
                    <span className="block text-xs font-bold text-white/75">XP</span>
                    <strong className="text-xl text-white">{formatNumber(totalXp)}</strong>
                  </div>
                  <div className="rounded-xl bg-white/16 p-3 backdrop-blur">
                    <span className="block text-xs font-bold text-white/75">{t("home.lessons")}</span>
                    <strong className="text-xl text-white">{completedLessons}</strong>
                  </div>
                  <div className="rounded-xl bg-white/16 p-3 backdrop-blur">
                    <span className="block text-xs font-bold text-white/75">{t("home.reviews")}</span>
                    <strong className="text-xl text-white">{todayStat.wordsReviewed}</strong>
                  </div>
                </div>
              </div>
              <DashboardAvatar avatar={profile?.avatar} name={displayName} />
            </div>
          </section>

          <section className="app-surface-padded min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold">{t("home.continueLearning")}</h2>
                <p className="text-sm font-medium text-muted-foreground">{t("home.nextLessonHint")}</p>
              </div>
              <Button type="button" variant="ghost" onClick={() => navigate("/learn")} className="shrink-0 rounded-xl">
                {t("home.allLessons")}
                <ArrowRight size={16} />
              </Button>
            </div>

            {nextLesson ? (
              <button
                type="button"
                onClick={handleLessonStart}
                className="group grid w-full gap-4 rounded-xl border bg-background/80 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg sm:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="rounded-lg">
                      HSK {nextLesson.hskLevel}
                    </Badge>
                    <span className="text-xs font-bold text-muted-foreground">
                      {nextLesson.estimatedMinutes} min · +{nextLesson.xpReward} XP
                    </span>
                  </div>
                  <h3 className="truncate text-xl font-extrabold">{nextLesson.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{nextLesson.subtitle}</p>
                </div>
                <span className="flex size-16 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_0_rgba(217,63,71,0)] transition group-hover:scale-105 group-hover:shadow-[0_0_28px_rgba(217,63,71,0.35)]">
                  <Play size={28} fill="currentColor" />
                </span>
              </button>
            ) : (
              <div className="rounded-xl border border-dashed bg-background p-6 text-center font-bold text-muted-foreground">
                {isAuthenticated ? t("home.noLessons") : t("home.loginToPersonalize")}
              </div>
            )}
          </section>

          <section className="app-surface-padded min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold">{t("home.todayPlan")}</h2>
                <p className="text-sm font-medium text-muted-foreground">
                  {todayPlan
                    ? t("home.todayPlanMeta", {
                        xp: todayPlan.todayXp,
                        target: todayPlan.xpTarget,
                        minutes: todayPlan.dailyMinutes,
                      })
                    : t("home.loginToPersonalize")}
                </p>
              </div>
              <Clock3 size={22} className="text-primary" />
            </div>

            {isAuthenticated && todayPlan ? (
              <div className="grid gap-2.5">
                {todayPlan.steps.map((step, index) => {
                  const isDone = step.status === "done";
                  const isCurrent = step.status === "current";

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => handlePlanStep(step.href, step.meta?.lessonId)}
                      className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border bg-background/80 px-3 py-3 text-left transition hover:border-primary/50 hover:bg-secondary/60"
                    >
                      <span
                        className={cn(
                          "flex size-9 items-center justify-center rounded-xl text-xs font-extrabold",
                          isDone && "bg-tone-2/12 text-tone-2",
                          isCurrent && "bg-primary text-primary-foreground",
                          !isDone && !isCurrent && "bg-secondary text-muted-foreground",
                        )}
                      >
                        {isDone ? <CheckCircle2 size={17} /> : index + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-extrabold">{step.title}</span>
                        <span className="block truncate text-xs font-medium text-muted-foreground">
                          {step.description}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs font-extrabold text-primary">{step.estimateMinutes}m</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <Button type="button" onClick={() => navigate("/auth")} className="w-full rounded-xl">
                {t("auth.login")}
              </Button>
            )}
          </section>

          <section className="app-surface-padded min-w-0">
            <h2 className="mb-4 text-lg font-extrabold">{t("home.phrase")}</h2>
            {currentPhrase ? (
              <div>
                <div className="font-serif text-5xl font-extrabold text-primary sm:text-6xl">
                  {currentPhrase.simplified}
                </div>
                <div className="mt-2 text-base font-semibold text-muted-foreground">{currentPhrase.pinyin}</div>
                <p className="mt-3 text-base font-bold">
                  {language === "vi" && currentPhrase.note ? currentPhrase.note : currentPhrase.english}
                </p>
                <p className="mt-2 border-l-2 border-primary/30 pl-3 text-sm text-muted-foreground">
                  {currentPhrase.english}
                </p>
                <TtsButton text={currentPhrase.simplified} className="mt-4">
                  {t("common.listen")}
                </TtsButton>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed bg-background p-5 text-sm font-semibold text-muted-foreground">
                {isAuthenticated ? t("common.loading") : t("home.loginToPersonalize")}
              </div>
            )}
          </section>
        </div>

        <aside className="grid min-w-0 content-start gap-5 lg:col-span-4">
          <section className="app-surface-padded min-w-0">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold">{t("home.goalsWallet")}</h2>
                <p className="text-sm font-medium text-muted-foreground">{t("home.todayGoal")}</p>
              </div>
              <span className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Flame size={30} fill="currentColor" />
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-secondary/70 p-3">
                <Flame className="mx-auto mb-1 text-tone-4" size={20} />
                <strong className="block text-xl">{streak?.current ?? 0}</strong>
                <span className="text-xs font-bold text-muted-foreground">{t("home.streak")}</span>
              </div>
              <div className="rounded-xl bg-secondary/70 p-3">
                <Gem className="mx-auto mb-1 text-tone-1" size={20} />
                <strong className="block text-xl">{wallet?.gemBalance ?? 0}</strong>
                <span className="text-xs font-bold text-muted-foreground">{t("common.gems")}</span>
              </div>
              <div className="rounded-xl bg-secondary/70 p-3">
                <ShieldCheck className="mx-auto mb-1 text-tone-3" size={20} />
                <strong className="block text-xl">{wallet?.streakFreezes ?? 0}</strong>
                <span className="text-xs font-bold text-muted-foreground">{t("common.freeze")}</span>
              </div>
            </div>
            <Button
              type="button"
              onClick={handleBuyFreeze}
              disabled={purchaseMutation.isPending}
              className="mt-4 w-full rounded-xl"
            >
              {purchaseMutation.isPending ? <RefreshCw className="animate-spin" /> : <ShieldCheck size={17} />}
              {t("home.buyFreeze")}
            </Button>
          </section>

          <section className="app-surface-padded min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold">{t("home.leaderboard")}</h2>
              <Trophy size={21} className="text-gold" />
            </div>
            <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl border bg-background p-1">
              {(["global", "friends"] as LeaderboardScope[]).map((scope) => (
                <button
                  key={scope}
                  type="button"
                  aria-pressed={leaderboardScope === scope}
                  onClick={() => setLeaderboardScope(scope)}
                  className={cn(
                    "h-9 rounded-md px-2 text-sm font-extrabold transition",
                    leaderboardScope === scope ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary",
                  )}
                >
                  {scope === "global" ? t("home.global") : t("home.friends")}
                </button>
              ))}
            </div>

            {leaderboardQuery.isLoading ? (
              <div className="rounded-lg border border-dashed bg-background p-4 text-center text-sm font-semibold text-muted-foreground">
                {t("common.loading")}
              </div>
            ) : leaderboardEntries.length ? (
              <ol className="grid gap-2">
                {leaderboardEntries.map((entry) => (
                  <li
                    key={entry.user.id}
                    className={cn(
                      "grid grid-cols-[32px_36px_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border bg-background px-2.5 py-2.5",
                      entry.isCurrentUser && "border-primary/35 bg-primary/5",
                    )}
                  >
                    <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-xs font-extrabold">
                      {entry.rank <= 3 ? <Medal size={16} className="text-gold" /> : entry.rank}
                    </span>
                    <span className="flex size-9 items-center justify-center overflow-hidden rounded-md bg-card text-lg font-extrabold">
                      {entry.user.avatar || entry.user.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-extrabold">{entry.user.name}</span>
                      <span className="block truncate text-xs font-semibold text-muted-foreground">
                        {entry.user.streak.current} {t("home.streak").toLowerCase()}
                      </span>
                    </span>
                    <strong className="text-sm text-primary">{formatNumber(entry.totalXp)} XP</strong>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="rounded-lg border border-dashed bg-background p-4 text-center text-sm font-semibold text-muted-foreground">
                {isAuthenticated ? t("home.noLeaderboard") : t("home.loginToPersonalize")}
              </div>
            )}
          </section>

          <section className="app-surface-padded min-w-0">
            <h2 className="mb-4 text-lg font-extrabold">{t("home.dailyChallenges")}</h2>
            <div className="grid gap-3">
              {dailyChallenges.map((challenge) => {
                const Icon = challenge.icon;
                const percent = clampPercent(challenge.current, challenge.goal);

                return (
                  <div key={challenge.title} className="rounded-xl border bg-background/80 p-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-2">
                        <Icon className={cn("size-4 shrink-0", challenge.tone)} />
                        <span className="truncate text-sm font-extrabold">{challenge.title}</span>
                      </span>
                      <span className="shrink-0 text-xs font-bold text-muted-foreground">
                        {Math.min(challenge.current, challenge.goal)} / {challenge.goal}
                      </span>
                    </div>
                    <Progress value={percent} />
                  </div>
                );
              })}
            </div>
          </section>

          <section className="app-surface-padded min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold">{t("home.badges")}</h2>
              <Button type="button" variant="ghost" size="sm" onClick={() => navigate("/achievements")}>
                {t("home.viewAll")}
              </Button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {unlockedAchievements.length ? (
                unlockedAchievements.slice(0, 8).map((ach) => (
                  <div
                    key={ach.id}
                    className="flex min-w-24 flex-col items-center rounded-lg border border-gold/25 bg-gold/10 p-3 text-center"
                  >
                    <span className="text-3xl">{ach.emoji}</span>
                    <span className="mt-2 w-[4.5rem] truncate text-xs font-extrabold">{ach.title}</span>
                  </div>
                ))
              ) : (
                <div className="flex w-full items-center gap-2 rounded-lg border border-dashed bg-background p-4 text-sm font-semibold text-muted-foreground">
                  <Circle size={16} />
                  {t("home.noBadges")}
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
