import { Gauge } from "lucide-react";
import { cn } from "../utils/cn";
import { TTS_SPEED_OPTIONS, useTtsSpeed } from "../utils/ttsSettings";

interface TtsSpeedControlProps {
  className?: string;
  /** Show the gauge icon before the segments. Defaults to true. */
  showIcon?: boolean;
  label?: string;
}

const formatSpeed = (speed: number) => `${speed}×`;

export default function TtsSpeedControl({ className, showIcon = true, label }: TtsSpeedControlProps) {
  const [speed, setSpeed] = useTtsSpeed();

  return (
    <div
      className={cn("inline-flex items-center gap-1.5", className)}
      role="radiogroup"
      aria-label={label ?? "Audio speed"}
    >
      {showIcon && <Gauge size={14} className="shrink-0 text-muted-foreground" aria-hidden />}
      {label && <span className="text-xs font-semibold text-muted-foreground">{label}</span>}
      <div className="inline-flex items-center rounded-full border bg-secondary p-0.5">
        {TTS_SPEED_OPTIONS.map((option) => {
          const isActive = option === speed;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setSpeed(option)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-bold tabular-nums transition",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {formatSpeed(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
