import { cn } from "../utils/cn";
import { Skeleton } from "./ui/skeleton";

interface LoadingCardProps {
  label: string;
  className?: string;
  /** Number of shimmer lines to render. */
  lines?: number;
}

export default function LoadingCard({ label, className, lines = 3 }: LoadingCardProps) {
  return (
    <div
      className={cn("rounded-lg border bg-card p-6 shadow-sm", className)}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">{label}</span>
      <div className="grid gap-3">
        <Skeleton className="h-5 w-2/5" />
        {Array.from({ length: Math.max(1, lines) }).map((_, index) => (
          <Skeleton
            key={index}
            className={cn("h-4", index === lines - 1 ? "w-3/5" : "w-full")}
          />
        ))}
      </div>
    </div>
  );
}
