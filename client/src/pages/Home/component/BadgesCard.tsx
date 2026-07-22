import { useNavigate } from "react-router-dom";
import { Circle } from "lucide-react";
import { useAchievementsQuery } from "../../../api";
import { Button } from "../../../components/ui/button";
import { useI18n } from "../../../i18n";
import { useAppSelector } from "../../../store/hooks";
import getAchievementText from "../../Achievements/components/getAchievementText";

export default function BadgesCard() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const achievementsQuery = useAchievementsQuery(isAuthenticated);
  const unlockedAchievements = achievementsQuery.data?.achievements.filter((item) => item.unlockedAt) ?? [];

  return (
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
              title={getAchievementText(ach, t).title}
            >
              <span className="text-3xl">{ach.emoji}</span>
              <span className="mt-2 w-[4.5rem] truncate text-xs font-extrabold">
                {getAchievementText(ach, t).title}
              </span>
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
  );
}
