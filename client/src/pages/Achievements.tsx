import { useMemo, useState } from "react";
import { Award, CheckCircle2, LockKeyhole, Sparkles, Trophy } from "lucide-react";
import { useAchievementsQuery } from "../api";
import type { Achievement } from "../api/achievements";
import LoadingCard from "../components/LoadingCard";
import LoginPromptCard from "../components/LoginPromptCard";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useI18n } from "../i18n";
import { useAppSelector } from "../store/hooks";
import type { TranslationKey } from "../i18n/translations";
import { cn } from "../utils/cn";

type StatusFilter = "all" | "unlocked" | "locked";
type CategoryFilter = Achievement["category"] | "all";

const categoryLabelKeys: Record<Achievement["category"], TranslationKey> = {
  lessons: "achievements.categoryLessons",
  streak: "achievements.categoryStreak",
  vocabulary: "achievements.categoryVocabulary",
  xp: "achievements.categoryXp",
  hsk: "achievements.categoryHsk",
  skill: "achievements.categorySkill",
};

const categoryStyles: Record<Achievement["category"], string> = {
  lessons: "border-tone-2/30 bg-tone-2/10 text-tone-2",
  streak: "border-tone-4/30 bg-tone-4/10 text-tone-4",
  vocabulary: "border-tone-3/30 bg-tone-3/10 text-tone-3",
  xp: "border-gold/30 bg-gold/10 text-gold",
  hsk: "border-primary/30 bg-primary/10 text-primary",
  skill: "border-jade/30 bg-jade/10 text-jade",
};

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

const formatUnlockedDate = (value: string | null) => {
  if (!value) return null;

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

export default function Achievements() {
  const { t } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={Trophy}
        title={t("loginPrompt.achievementsTitle")}
        description={t("loginPrompt.achievementsBody")}
      />
    );
  }

  return <AchievementsContent />;
}

function AchievementsContent() {
  const { t } = useI18n();
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

  if (achievementsQuery.isLoading) {
    return <LoadingCard label={t("achievements.loading")} />;
  }

  if (achievementsQuery.isError) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center shadow-sm">
        <Trophy className="mx-auto mb-3 size-10 text-muted-foreground" />
        <h2 className="text-xl font-extrabold">{t("achievements.errorTitle")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("achievements.errorBody")}</p>
      </div>
    );
  }

  return (
    <div className="anim-slide pb-8">
      <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-gold/30 bg-gold/10 px-2.5 py-1 text-xs font-bold uppercase text-gold">
            <Trophy size={14} />
            {t("achievements.badge")}
          </div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">{t("achievements.title")}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {t("achievements.subtitle")}
          </p>
        </div>
        <div className="rounded-lg border bg-card px-4 py-3 shadow-sm">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
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

      <section className="mb-5 rounded-lg border bg-card p-3 shadow-sm">
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
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground shadow-sm">
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

function SummaryStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Award;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm sm:p-4">
      <Icon className="mb-2 size-5 text-primary" />
      <strong className="block text-xl font-extrabold">{value}</strong>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const { t } = useI18n();
  const isUnlocked = Boolean(achievement.unlockedAt);
  const unlockedDate = formatUnlockedDate(achievement.unlockedAt);

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card p-4 shadow-sm transition",
        isUnlocked ? "border-gold/25" : "opacity-75",
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-lg border text-3xl",
            isUnlocked ? "border-gold/30 bg-gold/10" : "bg-secondary grayscale",
          )}
        >
          {achievement.emoji}
        </div>
        {isUnlocked ? (
          <Badge className="bg-jade text-white">
            <CheckCircle2 size={12} />
            {t("achievements.unlocked")}
          </Badge>
        ) : (
          <Badge variant="secondary">
            <LockKeyhole size={12} />
            {t("achievements.locked")}
          </Badge>
        )}
      </div>

      <h2 className="line-clamp-2 text-base font-extrabold">{achievement.title}</h2>
      <p className="mt-1 line-clamp-3 min-h-[3.75rem] text-sm text-muted-foreground">
        {achievement.description}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <Badge variant="outline" className={categoryStyles[achievement.category]}>
          {t(categoryLabelKeys[achievement.category])}
        </Badge>
        <span className="text-xs font-semibold text-muted-foreground">
          {t("achievements.target", { value: achievement.targetValue })}
        </span>
      </div>

      <div className="mt-4 border-t pt-3 text-xs font-medium text-muted-foreground">
        {isUnlocked ? (
          <span className="inline-flex items-center gap-1.5 text-jade">
            <Sparkles size={13} />
            {unlockedDate ? t("achievements.unlockedOn", { date: unlockedDate }) : t("achievements.unlocked")}
          </span>
        ) : (
          <span>{t("achievements.keepStudying")}</span>
        )}
      </div>
    </article>
  );
}
