import { useState, useRef, useEffect } from "react";
import { useStore } from "../store/store";
import { VOCAB } from "../resources/vocab";
import { Activity, Ear, Keyboard, Mic, PencilLine, Volume2, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

export default function Practice() {
  const [activeTool, setActiveTool] = useState<"menu" | "tones" | "pairs" | "typing" | "shadow" | "hanzi">("menu");

  return (
    <div className="anim-slide">
      {activeTool !== "menu" && (
        <button
          onClick={() => setActiveTool("menu")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            border: "none",
            background: "none",
            color: "var(--primary-red)",
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: "20px"
          }}
        >
          <ArrowLeft size={16} /> Back to Practice Suite
        </button>
      )}

      {activeTool === "menu" && (
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={{ textAlign: "left", marginBottom: "8px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Practice Suite</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Sharpen your speaking, listening, typing, and character writing skills.
            </p>
          </div>

          {[
            { id: "tones", title: "Tone Drill", desc: "Visualize and master the 4 Mandarin tones", icon: Activity, color: "var(--tone-1)" },
            { id: "pairs", title: "Minimal Pairs", desc: "Distinguish similar-sounding syllables", icon: Ear, color: "var(--tone-4)" },
            { id: "typing", title: "Pinyin Typing", desc: "Type characters in Romanized pinyin spelling", icon: Keyboard, color: "var(--jade)" },
            { id: "shadow", title: "Shadowing Practice", desc: "Record your pronunciation and get scored", icon: Mic, color: "var(--tone-3)" },
            { id: "hanzi", title: "Hanzi Stroke Writing", desc: "Trace character strokes in correct stroke order", icon: PencilLine, color: "var(--gold)" }
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => setActiveTool(tool.id as any)}
                className="card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  padding: "20px",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <div style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  backgroundColor: tool.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white"
                }}>
                  <Icon size={26} />
                </div>
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{tool.title}</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "2px" }}>{tool.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTool === "tones" && <ToneDrillTool />}
      {activeTool === "pairs" && <MinimalPairsTool />}
      {activeTool === "typing" && <PinyinTypingTool />}
      {activeTool === "shadow" && <ShadowingTool />}
      {activeTool === "hanzi" && <HanziDrawingTool />}
    </div>
  );
}

// 1. Tone Drill Sub-Component
function ToneDrillTool() {
  const [activeTone, setActiveTone] = useState<number>(1);
  const [scoreAchieved, setScoreAchieved] = useState(false);
  const store = useStore();

  const tonesInfo = [
    { num: 1, name: "1st Tone (High Level)", pinyin: "mā (mother)", desc: "High, flat, steady pitch line. Keep your voice high and even.", color: "var(--tone-1)", points: "M10,25 L90,25" },
    { num: 2, name: "2nd Tone (Rising)", pinyin: "má (hemp)", desc: "Rising pitch curve. Start from middle and go up quickly, like asking a question.", color: "var(--tone-2)", points: "M10,75 C40,70 60,40 90,25" },
    { num: 3, name: "3rd Tone (Low Dipping)", pinyin: "mǎ (horse)", desc: "Low dipping pitch curve. Drop your voice deep, then rise slightly at the end.", color: "var(--tone-3)", points: "M10,40 C30,70 50,85 70,80 C80,75 85,60 90,35" },
    { num: 4, name: "4th Tone (Falling)", pinyin: "mà (scold)", desc: "Rapidly falling pitch line. Start very high and drop sharply, like a command.", color: "var(--tone-4)", points: "M10,15 L90,85" }
  ];

  const playTTS = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      window.speechSynthesis.speak(utterance);
      setScoreAchieved(true);
      store.unlockSpecialAchievement("perfect_tone");
    }
  };

  return (
    <div className="card anim-pop" style={{ padding: "28px", textAlign: "left" }}>
      <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "8px" }}>Tone Contour Drill</h3>
      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "20px" }}>
        Click any tone path to visualize its pitch level and listen to the pronunciation sample.
      </p>

      {/* SVG graph */}
      <div style={{
        position: "relative",
        height: "200px",
        backgroundColor: "var(--bg-app)",
        borderRadius: "16px",
        border: "1px solid var(--border-color)",
        padding: "16px",
        marginBottom: "24px"
      }}>
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", overflow: "visible" }}>
          {/* Grid lines */}
          {[20, 40, 60, 80].map((y) => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="2" />
          ))}

          {/* Draw all inactive/active lines */}
          {tonesInfo.map((t) => {
            const isActive = activeTone === t.num;
            return (
              <path
                key={t.num}
                d={t.points}
                fill="none"
                stroke={t.color}
                strokeWidth={isActive ? 6 : 2.5}
                opacity={isActive ? 1 : 0.25}
                style={{
                  transition: "stroke-width 0.2s, opacity 0.2s",
                  cursor: "pointer",
                  filter: isActive ? `drop-shadow(0px 2px 4px ${t.color})` : "none"
                }}
                onClick={() => setActiveTone(t.num)}
              />
            );
          })}
        </svg>
        <span style={{ position: "absolute", top: "12px", left: "16px", fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 700 }}>5 (HIGH)</span>
        <span style={{ position: "absolute", bottom: "12px", left: "16px", fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 700 }}>1 (LOW)</span>
      </div>

      {/* Details Box */}
      {(() => {
        const info = tonesInfo.find(t => t.num === activeTone)!;
        return (
          <div className="anim-slide" style={{
            backgroundColor: "var(--bg-card-hover)",
            padding: "20px",
            borderRadius: "14px",
            border: "1px solid var(--border-color)"
          }}>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: info.color }}>{info.name}</h4>
            <div style={{ display: "flex", gap: "16px", alignItems: "center", margin: "10px 0" }}>
              <span className="hanzi-text" style={{ fontSize: "1.8rem", fontWeight: 700 }}>
                {info.num === 1 ? "妈" : info.num === 2 ? "麻" : info.num === 3 ? "马" : "骂"}
              </span>
              <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-main)" }}>{info.pinyin}</span>
              <button className="btn btn-primary" onClick={() => playTTS(info.num === 1 ? "妈" : info.num === 2 ? "麻" : info.num === 3 ? "马" : "骂")} style={{ padding: "8px 14px", fontSize: "0.8rem" }}>
                <Volume2 size={16} /> Listen
              </button>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{info.desc}</p>
          </div>
        );
      })()}

      {scoreAchieved && (
        <div className="anim-pop" style={{ marginTop: "20px", padding: "12px", backgroundColor: "rgba(16, 185, 129, 0.08)", color: "var(--jade)", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px", borderRadius: "10px" }}>
          <CheckCircle2 size={18} /> Tone Master Achievement Unlocked! Keep practicing.
        </div>
      )}
    </div>
  );
}

// 2. Minimal Pairs Sub-Component
function MinimalPairsTool() {
  const store = useStore();
  const pairs = [
    { wordA: "mā", wordB: "mǎ", charA: "妈", charB: "马", toneA: 1, toneB: 3, label: "mother vs horse" },
    { wordA: "mā", wordB: "má", charA: "妈", charB: "麻", toneA: 1, toneB: 2, label: "mother vs hemp" },
    { wordA: "mā", wordB: "mà", charA: "妈", charB: "骂", toneA: 1, toneB: 4, label: "mother vs scold" },
    { wordA: "shū", wordB: "shǔ", charA: "书", charB: "鼠", toneA: 1, toneB: 3, label: "book vs mouse" },
    { wordA: "chá", wordB: "chà", charA: "茶", charB: "差", toneA: 2, toneB: 4, label: "tea vs poor" },
    { wordA: "mǎi", wordB: "mài", charA: "买", charB: "卖", toneA: 3, toneB: 4, label: "buy vs sell" }
  ];

  const [pairIdx, setPairIdx] = useState(0);
  const [playedA, setPlayedA] = useState(false);
  const [userSelection, setUserSelection] = useState<"A" | "B" | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const activePair = pairs[pairIdx];

  useEffect(() => {
    // Randomize which one gets played
    setPlayedA(Math.random() > 0.5);
    setUserSelection(null);
    setIsAnswerChecked(false);
  }, [pairIdx]);

  const speakActiveWord = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const target = playedA ? activePair.charA : activePair.charB;
      const utterance = new SpeechSynthesisUtterance(target);
      utterance.lang = "zh-CN";
      window.speechSynthesis.speak(utterance);
    }
  };

  const checkAnswer = (selection: "A" | "B") => {
    if (isAnswerChecked) return;
    setUserSelection(selection);
    const isCorrect = (selection === "A" && playedA) || (selection === "B" && !playedA);
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      store.addXP(5);
    }
    setIsAnswerChecked(true);
  };

  const handleNext = () => {
    setPairIdx((pairIdx + 1) % pairs.length);
  };

  return (
    <div className="card anim-pop" style={{ padding: "28px", textAlign: "center" }}>
      <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "4px" }}>Minimal Pairs Drill</h3>
      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Score: {correctCount} XP Earned</span>
      
      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "12px 0 24px" }}>
        Listen to the spoken word and select which syllable you heard.
      </p>

      {/* Main Play Action Card */}
      <div className="card" style={{ padding: "32px", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "16px", marginBottom: "28px", width: "100%" }}>
        <button className="btn btn-primary" onClick={speakActiveWord} style={{ borderRadius: "50%", width: "80px", height: "80px", padding: 0 }}>
          <Volume2 size={32} />
        </button>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
          Drill: {activePair.label}
        </span>
      </div>

      {/* Options */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
        {[
          { key: "A", pinyin: activePair.wordA, char: activePair.charA, isCorrect: playedA },
          { key: "B", pinyin: activePair.wordB, char: activePair.charB, isCorrect: !playedA }
        ].map((opt) => {
          let borderCol = "var(--border-color)";
          let bgCol = "var(--bg-card)";
          let txtCol = "var(--text-main)";

          if (isAnswerChecked) {
            if (opt.isCorrect) {
              borderCol = "var(--jade)";
              bgCol = "rgba(16, 185, 129, 0.08)";
              txtCol = "var(--jade)";
            } else if (userSelection === opt.key) {
              borderCol = "var(--primary-red)";
              bgCol = "rgba(239, 68, 68, 0.08)";
              txtCol = "var(--primary-red)";
            }
          }

          return (
            <button
              key={opt.key}
              onClick={() => checkAnswer(opt.key as any)}
              disabled={isAnswerChecked}
              style={{
                padding: "24px 16px",
                borderRadius: "16px",
                border: `2px solid ${borderCol}`,
                backgroundColor: bgCol,
                color: txtCol,
                cursor: isAnswerChecked ? "default" : "pointer",
                transition: "var(--transition-smooth)"
              }}
            >
              <span className="hanzi-text" style={{ fontSize: "2rem", display: "block", fontWeight: 700 }}>
                {opt.char}
              </span>
              <span style={{ fontSize: "1.1rem", fontWeight: 800, marginTop: "4px", display: "block" }}>
                {opt.pinyin}
              </span>
            </button>
          );
        })}
      </div>

      {isAnswerChecked && (
        <button className="btn btn-primary" onClick={handleNext} style={{ width: "100%" }}>
          Next Pair
        </button>
      )}
    </div>
  );
}

// 3. Pinyin Typing Sub-Component
function PinyinTypingTool() {
  const store = useStore();
  const typingWords = VOCAB.filter(w => w.pinyin.split(" ").length === 1).slice(10, 40); // Select simple single character words

  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);

  const word = typingWords[idx % typingWords.length];

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (checked) return;

    const cleanInput = typed.trim().toLowerCase();
    const cleanPinyin = word.pinyin.trim().toLowerCase();
    // support pinyin comparison with or without tone accents if typing is hard
    const cleanStandard = cleanPinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const isMatch = cleanInput === cleanPinyin || cleanInput === cleanStandard;
    
    setCorrect(isMatch);
    if (isMatch) store.addXP(10);
    setChecked(true);
  };

  const handleNext = () => {
    setIdx(idx + 1);
    setTyped("");
    setChecked(false);
  };

  return (
    <div className="card anim-pop" style={{ padding: "28px", textAlign: "center" }}>
      <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "16px" }}>Pinyin Keyboard Typing</h3>

      <div className="card" style={{ padding: "36px", marginBottom: "24px" }}>
        <h1 className="hanzi-text" style={{ fontSize: "4rem", fontWeight: 800, color: "var(--primary-red)", marginBottom: "8px" }}>
          {word.simplified}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Meaning: <strong>{word.english}</strong>
        </p>
      </div>

      <form onSubmit={handleCheck} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <input
          type="text"
          placeholder="Type the pinyin (e.g. wǔ or wu)..."
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          disabled={checked}
          style={{
            padding: "16px",
            fontSize: "1.1rem",
            fontWeight: 700,
            borderRadius: "12px",
            border: "2px solid var(--border-color)",
            backgroundColor: "var(--bg-app)",
            color: "var(--text-main)",
            textAlign: "center",
            outline: "none"
          }}
        />

        {checked && (
          <div className="anim-pop" style={{
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: correct ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
            border: `1px solid ${correct ? "var(--jade)" : "var(--primary-red)"}`,
            color: correct ? "var(--jade)" : "var(--primary-red)",
            fontWeight: 700,
            fontSize: "0.95rem"
          }}>
            {correct ? "🎉 Correct! +10 XP" : `❌ Incorrect. The correct pinyin is: ${word.pinyin}`}
          </div>
        )}

        {!checked ? (
          <button className="btn btn-primary" type="submit" disabled={!typed.trim()}>
            Check Typing
          </button>
        ) : (
          <button className="btn btn-primary" type="button" onClick={handleNext}>
            Next Character
          </button>
        )}
      </form>
    </div>
  );
}

// 4. Shadowing Practice Sub-Component (Mock Voice Scorer)
function ShadowingTool() {
  const store = useStore();
  const sentences = [
    { hanzi: "你好！", pinyin: "nǐ hǎo", english: "Hello!" },
    { hanzi: "最近好吗？", pinyin: "zuìjìn hǎo ma", english: "How are you lately?" },
    { hanzi: "我是学生。", pinyin: "wǒ shì xuéshēng", english: "I am a student." },
    { hanzi: "这个多少钱？", pinyin: "zhège duōshǎo qián", english: "How much is this?" },
    { hanzi: "很高兴认识你！", pinyin: "hěn gāoxìng rènshí nǐ", english: "Nice to meet you!" }
  ];

  const [sIdx, setSIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [score, setScore] = useState<any | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const sentence = sentences[sIdx % sentences.length];

  // Visualizer loop simulation
  useEffect(() => {
    if (recording && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "var(--primary-red)";
        
        // draw simulated wave bars
        const barWidth = 4;
        const gap = 2;
        const count = Math.floor(canvas.width / (barWidth + gap));
        
        for (let i = 0; i < count; i++) {
          const height = Math.random() * (canvas.height - 20) + 10;
          const x = i * (barWidth + gap);
          const y = (canvas.height - height) / 2;
          ctx.fillRect(x, y, barWidth, height);
        }
        animationRef.current = requestAnimationFrame(draw);
      };
      
      draw();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [recording]);

  const speakSample = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentence.hanzi);
      utterance.lang = "zh-CN";
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecord = async () => {
    setRecording(true);
    setScore(null);
    // Mimic media record timeout of 2.5 seconds
    setTimeout(() => {
      stopRecord();
    }, 2500);
  };

  const stopRecord = () => {
    setRecording(false);
    
    // Generate simulated score
    const accuracy = Math.floor(Math.random() * 25) + 75; // 75-99%
    const tones = Math.floor(Math.random() * 20) + 75;
    const fluency = Math.floor(Math.random() * 20) + 80;
    const overall = Math.floor((accuracy + tones + fluency) / 3);

    setScore({
      accuracy,
      tones,
      fluency,
      overall,
      tip: overall >= 90 ? "Excellent pronunciation! Tones are perfectly aligned." : "Great job! Try to enunciate the dipping tone more clearly."
    });

    store.addXP(15); // +15 XP for shadowing
  };

  const handleNext = () => {
    setSIdx(sIdx + 1);
    setScore(null);
  };

  return (
    <div className="card anim-pop" style={{ padding: "28px", textAlign: "center" }}>
      <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "16px" }}>Shadowing & Pronunciation</h3>

      {/* Target prompt */}
      <div className="card" style={{ padding: "28px", marginBottom: "24px", textAlign: "center" }}>
        <h1 className="hanzi-text" style={{ fontSize: "3rem", fontWeight: 800, color: "var(--primary-red)" }}>
          {sentence.hanzi}
        </h1>
        <p style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 500, margin: "4px 0" }}>
          {sentence.pinyin}
        </p>
        <p style={{ fontSize: "0.9rem", color: "var(--text-main)", fontWeight: 600 }}>
          "{sentence.english}"
        </p>

        <button className="btn btn-secondary" onClick={speakSample} style={{ marginTop: "16px", padding: "8px 16px", fontSize: "0.8rem" }}>
          <Volume2 size={16} /> Listen Sample
        </button>
      </div>

      {/* Recording Waveform Visualizer */}
      {recording && (
        <div style={{ marginBottom: "20px" }}>
          <canvas ref={canvasRef} width={280} height={60} style={{ width: "100%", height: "60px" }} />
          <span style={{ fontSize: "0.75rem", color: "var(--primary-red)", fontWeight: 700 }}>
            🔴 RECORDING VOICE...
          </span>
        </div>
      )}

      {/* Scoring Result Sheet */}
      {score && (
        <div className="anim-pop" style={{ marginBottom: "24px", textAlign: "left" }}>
          <div className="card" style={{ border: "1px dashed var(--jade)", backgroundColor: "rgba(16, 185, 129, 0.03)" }}>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--jade)", marginBottom: "12px", display: "flex", gap: "8px" }}>
              <Sparkles size={20} /> Pronunciation: {score.overall >= 90 ? "Excellent" : "Great"}
            </h4>

            {/* Score bars */}
            <div style={{ display: "grid", gap: "10px", marginBottom: "14px" }}>
              {[
                { label: "Accuracy", val: score.accuracy, col: "var(--tone-1)" },
                { label: "Tones", val: score.tones, col: "var(--tone-3)" },
                { label: "Fluency", val: score.fluency, col: "var(--tone-2)" }
              ].map((bar, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "2px" }}>
                    <span>{bar.label}</span>
                    <span>{bar.val}%</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", backgroundColor: "var(--border-color)", borderRadius: "3px" }}>
                    <div style={{ width: `${bar.val}%`, height: "100%", backgroundColor: bar.col, borderRadius: "3px" }} />
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }}>
              💡 {score.tip}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "12px" }}>
        {!recording ? (
          <button className="btn btn-primary recording-pulse" onClick={startRecord} style={{ flex: 1, backgroundColor: "var(--primary-red)" }}>
            🎙️ Start Speak
          </button>
        ) : (
          <button className="btn btn-primary" onClick={stopRecord} style={{ flex: 1, backgroundColor: "var(--jade)", backgroundImage: "none" }}>
            ⏹️ Stop
          </button>
        )}
        
        {score && (
          <button className="btn btn-secondary" onClick={handleNext} style={{ flex: 0.5 }}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

// 5. Hanzi Drawing Stroke Order Canvas
function HanziDrawingTool() {
  const store = useStore();
  const strokesData: Record<string, string[]> = {
    "人": ["M50,20 L20,80", "M50,20 L80,80"],
    "大": ["M15,35 L85,35", "M50,20 L25,80", "M50,35 L80,80"],
    "中": ["M25,20 L25,70", "M75,20 L75,70", "M25,20 L75,20", "M50,10 L50,90"],
    "国": ["M15,10 L15,90", "M85,10 L85,90", "M15,10 L85,10", "M15,90 L85,90", "M35,30 L65,30", "M35,50 L65,50", "M35,70 L65,70", "M50,25 L50,75"],
    "好": ["M30,20 L20,60", "M20,60 L40,65", "M20,45 L40,45", "M60,20 L60,70", "M55,35 L75,35", "M55,55 L75,55"],
    "水": ["M50,15 L50,85", "M30,35 L20,75", "M25,55 L35,65", "M50,55 L75,35", "M50,55 L80,80"],
    "火": ["M30,25 L20,50", "M70,25 L80,50", "M50,15 L30,85", "M50,15 L70,85"],
    "山": ["M15,85 L15,50", "M50,85 L50,25", "M85,85 L85,50", "M15,85 L85,85"],
    "口": ["M25,20 L25,80", "M75,20 L75,80", "M25,20 L75,20", "M25,80 L75,80"],
    "一": ["M15,50 L85,50"],
    "二": ["M20,30 L75,30", "M15,70 L85,70"],
    "三": ["M20,25 L70,25", "M25,50 L75,50", "M15,75 L85,75"]
  };

  const characters = Object.keys(strokesData);
  const [charIdx, setCharIdx] = useState(0);
  const [activeStrokeIdx, setActiveStrokeIdx] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  const currentChar = characters[charIdx % characters.length];
  const targetPaths = strokesData[currentChar];

  // Canvas drawing handlers
  useEffect(() => {
    drawBackground();
  }, [currentChar, activeStrokeIdx]);

  const drawBackground = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid guide (mitred square)
    ctx.strokeStyle = "rgba(217, 63, 71, 0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(canvas.width, canvas.height);
    ctx.moveTo(canvas.width, 0); ctx.lineTo(0, canvas.height);
    ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Draw target character in light gray background
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    if (document.body.classList.contains("dark")) {
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
    }
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    targetPaths.forEach((path) => {
      drawSvgPathOnCanvas(ctx, path, canvas.width, canvas.height);
    });

    // Draw active stroke hint in gold
    ctx.strokeStyle = "rgba(242, 191, 76, 0.35)";
    drawSvgPathOnCanvas(ctx, targetPaths[activeStrokeIdx], canvas.width, canvas.height);
  };

  const drawSvgPathOnCanvas = (ctx: CanvasRenderingContext2D, path: string, w: number, h: number) => {
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
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawingRef.current = true;
    const ctx = canvas.getContext("2d")!;
    ctx.strokeStyle = "var(--primary-red)";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d")!;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleCanvasMouseUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    
    // Auto advance stroke index for simplicity (simulating drawing detection)
    if (activeStrokeIdx + 1 < targetPaths.length) {
      setActiveStrokeIdx(prev => prev + 1);
    } else {
      // Completed character drawing!
      store.addXP(10);
      alert(`🎉 Character "${currentChar}" Complete! +10 XP awarded.`);
      handleNext();
    }
  };

  const handleNext = () => {
    setCharIdx(prev => prev + 1);
    setActiveStrokeIdx(0);
  };

  const handleReset = () => {
    setActiveStrokeIdx(0);
    drawBackground();
  };

  return (
    <div className="card anim-pop" style={{ padding: "28px", textAlign: "center" }}>
      <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "4px" }}>Hanzi Stroke Writing</h3>
      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
        Character: <strong style={{ color: "var(--primary-red)" }}>{currentChar}</strong> · Stroke {activeStrokeIdx + 1} of {targetPaths.length}
      </span>

      <div style={{ display: "flex", justifyContent: "center", margin: "24px 0" }}>
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          style={{
            border: "2px solid var(--border-color)",
            borderRadius: "16px",
            backgroundColor: "var(--bg-card)",
            cursor: "crosshair"
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset Canvas
        </button>
        <button className="btn btn-primary" onClick={handleNext}>
          Skip Word
        </button>
      </div>
    </div>
  );
}
