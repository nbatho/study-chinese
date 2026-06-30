import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useDailyContentQuery, useLessonsQuery } from "../../api";
import { Search } from "lucide-react";
import { useI18n } from "../../i18n";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";
import LoginPromptCard from "../../components/LoginPromptCard";
import LessonPath from "./components/LessonPath";
import LessonPlayer from "./components/LessonPlayer";

export default function Learn() {
  const { t } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const { selectedLessonId, setSelectedLessonId } = useOutletContext<{
    selectedLessonId: string | null;
    setSelectedLessonId: (lessonId: string | null) => void;
  }>();
  const lessonsQuery = useLessonsQuery(isAuthenticated);
  const dailyContentQuery = useDailyContentQuery(isAuthenticated);
  const [activeTab, setActiveTab] = useState<"curriculum" | "grammar">("curriculum");
  const [selectedHSK, setSelectedHSK] = useState<number>(1);
  const [grammarQuery, setGrammarQuery] = useState("");
  const lessons = lessonsQuery.data?.lessons ?? [];
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
              <div className="mb-5 flex gap-2.5">
                {[1, 2, 3].map((level) => (
                  <button key={level} onClick={() => setSelectedHSK(level)} className={cn("flex-1 rounded-xl border-2 bg-card p-3 font-extrabold transition", selectedHSK === level ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground")}>
                    HSK {level}
                  </button>
                ))}
              </div>
              <div className="mb-4 text-left text-[0.85rem] font-semibold text-muted-foreground">
                {t("learn.progress", { level: selectedHSK, percent: Math.round(levelLessons.length ? (levelLessons.filter((lesson) => lesson.completedAt).length / levelLessons.length) * 100 : 0) })}
              </div>
              <LessonPath lessons={levelLessons} onSelectLesson={setSelectedLessonId} />
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

