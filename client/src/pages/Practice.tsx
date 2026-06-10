import { useEffect, useMemo, useRef, useState } from "react";
import {
  useAddActivityMutation,
  useHanziStrokesQuery,
  useMinimalPairsQuery,
  useScoreShadowingMutation,
  useShadowingPromptsQuery,
  useVocabularyQuery,
} from "../api";
import type { HanziStrokeCharacter } from "../api/practice";
import { Activity, ArrowLeft, CheckCircle2, Ear, Keyboard, Mic, PencilLine, Sparkles, Volume2, XCircle } from "lucide-react";

type Tool = "menu" | "tones" | "pairs" | "typing" | "shadow" | "hanzi" | "listening";

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
              Practice tools now load prompts, pairs, and stroke data from the server.
            </p>
          </div>
          {[
            { id: "tones", title: "Tone Drill", desc: "Listen and identify Mandarin tone patterns", icon: Activity, color: "var(--tone-1)" },
            { id: "pairs", title: "Minimal Pairs", desc: "Distinguish similar-sounding syllables", icon: Ear, color: "var(--tone-4)" },
            { id: "typing", title: "Pinyin Typing", desc: "Type pinyin for server vocabulary", icon: Keyboard, color: "var(--jade)" },
            { id: "listening", title: "Listening Check", desc: "Hear a word and choose the meaning", icon: Volume2, color: "var(--primary-red)" },
            { id: "shadow", title: "Shadowing Practice", desc: "Speak along and receive server feedback", icon: Mic, color: "var(--tone-3)" },
            { id: "hanzi", title: "Hanzi Stroke Writing", desc: "Trace server-provided stroke guides", icon: PencilLine, color: "var(--gold)" },
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
      {activeTool === "pairs" && <MinimalPairsTool />}
      {activeTool === "typing" && <PinyinTypingTool />}
      {activeTool === "listening" && <ListeningTool />}
      {activeTool === "shadow" && <ShadowingTool />}
      {activeTool === "hanzi" && <HanziDrawingTool />}
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

function LoadingCard({ label }: { label: string }) {
  return <div className="card" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>{label}</div>;
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
    await addActivity.mutateAsync({ xp: tone === correctTone ? 5 : 0, exercisesCorrect: tone === correctTone ? 1 : 0, exercisesTotal: 1 });
  };

  if (isLoading || !word) return <LoadingCard label="Loading practice words..." />;

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
          <button className="btn btn-primary" onClick={() => { setIdx((value) => value + 1); setSelectedTone(null); setChecked(false); }}>Next Word</button>
        </div>
      )}
    </div>
  );
}

function MinimalPairsTool() {
  const pairsQuery = useMinimalPairsQuery();
  const addActivity = useAddActivityMutation();
  const pairs = pairsQuery.data?.pairs ?? [];
  const [pairIdx, setPairIdx] = useState(0);
  const [playedA, setPlayedA] = useState(false);
  const [userSelection, setUserSelection] = useState<"A" | "B" | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const activePair = pairs[pairIdx % Math.max(pairs.length, 1)];

  useEffect(() => {
    setPlayedA((pairIdx + activePair?.id.length) % 2 === 0);
    setUserSelection(null);
    setIsAnswerChecked(false);
  }, [activePair?.id.length, pairIdx]);

  if (pairsQuery.isLoading || !activePair) return <LoadingCard label="Loading minimal pairs from server..." />;

  const speakActiveWord = () => speak(playedA ? activePair.charA : activePair.charB);

  const checkAnswer = async (selection: "A" | "B") => {
    if (isAnswerChecked) return;
    setUserSelection(selection);
    const isCorrect = (selection === "A" && playedA) || (selection === "B" && !playedA);
    if (isCorrect) setCorrectCount((prev) => prev + 1);
    setIsAnswerChecked(true);
    await addActivity.mutateAsync({ xp: isCorrect ? 5 : 0, exercisesCorrect: isCorrect ? 1 : 0, exercisesTotal: 1 });
  };

  return (
    <div className="card anim-pop" style={{ padding: "28px", textAlign: "center" }}>
      <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "4px" }}>Minimal Pairs Drill</h3>
      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Correct: {correctCount}</span>
      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "12px 0 24px" }}>Listen to the spoken word and select which syllable you heard.</p>
      <div className="card" style={{ padding: "32px", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "16px", marginBottom: "28px", width: "100%" }}>
        <button className="btn btn-primary" onClick={speakActiveWord} style={{ borderRadius: "50%", width: "80px", height: "80px", padding: 0 }}>
          <Volume2 size={32} />
        </button>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Drill: {activePair.label}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
        {[
          { key: "A", pinyin: activePair.wordA, char: activePair.charA, isCorrect: playedA },
          { key: "B", pinyin: activePair.wordB, char: activePair.charB, isCorrect: !playedA },
        ].map((opt) => {
          const isWrong = isAnswerChecked && userSelection === opt.key && !opt.isCorrect;
          const borderCol = isAnswerChecked && opt.isCorrect ? "var(--jade)" : isWrong ? "var(--primary-red)" : "var(--border-color)";
          const bgCol = isAnswerChecked && opt.isCorrect ? "rgba(16, 185, 129, 0.08)" : isWrong ? "rgba(239, 68, 68, 0.08)" : "var(--bg-card)";
          const txtCol = isAnswerChecked && opt.isCorrect ? "var(--jade)" : isWrong ? "var(--primary-red)" : "var(--text-main)";
          return (
            <button key={opt.key} onClick={() => checkAnswer(opt.key as "A" | "B")} disabled={isAnswerChecked} style={{ padding: "24px 16px", borderRadius: "16px", border: `2px solid ${borderCol}`, backgroundColor: bgCol, color: txtCol, cursor: isAnswerChecked ? "default" : "pointer" }}>
              <span className="hanzi-text" style={{ fontSize: "2rem", display: "block", fontWeight: 700 }}>{opt.char}</span>
              <span style={{ fontSize: "1.1rem", fontWeight: 800, marginTop: "4px", display: "block" }}>{opt.pinyin}</span>
            </button>
          );
        })}
      </div>
      {isAnswerChecked && <button className="btn btn-primary" onClick={() => setPairIdx((value) => value + 1)} style={{ width: "100%" }}>Next Pair</button>}
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

  if (isLoading || !word) return <LoadingCard label="Loading practice words..." />;

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
          <button className="btn btn-primary" type="button" onClick={() => { setIdx((value) => value + 1); setTyped(""); setChecked(false); }}>Next Character</button>
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

  if (isLoading || !word) return <LoadingCard label="Loading listening words..." />;

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
      {checked && <button className="btn btn-primary" onClick={() => { setIdx((value) => value + 1); setSelected(null); setChecked(false); }}>Next Word</button>}
    </div>
  );
}

function ShadowingTool() {
  const promptsQuery = useShadowingPromptsQuery();
  const scoreMutation = useScoreShadowingMutation();
  const addActivity = useAddActivityMutation();
  const prompts = promptsQuery.data?.prompts ?? [];
  const [idx, setIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [score, setScore] = useState<Awaited<ReturnType<typeof scoreMutation.mutateAsync>>["score"] | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const prompt = prompts[idx % Math.max(prompts.length, 1)];

  useEffect(() => {
    if (!recording || !canvasRef.current) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgb(217, 63, 71)";
      const barWidth = 4;
      const gap = 2;
      const count = Math.floor(canvas.width / (barWidth + gap));
      for (let i = 0; i < count; i += 1) {
        const height = Math.random() * (canvas.height - 20) + 10;
        const x = i * (barWidth + gap);
        const y = (canvas.height - height) / 2;
        ctx.fillRect(x, y, barWidth, height);
      }
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  }, [recording]);

  if (promptsQuery.isLoading || !prompt) return <LoadingCard label="Loading shadowing prompts from server..." />;

  const stopRecord = async () => {
    setRecording(false);
    const result = await scoreMutation.mutateAsync({ promptId: prompt.id });
    setScore(result.score);
    await addActivity.mutateAsync({ xp: 15, minutes: 1, exercisesCorrect: result.score.overall >= 80 ? 1 : 0, exercisesTotal: 1 });
  };

  const startRecord = () => {
    setRecording(true);
    setScore(null);
    window.setTimeout(() => {
      void stopRecord();
    }, 2500);
  };

  return (
    <div className="card anim-pop" style={{ padding: "28px", textAlign: "center" }}>
      <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "16px" }}>Shadowing & Pronunciation</h3>
      <div className="card" style={{ padding: "28px", marginBottom: "24px", textAlign: "center" }}>
        <h1 className="hanzi-text" style={{ fontSize: "3rem", fontWeight: 800, color: "var(--primary-red)" }}>{prompt.hanzi}</h1>
        <p style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 500, margin: "4px 0" }}>{prompt.pinyin}</p>
        <p style={{ fontSize: "0.9rem", color: "var(--text-main)", fontWeight: 600 }}>"{prompt.english}"</p>
        <button className="btn btn-secondary" onClick={() => speak(prompt.hanzi)} style={{ marginTop: "16px", padding: "8px 16px", fontSize: "0.8rem" }}>
          <Volume2 size={16} /> Listen Sample
        </button>
      </div>
      {recording && (
        <div style={{ marginBottom: "20px" }}>
          <canvas ref={canvasRef} width={280} height={60} style={{ width: "100%", height: "60px" }} />
          <span style={{ fontSize: "0.75rem", color: "var(--primary-red)", fontWeight: 700 }}>RECORDING VOICE...</span>
        </div>
      )}
      {score && (
        <div className="anim-pop" style={{ marginBottom: "24px", textAlign: "left" }}>
          <div className="card" style={{ border: "1px dashed var(--jade)", backgroundColor: "rgba(16, 185, 129, 0.03)" }}>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--jade)", marginBottom: "12px", display: "flex", gap: "8px" }}>
              <Sparkles size={20} /> Pronunciation: {score.overall >= 90 ? "Excellent" : "Great"}
            </h4>
            {[
              { label: "Accuracy", val: score.accuracy, col: "var(--tone-1)" },
              { label: "Tones", val: score.tones, col: "var(--tone-3)" },
              { label: "Fluency", val: score.fluency, col: "var(--tone-2)" },
            ].map((bar) => (
              <div key={bar.label} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "2px" }}>
                  <span>{bar.label}</span>
                  <span>{bar.val}%</span>
                </div>
                <div style={{ width: "100%", height: "6px", backgroundColor: "var(--border-color)", borderRadius: "3px" }}>
                  <div style={{ width: `${bar.val}%`, height: "100%", backgroundColor: bar.col, borderRadius: "3px" }} />
                </div>
              </div>
            ))}
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }}>{score.tip}</p>
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: "12px" }}>
        {!recording ? (
          <button className="btn btn-primary recording-pulse" onClick={startRecord} disabled={scoreMutation.isPending} style={{ flex: 1 }}>
            Start Speak
          </button>
        ) : (
          <button className="btn btn-primary" onClick={stopRecord} style={{ flex: 1, backgroundColor: "var(--jade)", backgroundImage: "none" }}>
            Stop
          </button>
        )}
        {score && (
          <button className="btn btn-secondary" onClick={() => { setIdx((value) => value + 1); setScore(null); }} style={{ flex: 0.5 }}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

function HanziDrawingTool() {
  const strokesQuery = useHanziStrokesQuery();
  const addActivity = useAddActivityMutation();
  const characters = strokesQuery.data?.characters ?? [];
  const [charIdx, setCharIdx] = useState(0);
  const [activeStrokeIdx, setActiveStrokeIdx] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const current = characters[charIdx % Math.max(characters.length, 1)];

  useEffect(() => {
    if (current) drawBackground(current, activeStrokeIdx, canvasRef.current);
  }, [activeStrokeIdx, current]);

  if (strokesQuery.isLoading || !current) return <LoadingCard label="Loading stroke data from server..." />;

  const handleNext = () => {
    setCharIdx((prev) => prev + 1);
    setActiveStrokeIdx(0);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    isDrawingRef.current = true;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "rgb(217, 63, 71)";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleCanvasMouseUp = async () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (activeStrokeIdx + 1 < current.strokes.length) {
      setActiveStrokeIdx((prev) => prev + 1);
      return;
    }
    await addActivity.mutateAsync({ xp: 10, exercisesCorrect: 1, exercisesTotal: 1 });
    alert(`Character "${current.character}" complete! +10 XP awarded.`);
    handleNext();
  };

  return (
    <div className="card anim-pop" style={{ padding: "28px", textAlign: "center" }}>
      <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "4px" }}>Hanzi Stroke Writing</h3>
      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
        Character: <strong style={{ color: "var(--primary-red)" }}>{current.character}</strong> · Stroke {activeStrokeIdx + 1} of {current.strokes.length}
      </span>
      <div style={{ display: "flex", justifyContent: "center", margin: "24px 0" }}>
        <canvas ref={canvasRef} width={280} height={280} onMouseDown={handleCanvasMouseDown} onMouseMove={handleCanvasMouseMove} onMouseUp={() => void handleCanvasMouseUp()} onMouseLeave={() => void handleCanvasMouseUp()} style={{ border: "2px solid var(--border-color)", borderRadius: "16px", backgroundColor: "var(--bg-card)", cursor: "crosshair" }} />
      </div>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button className="btn btn-secondary" onClick={() => { setActiveStrokeIdx(0); drawBackground(current, 0, canvasRef.current); }}>Reset Canvas</button>
        <button className="btn btn-primary" onClick={handleNext}>Skip Word</button>
      </div>
    </div>
  );
}

function drawBackground(character: HanziStrokeCharacter, activeStrokeIdx: number, canvas: HTMLCanvasElement | null) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(217, 63, 71, 0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(canvas.width, canvas.height);
  ctx.moveTo(canvas.width, 0); ctx.lineTo(0, canvas.height);
  ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
  ctx.strokeStyle = document.body.classList.contains("dark") ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  character.strokes.forEach((path) => drawSvgPathOnCanvas(ctx, path, canvas.width, canvas.height));
  ctx.strokeStyle = "rgba(242, 191, 76, 0.35)";
  drawSvgPathOnCanvas(ctx, character.strokes[activeStrokeIdx], canvas.width, canvas.height);
}

function drawSvgPathOnCanvas(ctx: CanvasRenderingContext2D, path: string, w: number, h: number) {
  const tokens = path.split(" ");
  ctx.beginPath();
  tokens.forEach((tok) => {
    if (tok.startsWith("M")) {
      const [x, y] = tok.slice(1).split(",").map(Number);
      ctx.moveTo((x / 100) * w, (y / 100) * h);
    } else if (tok.startsWith("L")) {
      const [x, y] = tok.slice(1).split(",").map(Number);
      ctx.lineTo((x / 100) * w, (y / 100) * h);
    }
  });
  ctx.stroke();
}
