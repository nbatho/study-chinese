import { Volume2 } from "lucide-react";
import type { LessonDetail } from "../../../api/lessons";
import { useI18n } from "../../../i18n";
import { cn } from "../../../utils/cn";
import { speakChinese } from "../../../utils/tts";

export default function WordList({ lesson, compact = false }: { lesson: LessonDetail; compact?: boolean }) {
  const { t } = useI18n();
  return (
    <div className={cn("text-left", !compact && "mb-6")}>
      <h4 className="mb-2.5 text-[0.9rem] font-bold uppercase text-muted-foreground">
        {compact ? t("learn.srsWords") : t("learn.newWords")}
      </h4>
      <div className={cn("flex flex-wrap gap-2.5", compact ? "justify-center" : "justify-start")}>
        {lesson.newWords.map((word) => (
          <button key={word.id} onClick={() => speakChinese(word.simplified)} className="flex items-center gap-1.5 rounded-[10px] border bg-secondary px-3 py-2">
            <span className="font-serif text-[1.1rem] font-bold">{word.simplified}</span>
            <span className="text-xs text-muted-foreground">({word.pinyin})</span>
            <Volume2 size={12} className="text-tone-1" />
          </button>
        ))}
      </div>
    </div>
  );
}
