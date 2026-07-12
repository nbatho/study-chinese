import { useEffect, useState } from "react";

const COLORS = [
  "var(--primary)",
  "var(--gold)",
  "var(--jade)",
  "var(--tone-1)",
  "var(--tone-2)",
  "var(--tone-4)",
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface ConfettiPiece {
  id: number;
  left: number;
  drift: number;
  rotation: number;
  duration: number;
  delay: number;
  size: number;
  color: string;
  circle: boolean;
}

const generatePieces = (count: number): ConfettiPiece[] =>
  Array.from({ length: count }).map((_, index) => ({
    id: index,
    left: Math.random() * 100,
    drift: (Math.random() - 0.5) * 40,
    rotation: 480 + Math.random() * 720,
    duration: 2.4 + Math.random() * 1.6,
    delay: Math.random() * 0.5,
    size: 6 + Math.random() * 6,
    color: COLORS[index % COLORS.length],
    circle: Math.random() > 0.5,
  }));

interface ConfettiProps {
  /** Number of confetti pieces to spawn. */
  count?: number;
  className?: string;
}

/**
 * Lightweight, self-contained celebration burst. Pieces fall once and fade out.
 * Renders nothing when the user prefers reduced motion.
 */
export default function Confetti({ count = 60, className }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const frame = requestAnimationFrame(() => setPieces(generatePieces(count)));
    return () => cancelAnimationFrame(frame);
  }, [count]);

  if (!pieces.length) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-1100 overflow-hidden ${className ?? ""}`}
    >
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="absolute top-0 block"
          style={{
            left: `${piece.left}%`,
            width: `${piece.size}px`,
            height: `${piece.size * (piece.circle ? 1 : 1.6)}px`,
            background: piece.color,
            borderRadius: piece.circle ? "9999px" : "2px",
            animation: `confetti-fall ${piece.duration}s cubic-bezier(0.3, 0.7, 0.5, 1) ${piece.delay}s forwards`,
            ["--confetti-x" as string]: `${piece.drift}vw`,
            ["--confetti-rot" as string]: `${piece.rotation}deg`,
          }}
        />
      ))}
    </div>
  );
}
