import { useCallback, useEffect, useRef, useState } from "react";
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

const resolveHanziWriterColor = (scope: HTMLElement, color: string, fallback: string) => {
  const probe = document.createElement("span");

  probe.style.color = color;
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  scope.appendChild(probe);

  const resolvedColor = getComputedStyle(probe).color;
  probe.remove();

  return resolvedColor || fallback;
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
  const onMistakeRef = useRef(onMistake);
  const onCompleteRef = useRef(onComplete);
  const [activeMode, setActiveMode] = useState<PracticeMode>(mode);
  const [outlineVisible, setOutlineVisible] = useState(showOutline);
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const resolvedSize = Math.min(360, Math.max(180, size));

  useEffect(() => {
    onMistakeRef.current = onMistake;
    onCompleteRef.current = onComplete;
  }, [onComplete, onMistake]);

  const getQuizOptions = useCallback((): HanziWriterQuizOptions => ({
    onMistake: (summary) => onMistakeRef.current?.(summary),
    onComplete: (summary) => onCompleteRef.current?.(summary),
  }), []);

  useEffect(() => {
    let cancelled = false;
    let host: HTMLDivElement | null = null;
    let writer: HanziWriterInstance | null = null;

    const mountWriter = async () => {
      const container = containerRef.current;
      const selectedCharacter = character.trim()[0];

      if (!container) {
        return;
      }

      setError(null);
      container.replaceChildren();

      if (!selectedCharacter) {
        return;
      }

      try {
        const module = await import("hanzi-writer");

        if (cancelled) {
          return;
        }

        host = document.createElement("div");
        host.style.width = `${resolvedSize}px`;
        host.style.height = `${resolvedSize}px`;
        host.style.display = "block";
        host.style.lineHeight = "0";
        container.appendChild(host);

        const drawingColor = resolveHanziWriterColor(host, "var(--primary)", "rgb(217, 63, 71)");
        const strokeColor = resolveHanziWriterColor(host, "var(--foreground)", "rgb(44, 44, 53)");
        const radicalColor = resolveHanziWriterColor(host, "var(--jade)", "rgb(60, 170, 137)");

        writer = module.default.create(host, selectedCharacter, {
          width: resolvedSize,
          height: resolvedSize,
          padding: 10,
          showOutline: outlineVisible,
          showCharacter: false,
          strokeAnimationSpeed: 1.1,
          delayBetweenStrokes: 180,
          drawingWidth: 28,
          drawingColor,
          strokeColor,
          outlineColor: "rgba(26, 26, 30, 0.18)",
          radicalColor,
        });

        if (cancelled) {
          host.remove();
          return;
        }

        writerRef.current = writer;

        if (activeMode === "quiz") {
          writer.quiz(getQuizOptions());
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
      host?.remove();

      if (writerRef.current === writer) {
        writerRef.current = null;
      }
    };
  }, [activeMode, character, getQuizOptions, outlineVisible, resolvedSize, revision]);

  const replay = () => {
    setActiveMode("demo");
    void writerRef.current?.animateCharacter();
  };

  const startQuiz = () => {
    setActiveMode("quiz");
    writerRef.current?.quiz(getQuizOptions());
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
