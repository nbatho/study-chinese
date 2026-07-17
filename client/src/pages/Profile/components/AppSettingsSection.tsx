import { useState } from "react";
import { Globe2, MailWarning, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import { useResendVerificationMutation } from "../../../api/auth/queries";
import { useUpdateProfileMutation, useUserProfileQuery } from "../../../api/users/queries";
import { DropdownSelect } from "../../../components/ui/dropdown-select";
import TtsSpeedControl from "../../../components/TtsSpeedControl";
import { useI18n } from "../../../i18n";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setAppearance } from "../../../store/modules/appSlice";
import type { AppAppearance } from "../../../store/modules/appSlice";
import { cn } from "../../../utils/cn";
import { getErrorMessage as getMutationError } from "../../../utils/errorUtils";
import ReminderCard from "./ReminderCard";

export default function AppSettingsSection() {
  const dispatch = useAppDispatch();
  const { language, setLanguage, t } = useI18n();
  const appAppearance = useAppSelector((state) => state.app.appAppearance);
  const profileQuery = useUserProfileQuery(true);
  const updateProfileMutation = useUpdateProfileMutation();
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

  const resendVerification = async () => {
    try {
      const result = await resendVerificationMutation.mutateAsync();
      toast.success(result.alreadyVerified ? t("emailVerify.already") : t("emailVerify.sent"));
    } catch (error) {
      toast.error(getMutationError(error, t("emailVerify.failed")));
    }
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

  return (
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

        <ReminderCard />
      </div>
      <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:translate-y-px disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground" onClick={saveProfileSettings} disabled={updateProfileMutation.isPending}>
        {updateProfileMutation.isPending ? t("common.saving") : t("profile.save")}
      </button>
    </section>
  );
}
