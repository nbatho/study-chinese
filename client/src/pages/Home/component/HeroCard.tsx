import { useMemo } from "react";
import { useLessonsQuery, useUserProfileQuery, useUserStatsQuery } from "../../../api";
import { Badge } from "../../../components/ui/badge";
import { formatNumber, useI18n } from "../../../i18n";
import { todayKey } from "../../../utils/studyReminder";
import { useAppSelector } from "../../../store/hooks";
import { clampPercent } from "./homeHelpers";
import DashboardAvatar from "./DashboardAvatar";

export default function HeroCard() {
  const { t, language } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const profileQuery = useUserProfileQuery(isAuthenticated);
  const statsQuery = useUserStatsQuery(7, isAuthenticated);
  const lessonsQuery = useLessonsQuery(isAuthenticated);

  const profile = profileQuery.data?.profile;
  const stats = useMemo(() => statsQuery.data?.stats ?? [], [statsQuery.data?.stats]);
  const lessons = lessonsQuery.data?.lessons ?? [];
  const todayDateKey = todayKey();
  const todayWordsReviewed = stats.find((item) => item.dateKey === todayDateKey)?.wordsReviewed ?? 0;
  const totalXp = stats.reduce((sum, item) => sum + item.xp, 0);
  const completedLessons = lessons.filter((lesson) => lesson.completedAt).length;
  const lessonProgress = lessons.length ? clampPercent(completedLessons, lessons.length) : 0;
  const displayName = profile?.name || t("common.learner");

  return (
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
              <strong className="text-xl text-white">{formatNumber(totalXp, language)}</strong>
            </div>
            <div className="rounded-xl bg-white/16 p-3 backdrop-blur">
              <span className="block text-xs font-bold text-white/75">{t("home.lessons")}</span>
              <strong className="text-xl text-white">{completedLessons}</strong>
            </div>
            <div className="rounded-xl bg-white/16 p-3 backdrop-blur">
              <span className="block text-xs font-bold text-white/75">{t("home.reviews")}</span>
              <strong className="text-xl text-white">{todayWordsReviewed}</strong>
            </div>
          </div>
        </div>
        <DashboardAvatar avatar={profile?.avatar} name={displayName} />
      </div>
    </section>
  );
}
