import { useState } from "react";
import { Bell, ToggleLeft, ToggleRight, User } from "lucide-react";
import { toast } from "sonner";
import { useUpdateProfileMutation, useUserProfileQuery } from "../../api/users/queries";
import LoginPromptCard from "../../components/LoginPromptCard";
import { useI18n } from "../../i18n";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setAppearance } from "../../store/modules/appSlice";
import type { AppAppearance } from "../../store/modules/appSlice";
import { cn } from "../../utils/cn";
import TtsSpeedControl from "../../components/TtsSpeedControl";
import {
  getNotificationPermission,
  loadReminderPrefs,
  notificationsSupported,
  requestNotificationPermission,
  saveReminderPrefs,
  type ReminderPrefs,
} from "../../utils/studyReminder";

export default function Settings() {
  const dispatch = useAppDispatch();
  const { language, setLanguage, t } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const appAppearance = useAppSelector((state) => state.app.appAppearance);
  const profileQuery = useUserProfileQuery(isAuthenticated);
  const updateProfileMutation = useUpdateProfileMutation();
  const profile = profileQuery.data?.profile;

  const [draftProfile, setDraftProfile] = useState<{
    name?: string;
    dailyMinutes?: number;
    showPinyin?: boolean;
    audioAutoPlay?: boolean;
  }>({});
  const name = draftProfile.name ?? profile?.name ?? "";
  const dailyMinutes = draftProfile.dailyMinutes ?? profile?.dailyMinutes ?? 15;
  const showPinyin = draftProfile.showPinyin ?? profile?.showPinyin ?? true;
  const audioAutoPlay = draftProfile.audioAutoPlay ?? profile?.audioAutoPlay ?? true;

  const [reminder, setReminder] = useState<ReminderPrefs>(() => loadReminderPrefs());
  const [permission, setPermission] = useState(() => getNotificationPermission());

  const persistReminder = (next: ReminderPrefs) => {
    setReminder(next);
    saveReminderPrefs(next);
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

  const saveProfileSettings = async () => {
    await updateProfileMutation.mutateAsync({
      name: name.trim() || t("common.learner"),
      dailyMinutes: Number(dailyMinutes) || 15,
      showPinyin,
      audioAutoPlay,
      appAppearance,
    });
    toast.success(t("profile.saved"));
  };

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={User}
        title={t("loginPrompt.profileTitle")}
        description={t("loginPrompt.profileBody")}
      />
    );
  }

  return (
    <div className="app-page">
      <section className="app-surface-padded mb-5 text-left">
        <h2 className="mb-1 text-xl font-extrabold">{t("navbar.settings")}</h2>
        <p className="mb-5 text-sm font-medium text-muted-foreground">{t("profile.appSettings")}</p>
        <div className="grid gap-4">
          <div>
            <label className="mb-1.5 block text-[0.8rem] font-bold text-muted-foreground">{t("profile.displayName")}</label>
            <input type="text" value={name} onChange={(e) => setDraftProfile((draft) => ({ ...draft, name: e.target.value }))} className="app-control w-full text-foreground" />
          </div>
          <div>
            <label className="mb-1.5 block text-[0.8rem] font-bold text-muted-foreground">{t("profile.dailyGoal")}</label>
            <select value={dailyMinutes} onChange={(e) => setDraftProfile((draft) => ({ ...draft, dailyMinutes: Number(e.target.value) }))} className="app-control w-full text-foreground">
              <option value="5">5 {t("common.minutes")} ({t("profile.goalCasual")})</option>
              <option value="15">15 {t("common.minutes")} ({t("profile.goalRegular")})</option>
              <option value="30">30 {t("common.minutes")} ({t("profile.goalScholar")})</option>
              <option value="60">60 {t("common.minutes")} ({t("profile.goalIntensive")})</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[0.8rem] font-bold text-muted-foreground">{t("profile.appearance")}</label>
            <div role="group" aria-label={t("profile.appearance")} className="flex gap-1 rounded-xl border bg-background p-1">
              {(["light", "dark", "system"] as AppAppearance[]).map((appearance) => (
                <button
                  key={appearance}
                  type="button"
                  aria-pressed={appAppearance === appearance}
                  onClick={() => dispatch(setAppearance(appearance))}
                  className={cn(
                    "flex-1 rounded-lg px-2.5 py-2 text-sm font-extrabold text-muted-foreground transition",
                    appAppearance === appearance && "bg-primary text-white",
                  )}
                >
                  {appearance === "light" && t("profile.appearanceLight")}
                  {appearance === "dark" && t("profile.appearanceDark")}
                  {appearance === "system" && t("profile.appearanceSystem")}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[0.8rem] font-bold text-muted-foreground">{t("profile.language")}</label>
            <div role="group" aria-label={t("profile.language")} className="flex gap-1 rounded-xl border bg-background p-1">
              <button
                type="button"
                aria-pressed={language === "en"}
                onClick={() => setLanguage("en")}
                className={cn("flex-1 rounded-lg px-2.5 py-2 text-sm font-extrabold text-muted-foreground transition", language === "en" && "bg-primary text-white")}
              >
                {t("profile.languageEnglish")}
              </button>
              <button
                type="button"
                aria-pressed={language === "vi"}
                onClick={() => setLanguage("vi")}
                className={cn("flex-1 rounded-lg px-2.5 py-2 text-sm font-extrabold text-muted-foreground transition", language === "vi" && "bg-primary text-white")}
              >
                {t("profile.languageVietnamese")}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 pt-2">
            <div>
              <span className="text-[0.95rem] font-semibold">{t("profile.showPinyin")}</span>
              <p className="text-xs text-muted-foreground">{t("profile.showPinyinBody")}</p>
            </div>
            <button type="button" onClick={() => setDraftProfile((draft) => ({ ...draft, showPinyin: !showPinyin }))} className="text-primary">
              {showPinyin ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 pt-2">
            <div>
              <span className="text-[0.95rem] font-semibold">{t("profile.audioAutoplay")}</span>
              <p className="text-xs text-muted-foreground">{t("profile.audioAutoplayBody")}</p>
            </div>
            <button type="button" onClick={() => setDraftProfile((draft) => ({ ...draft, audioAutoPlay: !audioAutoPlay }))} className="text-primary">
              {audioAutoPlay ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 pt-2">
            <div>
              <span className="text-[0.95rem] font-semibold">{t("tts.speedTitle")}</span>
              <p className="text-xs text-muted-foreground">{t("tts.speedBody")}</p>
            </div>
            <TtsSpeedControl showIcon={false} />
          </div>

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
        </div>
        <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:translate-y-px disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground" onClick={saveProfileSettings} disabled={updateProfileMutation.isPending}>
          {updateProfileMutation.isPending ? t("common.saving") : t("profile.save")}
        </button>
      </section>
    </div>
  );
}
