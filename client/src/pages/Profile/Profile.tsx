import { useEffect, useMemo, useRef, useState } from "react";
import { Award, BookOpen, CheckCircle2, Crown, Gem, LockKeyhole, ShieldCheck, Trophy, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAchievementsQuery, useLessonsQuery } from "../../api";
import type { Achievement } from "../../api/achievements";
import { useUserProfileQuery, useUserStatsQuery } from "../../api/users/queries";
import LoginPromptCard from "../../components/LoginPromptCard";
import { Button } from "../../components/ui/button";
import { CircularProgress } from "../../components/ui/circular-progress";
import { Progress } from "../../components/ui/progress";
import { formatDate, startLevelKeys, useI18n } from "../../i18n";
import LoadingCard from "../../components/LoadingCard";
import { useAuthGate } from "../../hooks/useAuthGate";
import type { TranslationKey } from "../../i18n/translations";
import AchievementCard from "../Achievements/components/AchievementCard";
import { categoryLabelKeys } from "../Achievements/components/achievementConfig";
import SummaryStat from "../Achievements/components/SummaryStat";

type StatusFilter = "all" | "unlocked" | "locked";
type CategoryFilter = Achievement["category"] | "all";

const statusFilters: Array<{ id: StatusFilter; labelKey: TranslationKey }> = [
  { id: "all", labelKey: "achievements.filterAll" },
  { id: "unlocked", labelKey: "achievements.unlocked" },
  { id: "locked", labelKey: "achievements.locked" },
];

const categoryFilters: Array<{ id: CategoryFilter; labelKey: TranslationKey }> = [
  { id: "all", labelKey: "achievements.filterAllTypes" },
  ...Object.entries(categoryLabelKeys).map(([id, labelKey]) => ({
    id: id as Achievement["category"],
    labelKey,
  })),
];

export default function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { isResolving, isAuthenticated } = useAuthGate();
  const profileQuery = useUserProfileQuery(isAuthenticated);
  const statsQuery = useUserStatsQuery(7, isAuthenticated);
  const lessonsQuery = useLessonsQuery(isAuthenticated);
  const achievementsQuery = useAchievementsQuery(isAuthenticated);
  const profile = profileQuery.data?.profile;
  const streak = profileQuery.data?.streak;
  const wallet = profileQuery.data?.wallet;
  const premium = profileQuery.data?.premium;
  const stats = useMemo(() => statsQuery.data?.stats ?? [], [statsQuery.data?.stats]);
  const lessons = useMemo(() => lessonsQuery.data?.lessons ?? [], [lessonsQuery.data?.lessons]);
  const achievements = useMemo(
    () => achievementsQuery.data?.achievements ?? [],
    [achievementsQuery.data?.achievements],
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const achievementsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (location.hash === "#settings") {
      navigate("/settings", { replace: true });
    }
  }, [location.hash, navigate]);

  useEffect(() => {
    if (location.hash !== "#achievements") return;

    window.setTimeout(() => {
      achievementsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      achievementsRef.current?.focus({ preventScroll: true });
    }, 0);
  }, [location.hash, achievements.length]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 30;
    const graphWidth = canvas.width - padding * 2;
    const graphHeight = canvas.height - padding * 2;
    ctx.strokeStyle = document.body.classList.contains("dark") ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i += 1) {
      const y = padding + (graphHeight * i) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    const xps = stats.map((stat) => stat.xp);
    const maxXp = Math.max(...xps, 50);
    const barGap = 10;
    const totalGapsWidth = barGap * Math.max(stats.length - 1, 0);
    const barWidth = stats.length ? (graphWidth - totalGapsWidth) / stats.length : graphWidth;
    const compStyle = window.getComputedStyle(canvas);
    const primaryRed = compStyle.getPropertyValue("--primary-red").trim() || "rgb(217, 63, 71)";
    const accentRed = compStyle.getPropertyValue("--accent-red").trim() || "rgb(240, 75, 66)";
    const textMain = compStyle.getPropertyValue("--text-main").trim() || "#2c2c35";
    const textMuted = compStyle.getPropertyValue("--text-muted").trim() || "#6e6e82";

    stats.forEach((stat, idx) => {
      const barHeight = (stat.xp / maxXp) * graphHeight;
      const x = padding + idx * (barWidth + barGap);
      const y = canvas.height - padding - barHeight;
      const grad = ctx.createLinearGradient(x, y, x, canvas.height - padding);
      grad.addColorStop(0, primaryRed);
      grad.addColorStop(1, accentRed);
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barWidth, barHeight);
      ctx.fillStyle = textMain;
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      if (stat.xp > 0) ctx.fillText(String(stat.xp), x + barWidth / 2, y - 4);
      ctx.fillStyle = textMuted;
      ctx.font = "8px sans-serif";
      ctx.fillText(stat.dateKey.split("-").slice(1).join("/"), x + barWidth / 2, canvas.height - padding + 14);
    });
  }, [stats]);

  const today = stats[stats.length - 1] ?? {
    xp: 0,
    minutesStudied: 0,
    wordsReviewed: 0,
    exercisesCorrect: 0,
    exercisesTotal: 0,
  };
  const accuracy = today.exercisesTotal
    ? Math.round((today.exercisesCorrect / today.exercisesTotal) * 100)
    : 0;
  const completedLessons = lessons.filter((lesson) => lesson.completedAt).length;
  const totalLessons = lessons.length;
  const learningProgressPercent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const hskProgress = Array.from(new Set(lessons.map((lesson) => lesson.hskLevel)))
    .sort((a, b) => a - b)
    .map((level) => {
      const levelLessons = lessons.filter((lesson) => lesson.hskLevel === level);
      const levelCompleted = levelLessons.filter((lesson) => lesson.completedAt).length;

      return {
        level,
        completed: levelCompleted,
        total: levelLessons.length,
        percent: levelLessons.length ? Math.round((levelCompleted / levelLessons.length) * 100) : 0,
      };
    });
  const unlockedCount = achievements.filter((achievement) => achievement.unlockedAt).length;
  const lockedCount = achievements.length - unlockedCount;
  const achievementProgressPercent = achievements.length
    ? Math.round((unlockedCount / achievements.length) * 100)
    : 0;
  const filteredAchievements = achievements.filter((achievement) => {
    const isUnlocked = Boolean(achievement.unlockedAt);
    const statusMatches =
      statusFilter === "all" ||
      (statusFilter === "unlocked" && isUnlocked) ||
      (statusFilter === "locked" && !isUnlocked);
    const categoryMatches = categoryFilter === "all" || achievement.category === categoryFilter;

    return statusMatches && categoryMatches;
  });

  if (isResolving) {
    return <LoadingCard label={t("common.loading")} />;
  }

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={User}
        title={t("loginPrompt.profileTitle")}
        description={t("loginPrompt.profileBody")}
      />
    );
  }

  return (
    <div className="app-page">
      <section className="app-page-header mb-5 flex items-center gap-4">
        <div className="text-5xl sm:text-[3.2rem]">{profile?.avatar || "学"}</div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-extrabold sm:text-[1.35rem]">{profile?.name || t("common.learner")}</h2>
          <span className="text-[0.8rem] font-bold text-primary">
            {t("profile.memberSince", { date: profile?.joinDate ? formatDate(profile.joinDate, language) : t("common.today") })}
          </span>
          <div className="mt-2 flex flex-wrap gap-2.5">
            <span className="rounded-lg bg-secondary px-2 py-1 text-xs font-bold text-muted-foreground">
              {t("profile.streakDays", { count: streak?.current ?? 0 })}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-xs font-bold text-muted-foreground">
              <Gem size={13} className="text-tone-1" /> {t("profile.gemsBadge", { count: wallet?.gemBalance ?? 0 })}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-xs font-bold text-muted-foreground">
              <ShieldCheck size={13} className="text-tone-3" /> {t("profile.freezeBadge", { count: wallet?.streakFreezes ?? 0 })}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-xs font-bold text-muted-foreground">
              <Crown size={13} className="text-gold" /> {premium?.isActive ? t("profile.premiumActive") : t("profile.premiumFree")}
            </span>
            <span className="rounded-lg bg-secondary px-2 py-1 text-xs font-bold text-muted-foreground">
              {t("common.level")}: {t(startLevelKeys[profile?.startLevel || "beginner"]).toUpperCase()}
            </span>
          </div>
        </div>
      </section>

      <section className="app-surface-padded mb-5 text-left">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="mb-1 text-base font-bold">{t("navbar.curriculumProgress")}</h3>
            <p className="text-[0.8rem] text-muted-foreground">
              {t("navbar.lessonsComplete", { completed: completedLessons, total: totalLessons })}
            </p>
          </div>
          <CircularProgress progress={learningProgressPercent} size={62} strokeWidth={5} />
        </div>
        <Progress value={learningProgressPercent} className="mb-4 h-2.5" />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border bg-background p-3">
            <BookOpen className="mb-2 size-5 text-primary" />
            <strong className="block text-xl font-extrabold">{completedLessons}/{totalLessons}</strong>
            <span className="text-xs text-muted-foreground">{t("learn.curriculum")}</span>
          </div>
          <div className="rounded-xl border bg-background p-3">
            <CheckCircle2 className="mb-2 size-5 text-jade" />
            <strong className="block text-xl font-extrabold">{learningProgressPercent}%</strong>
            <span className="text-xs text-muted-foreground">{t("achievements.progress")}</span>
          </div>
          <div className="rounded-xl border bg-background p-3">
            <Trophy className="mb-2 size-5 text-gold" />
            <strong className="block text-xl font-extrabold">{profile?.cefrLevel ?? "A1"}</strong>
            <span className="text-xs text-muted-foreground">{t("common.level")}</span>
          </div>
        </div>
        {hskProgress.length > 0 && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {hskProgress.map((item) => (
              <div key={item.level} className="rounded-xl bg-secondary p-3">
                <div className="mb-2 flex items-center justify-between gap-3 text-sm font-extrabold">
                  <span>HSK {item.level}</span>
                  <span className="text-primary">{item.percent}%</span>
                </div>
                <Progress value={item.percent} />
                <p className="mt-2 text-xs font-semibold text-muted-foreground">
                  {t("navbar.lessonsComplete", { completed: item.completed, total: item.total })}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="app-surface-padded mb-5 text-left">
        <h3 className="mb-1 text-base font-bold">{t("profile.weeklyXp")}</h3>
        <p className="mb-4 text-[0.8rem] text-muted-foreground">{t("profile.weeklyXpBody")}</p>
        <div className="flex justify-center">
          <canvas ref={canvasRef} width={340} height={180} className="h-45 w-full max-w-85" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2.5 border-t border-dashed pt-4 text-center">
          <div>
            <span className="block text-[0.7rem] font-bold text-muted-foreground">{t("profile.studyTime")}</span>
            <strong className="text-[1.1rem] text-primary">{today.minutesStudied} min</strong>
          </div>
          <div>
            <span className="block text-[0.7rem] font-bold text-muted-foreground">{t("profile.accuracy")}</span>
            <strong className="text-[1.1rem] text-jade">{accuracy}%</strong>
          </div>
          <div>
            <span className="block text-[0.7rem] font-bold text-muted-foreground">{t("home.reviews").toUpperCase()}</span>
            <strong className="text-[1.1rem] text-tone-3">{today.wordsReviewed}</strong>
          </div>
        </div>
      </section>

      <section
        id="achievements"
        ref={achievementsRef}
        tabIndex={-1}
        className="scroll-mt-24 outline-none"
      >
        <header className="app-page-header mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold">
              <Trophy size={14} />
              {t("achievements.badge")}
            </div>
            <h3 className="text-xl font-extrabold sm:text-2xl">{t("achievements.title")}</h3>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {t("achievements.subtitle")}
            </p>
          </div>
          <div className="rounded-xl border bg-background px-4 py-3">
            <span className="text-xs font-semibold text-muted-foreground">
              {t("achievements.progress")}
            </span>
            <div className="mt-1 flex items-end gap-2">
              <strong className="text-3xl leading-none">{achievementProgressPercent}%</strong>
              <span className="text-sm text-muted-foreground">
                {unlockedCount}/{achievements.length}
              </span>
            </div>
          </div>
        </header>

        <div className="mb-5 grid grid-cols-3 gap-3">
          <SummaryStat icon={Award} label={t("achievements.total")} value={achievements.length} />
          <SummaryStat icon={CheckCircle2} label={t("achievements.unlocked")} value={unlockedCount} />
          <SummaryStat icon={LockKeyhole} label={t("achievements.locked")} value={lockedCount} />
        </div>

        <div className="app-surface mb-5 p-3">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {statusFilters.map((filter) => (
              <Button
                key={filter.id}
                variant={statusFilter === filter.id ? "default" : "secondary"}
                size="sm"
                onClick={() => setStatusFilter(filter.id)}
                className="shrink-0"
              >
                {t(filter.labelKey)}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categoryFilters.map((filter) => (
              <Button
                key={filter.id}
                variant={categoryFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(filter.id)}
                className="shrink-0"
              >
                {t(filter.labelKey)}
              </Button>
            ))}
          </div>
        </div>

        {achievementsQuery.isLoading ? (
          <div className="app-surface p-8 text-center text-muted-foreground">
            {t("achievements.loading")}
          </div>
        ) : achievementsQuery.isError ? (
          <div className="app-surface p-8 text-center">
            <Trophy className="mx-auto mb-3 size-10 text-muted-foreground" />
            <h3 className="text-xl font-extrabold">{t("achievements.errorTitle")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("achievements.errorBody")}</p>
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="app-surface p-8 text-center text-muted-foreground">
            {t("achievements.empty")}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
