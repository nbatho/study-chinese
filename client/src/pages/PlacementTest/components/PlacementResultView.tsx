import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import type { PlacementResult } from "../../../api/placement";
import { startLevelKeys, useI18n } from "../../../i18n";
import { Button } from "../../../components/ui/button";
import { cefrDescKeys, sectionKeys } from "./placementScoring";

interface PlacementResultViewProps {
  result: PlacementResult;
  onRetake: () => void;
  onContinue: () => void;
  continueLabel: string;
}

export default function PlacementResultView({ result, onRetake, onContinue, continueLabel }: PlacementResultViewProps) {
  const { t } = useI18n();

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-jade/10 text-jade">
        <CheckCircle2 size={28} />
      </div>
      <p className="text-xs font-extrabold text-muted-foreground">{t("placement.recommended")}</p>
      <h1 className="mt-1 text-4xl font-extrabold text-primary">{result.cefrLevel}</h1>
      <p className="mt-2 text-sm font-bold text-foreground">
        {t("placement.resultLevel", { level: result.cefrLevel, label: t(startLevelKeys[result.startLevel]) })}
      </p>
      <p className="mx-auto mt-3 max-w-120 text-sm text-muted-foreground">
        {t(cefrDescKeys[result.cefrLevel])}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {result.breakdown.map((item) => (
          <div key={item.section} className="rounded-xl border bg-background p-4 text-left">
            <p className="text-xs font-extrabold text-muted-foreground">{t(sectionKeys[item.section])}</p>
            <p className="mt-2 text-2xl font-extrabold">{item.correct}/{item.total}</p>
            <p className="text-xs font-semibold text-muted-foreground">{t("placement.weightedPoints", { score: item.score })}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-secondary p-4 text-sm font-semibold text-muted-foreground">
        {t("placement.totalScore")} <span className="text-foreground">{result.score}</span> · {t("placement.correctAnswers")}{" "}
        <span className="text-foreground">{result.correct}/{result.total}</span>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button type="button" variant="secondary" onClick={onRetake} className="rounded-xl">
          <RotateCcw size={18} />
          {t("placement.retake")}
        </Button>
        <Button type="button" onClick={onContinue} className="rounded-xl">
          {continueLabel}
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}
