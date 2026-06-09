import { useState, useEffect } from "react";
import { useStore, ACHIEVEMENTS } from "../store/store";
import { DAILY_PHRASES } from "../resources/seedData";
import { Flame, Star, BookOpen, Brain, Sparkles, Camera, Activity, PencilLine, ArrowRight, PlayCircle, RefreshCw, Volume2, Trophy } from "lucide-react";
import type { Lesson } from "../resources/lessons";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { setSelectedLesson } = useOutletContext<{ setSelectedLesson: (l: Lesson | null) => void }>();
  const store = useStore();
  const profile = store.profile;
  const todayStat = store.getTodayStat();
  
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const day = new Date().getDate();
    setPhraseIndex(day % DAILY_PHRASES.length);
  }, []);

  const currentPhrase = DAILY_PHRASES[phraseIndex];

  const rotatePhrase = () => {
    setPhraseIndex((prev) => (prev + 1) % DAILY_PHRASES.length);
  };

  const playTTS = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      window.speechSynthesis.speak(utterance);
    } else {
      alert("TTS not supported on this browser");
    }
  };

  const nextLesson = store.getNextLesson();
  const dueSRCCount = store.getDueSRSCardsCount();
  const completedLessons = store.getCompletedLessonsCount();
  const masteredCount = store.getMasteredWordsCount();

  const xpProgress = Math.min(todayStat.xp, store.profile.dailyMinutes * 3.3 || 50);
  const xpTarget = store.profile.dailyMinutes * 3.3 || 50;

  return (
    <div className="anim-slide" style={{ paddingBottom: "32px" }}>
      {/* Header Profile Info */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "24px"
      }}>
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
            boxShadow: "0 4px 10px rgba(0,0,0,0.02)"
          }}>
            {profile.avatar}
          </div>
          <div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Hi {profile.name}!</h1>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {profile.startLevel.toUpperCase()} · Goal: {profile.goalPurpose.toUpperCase()}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Flame size={28} className="tone-t4" fill="var(--tone-4)" />
          <span style={{ fontSize: "1.25rem", fontWeight: 800 }}>{store.getCurrentStreak()}</span>
        </div>
      </header>

      {/* Goal Progress Section */}
      <section className="card" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Today's Goal</h3>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
            {todayStat.xp} / {Math.round(xpTarget)} XP
          </span>
        </div>
        
        {/* Progress Bar */}
        <div style={{
          width: "100%",
          height: "12px",
          backgroundColor: "var(--bg-app)",
          borderRadius: "6px",
          overflow: "hidden",
          marginBottom: "20px",
          border: "1px solid var(--border-color)"
        }}>
          <div style={{
            width: `${(xpProgress / xpTarget) * 100}%`,
            height: "100%",
            background: "linear-gradient(90deg, var(--primary-red), var(--accent-red))",
            borderRadius: "6px",
            transition: "width 0.4s ease"
          }} />
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", textAlign: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Star size={20} className="tone-t3" fill="var(--tone-3)" />
            <span style={{ fontWeight: 800, fontSize: "1.1rem", marginTop: "4px" }}>
              {Object.values(store.dailyStats).reduce((sum, s) => sum + s.xp, 0)}
            </span>
            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>XP Total</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Flame size={20} className="tone-t4" fill="var(--tone-4)" />
            <span style={{ fontWeight: 800, fontSize: "1.1rem", marginTop: "4px" }}>{store.getCurrentStreak()}</span>
            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Streak</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <BookOpen size={20} className="tone-t2" />
            <span style={{ fontWeight: 800, fontSize: "1.1rem", marginTop: "4px" }}>{completedLessons}</span>
            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Lessons</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Brain size={20} className="tone-t1" />
            <span style={{ fontWeight: 800, fontSize: "1.1rem", marginTop: "4px" }}>{masteredCount}</span>
            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Mastered</span>
          </div>
        </div>
      </section>

      {/* Quick Action Rows */}
      <section style={{ marginBottom: "24px", overflowX: "auto", paddingBottom: "8px" }}>
        <div style={{ display: "flex", gap: "16px", width: "max-content" }}>
          {[
            { label: "AI Tutor", icon: Sparkles, color: "var(--tone-3)", action: () => navigate("/ai-tutor") },
            { label: "Scan OCR", icon: Camera, color: "var(--jade)", action: () => navigate("/camera-translator") },
            { label: "Tone Drill", icon: Activity, color: "var(--tone-1)", action: () => navigate("/practice") },
            { label: "SRS Cards", icon: RefreshCw, color: "var(--primary-red)", action: () => navigate("/review") },
            { label: "Write Hanzi", icon: PencilLine, color: "var(--gold)", action: () => navigate("/practice") }
          ].map((act, i) => {
            const Icon = act.icon;
            return (
              <button
                key={i}
                onClick={act.action}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  width: "72px",
                  gap: "6px"
                }}
              >
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: act.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  transition: "var(--transition-smooth)"
                }}
                className="quick-action-circle"
                >
                  <Icon size={24} />
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-main)" }}>{act.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Continue Learning card */}
      <section className="card card-gradient-red" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Continue Learning</h3>
          <button
            onClick={() => navigate("learn")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "none",
              border: "none",
              color: "var(--primary-red)",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
          >
            All Lessons <ArrowRight size={14} />
          </button>
        </div>

        {nextLesson ? (
          <div
            onClick={() => {
              setSelectedLesson(nextLesson);
              navigate("/learn");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              cursor: "pointer",
              transition: "var(--transition-smooth)"
            }}
            className="continue-subcard"
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--primary-red)", fontWeight: 700, marginBottom: "2px" }}>
                HSK {nextLesson.hskLevel} · Lesson {nextLesson.order}
              </div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{nextLesson.title}</h4>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "1px" }}>{nextLesson.subtitle}</p>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                <span>⏱️ {nextLesson.estimatedMinutes} min</span>
                <span>⭐ +{nextLesson.xpReward} XP</span>
              </div>
            </div>
            <PlayCircle size={44} className="tone-t4" fill="rgba(217, 63, 71, 0.1)" />
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "16px", color: "var(--jade)", fontWeight: 700 }}>
            🎉 You have completed all curriculum lessons! Take tone practices or reviews!
          </div>
        )}
      </section>

      {/* Phrase of the Day */}
      <section className="card" style={{ marginBottom: "20px", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Phrase of the Day</h3>
          <button
            onClick={rotatePhrase}
            style={{
              border: "none",
              background: "none",
              color: "var(--primary-red)",
              cursor: "pointer",
              padding: "4px"
            }}
          >
            <RefreshCw size={18} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <h2 className="hanzi-text" style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--primary-red)", letterSpacing: "1px" }}>
            {currentPhrase.simplified}
          </h2>
          <div style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 500 }}>
            {currentPhrase.pinyin}
          </div>
          <p style={{ fontSize: "1rem", color: "var(--text-main)", fontWeight: 500, marginTop: "4px" }}>
            "{currentPhrase.english}"
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic", borderLeft: "2px solid var(--border-color)", paddingLeft: "8px", marginTop: "4px" }}>
            💡 {currentPhrase.note}
          </p>

          <button
            className="btn btn-secondary"
            onClick={() => playTTS(currentPhrase.simplified)}
            style={{
              marginTop: "16px",
              padding: "8px 16px",
              alignSelf: "flex-start",
              fontSize: "0.85rem"
            }}
          >
            <Volume2 size={16} /> Listen
          </button>
        </div>
      </section>

      {/* Spaced repetition review card */}
      <section className="card card-gradient-gold" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Ready to Review</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
              {store.getTotalStudiedWordsCount()} words studied, {dueSRCCount} cards due.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/review")}
            style={{
              padding: "10px 18px",
              fontSize: "0.85rem"
            }}
          >
            Start Review ({dueSRCCount})
          </button>
        </div>
      </section>

      {/* Achievements Horizontal Strip */}
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <Trophy size={18} style={{ color: "var(--gold)" }} />
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Badge Achievements</h3>
        </div>

        <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "10px" }}>
          {store.unlockedAchievements.length === 0 ? (
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", padding: "8px" }}>
              No badges unlocked yet. Keep studying to unlock achievements!
            </div>
          ) : (
            ACHIEVEMENTS.map((ach) => {
              const isUnlocked = store.unlockedAchievements.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "10px",
                    borderRadius: "14px",
                    backgroundColor: isUnlocked ? "rgba(242, 191, 76, 0.08)" : "var(--bg-card)",
                    border: `1px solid ${isUnlocked ? "rgba(242, 191, 76, 0.25)" : "var(--border-color)"}`,
                    minWidth: "96px",
                    textAlign: "center",
                    opacity: isUnlocked ? 1 : 0.35,
                    filter: isUnlocked ? "none" : "grayscale(80%)",
                    transition: "var(--transition-smooth)"
                  }}
                  title={ach.description}
                >
                  <span style={{ fontSize: "2rem" }}>{ach.emoji}</span>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, marginTop: "6px", color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "80px" }}>
                    {ach.title}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
