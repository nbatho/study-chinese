import { useNavigate, useOutletContext } from "react-router-dom";
import {
  useAchievementsQuery,
  useDailyContentQuery,
  useDueSrsCardsQuery,
  useLessonsQuery,
  useUserProfileQuery,
  useUserStatsQuery,
} from "../api";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Brain,
  Camera,
  Flame,
  PencilLine,
  PlayCircle,
  RefreshCw,
  Sparkles,
  Star,
  Trophy,
  Volume2,
} from "lucide-react";
import { useI18n } from "../i18n";

export default function Home() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { setSelectedLessonId } = useOutletContext<{
    setSelectedLessonId: (lessonId: string | null) => void;
  }>();
  const profileQuery = useUserProfileQuery();
  const statsQuery = useUserStatsQuery(7);
  const lessonsQuery = useLessonsQuery();
  const dueCardsQuery = useDueSrsCardsQuery(20);
  const achievementsQuery = useAchievementsQuery();
  const dailyContentQuery = useDailyContentQuery();

  const profile = profileQuery.data?.profile;
  const streak = profileQuery.data?.streak;
  const stats = statsQuery.data?.stats ?? [];
  const lessons = lessonsQuery.data?.lessons ?? [];
  const dueCount = dueCardsQuery.data?.cards.length ?? 0;
  const unlockedAchievements = achievementsQuery.data?.achievements.filter((item) => item.unlockedAt) ?? [];
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayStat = stats.find((item) => item.dateKey === todayKey) ?? {
    dateKey: todayKey,
    xp: 0,
    minutesStudied: 0,
    lessonsCompleted: 0,
    wordsReviewed: 0,
    exercisesCorrect: 0,
    exercisesTotal: 0,
  };
  const totalXp = stats.reduce((sum, item) => sum + item.xp, 0);
  const completedLessons = lessons.filter((lesson) => lesson.completedAt).length;
  const nextLesson = lessons.find((lesson) => !lesson.completedAt) ?? lessons[0];
  const currentPhrase = dailyContentQuery.data?.phrase;
  const xpTarget = Math.max((profile?.dailyMinutes ?? 15) * 3, 45);
  const xpProgress = Math.min(todayStat.xp, xpTarget);

  const playTTS = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="anim-slide" style={{ paddingBottom: "32px" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            fontSize: "2.8rem",
            width: "64px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--bg-card)",
            borderRadius: "50%",
            border: "1px solid var(--border-color)",
          }}>
            {profile?.avatar || "学"}
          </div>
          <div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>
              {t("home.greeting", { name: profile?.name || t("common.learner") })}
            </h1>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {(profile?.startLevel || "beginner").toUpperCase()} · {t("common.goal")}: {(profile?.goalPurpose || "travel").toUpperCase()}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Flame size={28} className="tone-t4" fill="var(--tone-4)" />
          <span style={{ fontSize: "1.25rem", fontWeight: 800 }}>{streak?.current ?? 0}</span>
        </div>
      </header>

      <section className="card" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>{t("home.todayGoal")}</h3>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
            {todayStat.xp} / {Math.round(xpTarget)} XP
          </span>
        </div>
        <div style={{ width: "100%", height: "12px", backgroundColor: "var(--bg-app)", borderRadius: "6px", overflow: "hidden", marginBottom: "20px", border: "1px solid var(--border-color)" }}>
          <div style={{ width: `${(xpProgress / xpTarget) * 100}%`, height: "100%", background: "linear-gradient(90deg, var(--primary-red), var(--accent-red))", borderRadius: "6px" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", textAlign: "center" }}>
          {[
            { label: t("home.xpTotal"), value: totalXp, icon: Star, cls: "tone-t3" },
            { label: t("home.streak"), value: streak?.current ?? 0, icon: Flame, cls: "tone-t4" },
            { label: t("home.lessons"), value: completedLessons, icon: BookOpen, cls: "tone-t2" },
            { label: t("home.reviews"), value: todayStat.wordsReviewed, icon: Brain, cls: "tone-t1" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Icon size={20} className={item.cls} />
                <span style={{ fontWeight: 800, fontSize: "1.1rem", marginTop: "4px" }}>{item.value}</span>
                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{item.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ marginBottom: "24px", overflowX: "auto", paddingBottom: "8px" }}>
        <div style={{ display: "flex", gap: "16px", width: "max-content" }}>
          {[
            { label: t("home.aiTutor"), icon: Sparkles, color: "var(--tone-3)", action: () => navigate("/ai-tutor") },
            { label: t("home.scanOcr"), icon: Camera, color: "var(--jade)", action: () => navigate("/camera-translator") },
            { label: t("home.toneDrill"), icon: Activity, color: "var(--tone-1)", action: () => navigate("/practice") },
            { label: t("home.srsCards"), icon: RefreshCw, color: "var(--primary-red)", action: () => navigate("/review") },
            { label: t("home.writeHanzi"), icon: PencilLine, color: "var(--gold)", action: () => navigate("/practice") }
          ].map((act) => {
            const Icon = act.icon;
            return (
              <button key={act.label} onClick={act.action} style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "none", border: "none", cursor: "pointer", width: "72px", gap: "6px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: act.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                  <Icon size={24} />
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-main)" }}>{act.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="card card-gradient-red" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>{t("home.continueLearning")}</h3>
          <button onClick={() => navigate("/learn")} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", color: "var(--primary-red)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
            {t("home.allLessons")} <ArrowRight size={14} />
          </button>
        </div>
        {nextLesson ? (
          <div
            onClick={() => {
              setSelectedLessonId(nextLesson.id);
              navigate("/learn");
            }}
            className="continue-subcard"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderRadius: "12px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", cursor: "pointer" }}
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--primary-red)", fontWeight: 700, marginBottom: "2px" }}>
                HSK {nextLesson.hskLevel} · {t("home.lessons")} {nextLesson.order}
              </div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{nextLesson.title}</h4>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "1px" }}>{nextLesson.subtitle}</p>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                <span>{nextLesson.estimatedMinutes} min</span>
                <span>+{nextLesson.xpReward} XP</span>
              </div>
            </div>
            <PlayCircle size={44} className="tone-t4" fill="rgba(217, 63, 71, 0.1)" />
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "16px", color: "var(--text-muted)", fontWeight: 700 }}>
            {t("home.noLessons")}
          </div>
        )}
      </section>

      {currentPhrase && (
        <section className="card" style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "14px" }}>{t("home.phrase")}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <h2 className="hanzi-text" style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--primary-red)", letterSpacing: "1px" }}>
              {currentPhrase.simplified}
            </h2>
            <div style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 500 }}>{currentPhrase.pinyin}</div>
            <p style={{ fontSize: "1rem", color: "var(--text-main)", fontWeight: 500, marginTop: "4px" }}>"{currentPhrase.english}"</p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic", borderLeft: "2px solid var(--border-color)", paddingLeft: "8px", marginTop: "4px" }}>
              {currentPhrase.note}
            </p>
            <button className="btn btn-secondary" onClick={() => playTTS(currentPhrase.simplified)} style={{ marginTop: "16px", padding: "8px 16px", alignSelf: "flex-start", fontSize: "0.85rem" }}>
              <Volume2 size={16} /> {t("common.listen")}
            </button>
          </div>
        </section>
      )}

      <section className="card card-gradient-gold" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>{t("home.readyReview")}</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
              {t("home.cardsDue", { count: dueCount })}
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate("/review")} style={{ padding: "10px 18px", fontSize: "0.85rem" }}>
            {t("home.startReview", { count: dueCount })}
          </button>
        </div>
      </section>

      <section>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <Trophy size={18} style={{ color: "var(--gold)" }} />
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{t("home.badges")}</h3>
        </div>
        <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "10px" }}>
          {unlockedAchievements.length === 0 ? (
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", padding: "8px" }}>
              {t("home.noBadges")}
            </div>
          ) : (
            unlockedAchievements.map((ach) => (
              <div key={ach.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px", borderRadius: "14px", backgroundColor: "rgba(242, 191, 76, 0.08)", border: "1px solid rgba(242, 191, 76, 0.25)", minWidth: "96px", textAlign: "center" }}>
                <span style={{ fontSize: "2rem" }}>{ach.emoji}</span>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, marginTop: "6px", color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "80px" }}>
                  {ach.title}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
