import { useMemo, useState } from "react";
import { Award, CheckCircle2, LockKeyhole, Trophy } from "lucide-react";
import { useAchievementsQuery } from "../../api";
import type { Achievement } from "../../api/achievements";
import LoadingCard from "../../components/LoadingCard";
import LoginPromptCard from "../../components/LoginPromptCard";
import { Button } from "../../components/ui/button";
import { useI18n } from "../../i18n";
import { useAppSelector } from "../../store/hooks";
import type { TranslationKey } from "../../i18n/translations";
import AchievementCard from "./components/AchievementCard";
import { categoryLabelKeys } from "./components/achievementConfig";
import SummaryStat from "./components/SummaryStat";

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

export default function Achievements() {
  const { t } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const achievementsQuery = useAchievementsQuery();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const achievements = useMemo(
    () => achievementsQuery.data?.achievements ?? [],
    [achievementsQuery.data?.achievements],
  );
  const unlockedCount = achievements.filter((achievement) => achievement.unlockedAt).length;
  const lockedCount = achievements.length - unlockedCount;
  const progressPercent = achievements.length
    ? Math.round((unlockedCount / achievements.length) * 100)
    : 0;

  const filteredAchievements = useMemo(
    () =>
      achievements.filter((achievement) => {
        const isUnlocked = Boolean(achievement.unlockedAt);
        const statusMatches =
          statusFilter === "all" ||
          (statusFilter === "unlocked" && isUnlocked) ||
          (statusFilter === "locked" && !isUnlocked);
        const categoryMatches = categoryFilter === "all" || achievement.category === categoryFilter;

        return statusMatches && categoryMatches;
      }),
    [achievements, categoryFilter, statusFilter],
  );

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={Trophy}
        title={t("loginPrompt.achievementsTitle")}
        description={t("loginPrompt.achievementsBody")}
      />
    );
  }

  if (achievementsQuery.isLoading) {
    return <LoadingCard label={t("achievements.loading")} />;
  }

  if (achievementsQuery.isError) {
    return (
      <div className="app-surface p-6 text-center">
        <Trophy className="mx-auto mb-3 size-10 text-muted-foreground" />
        <h2 className="text-xl font-extrabold">{t("achievements.errorTitle")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("achievements.errorBody")}</p>
      </div>
    );
  }

  return (
    <div className="app-page">
      <header className="app-page-header mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold">
            <Trophy size={14} />
            {t("achievements.badge")}
          </div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">{t("achievements.title")}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {t("achievements.subtitle")}
          </p>
        </div>
        <div className="rounded-xl border bg-background px-4 py-3">
          <span className="text-xs font-semibold text-muted-foreground">
            {t("achievements.progress")}
          </span>
          <div className="mt-1 flex items-end gap-2">
            <strong className="text-3xl leading-none">{progressPercent}%</strong>
            <span className="text-sm text-muted-foreground">
              {unlockedCount}/{achievements.length}
            </span>
          </div>
        </div>
      </header>

      <section className="mb-5 grid grid-cols-3 gap-3">
        <SummaryStat icon={Award} label={t("achievements.total")} value={achievements.length} />
        <SummaryStat icon={CheckCircle2} label={t("achievements.unlocked")} value={unlockedCount} />
        <SummaryStat icon={LockKeyhole} label={t("achievements.locked")} value={lockedCount} />
      </section>

      <section className="app-surface mb-5 p-3">
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
      </section>

      {filteredAchievements.length === 0 ? (
        <div className="app-surface p-8 text-center text-muted-foreground">
          {t("achievements.empty")}
        </div>
      ) : (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </section>
      )}
    </div>
  );
}
