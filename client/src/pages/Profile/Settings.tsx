import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Bell, Eye, EyeOff, Globe2, KeyRound, MailWarning, ToggleLeft, ToggleRight, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import {
  useChangePasswordMutation,
  useChangePasswordOtpMutation,
  useDeleteAccountMutation,
  useDeleteAccountOtpMutation,
  useResendVerificationMutation,
} from "../../api/auth/queries";
import { useUpdateProfileMutation, useUserProfileQuery } from "../../api/users/queries";
import LoginPromptCard from "../../components/LoginPromptCard";
import { DropdownSelect } from "../../components/ui/dropdown-select";
import { useI18n } from "../../i18n";
import LoadingCard from "../../components/LoadingCard";
import { useAuthGate } from "../../hooks/useAuthGate";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setAppearance } from "../../store/modules/appSlice";
import type { AppAppearance } from "../../store/modules/appSlice";
import { cn } from "../../utils/cn";
import { ApiError } from "../../utils/errorUtils";
import { isStrongPassword } from "../../utils/passwordPolicy";
import TtsSpeedControl from "../../components/TtsSpeedControl";
import {
  getNotificationPermission,
  loadReminderPrefs,
  notificationsSupported,
  reminderSWSupported,
  requestNotificationPermission,
  saveReminderPrefs,
  syncReminderToSW,
  type ReminderPrefs,
} from "../../utils/studyReminder";

const getMutationError = (error: unknown, fallback: string) =>
  error instanceof ApiError || error instanceof Error ? error.message : fallback;

const REMINDER_DAY_KEYS = [
  "reminder.day0",
  "reminder.day1",
  "reminder.day2",
  "reminder.day3",
  "reminder.day4",
  "reminder.day5",
  "reminder.day6",
] as const;

export default function Settings() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useI18n();
  const { isResolving, isAuthenticated } = useAuthGate();
  const appAppearance = useAppSelector((state) => state.app.appAppearance);
  const profileQuery = useUserProfileQuery(isAuthenticated);
  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();
  const changePasswordOtpMutation = useChangePasswordOtpMutation();
  const deleteAccountMutation = useDeleteAccountMutation();
  const deleteAccountOtpMutation = useDeleteAccountOtpMutation();
  const resendVerificationMutation = useResendVerificationMutation();
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

  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "", otp: "" });
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordOtpSent, setPasswordOtpSent] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteOtp, setDeleteOtp] = useState("");
  const [deleteOtpSent, setDeleteOtpSent] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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

  const sendPasswordOtp = async () => {
    setPasswordError("");

    try {
      await changePasswordOtpMutation.mutateAsync();
      setPasswordOtpSent(true);
      toast.success(t("security.otpSent"));
    } catch (error) {
      setPasswordError(getMutationError(error, t("security.otpSendFailed")));
    }
  };

  const submitChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError("");

    if (!isStrongPassword(passwordForm.next)) {
      setPasswordError(t("security.weakPassword"));
      return;
    }

    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError(t("security.mismatch"));
      return;
    }

    if (!/^\d{6}$/.test(passwordForm.otp.trim())) {
      setPasswordError(t("security.otpInvalid"));
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordForm.current,
        newPassword: passwordForm.next,
        otp: passwordForm.otp.trim(),
      });
      setPasswordForm({ current: "", next: "", confirm: "", otp: "" });
      setPasswordOtpSent(false);
      toast.success(t("security.changed"));
    } catch (error) {
      setPasswordError(getMutationError(error, t("security.changeFailed")));
    }
  };

  const sendDeleteOtp = async () => {
    setDeleteError("");

    try {
      await deleteAccountOtpMutation.mutateAsync();
      setDeleteOtpSent(true);
      toast.success(t("danger.otpSent"));
    } catch (error) {
      setDeleteError(getMutationError(error, t("danger.otpSendFailed")));
    }
  };

  const submitDeleteAccount = async (event: React.FormEvent) => {
    event.preventDefault();
    setDeleteError("");

    if (!/^\d{6}$/.test(deleteOtp.trim())) {
      setDeleteError(t("danger.otpInvalid"));
      return;
    }

    try {
      await deleteAccountMutation.mutateAsync(deleteOtp.trim());
      toast.success(t("danger.deleted"));
      navigate("/landing", { replace: true });
    } catch (error) {
      setDeleteError(getMutationError(error, t("danger.deleteFailed")));
    }
  };

  const resendVerification = async () => {
    try {
      const result = await resendVerificationMutation.mutateAsync();
      toast.success(result.alreadyVerified ? t("emailVerify.already") : t("emailVerify.sent"));
    } catch (error) {
      toast.error(getMutationError(error, t("emailVerify.failed")));
    }
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

  if (isResolving) {
    return <LoadingCard label={t("common.loading")} />;
  }

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
        {profile && profile.emailVerified === false && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5">
            <div className="flex items-center gap-3">
              <MailWarning size={18} className="shrink-0 text-amber-600" />
              <p className="text-sm font-semibold">{t("emailVerify.banner")}</p>
            </div>
            <button
              type="button"
              onClick={resendVerification}
              disabled={resendVerificationMutation.isPending}
              className="rounded-lg border border-amber-500/40 bg-card px-3 py-1.5 text-xs font-bold transition hover:border-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resendVerificationMutation.isPending ? t("common.saving") : t("emailVerify.resend")}
            </button>
          </div>
        )}
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
            <DropdownSelect
              value={language}
              label={t("profile.language")}
              icon={<Globe2 size={16} />}
              onChange={setLanguage}
              align="left"
              options={[
                { code: "EN", label: t("profile.languageEnglish"), value: "en" },
                { code: "VI", label: t("profile.languageVietnamese"), value: "vi" },
                { code: "简", label: t("profile.languageChineseSimplified"), value: "zh-Hans" },
                { code: "繁", label: t("profile.languageChineseTraditional"), value: "zh-Hant" },
              ]}
              className="w-full"
              buttonClassName="w-full"
              menuClassName="w-full"
            />
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
        </div>
        <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:translate-y-px disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground" onClick={saveProfileSettings} disabled={updateProfileMutation.isPending}>
          {updateProfileMutation.isPending ? t("common.saving") : t("profile.save")}
        </button>
      </section>

      <section className="app-surface-padded mb-5 text-left">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <KeyRound size={18} />
          </span>
          <div>
            <h2 className="text-lg font-extrabold">{t("security.title")}</h2>
            <p className="text-sm font-medium text-muted-foreground">{t("security.body")}</p>
          </div>
        </div>
        <form onSubmit={submitChangePassword} className="grid gap-4">
          <div>
            <label className="mb-1.5 block text-[0.8rem] font-bold text-muted-foreground">{t("security.currentPassword")}</label>
            <span className="relative block">
              <input
                type={showPasswords ? "text" : "password"}
                value={passwordForm.current}
                onChange={(e) => setPasswordForm((form) => ({ ...form, current: e.target.value }))}
                autoComplete="current-password"
                className="app-control w-full pr-11 text-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((value) => !value)}
                aria-label={showPasswords ? t("auth.hidePassword") : t("auth.showPassword")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </div>
          <div>
            <label className="mb-1.5 block text-[0.8rem] font-bold text-muted-foreground">{t("security.newPassword")}</label>
            <span className="relative block">
              <input
                type={showPasswords ? "text" : "password"}
                value={passwordForm.next}
                onChange={(e) => setPasswordForm((form) => ({ ...form, next: e.target.value }))}
                autoComplete="new-password"
                placeholder={t("auth.newPasswordPlaceholder")}
                className="app-control w-full pr-11 text-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((value) => !value)}
                aria-label={showPasswords ? t("auth.hidePassword") : t("auth.showPassword")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
            <p className="mt-1.5 text-xs font-medium text-muted-foreground">{t("security.policyHint")}</p>
          </div>
          <div>
            <label className="mb-1.5 block text-[0.8rem] font-bold text-muted-foreground">{t("security.confirmPassword")}</label>
            <span className="relative block">
              <input
                type={showPasswords ? "text" : "password"}
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm((form) => ({ ...form, confirm: e.target.value }))}
                autoComplete="new-password"
                className="app-control w-full pr-11 text-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((value) => !value)}
                aria-label={showPasswords ? t("auth.hidePassword") : t("auth.showPassword")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </div>
          <div>
            <label className="mb-1.5 block text-[0.8rem] font-bold text-muted-foreground">{t("security.otpLabel")}</label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={passwordForm.otp}
                onChange={(e) => setPasswordForm((form) => ({ ...form, otp: e.target.value.replace(/\D/g, "") }))}
                placeholder="123456"
                autoComplete="one-time-code"
                className="app-control w-full text-foreground tracking-[0.3em]"
              />
              <button
                type="button"
                onClick={sendPasswordOtp}
                disabled={changePasswordOtpMutation.isPending}
                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-primary/40 px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {changePasswordOtpMutation.isPending
                  ? t("common.saving")
                  : passwordOtpSent
                    ? t("security.otpResend")
                    : t("security.otpSend")}
              </button>
            </div>
            <p className="mt-1.5 text-xs font-medium text-muted-foreground">{t("security.otpHint")}</p>
          </div>
          {passwordError && (
            <div role="alert" className="rounded-xl border border-destructive/25 bg-destructive/10 px-3.5 py-3 text-sm font-bold text-destructive">
              {passwordError}
            </div>
          )}
          <button
            type="submit"
            disabled={
              changePasswordMutation.isPending ||
              !passwordForm.current ||
              !passwordForm.next ||
              !passwordForm.confirm ||
              !passwordForm.otp
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:translate-y-px disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          >
            {changePasswordMutation.isPending ? t("common.saving") : t("security.submit")}
          </button>
          <p className="text-xs font-medium text-muted-foreground">{t("security.note")}</p>
        </form>
      </section>

      <section className="app-surface-padded mb-5 border-destructive/30 text-left">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertTriangle size={18} />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-destructive">{t("danger.title")}</h2>
              <p className="text-sm font-medium text-muted-foreground">{t("danger.body")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setDeleteOtp("");
              setDeleteOtpSent(false);
              setDeleteError("");
              setDeleteModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm font-bold text-destructive transition hover:bg-destructive hover:text-white active:translate-y-px"
          >
            <Trash2 size={16} /> {t("danger.delete")}
          </button>
        </div>
      </section>

      {deleteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          onClick={() => !deleteAccountMutation.isPending && setDeleteModalOpen(false)}
        >
          <form
            onSubmit={submitDeleteAccount}
            onClick={(e) => e.stopPropagation()}
            className="anim-slide w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl"
          >
            <h3 id="delete-account-title" className="mb-2 text-lg font-extrabold text-destructive">
              {t("danger.confirmTitle")}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">{t("danger.confirmBody")}</p>
            <label className="mb-1.5 block text-[0.8rem] font-bold text-muted-foreground">
              {t("danger.otpPrompt")}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={deleteOtp}
                onChange={(e) => setDeleteOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                autoComplete="one-time-code"
                autoFocus
                className="app-control w-full text-foreground tracking-[0.3em]"
              />
              <button
                type="button"
                onClick={sendDeleteOtp}
                disabled={deleteAccountOtpMutation.isPending}
                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-destructive/40 px-4 py-2 text-sm font-bold text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteAccountOtpMutation.isPending
                  ? t("common.saving")
                  : deleteOtpSent
                    ? t("danger.otpResend")
                    : t("danger.otpSend")}
              </button>
            </div>
            <p className="mt-1.5 text-xs font-medium text-muted-foreground">{t("danger.otpHint")}</p>
            {deleteError && (
              <div role="alert" className="mt-3 rounded-xl border border-destructive/25 bg-destructive/10 px-3.5 py-3 text-sm font-bold text-destructive">
                {deleteError}
              </div>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleteAccountMutation.isPending}
                className="rounded-xl border bg-card px-4 py-2.5 text-sm font-bold transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                disabled={deleteOtp.trim().length !== 6 || deleteAccountMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-destructive px-4 py-2.5 text-sm font-bold text-white transition hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={15} />
                {deleteAccountMutation.isPending ? t("common.saving") : t("danger.confirm")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
