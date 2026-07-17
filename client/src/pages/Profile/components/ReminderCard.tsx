import { useState } from "react";
import { Bell, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "../../../i18n";
import { cn } from "../../../utils/cn";
import {
  getNotificationPermission,
  loadReminderPrefs,
  notificationsSupported,
  reminderSWSupported,
  requestNotificationPermission,
  saveReminderPrefs,
  syncReminderToSW,
  type ReminderPrefs,
} from "../../../utils/studyReminder";

const REMINDER_DAY_KEYS = [
  "reminder.day0",
  "reminder.day1",
  "reminder.day2",
  "reminder.day3",
  "reminder.day4",
  "reminder.day5",
  "reminder.day6",
] as const;

export default function ReminderCard() {
  const { t } = useI18n();
  const [reminder, setReminder] = useState<ReminderPrefs>(() => loadReminderPrefs());
  const [permission, setPermission] = useState(() => getNotificationPermission());

  const persistReminder = (next: ReminderPrefs) => {
    setReminder(next);
    saveReminderPrefs(next);
    void syncReminderToSW(next, {
      title: t("reminder.notifTitle"),
      body: t("reminder.notifBody"),
      url: "/learn",
    });
  };

  const toggleReminderDay = (day: number) => {
    const days = reminder.days.includes(day)
      ? reminder.days.filter((value) => value !== day)
      : [...reminder.days, day].sort((a, b) => a - b);
    if (days.length === 0) return;
    persistReminder({ ...reminder, days });
  };

  const toggleReminder = async () => {
    const nextEnabled = !reminder.enabled;
    if (nextEnabled && notificationsSupported() && getNotificationPermission() === "default") {
      const result = await requestNotificationPermission();
      setPermission(result);
      if (result === "denied") {
        toast.warning(t("reminder.permissionDenied"));
      }
    }
    persistReminder({ ...reminder, enabled: nextEnabled });
  };

  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bell size={18} />
          </span>
          <div>
            <span className="text-[0.95rem] font-semibold">{t("reminder.title")}</span>
            <p className="text-xs text-muted-foreground">{t("reminder.body")}</p>
          </div>
        </div>
        <button type="button" onClick={toggleReminder} className="shrink-0 text-primary" aria-pressed={reminder.enabled}>
          {reminder.enabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
        </button>
      </div>
      {reminder.enabled && (
        <div className="mt-4 grid gap-3 border-t pt-4">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="reminder-time" className="text-sm font-bold text-muted-foreground">{t("reminder.time")}</label>
            <input
              id="reminder-time"
              type="time"
              value={reminder.time}
              onChange={(e) => persistReminder({ ...reminder, time: e.target.value })}
              className="app-control w-36 text-foreground"
            />
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-bold text-muted-foreground">{t("reminder.days")}</span>
            <div role="group" aria-label={t("reminder.days")} className="flex flex-wrap gap-1.5">
              {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                <button
                  key={day}
                  type="button"
                  aria-pressed={reminder.days.includes(day)}
                  onClick={() => toggleReminderDay(day)}
                  className={cn(
                    "min-w-10 rounded-lg border px-2 py-1.5 text-xs font-extrabold text-muted-foreground transition",
                    reminder.days.includes(day) && "border-primary bg-primary text-white",
                  )}
                >
                  {t(REMINDER_DAY_KEYS[day])}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-extrabold",
                reminderSWSupported() && permission === "granted"
                  ? "border-jade/40 bg-jade/10 text-jade"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-600",
              )}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {reminderSWSupported() && permission === "granted"
                ? t("reminder.statusBackground")
                : t("reminder.statusAppOnly")}
            </span>
          </div>
          {!notificationsSupported() ? (
            <p className="text-xs font-semibold text-muted-foreground">{t("reminder.unsupported")}</p>
          ) : permission === "denied" ? (
            <p className="text-xs font-semibold text-destructive">{t("reminder.blocked")}</p>
          ) : permission === "granted" ? (
            <p className="text-xs font-semibold text-jade">{t("reminder.enabledNote")}</p>
          ) : (
            <button
              type="button"
              onClick={async () => setPermission(await requestNotificationPermission())}
              className="inline-flex w-fit items-center gap-2 rounded-xl border bg-card px-3 py-2 text-xs font-bold transition hover:border-primary hover:text-primary active:translate-y-px"
            >
              <Bell size={14} /> {t("reminder.allow")}
            </button>
          )}
          <p className="text-[0.7rem] font-medium leading-relaxed text-muted-foreground">{t("reminder.limitation")}</p>
        </div>
      )}
    </div>
  );
}
