import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDailyContentQuery, useLessonsQuery, useUserProfileQuery } from "../../api";
import { BookOpenCheck, CheckCircle2, ClipboardCheck, Lock, Search, Trophy } from "lucide-react";
import { useI18n } from "../../i18n";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";
import LoginPromptCard from "../../components/LoginPromptCard";
import LessonPath from "./components/LessonPath";
import LessonPlayer from "./components/LessonPlayer";

export default function Learn() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const { selectedLessonId, setSelectedLessonId } = useOutletContext<{
    selectedLessonId: string | null;
    setSelectedLessonId: (lessonId: string | null) => void;
  }>();
  const lessonsQuery = useLessonsQuery(isAuthenticated);
  const profileQuery = useUserProfileQuery(isAuthenticated);
  const dailyContentQuery = useDailyContentQuery(isAuthenticated);
  const [activeTab, setActiveTab] = useState<"curriculum" | "grammar">("curriculum");
  const [selectedHSK, setSelectedHSK] = useState<number>(1);
  const [grammarQuery, setGrammarQuery] = useState("");
  const lessons = lessonsQuery.data?.lessons ?? [];
  const userCefrLevel = profileQuery.data?.profile.cefrLevel ?? "A1";
  const cefrRank = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 } as const;
  const isLessonLockedByCefr = (lesson: { cefrLevel?: keyof typeof cefrRank; completedAt?: string | null }) =>
    cefrRank[lesson.cefrLevel ?? "A1"] > cefrRank[userCefrLevel];
  const hskLevels = Array.from(new Set(lessons.map((lesson) => lesson.hskLevel))).sort((a, b) => a - b);
  const visibleHskLevels = hskLevels.length ? hskLevels : [1, 2, 3];
  const hskStats = visibleHskLevels.map((level) => {
    const hskLessons = lessons.filter((lesson) => lesson.hskLevel === level);
    const completedCount = hskLessons.filter((lesson) => lesson.completedAt).length;
    const percent = Math.round(hskLessons.length ? (completedCount / hskLessons.length) * 100 : 0);
    const skills = Array.from(new Set(hskLessons.map((lesson) => lesson.skill))).slice(0, 3);
    const cefrLevel = hskLessons[0]?.cefrLevel ?? (level === 1 ? "A1" : level === 2 ? "A2" : "B1");
    const isLocked = cefrRank[cefrLevel] > cefrRank[userCefrLevel];

    return {
      level,
      cefrLevel,
      isLocked,
      completedCount,
      lessonCount: hskLessons.length,
      percent,
      skills,
      xpReward: hskLessons.reduce((total, lesson) => total + lesson.xpReward, 0),
    };
  });
  const levelLessons = lessons.filter((lesson) => lesson.hskLevel === selectedHSK).sort((a, b) => a.order - b.order);
  const grammarLibrary = dailyContentQuery.data?.grammarLibrary ?? [];
  const filteredGrammar = grammarLibrary.filter((entry) =>
    entry.title.toLowerCase().includes(grammarQuery.toLowerCase()) ||
    entry.summary.toLowerCase().includes(grammarQuery.toLowerCase()) ||
    entry.pattern.toLowerCase().includes(grammarQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={Search}
        title={t("loginPrompt.learnTitle")}
        description={t("loginPrompt.learnBody")}
      />
    );
  }

  return (
    <div className="anim-slide">
      {selectedLessonId ? (
        <LessonPlayer lessonId={selectedLessonId} onClose={() => setSelectedLessonId(null)} />
      ) : (
        <>
          <div className="mb-6 flex rounded-xl border bg-secondary p-1">
            {[
              { id: "curriculum", label: t("learn.curriculum") },
              { id: "grammar", label: t("learn.grammar") },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={cn("flex-1 rounded-lg p-2.5 font-bold transition", activeTab === tab.id ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "curriculum" ? (
            <div>
              <div className="mb-5 flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ClipboardCheck size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-extrabold">CEFR {userCefrLevel} path</p>
                    <p className="text-xs font-semibold text-muted-foreground">Lessons above your placement level stay visible but locked.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/placement-test")}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border bg-secondary px-4 text-sm font-bold transition hover:bg-secondary/80"
                >
                  <ClipboardCheck size={16} />
                  Retake placement
                </button>
              </div>
              <div className="mb-5 grid gap-3 sm:grid-cols-3">
                {hskStats.map((levelStats) => (
                  <button
                    key={levelStats.level}
                    type="button"
                    onClick={() => setSelectedHSK(levelStats.level)}
                    className={cn(
                      "min-h-36 rounded-lg border-2 bg-card p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                      selectedHSK === levelStats.level ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground",
                      levelStats.isLocked && "border-dashed opacity-75",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold uppercase text-muted-foreground">Curriculum</span>
                        <h3 className="mt-1 text-2xl font-extrabold">HSK {levelStats.level}</h3>
                      </div>
                      <span className={cn("flex size-9 items-center justify-center rounded-full", levelStats.percent === 100 ? "bg-jade/10 text-jade" : levelStats.isLocked ? "bg-muted text-muted-foreground" : "bg-secondary text-muted-foreground")}>
                        {levelStats.percent === 100 ? <CheckCircle2 size={19} /> : levelStats.isLocked ? <Lock size={18} /> : <BookOpenCheck size={19} />}
                      </span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${levelStats.percent}%` }} />
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2 text-xs font-bold text-muted-foreground">
                      <span>{levelStats.completedCount}/{levelStats.lessonCount} {t("home.lessons")}</span>
                      <span>{levelStats.percent}%</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className={cn("rounded-md px-2 py-1 text-[0.68rem] font-extrabold", levelStats.isLocked ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary")}>
                        CEFR {levelStats.cefrLevel}
                      </span>
                      {levelStats.skills.map((skill) => (
                        <span key={skill} className="rounded-md bg-secondary px-2 py-1 text-[0.68rem] font-extrabold uppercase text-muted-foreground">
                          {skill}
                        </span>
                      ))}
                      {levelStats.xpReward > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-gold/10 px-2 py-1 text-[0.68rem] font-extrabold text-gold">
                          <Trophy size={12} />
                          {levelStats.xpReward} XP
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mb-4 text-left text-[0.85rem] font-semibold text-muted-foreground">
                {t("learn.progress", { level: selectedHSK, percent: Math.round(levelLessons.length ? (levelLessons.filter((lesson) => lesson.completedAt).length / levelLessons.length) * 100 : 0) })}
              </div>
              <LessonPath lessons={levelLessons} onSelectLesson={setSelectedLessonId} isLessonLocked={isLessonLockedByCefr} />
            </div>
          ) : (
            <div className="anim-slide">
              <div className="mb-5 flex items-center gap-2.5 rounded-xl border bg-card px-4 py-2">
                <Search size={18} className="text-muted-foreground" />
                <input type="text" placeholder={t("learn.searchGrammar")} value={grammarQuery} onChange={(e) => setGrammarQuery(e.target.value)} className="w-full bg-transparent text-[0.95rem] text-foreground outline-none placeholder:text-muted-foreground" />
              </div>
              <div className="grid gap-4">
                {filteredGrammar.map((entry) => (
                  <div key={entry.id} className="rounded-lg border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <h4 className="text-[1.1rem] font-extrabold text-primary">{entry.title}</h4>
                    <div className="my-2 rounded-lg bg-background px-3 py-2 text-[0.85rem] font-semibold">{t("learn.pattern")} {entry.pattern}</div>
                    <p className="mb-3 text-[0.9rem] text-muted-foreground">{entry.summary}</p>
                    <div className="border-t border-dashed pt-2.5">
                      <label className="text-xs font-bold uppercase text-muted-foreground">{t("learn.example")}</label>
                      {entry.examples.map((ex, i) => (
                        <div key={i} className="mt-1">
                          <span className="font-serif text-xl font-bold">{ex.simplified}</span>
                          <span className="ml-2.5 text-[0.85rem] text-muted-foreground">({ex.pinyin})</span>
                          <p className="mt-0.5 text-[0.9rem]">{ex.english}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

