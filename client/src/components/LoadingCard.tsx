import { cn } from "../utils/cn";

interface LoadingCardProps {
  label: string;
  className?: string;
}

export default function LoadingCard({ label, className }: LoadingCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-8 text-center text-muted-foreground shadow-sm", className)}>
      {label}
    </div>
  );
}
