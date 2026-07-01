import { CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";
import type { Achievement } from "../../../api/achievements";
import { Badge } from "../../../components/ui/badge";
import { useI18n } from "../../../i18n";
import { cn } from "../../../utils/cn";
import { categoryLabelKeys, categoryStyles } from "./achievementConfig";

const formatUnlockedDate = (value: string | null) => {
  if (!value) return null;

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

export default function AchievementCard({ achievement }: { achievement: Achievement }) {
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
      <p className="mt-1 line-clamp-3 min-h-15 text-sm text-muted-foreground">
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
