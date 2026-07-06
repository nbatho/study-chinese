import type { LucideIcon } from "lucide-react";

interface SummaryStatProps {
  icon: LucideIcon;
  label: string;
  value: number;
}

export default function SummaryStat({ icon: Icon, label, value }: SummaryStatProps) {
  return (
    <div className="rounded-2xl border bg-card/95 p-3 shadow-sm sm:p-4">
      <Icon className="mb-2 size-5 text-primary" />
      <strong className="block text-xl font-extrabold">{value}</strong>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
