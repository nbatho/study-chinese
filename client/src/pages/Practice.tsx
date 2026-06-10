import { useMemo, useState } from "react";
import { useAddActivityMutation, useVocabularyQuery } from "../api";
import { Activity, ArrowLeft, CheckCircle2, Ear, Keyboard, Volume2, XCircle } from "lucide-react";

type Tool = "menu" | "tones" | "typing" | "listening";

export default function Practice() {
  const [activeTool, setActiveTool] = useState<Tool>("menu");

  return (
    <div className="anim-slide">
      {activeTool !== "menu" && (
        <button onClick={() => setActiveTool("menu")} style={{ display: "inline-flex", alignItems: "center", gap: "6px", border: "none", background: "none", color: "var(--primary-red)", fontWeight: 700, cursor: "pointer", marginBottom: "20px" }}>
          <ArrowLeft size={16} /> Back to Practice Suite
        </button>
      )}

      {activeTool === "menu" && (
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={{ textAlign: "left", marginBottom: "8px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Practice Suite</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Practice uses vocabulary and activity endpoints from the server.
            </p>
          </div>
          {[
            { id: "tones", title: "Tone Drill", desc: "Listen and identify Mandarin tone patterns", icon: Activity, color: "var(--tone-1)" },
            { id: "typing", title: "Pinyin Typing", desc: "Type pinyin for server vocabulary", icon: Keyboard, color: "var(--jade)" },
            { id: "listening", title: "Listening Check", desc: "Hear a word and choose the meaning", icon: Ear, color: "var(--tone-4)" },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <button key={tool.id} onClick={() => setActiveTool(tool.id as Tool)} className="card" style={{ display: "flex", alignItems: "center", gap: "20px", padding: "20px", cursor: "pointer", textAlign: "left", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)" }}>
                <span style={{ width: "52px", height: "52px", borderRadius: "14px", backgroundColor: tool.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                  <Icon size={26} />
                </span>
                <span>
                  <strong style={{ display: "block", fontSize: "1.1rem" }}>{tool.title}</strong>
                  <span style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "2px" }}>{tool.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {activeTool === "tones" && <ToneDrillTool />}
      {activeTool === "typing" && <PinyinTypingTool />}
      {activeTool === "listening" && <ListeningTool />}
    </div>
  );
}

function usePracticeWords() {
  const vocabQuery = useVocabularyQuery({ hsk: 1 });
  return {
    ...vocabQuery,
    words: vocabQuery.data?.vocab ?? [],
  };
}

function speak(text: string) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    window.speechSynthesis.speak(utterance);
  }
}

function ToneDrillTool() {
  const { words, isLoading } = usePracticeWords();
  const addActivity = useAddActivityMutation();
  const toneWords = useMemo(() => words.filter((word) => word.tones.length > 0).slice(0, 12), [words]);
  const [idx, setIdx] = useState(0);
  const [selectedTone, setSelectedTone] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const word = toneWords[idx % Math.max(toneWords.length, 1)];
  const correctTone = word?.tones[0] ?? 1;

  const check = async (tone: number) => {
    setSelectedTone(tone);
    setChecked(true);
    if (tone === correctTone) {
      await addActivity.mutateAsync({ xp: 5, exercisesCorrect: 1, exercisesTotal: 1 });
    } else {
      await addActivity.mutateAsync({ exercisesCorrect: 0, exercisesTotal: 1 });
    }
  };

  const next = () => {
    setIdx((value) => value + 1);
    setSelectedTone(null);
    setChecked(false);
  };

  if (isLoading || !word) {
    return <div className="card" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>Loading practice words...</div>;
  }

  return (
    <div className="card anim-pop" style={{ padding: "28px", textAlign: "center" }}>
      <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "8px" }}>Tone Drill</h3>
      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "20px" }}>Listen to the word and choose its first tone.</p>
      <div className="card" style={{ padding: "32px", marginBottom: "24px" }}>
        <h1 className="hanzi-text" style={{ fontSize: "4rem", color: "var(--primary-red)" }}>{word.simplified}</h1>
        <button className="btn btn-secondary" onClick={() => speak(word.simplified)} style={{ marginTop: "12px" }}>
          <Volume2 size={16} /> Listen
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "20px" }}>
        {[1, 2, 3, 4].map((tone) => {
          const isCorrect = checked && tone === correctTone;
          const isWrong = checked && selectedTone === tone && tone !== correctTone;
          return (
            <button key={tone} onClick={() => check(tone)} disabled={checked} style={{ padding: "16px", borderRadius: "12px", border: `2px solid ${isCorrect ? "var(--jade)" : isWrong ? "var(--tone-4)" : "var(--border-color)"}`, backgroundColor: isCorrect ? "rgba(16, 185, 129, 0.08)" : isWrong ? "rgba(239, 68, 68, 0.08)" : "var(--bg-card)", fontWeight: 800, color: isCorrect ? "var(--jade)" : isWrong ? "var(--tone-4)" : "var(--text-main)" }}>
              Tone {tone}
            </button>
          );
        })}
      </div>
      {checked && (
        <div className="anim-pop">
          <p style={{ fontWeight: 700, color: selectedTone === correctTone ? "var(--jade)" : "var(--tone-4)", marginBottom: "14px" }}>
            {selectedTone === correctTone ? "Correct!" : `Correct tone is ${correctTone}.`} {word.pinyin}
          </p>
          <button className="btn btn-primary" onClick={next}>Next Word</button>
        </div>
      )}
    </div>
  );
}

function PinyinTypingTool() {
  const { words, isLoading } = usePracticeWords();
  const addActivity = useAddActivityMutation();
  const typingWords = useMemo(() => words.filter((word) => word.pinyin.split(" ").length === 1), [words]);
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const word = typingWords[idx % Math.max(typingWords.length, 1)];

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word || checked) return;
    const cleanInput = typed.trim().toLowerCase();
    const cleanPinyin = word.pinyin.trim().toLowerCase();
    const cleanStandard = cleanPinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const isMatch = cleanInput === cleanPinyin || cleanInput === cleanStandard;
    setCorrect(isMatch);
    setChecked(true);
    await addActivity.mutateAsync({ xp: isMatch ? 10 : 0, exercisesCorrect: isMatch ? 1 : 0, exercisesTotal: 1 });
  };

  const handleNext = () => {
    setIdx((value) => value + 1);
    setTyped("");
    setChecked(false);
  };

  if (isLoading || !word) {
    return <div className="card" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>Loading practice words...</div>;
  }

  return (
    <div className="card anim-pop" style={{ padding: "28px", textAlign: "center" }}>
      <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "16px" }}>Pinyin Keyboard Typing</h3>
      <div className="card" style={{ padding: "36px", marginBottom: "24px" }}>
        <h1 className="hanzi-text" style={{ fontSize: "4rem", fontWeight: 800, color: "var(--primary-red)", marginBottom: "8px" }}>{word.simplified}</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Meaning: <strong>{word.english}</strong></p>
      </div>
      <form onSubmit={handleCheck} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <input type="text" placeholder="Type the pinyin..." value={typed} onChange={(e) => setTyped(e.target.value)} disabled={checked} style={{ padding: "16px", fontSize: "1.1rem", fontWeight: 700, borderRadius: "12px", border: "2px solid var(--border-color)", backgroundColor: "var(--bg-app)", color: "var(--text-main)", textAlign: "center", outline: "none" }} />
        {checked && (
          <div className="anim-pop" style={{ padding: "16px", borderRadius: "12px", backgroundColor: correct ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)", border: `1px solid ${correct ? "var(--jade)" : "var(--primary-red)"}`, color: correct ? "var(--jade)" : "var(--primary-red)", fontWeight: 700, fontSize: "0.95rem" }}>
            {correct ? "Correct! +10 XP" : `Incorrect. The correct pinyin is: ${word.pinyin}`}
          </div>
        )}
        {!checked ? (
          <button className="btn btn-primary" type="submit" disabled={!typed.trim()}>Check Typing</button>
        ) : (
          <button className="btn btn-primary" type="button" onClick={handleNext}>Next Character</button>
        )}
      </form>
    </div>
  );
}

function ListeningTool() {
  const { words, isLoading } = usePracticeWords();
  const addActivity = useAddActivityMutation();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const word = words[idx % Math.max(words.length, 1)];
  const options = useMemo(() => {
    if (!word) return [];
    const nearby = words.filter((item) => item.id !== word.id).slice(idx, idx + 3);
    return [...nearby, word].sort((a, b) => a.id.localeCompare(b.id));
  }, [idx, word, words]);

  const choose = async (wordId: string) => {
    if (!word) return;
    setSelected(wordId);
    setChecked(true);
    const isCorrect = wordId === word.id;
    await addActivity.mutateAsync({ xp: isCorrect ? 8 : 0, exercisesCorrect: isCorrect ? 1 : 0, exercisesTotal: 1 });
  };

  if (isLoading || !word) {
    return <div className="card" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>Loading listening words...</div>;
  }

  return (
    <div className="card anim-pop" style={{ padding: "28px", textAlign: "center" }}>
      <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "8px" }}>Listening Check</h3>
      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "20px" }}>Listen and choose the correct meaning.</p>
      <button className="btn btn-primary" onClick={() => speak(word.simplified)} style={{ borderRadius: "50%", width: "80px", height: "80px", padding: 0, marginBottom: "24px" }}>
        <Volume2 size={32} />
      </button>
      <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
        {options.map((option) => {
          const isCorrect = checked && option.id === word.id;
          const isWrong = checked && selected === option.id && option.id !== word.id;
          return (
            <button key={option.id} onClick={() => choose(option.id)} disabled={checked} style={{ padding: "16px", borderRadius: "12px", border: `2px solid ${isCorrect ? "var(--jade)" : isWrong ? "var(--tone-4)" : "var(--border-color)"}`, backgroundColor: isCorrect ? "rgba(16, 185, 129, 0.08)" : isWrong ? "rgba(239, 68, 68, 0.08)" : "var(--bg-card)", color: isCorrect ? "var(--jade)" : isWrong ? "var(--tone-4)" : "var(--text-main)", fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {option.english}
              {isCorrect && <CheckCircle2 size={18} />}
              {isWrong && <XCircle size={18} />}
            </button>
          );
        })}
      </div>
      {checked && (
        <button className="btn btn-primary" onClick={() => { setIdx((value) => value + 1); setSelected(null); setChecked(false); }}>
          Next Word
        </button>
      )}
    </div>
  );
}
