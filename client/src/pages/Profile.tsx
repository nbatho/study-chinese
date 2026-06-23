import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useUpdateProfileMutation, useUserProfileQuery, useUserStatsQuery } from "../api/users/queries";
import { ToggleLeft, ToggleRight, User } from "lucide-react";
import { useI18n } from "../i18n";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAppearance } from "../store/modules/appSlice";
import type { AppAppearance } from "../store/modules/appSlice";
import LoginPromptCard from "../components/LoginPromptCard";
import { cn } from "../utils/cn";

export default function Profile() {
  const { t } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={User}
        title={t("loginPrompt.profileTitle")}
        description={t("loginPrompt.profileBody")}
      />
    );
  }

  return <ProfileContent />;
}

function ProfileContent() {
  const dispatch = useAppDispatch();
  const { language, setLanguage, t } = useI18n();
  const appAppearance = useAppSelector((state) => state.app.appAppearance);
  const profileQuery = useUserProfileQuery();
  const statsQuery = useUserStatsQuery(7);
  const updateProfileMutation = useUpdateProfileMutation();
  const profile = profileQuery.data?.profile;
  const streak = profileQuery.data?.streak;
  const stats = useMemo(() => statsQuery.data?.stats ?? [], [statsQuery.data?.stats]);

  const [draftProfile, setDraftProfile] = useState<{
    name?: string;
    dailyMinutes?: number;
    showPinyin?: boolean;
    audioAutoPlay?: boolean;
  }>({});
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const name = draftProfile.name ?? profile?.name ?? "";
  const dailyMinutes = draftProfile.dailyMinutes ?? profile?.dailyMinutes ?? 15;
  const showPinyin = draftProfile.showPinyin ?? profile?.showPinyin ?? true;
  const audioAutoPlay = draftProfile.audioAutoPlay ?? profile?.audioAutoPlay ?? true;
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

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 30;
    const graphWidth = canvas.width - padding * 2;
    const graphHeight = canvas.height - padding * 2;
    ctx.strokeStyle = document.body.classList.contains("dark") ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i += 1) {
      const y = padding + (graphHeight * i) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    const xps = stats.map((stat) => stat.xp);
    const maxXp = Math.max(...xps, 50);
    const barGap = 10;
    const totalGapsWidth = barGap * Math.max(stats.length - 1, 0);
    const barWidth = stats.length ? (graphWidth - totalGapsWidth) / stats.length : graphWidth;
    const compStyle = window.getComputedStyle(canvas);
    const primaryRed = compStyle.getPropertyValue("--primary-red").trim() || "rgb(217, 63, 71)";
    const accentRed = compStyle.getPropertyValue("--accent-red").trim() || "rgb(240, 75, 66)";
    const textMain = compStyle.getPropertyValue("--text-main").trim() || "#2c2c35";
    const textMuted = compStyle.getPropertyValue("--text-muted").trim() || "#6e6e82";

    stats.forEach((stat, idx) => {
      const barHeight = (stat.xp / maxXp) * graphHeight;
      const x = padding + idx * (barWidth + barGap);
      const y = canvas.height - padding - barHeight;
      const grad = ctx.createLinearGradient(x, y, x, canvas.height - padding);
      grad.addColorStop(0, primaryRed);
      grad.addColorStop(1, accentRed);
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barWidth, barHeight);
      ctx.fillStyle = textMain;
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      if (stat.xp > 0) ctx.fillText(String(stat.xp), x + barWidth / 2, y - 4);
      ctx.fillStyle = textMuted;
      ctx.font = "8px sans-serif";
      ctx.fillText(stat.dateKey.split("-").slice(1).join("/"), x + barWidth / 2, canvas.height - padding + 14);
    });
  }, [stats]);

  const today = stats[stats.length - 1] ?? {
    xp: 0,
    minutesStudied: 0,
    wordsReviewed: 0,
    exercisesCorrect: 0,
    exercisesTotal: 0,
  };
  const accuracy = today.exercisesTotal
    ? Math.round((today.exercisesCorrect / today.exercisesTotal) * 100)
    : 0;

  return (
    <div className="anim-slide pb-10">
      <section className="mb-5 flex items-center gap-4 rounded-lg border bg-card p-4 text-left shadow-sm sm:p-5">
        <div className="text-5xl sm:text-[3.2rem]">{profile?.avatar || "学"}</div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-extrabold sm:text-[1.35rem]">{profile?.name || t("common.learner")}</h2>
          <span className="text-[0.8rem] font-bold text-primary">
            {t("profile.memberSince", { date: profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString() : t("common.today") })}
          </span>
          <div className="mt-2 flex flex-wrap gap-2.5">
            <span className="rounded-md bg-secondary px-2 py-1 text-xs font-bold text-muted-foreground">
              {t("profile.streakDays", { count: streak?.current ?? 0 })}
            </span>
            <span className="rounded-md bg-secondary px-2 py-1 text-xs font-bold text-muted-foreground">
              {t("common.level")}: {(profile?.startLevel || "beginner").toUpperCase()}
            </span>
          </div>
        </div>
      </section>

      <section className="mb-5 rounded-lg border bg-card p-4 text-left shadow-sm sm:p-5">
        <h3 className="mb-1 text-base font-bold">{t("profile.weeklyXp")}</h3>
        <p className="mb-4 text-[0.8rem] text-muted-foreground">{t("profile.weeklyXpBody")}</p>
        <div className="flex justify-center">
          <canvas ref={canvasRef} width={340} height={180} className="h-[180px] w-full max-w-[340px]" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2.5 border-t border-dashed pt-4 text-center">
          <div>
            <span className="block text-[0.7rem] font-bold text-muted-foreground">{t("profile.studyTime")}</span>
            <strong className="text-[1.1rem] text-primary">{today.minutesStudied} min</strong>
          </div>
          <div>
            <span className="block text-[0.7rem] font-bold text-muted-foreground">{t("profile.accuracy")}</span>
            <strong className="text-[1.1rem] text-jade">{accuracy}%</strong>
          </div>
          <div>
            <span className="block text-[0.7rem] font-bold text-muted-foreground">{t("home.reviews").toUpperCase()}</span>
            <strong className="text-[1.1rem] text-tone-3">{today.wordsReviewed}</strong>
          </div>
        </div>
      </section>

      <section className="mb-5 rounded-lg border bg-card p-4 text-left shadow-sm sm:p-5">
        <h3 className="mb-4 text-base font-bold">{t("profile.appSettings")}</h3>
        <div className="grid gap-4">
          <div>
            <label className="mb-1.5 block text-[0.8rem] font-bold text-muted-foreground">{t("profile.displayName")}</label>
            <input type="text" value={name} onChange={(e) => setDraftProfile((draft) => ({ ...draft, name: e.target.value }))} className="w-full rounded-lg border bg-background px-3.5 py-2.5 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-[0.8rem] font-bold text-muted-foreground">{t("profile.dailyGoal")}</label>
            <select value={dailyMinutes} onChange={(e) => setDraftProfile((draft) => ({ ...draft, dailyMinutes: Number(e.target.value) }))} className="w-full rounded-lg border bg-background px-3.5 py-2.5 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20">
              <option value="5">5 {t("common.minutes")} (Casual)</option>
              <option value="15">15 {t("common.minutes")} (Regular)</option>
              <option value="30">30 {t("common.minutes")} (Scholar)</option>
              <option value="60">60 {t("common.minutes")} (Intensive)</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[0.8rem] font-bold text-muted-foreground">{t("profile.appearance")}</label>
            <div role="group" aria-label={t("profile.appearance")} className="flex gap-1 rounded-[10px] border bg-background p-1">
              {(["light", "dark", "system"] as AppAppearance[]).map((appearance) => (
                <button
                  key={appearance}
                  type="button"
                  aria-pressed={appAppearance === appearance}
                  onClick={() => dispatch(setAppearance(appearance))}
                  className={cn(
                    "flex-1 rounded-md px-2.5 py-2 text-sm font-extrabold text-muted-foreground transition",
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
            <div role="group" aria-label={t("profile.language")} className="flex gap-1 rounded-[10px] border bg-background p-1">
              <button
                type="button"
                aria-pressed={language === "en"}
                onClick={() => setLanguage("en")}
                className={cn("flex-1 rounded-md px-2.5 py-2 text-sm font-extrabold text-muted-foreground transition", language === "en" && "bg-primary text-white")}
              >
                English
              </button>
              <button
                type="button"
                aria-pressed={language === "vi"}
                onClick={() => setLanguage("vi")}
                className={cn("flex-1 rounded-md px-2.5 py-2 text-sm font-extrabold text-muted-foreground transition", language === "vi" && "bg-primary text-white")}
              >
                Tiếng Việt
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 pt-2">
            <div>
              <span className="text-[0.95rem] font-semibold">{t("profile.showPinyin")}</span>
              <p className="text-xs text-muted-foreground">{t("profile.showPinyinBody")}</p>
            </div>
            <button onClick={() => setDraftProfile((draft) => ({ ...draft, showPinyin: !showPinyin }))} className="text-primary">
              {showPinyin ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 pt-2">
            <div>
              <span className="text-[0.95rem] font-semibold">{t("profile.audioAutoplay")}</span>
              <p className="text-xs text-muted-foreground">{t("profile.audioAutoplayBody")}</p>
            </div>
            <button onClick={() => setDraftProfile((draft) => ({ ...draft, audioAutoPlay: !audioAutoPlay }))} className="text-primary">
              {audioAutoPlay ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>
        </div>
        <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground" onClick={saveProfileSettings} disabled={updateProfileMutation.isPending}>
          {updateProfileMutation.isPending ? t("common.saving") : t("profile.save")}
        </button>
      </section>

    </div>
  );
}
