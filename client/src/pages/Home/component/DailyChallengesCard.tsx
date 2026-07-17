import { useMemo } from "react";
import { BookOpen, RefreshCw, Star } from "lucide-react";
import { useTodayPlanQuery, useUserProfileQuery, useUserStatsQuery } from "../../../api";
import { Progress } from "../../../components/ui/progress";
import { useI18n } from "../../../i18n";
import { todayKey } from "../../../utils/studyReminder";
import { useAppSelector } from "../../../store/hooks";
import { cn } from "../../../utils/cn";
import { clampPercent } from "./homeHelpers";

export default function DailyChallengesCard() {
  const { t } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const profileQuery = useUserProfileQuery(isAuthenticated);
  const statsQuery = useUserStatsQuery(7, isAuthenticated);
  const todayPlanQuery = useTodayPlanQuery(isAuthenticated);

  const profile = profileQuery.data?.profile;
  const todayPlan = todayPlanQuery.data?.plan;
  const stats = useMemo(() => statsQuery.data?.stats ?? [], [statsQuery.data?.stats]);
  const todayDateKey = todayKey();
  const todayStat = stats.find((item) => item.dateKey === todayDateKey) ?? {
    dateKey: todayDateKey,
    xp: 0,
    minutesStudied: 0,
    lessonsCompleted: 0,
    wordsReviewed: 0,
    exercisesCorrect: 0,
    exercisesTotal: 0,
  };

  // Mirrors the server's formula in buildTodayPlanResponse (user.service.js)
  // so the goal ring doesn't jump when the plan query resolves.
  const xpTarget = todayPlan?.xpTarget ?? Math.max((profile?.dailyMinutes ?? 15) * 3, 45);
  const lessonTarget = 1;
  const reviewTarget = 10;

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

  return (
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
  );
}
