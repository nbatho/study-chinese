import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, PenLine, Play, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../utils/cn";
import type { HanziWriterInstance, HanziWriterQuizOptions } from "hanzi-writer";

type PracticeMode = "demo" | "quiz";

type HanziStrokePracticeProps = {
  character: string;
  mode?: PracticeMode;
  size?: number;
  showOutline?: boolean;
  className?: string;
  onMistake?: HanziWriterQuizOptions["onMistake"];
  onComplete?: HanziWriterQuizOptions["onComplete"];
};

export function HanziStrokePractice({
  character,
  mode = "demo",
  size = 240,
  showOutline = true,
  className,
  onMistake,
  onComplete,
}: HanziStrokePracticeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const writerRef = useRef<HanziWriterInstance | null>(null);
  const [activeMode, setActiveMode] = useState<PracticeMode>(mode);
  const [outlineVisible, setOutlineVisible] = useState(showOutline);
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const resolvedSize = Math.min(360, Math.max(180, size));

  useEffect(() => {
    let cancelled = false;

    const mountWriter = async () => {
      if (!containerRef.current || !character.trim()) {
        return;
      }

      setError(null);
      containerRef.current.innerHTML = "";

      try {
        const module = await import("hanzi-writer");
        const writer = module.default.create(containerRef.current, character.trim()[0], {
          width: resolvedSize,
          height: resolvedSize,
          padding: 10,
          showOutline: outlineVisible,
          showCharacter: false,
          strokeAnimationSpeed: 1.1,
          delayBetweenStrokes: 180,
          drawingWidth: 28,
          drawingColor: "var(--primary)",
          strokeColor: "var(--foreground)",
          outlineColor: "rgba(26, 26, 30, 0.18)",
          radicalColor: "var(--jade)",
        });

        if (cancelled) {
          return;
        }

        writerRef.current = writer;

        if (activeMode === "quiz") {
          writer.quiz({ onMistake, onComplete });
        } else {
          await writer.animateCharacter();
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load Hanzi Writer.");
        }
      }
    };

    void mountWriter();

    return () => {
      cancelled = true;
      writerRef.current = null;
    };
  }, [activeMode, character, onComplete, onMistake, outlineVisible, resolvedSize, revision]);

  const replay = () => {
    setActiveMode("demo");
    void writerRef.current?.animateCharacter();
  };

  const startQuiz = () => {
    setActiveMode("quiz");
    writerRef.current?.quiz({ onMistake, onComplete });
  };

  const reset = () => {
    setRevision((value) => value + 1);
  };

  const toggleOutline = () => {
    setOutlineVisible((value) => !value);
  };

  return (
    <div
      className={cn(
        "flex w-full max-w-md flex-col items-center gap-3 rounded-md border bg-card p-4",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <div className="min-w-0 text-2xl font-semibold leading-none">{character.trim()[0] || "?"}</div>
        <div className="flex shrink-0 items-center gap-1">
          <Button type="button" size="icon" variant="ghost" title="Play stroke animation" aria-label="Play stroke animation" onClick={replay}>
            <Play />
          </Button>
          <Button type="button" size="icon" variant="ghost" title="Start writing quiz" aria-label="Start writing quiz" onClick={startQuiz}>
            <PenLine />
          </Button>
          <Button type="button" size="icon" variant="ghost" title="Reset practice" aria-label="Reset practice" onClick={reset}>
            <RotateCcw />
          </Button>
          <Button type="button" size="icon" variant="ghost" title="Toggle outline" aria-label="Toggle outline" onClick={toggleOutline}>
            {outlineVisible ? <Eye /> : <EyeOff />}
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="grid place-items-center rounded-md border bg-background"
        style={{ width: resolvedSize, height: resolvedSize }}
      />

      {error ? (
        <div className="w-full rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}
    </div>
  );
}

export default HanziStrokePractice;
