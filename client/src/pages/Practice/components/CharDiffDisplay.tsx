import type { CharDiffEntry } from "../../../api/practice";
import { useI18n } from "../../../i18n";
import { cn } from "../../../utils/cn";
export default function CharDiffDisplay({ charDiff }: { charDiff: CharDiffEntry[] }) {
    const { t } = useI18n();

    if (!charDiff || charDiff.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-1">
            {charDiff.map((entry, i) => {
                const colorClass =
                    entry.status === "correct"
                        ? "bg-jade/15 text-jade border-jade/30"
                        : entry.status === "wrong"
                            ? "bg-primary/10 text-primary border-primary/30"
                            : entry.status === "missing"
                                ? "bg-gold/15 text-gold border-gold/30"
                                : "bg-muted text-muted-foreground border-border";
                return (
                    <span
                        key={`${i}-${entry.char}`}
                        className={cn(
                            "inline-flex min-w-8 items-center justify-center rounded-md border px-1.5 py-1 font-serif text-lg font-bold",
                            colorClass,
                        )}
                        title={
                            entry.status === "correct"
                                ? t("practice.shadow.diffCorrect")
                                : entry.status === "wrong"
                                    ? t("practice.shadow.diffWrong", { expected: entry.char, got: entry.got ?? "" })
                                    : entry.status === "missing"
                                        ? t("practice.shadow.diffMissing", { expected: entry.char })
                                        : t("practice.shadow.diffExtra", { got: entry.got ?? "" })
                        }
                    >
                        {entry.status === "wrong" ? (
                            <span className="flex flex-col items-center leading-tight">
                                <span className="text-[0.65rem] font-semibold line-through opacity-60">{entry.got}</span>
                                <span>{entry.char}</span>
                            </span>
                        ) : entry.status === "missing" ? (
                            <span className="opacity-50">{entry.char}</span>
                        ) : (
                            entry.char
                        )}
                    </span>
                );
            })}
        </div>
    );
}