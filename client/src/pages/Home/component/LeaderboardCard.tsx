import { useState } from "react";
import { Medal, Trophy } from "lucide-react";
import { type LeaderboardScope, useLeaderboardQuery } from "../../../api";
import { Skeleton } from "../../../components/ui/skeleton";
import { formatNumber, useI18n } from "../../../i18n";
import { useAppSelector } from "../../../store/hooks";
import { cn } from "../../../utils/cn";

export default function LeaderboardCard() {
  const { t, language } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const [leaderboardScope, setLeaderboardScope] = useState<LeaderboardScope>("global");
  const leaderboardQuery = useLeaderboardQuery({
    scope: leaderboardScope,
    timeframe: "weekly",
    enabled: isAuthenticated,
  });
  const leaderboardEntries = leaderboardQuery.data?.entries.slice(0, 5) ?? [];

  return (
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
        <div className="grid gap-2">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="grid grid-cols-[32px_36px_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border bg-background px-2.5 py-2.5"
            >
              <Skeleton className="size-8 rounded-md" />
              <Skeleton className="size-9 rounded-md" />
              <div className="grid gap-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
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
              <strong className="text-sm text-primary">{formatNumber(entry.totalXp, language)} XP</strong>
            </li>
          ))}
        </ol>
      ) : (
        <div className="rounded-lg border border-dashed bg-background p-4 text-center text-sm font-semibold text-muted-foreground">
          {isAuthenticated ? t("home.noLeaderboard") : t("home.loginToPersonalize")}
        </div>
      )}
    </section>
  );
}
