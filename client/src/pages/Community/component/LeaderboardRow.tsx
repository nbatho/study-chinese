import type { LeaderboardEntry } from "../../../api";
import { cn } from "../../../utils/cn";
import { Flame, Medal } from "lucide-react";
import Avatar from "./Avatar";
import { formatNumber as formatNumberIntl, useI18n } from "../../../i18n";
import type { TranslationKey } from "../../../i18n";

export default function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
    const { t, language } = useI18n();

    const formatNumber = (value: number) => formatNumberIntl(value, language);

    const formatLevel = (level?: string) => {
        const labelKeys: Record<string, TranslationKey> = {
            beginner: "community.levelBeginner",
            elementary: "community.levelElementary",
            intermediate: "community.levelIntermediate",
            advanced: "community.levelAdvanced",
        };

        const key = labelKeys[level || ""];
        return key ? t(key) : t("common.learner");
    };
    const rankClass =
        entry.rank === 1
            ? "bg-gold/15 text-gold"
            : entry.rank === 2
                ? "bg-tone-1/10 text-tone-1"
                : entry.rank === 3
                    ? "bg-tone-3/10 text-tone-3"
                    : "bg-secondary text-muted-foreground";

    return (
        <li
            className={cn(
                "grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 border-b px-3 py-3 last:border-b-0 sm:grid-cols-[52px_minmax(0,1fr)_120px_120px]",
                entry.isCurrentUser && "bg-primary/5",
            )}
        >
            <span className={cn("flex size-9 items-center justify-center rounded-xl text-sm font-extrabold", rankClass)}>
                {entry.rank <= 3 ? <Medal size={17} /> : entry.rank}
            </span>

            <div className="flex min-w-0 items-center gap-3">
                <Avatar avatar={entry.user.avatar} name={entry.user.name} />
                <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-sm font-extrabold sm:text-base">{entry.user.name}</span>
                        {entry.isCurrentUser && (
                            <span className="shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 text-[0.68rem] font-bold text-primary">
                                {t("community.you")}
                            </span>
                        )}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
                        <span>{formatLevel(entry.user.startLevel)}</span>
                        <span className="inline-flex items-center gap-1">
                            <Flame size={13} className="text-tone-3" />
                            {t("community.days", { count: entry.user.streak.current })}
                        </span>
                    </div>
                </div>
            </div>

            <div className="text-right">
                <strong className="block text-base text-primary sm:text-lg">{formatNumber(entry.totalXp)}</strong>
                <span className="text-xs font-semibold text-muted-foreground">XP</span>
            </div>

            <div className="hidden text-right text-sm font-bold text-muted-foreground sm:block">
                {t("community.best", { count: entry.user.streak.best })}
            </div>
        </li>
    );
}
