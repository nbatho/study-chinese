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
import { toast } from "sonner";
import { useI18n } from "../i18n";
import { cn } from "../utils/cn";
import LoadingCard from "../components/LoadingCard";
import TtsButton from "../components/TtsButton";
import { speakChinese } from "../utils/tts";

type Tool = "menu" | "tones" | "pairs" | "typing" | "shadow" | "hanzi" | "listening";

const panelClass = "anim-pop rounded-lg border bg-card p-5 text-center shadow-sm sm:p-7";
const innerCardClass = "rounded-lg border bg-card shadow-sm";
const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";
const secondaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition hover:bg-accent disabled:opacity-60";

export default function Practice() {
  const { t } = useI18n();
  const [activeTool, setActiveTool] = useState<Tool>("menu");

  return (
    <div className="anim-slide">
      {activeTool !== "menu" && (
        <button onClick={() => setActiveTool("menu")} className="mb-5 inline-flex items-center gap-1.5 font-bold text-primary">
          <ArrowLeft size={16} /> {t("practice.back")}
        </button>
      )}

      {activeTool === "menu" && (
        <div className="grid gap-4">
          <div className="mb-2 text-left">
            <h2 className="text-2xl font-extrabold">{t("practice.title")}</h2>
            <p className="text-[0.9rem] text-muted-foreground">
              {t("practice.subtitle")}
            </p>
          </div>
          {[
            { id: "tones", title: t("practice.tones"), desc: t("practice.tonesDesc"), icon: Activity, cls: "bg-tone-1" },
            { id: "pairs", title: t("practice.pairs"), desc: t("practice.pairsDesc"), icon: Ear, cls: "bg-tone-4" },
            { id: "typing", title: t("practice.typing"), desc: t("practice.typingDesc"), icon: Keyboard, cls: "bg-jade" },
            { id: "listening", title: t("practice.listening"), desc: t("practice.listeningDesc"), icon: Volume2, cls: "bg-primary" },
            { id: "shadow", title: t("practice.shadow"), desc: t("practice.shadowDesc"), icon: Mic, cls: "bg-tone-3" },
            { id: "hanzi", title: t("practice.hanzi"), desc: t("practice.hanziDesc"), icon: PencilLine, cls: "bg-gold" },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <button key={tool.id} onClick={() => setActiveTool(tool.id as Tool)} className="flex cursor-pointer items-center gap-4 rounded-lg border bg-card p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:gap-5 sm:p-5">
                <span className={cn("flex size-[52px] shrink-0 items-center justify-center rounded-[14px] text-white", tool.cls)}>
                  <Icon size={26} />
                </span>
                <span className="min-w-0">
                  <strong className="block text-[1.1rem]">{tool.title}</strong>
                  <span className="mt-0.5 block text-[0.85rem] text-muted-foreground">{tool.desc}</span>
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
    <div className={panelClass}>
      <h3 className="mb-2 text-[1.3rem] font-extrabold">Tone Drill</h3>
      <p className="mb-5 text-[0.85rem] text-muted-foreground">Listen to the word and choose its first tone.</p>
      <div className={cn(innerCardClass, "mb-6 p-8")}>
        <h1 className="font-serif text-6xl text-primary">{word.simplified}</h1>
        <TtsButton text={word.simplified} className={cn(secondaryButtonClass, "mt-3 px-4 py-2")}>
          Listen
        </TtsButton>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[1, 2, 3, 4].map((tone) => {
          const isCorrect = checked && tone === correctTone;
          const isWrong = checked && selectedTone === tone && tone !== correctTone;
          return (
            <button key={tone} onClick={() => check(tone)} disabled={checked} className={cn("rounded-xl border-2 p-4 font-extrabold", isCorrect ? "border-jade bg-jade/10 text-jade" : isWrong ? "border-tone-4 bg-tone-4/10 text-tone-4" : "border-border bg-card text-foreground")}>
              Tone {tone}
            </button>
          );
        })}
      </div>
      {checked && (
        <div className="anim-pop">
          <p className={cn("mb-3.5 font-bold", selectedTone === correctTone ? "text-jade" : "text-tone-4")}>
            {selectedTone === correctTone ? "Correct!" : `Correct tone is ${correctTone}.`} {word.pinyin}
          </p>
          <button className={primaryButtonClass} onClick={() => { setIdx((value) => value + 1); setSelectedTone(null); setChecked(false); }}>Next Word</button>
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
  const [userSelection, setUserSelection] = useState<"A" | "B" | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const activePair = pairs[pairIdx % Math.max(pairs.length, 1)];
  const playedA = (pairIdx + (activePair?.id.length ?? 0)) % 2 === 0;

  if (pairsQuery.isLoading || !activePair) return <LoadingCard label="Loading minimal pairs from server..." />;

  const speakActiveWord = () => speakChinese(playedA ? activePair.charA : activePair.charB);

  const checkAnswer = async (selection: "A" | "B") => {
    if (isAnswerChecked) return;
    setUserSelection(selection);
    const isCorrect = (selection === "A" && playedA) || (selection === "B" && !playedA);
    if (isCorrect) setCorrectCount((prev) => prev + 1);
    setIsAnswerChecked(true);
    await addActivity.mutateAsync({ xp: isCorrect ? 5 : 0, exercisesCorrect: isCorrect ? 1 : 0, exercisesTotal: 1 });
  };

  const goToNextPair = () => {
    setPairIdx((value) => value + 1);
    setUserSelection(null);
    setIsAnswerChecked(false);
  };

  return (
    <div className={panelClass}>
      <h3 className="mb-1 text-[1.3rem] font-extrabold">Minimal Pairs Drill</h3>
      <span className="text-[0.8rem] font-semibold text-muted-foreground">Correct: {correctCount}</span>
      <p className="mb-6 mt-3 text-[0.85rem] text-muted-foreground">Listen to the spoken word and select which syllable you heard.</p>
      <div className={cn(innerCardClass, "mb-7 inline-flex w-full flex-col items-center gap-4 p-8")}>
        <button className={cn(primaryButtonClass, "size-20 rounded-full p-0")} onClick={speakActiveWord}>
          <Volume2 size={32} />
        </button>
        <span className="text-[0.85rem] font-bold uppercase text-muted-foreground">Drill: {activePair.label}</span>
      </div>
      <div className="mb-7 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
        {[
          { key: "A", pinyin: activePair.wordA, char: activePair.charA, isCorrect: playedA },
          { key: "B", pinyin: activePair.wordB, char: activePair.charB, isCorrect: !playedA },
        ].map((opt) => {
          const isWrong = isAnswerChecked && userSelection === opt.key && !opt.isCorrect;
          const stateClass = isAnswerChecked && opt.isCorrect ? "border-jade bg-jade/10 text-jade" : isWrong ? "border-primary bg-tone-4/10 text-primary" : "border-border bg-card text-foreground";
          return (
            <button key={opt.key} onClick={() => checkAnswer(opt.key as "A" | "B")} disabled={isAnswerChecked} className={cn("rounded-2xl border-2 px-4 py-6", isAnswerChecked ? "cursor-default" : "cursor-pointer", stateClass)}>
              <span className="block font-serif text-3xl font-bold">{opt.char}</span>
              <span className="mt-1 block text-[1.1rem] font-extrabold">{opt.pinyin}</span>
            </button>
          );
        })}
      </div>
      {isAnswerChecked && <button className={cn(primaryButtonClass, "w-full")} onClick={goToNextPair}>Next Pair</button>}
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
    <div className={panelClass}>
      <h3 className="mb-4 text-[1.3rem] font-extrabold">Pinyin Keyboard Typing</h3>
      <div className={cn(innerCardClass, "mb-6 p-8 sm:p-9")}>
        <h1 className="mb-2 font-serif text-6xl font-extrabold text-primary">{word.simplified}</h1>
        <p className="text-[0.95rem] text-muted-foreground">Meaning: <strong>{word.english}</strong></p>
      </div>
      <form onSubmit={handleCheck} className="flex flex-col gap-4">
        <input type="text" placeholder="Type the pinyin..." value={typed} onChange={(e) => setTyped(e.target.value)} disabled={checked} className="rounded-xl border-2 bg-background p-4 text-center text-[1.1rem] font-bold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60" />
        {checked && (
          <div className={cn("anim-pop rounded-xl border p-4 text-[0.95rem] font-bold", correct ? "border-jade bg-jade/10 text-jade" : "border-primary bg-tone-4/10 text-primary")}>
            {correct ? "Correct! +10 XP" : `Incorrect. The correct pinyin is: ${word.pinyin}`}
          </div>
        )}
        {!checked ? (
          <button className={primaryButtonClass} type="submit" disabled={!typed.trim()}>Check Typing</button>
        ) : (
          <button className={primaryButtonClass} type="button" onClick={() => { setIdx((value) => value + 1); setTyped(""); setChecked(false); }}>Next Character</button>
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
    <div className={panelClass}>
      <h3 className="mb-2 text-[1.3rem] font-extrabold">Listening Check</h3>
      <p className="mb-5 text-[0.85rem] text-muted-foreground">Listen and choose the correct meaning.</p>
      <button className={cn(primaryButtonClass, "mb-6 size-20 rounded-full p-0")} onClick={() => speakChinese(word.simplified)}>
        <Volume2 size={32} />
      </button>
      <div className="mb-5 grid gap-2.5">
        {options.map((option) => {
          const isCorrect = checked && option.id === word.id;
          const isWrong = checked && selected === option.id && option.id !== word.id;
          return (
            <button key={option.id} onClick={() => choose(option.id)} disabled={checked} className={cn("flex items-center justify-between rounded-xl border-2 p-4 font-bold", isCorrect ? "border-jade bg-jade/10 text-jade" : isWrong ? "border-tone-4 bg-tone-4/10 text-tone-4" : "border-border bg-card text-foreground")}>
              {option.english}
              {isCorrect && <CheckCircle2 size={18} />}
              {isWrong && <XCircle size={18} />}
            </button>
          );
        })}
      </div>
      {checked && <button className={primaryButtonClass} onClick={() => { setIdx((value) => value + 1); setSelected(null); setChecked(false); }}>Next Word</button>}
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
    <div className={panelClass}>
      <h3 className="mb-4 text-[1.3rem] font-extrabold">Shadowing & Pronunciation</h3>
      <div className={cn(innerCardClass, "mb-6 p-7 text-center")}>
        <h1 className="font-serif text-5xl font-extrabold text-primary">{prompt.hanzi}</h1>
        <p className="my-1 text-base font-medium text-muted-foreground">{prompt.pinyin}</p>
        <p className="text-[0.9rem] font-semibold">"{prompt.english}"</p>
        <TtsButton text={prompt.hanzi} className={cn(secondaryButtonClass, "mt-4 px-4 py-2 text-[0.8rem]")}>
          Listen Sample
        </TtsButton>
      </div>
      {recording && (
        <div className="mb-5">
          <canvas ref={canvasRef} width={280} height={60} className="h-[60px] w-full" />
          <span className="text-xs font-bold text-primary">RECORDING VOICE...</span>
        </div>
      )}
      {score && (
        <div className="anim-pop mb-6 text-left">
          <div className="rounded-lg border border-dashed border-jade bg-jade/5 p-5 shadow-sm">
            <h4 className="mb-3 flex gap-2 text-[1.1rem] font-extrabold text-jade">
              <Sparkles size={20} /> Pronunciation: {score.overall >= 90 ? "Excellent" : "Great"}
            </h4>
            {[
              { label: "Accuracy", val: score.accuracy, cls: "bg-tone-1" },
              { label: "Tones", val: score.tones, cls: "bg-tone-3" },
              { label: "Fluency", val: score.fluency, cls: "bg-tone-2" },
            ].map((bar) => (
              <div key={bar.label} className="mb-2.5">
                <div className="mb-0.5 flex justify-between text-xs font-bold">
                  <span>{bar.label}</span>
                  <span>{bar.val}%</span>
                </div>
                <div className="h-1.5 w-full rounded-[3px] bg-border">
                  <div className={cn("h-full rounded-[3px]", bar.cls)} style={{ width: `${bar.val}%` }} />
                </div>
              </div>
            ))}
            <p className="text-[0.85rem] italic text-muted-foreground">{score.tip}</p>
          </div>
        </div>
      )}
      <div className="flex gap-3">
        {!recording ? (
          <button className={cn(primaryButtonClass, "recording-pulse flex-1")} onClick={startRecord} disabled={scoreMutation.isPending}>
            Start Speak
          </button>
        ) : (
          <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-jade px-6 py-3 text-sm font-semibold text-white transition hover:bg-jade/90" onClick={stopRecord}>
            Stop
          </button>
        )}
        {score && (
          <button className={cn(secondaryButtonClass, "flex-[0.5]")} onClick={() => { setIdx((value) => value + 1); setScore(null); }}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

function HanziDrawingTool() {
  const { t } = useI18n();
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
    toast.success(t("practice.hanziComplete", { character: current.character }));
    handleNext();
  };

  return (
    <div className={panelClass}>
      <h3 className="mb-1 text-[1.3rem] font-extrabold">Hanzi Stroke Writing</h3>
      <span className="text-[0.8rem] font-semibold text-muted-foreground">
        Character: <strong className="text-primary">{current.character}</strong> · Stroke {activeStrokeIdx + 1} of {current.strokes.length}
      </span>
      <div className="my-6 flex justify-center">
        <canvas ref={canvasRef} width={280} height={280} onMouseDown={handleCanvasMouseDown} onMouseMove={handleCanvasMouseMove} onMouseUp={() => void handleCanvasMouseUp()} onMouseLeave={() => void handleCanvasMouseUp()} className="aspect-square w-full max-w-[280px] cursor-crosshair rounded-2xl border-2 bg-card" />
      </div>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <button className={secondaryButtonClass} onClick={() => { setActiveStrokeIdx(0); drawBackground(current, 0, canvasRef.current); }}>Reset Canvas</button>
        <button className={primaryButtonClass} onClick={handleNext}>Skip Word</button>
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
