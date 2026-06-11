import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useDailyContentQuery, useLessonDetailQuery, useLessonsQuery } from "../api";
import { useCompleteLessonMutation } from "../api/lessons/queries";
import type { LessonDetail } from "../api/lessons";
import { ArrowLeft, Award, BookOpen, CheckCircle2, Search, ToggleLeft, ToggleRight, Volume2, XCircle } from "lucide-react";

export default function Learn() {
  const { selectedLessonId, setSelectedLessonId } = useOutletContext<{
    selectedLessonId: string | null;
    setSelectedLessonId: (lessonId: string | null) => void;
  }>();
  const lessonsQuery = useLessonsQuery();
  const dailyContentQuery = useDailyContentQuery();
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

  return (
    <div className="anim-slide">
      {selectedLessonId ? (
        <LessonPlayer lessonId={selectedLessonId} onClose={() => setSelectedLessonId(null)} />
      ) : (
        <>
          <div style={{ display: "flex", borderRadius: "12px", backgroundColor: "var(--bg-card-hover)", padding: "4px", marginBottom: "24px", border: "1px solid var(--border-color)" }}>
            {[
              { id: "curriculum", label: "Curriculum Path" },
              { id: "grammar", label: "Grammar Library" },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "8px", backgroundColor: activeTab === tab.id ? "var(--bg-card)" : "transparent", color: activeTab === tab.id ? "var(--primary-red)" : "var(--text-muted)", fontWeight: 700, cursor: "pointer" }}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "curriculum" ? (
            <div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                {[1, 2, 3].map((level) => (
                  <button key={level} onClick={() => setSelectedHSK(level)} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: `2px solid ${selectedHSK === level ? "var(--primary-red)" : "var(--border-color)"}`, backgroundColor: selectedHSK === level ? "rgba(217, 63, 71, 0.04)" : "var(--bg-card)", color: selectedHSK === level ? "var(--primary-red)" : "var(--text-main)", fontWeight: 800, cursor: "pointer" }}>
                    HSK {level}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "16px", fontWeight: 600, textAlign: "left" }}>
                HSK {selectedHSK} Progress: {Math.round(levelLessons.length ? (levelLessons.filter((lesson) => lesson.completedAt).length / levelLessons.length) * 100 : 0)}%
              </div>
              <div style={{ display: "grid", gap: "14px" }}>
                {levelLessons.map((lesson) => {
                  const isCompleted = !!lesson.completedAt;
                  return (
                    <div key={lesson.id} onClick={() => setSelectedLessonId(lesson.id)} className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px", cursor: "pointer", borderLeft: isCompleted ? "4px solid var(--jade)" : "4px solid var(--border-color)" }}>
                      <div style={{ textAlign: "left" }}>
                        <span style={{ fontSize: "0.75rem", color: isCompleted ? "var(--jade)" : "var(--primary-red)", fontWeight: 700 }}>
                          Lesson {lesson.order} · {lesson.skill.toUpperCase()}
                        </span>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: 800, marginTop: "2px" }}>{lesson.title}</h4>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "2px" }}>{lesson.subtitle}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {isCompleted && (
                          <span style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "var(--jade)", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>
                            {Math.round(lesson.bestAccuracy)}% Acc
                          </span>
                        )}
                        <BookOpen size={20} className={isCompleted ? "tone-t2" : "tone-t4"} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="anim-slide">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px", borderRadius: "12px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", marginBottom: "20px" }}>
                <Search size={18} style={{ color: "var(--text-muted)" }} />
                <input type="text" placeholder="Search grammar guides..." value={grammarQuery} onChange={(e) => setGrammarQuery(e.target.value)} style={{ border: "none", background: "none", outline: "none", width: "100%", fontSize: "0.95rem", color: "var(--text-main)" }} />
              </div>
              <div style={{ display: "grid", gap: "16px" }}>
                {filteredGrammar.map((entry) => (
                  <div key={entry.id} className="card" style={{ textAlign: "left" }}>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--primary-red)" }}>{entry.title}</h4>
                    <div style={{ backgroundColor: "var(--bg-app)", padding: "8px 12px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600, margin: "8px 0" }}>Pattern: {entry.pattern}</div>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "12px" }}>{entry.summary}</p>
                    <div style={{ borderTop: "1px dashed var(--border-color)", paddingTop: "10px" }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>Example:</label>
                      {entry.examples.map((ex, i) => (
                        <div key={i} style={{ marginTop: "4px" }}>
                          <span className="hanzi-text" style={{ fontSize: "1.25rem", color: "var(--text-main)", fontWeight: 700 }}>{ex.simplified}</span>
                          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginLeft: "10px" }}>({ex.pinyin})</span>
                          <p style={{ fontSize: "0.9rem", color: "var(--text-main)", marginTop: "2px" }}>{ex.english}</p>
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

function LessonPlayer({ lessonId, onClose }: { lessonId: string; onClose: () => void }) {
  const lessonQuery = useLessonDetailQuery(lessonId);
  const completeLessonMutation = useCompleteLessonMutation(lessonId);
  const lesson = lessonQuery.data?.lesson;
  const [stage, setStage] = useState<"intro" | "dialogue" | "exercises" | "completed">("intro");
  const [showPinyin, setShowPinyin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [arrangedWords, setArrangedWords] = useState<string[]>([]);

  const currentExercise = lesson?.exercises[exerciseIdx];
  const exerciseCount = lesson?.exercises.length ?? 0;
  const finalAccuracy = exerciseCount ? Math.round((correctAnswersCount / exerciseCount) * 100) : 0;

  const playLineAudio = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      window.speechSynthesis.speak(utterance);
    }
  };

  const initExerciseState = () => {
    setSelectedOptionIdx(null);
    setIsAnswerChecked(false);
    setArrangedWords([]);
  };

  const handleStart = () => {
    if (!lesson) return;
    if (lesson.dialogue) {
      setStage("dialogue");
    } else {
      setStage("exercises");
      initExerciseState();
    }
  };

  const handleCheckAnswer = () => {
    if (!currentExercise) return;
    if (selectedOptionIdx === null && arrangedWords.length === 0 && currentExercise.kind === "arrangeSentence") return;
    const correct = currentExercise.kind === "arrangeSentence"
      ? arrangedWords.join("") === currentExercise.correctText.replace(/\s+/g, "")
      : selectedOptionIdx === currentExercise.correctIndex;
    if (correct) setCorrectAnswersCount((prev) => prev + 1);
    setIsAnswerChecked(true);
    if (currentExercise.audioWordId || currentExercise.kind === "listening") {
      playLineAudio(currentExercise.correctText);
    }
  };

  const handleNextExercise = async () => {
    if (!lesson) return;
    if (exerciseIdx + 1 < lesson.exercises.length) {
      setExerciseIdx((prev) => prev + 1);
      initExerciseState();
      return;
    }
    await completeLessonMutation.mutateAsync({ accuracy: finalAccuracy, minutes: lesson.estimatedMinutes });
    setStage("completed");
  };

  const handleWordArrangeToggle = (word: string) => {
    if (isAnswerChecked) return;
    setArrangedWords((prev) => prev.includes(word) ? prev.filter((item) => item !== word) : [...prev, word]);
  };

  if (lessonQuery.isLoading || !lesson) {
    return <div className="card" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>Loading lesson from server...</div>;
  }

  return (
    <div className="card anim-pop" style={{ maxWidth: "640px", margin: "0 auto", padding: "24px", borderRadius: "20px" }}>
      {stage === "intro" && (
        <div className="anim-slide">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-muted)" }}>
              <ArrowLeft size={20} />
            </button>
            <span style={{ fontSize: "0.8rem", color: "var(--primary-red)", fontWeight: 700 }}>HSK {lesson.hskLevel} · Curriculum Path</span>
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, textAlign: "left" }}>{lesson.title}</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "left", marginBottom: "16px" }}>{lesson.subtitle}</p>
          <div style={{ backgroundColor: "var(--bg-app)", padding: "16px", borderRadius: "12px", fontSize: "0.9rem", color: "var(--text-main)", textAlign: "left", lineHeight: 1.6, marginBottom: "24px" }}>
            {lesson.intro}
          </div>
          <WordList lesson={lesson} playLineAudio={playLineAudio} />
          {lesson.grammar.length > 0 && (
            <div style={{ textAlign: "left", marginBottom: "32px" }}>
              <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px" }}>Target Grammar Structures</h4>
              {lesson.grammar.map((gp) => (
                <div key={gp.id} style={{ marginBottom: "12px" }}>
                  <div style={{ fontWeight: 700, color: "var(--primary-red)" }}>{gp.pattern}</div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "2px" }}>{gp.explanation}</p>
                </div>
              ))}
            </div>
          )}
          <button className="btn btn-primary" onClick={handleStart} style={{ width: "100%" }}>Start Lesson</button>
        </div>
      )}

      {stage === "dialogue" && lesson.dialogue && (
        <div className="anim-slide">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, textAlign: "left" }}>Dialogue: {lesson.dialogue.title}</h3>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setShowPinyin(!showPinyin)} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", color: showPinyin ? "var(--primary-red)" : "var(--text-muted)" }}>
                Pinyin {showPinyin ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </button>
              <button onClick={() => setShowTranslation(!showTranslation)} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", color: showTranslation ? "var(--primary-red)" : "var(--text-muted)" }}>
                English {showTranslation ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </button>
            </div>
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic", textAlign: "left", marginBottom: "20px" }}>Scenario: {lesson.dialogue.scenario}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px", maxHeight: "360px", overflowY: "auto", padding: "10px" }}>
            {lesson.dialogue.lines.map((line) => (
              <div key={line.id} onClick={() => playLineAudio(line.simplified)} style={{ alignSelf: line.isUser ? "flex-end" : "flex-start", maxWidth: "80%", padding: "12px 16px", borderRadius: "16px", borderTopLeftRadius: line.isUser ? "16px" : "4px", borderTopRightRadius: line.isUser ? "4px" : "16px", backgroundColor: line.isUser ? "rgba(217, 63, 71, 0.08)" : "var(--bg-card-hover)", border: "1px solid var(--border-color)", cursor: "pointer", textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--text-muted)" }}>{line.speaker}</span>
                  <Volume2 size={12} style={{ color: "var(--text-muted)" }} />
                </div>
                <h3 className="hanzi-text" style={{ fontSize: "1.45rem", fontWeight: 700, color: "var(--text-main)" }}>{line.simplified}</h3>
                {showPinyin && <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "2px" }}>{line.pinyin}</div>}
                {showTranslation && <p style={{ fontSize: "0.85rem", color: "var(--text-main)", borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: "4px", marginTop: "6px" }}>{line.english}</p>}
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => { setStage("exercises"); initExerciseState(); }} style={{ width: "100%" }}>Go to Exercises</button>
        </div>
      )}

      {stage === "exercises" && currentExercise && (
        <div className="anim-slide">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>Question {exerciseIdx + 1} of {lesson.exercises.length}</span>
            <span style={{ fontSize: "0.8rem", color: "var(--jade)", fontWeight: 700 }}>Score: {correctAnswersCount}</span>
          </div>
          <div className="card" style={{ marginBottom: "24px", textAlign: "center", padding: "30px 20px" }}>
            <h4 style={{ fontSize: "1rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "12px" }}>{currentExercise.kind}</h4>
            {currentExercise.kind === "listening" && (
              <button className="btn btn-secondary" onClick={() => playLineAudio(currentExercise.correctText)} style={{ padding: "16px 24px", borderRadius: "50%", width: "80px", height: "80px", marginBottom: "20px" }}>
                <Volume2 size={36} />
              </button>
            )}
            {currentExercise.promptHanzi && <h2 className="hanzi-text" style={{ fontSize: "2.8rem", fontWeight: 800, color: "var(--primary-red)", marginBottom: "8px" }}>{currentExercise.promptHanzi}</h2>}
            {currentExercise.promptPinyin && <p style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "8px" }}>{currentExercise.promptPinyin}</p>}
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>{currentExercise.prompt}</h3>
          </div>
          <div style={{ display: "grid", gap: "10px", marginBottom: "28px" }}>
            {currentExercise.kind === "arrangeSentence" ? (
              <ArrangeExercise options={currentExercise.options || []} arrangedWords={arrangedWords} isAnswerChecked={isAnswerChecked} onToggle={handleWordArrangeToggle} />
            ) : (
              (currentExercise.options || []).map((option, idx) => {
                const isSelected = selectedOptionIdx === idx;
                let borderCol = isSelected ? "var(--primary-red)" : "var(--border-color)";
                let bgCol = isSelected ? "rgba(217, 63, 71, 0.04)" : "var(--bg-card)";
                let txtCol = "var(--text-main)";
                if (isAnswerChecked) {
                  if (idx === currentExercise.correctIndex) {
                    borderCol = "var(--jade)";
                    bgCol = "rgba(16, 185, 129, 0.08)";
                    txtCol = "var(--jade)";
                  } else if (isSelected) {
                    borderCol = "var(--primary-red)";
                    bgCol = "rgba(239, 68, 68, 0.08)";
                    txtCol = "var(--primary-red)";
                  }
                }
                return (
                  <button key={idx} disabled={isAnswerChecked} onClick={() => setSelectedOptionIdx(idx)} style={{ padding: "16px 20px", borderRadius: "14px", border: `2px solid ${borderCol}`, backgroundColor: bgCol, color: txtCol, fontSize: "1rem", fontWeight: 600, cursor: isAnswerChecked ? "default" : "pointer", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>{option}</span>
                    {isAnswerChecked && idx === currentExercise.correctIndex && <CheckCircle2 size={18} />}
                    {isAnswerChecked && isSelected && idx !== currentExercise.correctIndex && <XCircle size={18} />}
                  </button>
                );
              })
            )}
          </div>
          {isAnswerChecked && (
            <div className="anim-pop" style={{ padding: "16px", borderRadius: "12px", backgroundColor: "var(--bg-card-hover)", border: "1px solid var(--border-color)", marginBottom: "24px", textAlign: "left" }}>
              <h5 style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>Correct match</h5>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}><strong>{currentExercise.correctText}</strong></p>
            </div>
          )}
          {!isAnswerChecked ? (
            <button className="btn btn-primary" disabled={selectedOptionIdx === null && arrangedWords.length === 0 && currentExercise.kind === "arrangeSentence"} onClick={handleCheckAnswer} style={{ width: "100%" }}>Check Answer</button>
          ) : (
            <button className="btn btn-primary" onClick={handleNextExercise} disabled={completeLessonMutation.isPending} style={{ width: "100%", backgroundColor: "var(--jade)", backgroundImage: "none", boxShadow: "none" }}>
              {exerciseIdx + 1 === lesson.exercises.length ? "Finish Lesson" : "Next Question"}
            </button>
          )}
        </div>
      )}

      {stage === "completed" && (
        <div className="anim-slide" style={{ textAlign: "center", padding: "20px 0" }}>
          <Award size={72} style={{ color: "var(--gold)", marginBottom: "16px" }} />
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Lesson Completed!</h2>
          <p style={{ color: "var(--text-muted)", margin: "8px 0 24px" }}>You finished the lesson: <strong>{lesson.title}</strong></p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", maxWidth: "320px", margin: "0 auto 36px" }}>
            <div className="card" style={{ padding: "16px 8px" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>XP REWARD</span>
              <h3 style={{ fontSize: "1.5rem", color: "var(--gold)", fontWeight: 800, marginTop: "4px" }}>+{lesson.xpReward}</h3>
            </div>
            <div className="card" style={{ padding: "16px 8px" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>ACCURACY</span>
              <h3 style={{ fontSize: "1.5rem", color: "var(--jade)", fontWeight: 800, marginTop: "4px" }}>{finalAccuracy}%</h3>
            </div>
          </div>
          <WordList lesson={lesson} playLineAudio={playLineAudio} compact />
          <button className="btn btn-primary" onClick={onClose} style={{ maxWidth: "240px", width: "100%", marginTop: "24px" }}>Back to Path</button>
        </div>
      )}
    </div>
  );
}

function WordList({ lesson, playLineAudio, compact = false }: { lesson: LessonDetail; playLineAudio: (text: string) => void; compact?: boolean }) {
  return (
    <div style={{ textAlign: "left", marginBottom: compact ? 0 : "24px" }}>
      <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px" }}>
        {compact ? "Words enrolled in SRS reviews" : "New Words in This Lesson"}
      </h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: compact ? "center" : "flex-start" }}>
        {lesson.newWords.map((word) => (
          <button key={word.id} onClick={() => playLineAudio(word.simplified)} style={{ padding: "8px 12px", borderRadius: "10px", backgroundColor: "var(--bg-card-hover)", border: "1px solid var(--border-color)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <span className="hanzi-text" style={{ fontSize: "1.1rem", fontWeight: 700 }}>{word.simplified}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>({word.pinyin})</span>
            <Volume2 size={12} className="tone-t1" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ArrangeExercise({ options, arrangedWords, isAnswerChecked, onToggle }: { options: string[]; arrangedWords: string[]; isAnswerChecked: boolean; onToggle: (word: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ padding: "16px", borderRadius: "12px", minHeight: "56px", border: "2px dashed var(--border-color)", backgroundColor: "var(--bg-app)", display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
        {arrangedWords.map((word, i) => (
          <button key={`${word}-${i}`} onClick={() => onToggle(word)} className="hanzi-text anim-pop" style={{ padding: "6px 12px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "8px", fontSize: "1.25rem", fontWeight: 700, cursor: "pointer" }}>
            {word}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        {options.map((word, idx) => {
          const isSelected = arrangedWords.includes(word);
          return (
            <button key={`${word}-${idx}`} disabled={isSelected || isAnswerChecked} onClick={() => onToggle(word)} className="hanzi-text" style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid var(--border-color)", backgroundColor: isSelected ? "transparent" : "var(--bg-card)", color: isSelected ? "transparent" : "var(--text-main)", fontSize: "1.25rem", fontWeight: 700, cursor: isSelected ? "default" : "pointer", opacity: isSelected ? 0.25 : 1 }}>
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
}
