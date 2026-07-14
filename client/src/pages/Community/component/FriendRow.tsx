import Avatar from "./Avatar";
import { Check, Flame, X } from "lucide-react";
import {
  type FriendshipItem,
} from "../../../api/community";
import { Button } from "../../../components/ui/button";
import { useI18n } from "../../../i18n";
import type { TranslationKey } from "../../../i18n";

export default function FriendRow({
  item,
  action,
  onAccept,
  onRemove,
  busy,
}: {
  item: FriendshipItem;
  action: "friend" | "received" | "sent";
  onAccept?: (id: string) => void;
  onRemove: (id: string) => void;
  busy: boolean;
}) {
  const { t, language } = useI18n();

  const formatNumber = (value: number) =>
    new Intl.NumberFormat(language === "vi" ? "vi-VN" : "en-US").format(value);

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


  return (
    <li className="flex flex-col gap-3 border-b px-3 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar avatar={item.user.avatar} name={item.user.name} />
        <div className="min-w-0">
          <h3 className="truncate text-sm font-extrabold sm:text-base">{item.user.name}</h3>
          <div className="mt-1 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
            <span>{formatLevel(item.user.startLevel)}</span>
            <span className="inline-flex items-center gap-1">
              <Flame size={13} className="text-tone-3" />
              {t("community.days", { count: item.user.streak.current })}
            </span>
            <span>{formatNumber(item.user.totalXp ?? 0)} XP</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {action === "received" && onAccept && (
          <Button type="button" size="sm" onClick={() => onAccept(item.id)} disabled={busy}>
            <Check size={15} />
            {t("community.accept")}
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          variant={action === "friend" ? "outline" : "secondary"}
          onClick={() => onRemove(item.id)}
          disabled={busy}
        >
          {action === "friend" ? <X size={15} /> : <X size={15} />}
          {action === "friend"
            ? t("community.removeFriend")
            : action === "sent"
              ? t("community.cancelRequest")
              : t("community.reject")}
        </Button>
      </div>
    </li>
  );
}