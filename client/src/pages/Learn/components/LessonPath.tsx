import { CheckCircle2, Clock3, Lock, PlayCircle } from "lucide-react";
import type { LessonSummary } from "../../../api/lessons";
import { useI18n } from "../../../i18n";
import type { TranslationKey } from "../../../i18n";
import { cn } from "../../../utils/cn";

export default function LessonPath({ lessons, onSelectLesson }: { lessons: LessonSummary[]; onSelectLesson: (lessonId: string) => void }) {
  const { t } = useI18n();
  const firstIncompleteIndex = lessons.findIndex((lesson) => !lesson.completedAt);

  if (!lessons.length) {
    return (
      <div className="rounded-lg border bg-card p-5 text-center text-sm font-semibold text-muted-foreground">
        {t("home.noLessons")}
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-[780px] py-1">
      <div className="absolute bottom-10 left-8 top-10 w-1 -translate-x-1/2 rounded-full bg-border sm:left-1/2" />
      {lessons.map((lesson, index) => {
        const isCompleted = !!lesson.completedAt;
        const isCurrent = firstIncompleteIndex === index || (firstIncompleteIndex === -1 && index === lessons.length - 1);
        const isUnlocked = isCompleted || firstIncompleteIndex === -1 || index === firstIncompleteIndex;
        const isLocked = !isUnlocked;
        const isLeft = index % 2 === 0;
        const statusKey: TranslationKey = isCompleted
          ? "learn.pathCompleted"
          : isLocked
            ? "learn.pathLocked"
            : "learn.pathUnlocked";
        const NodeIcon = isCompleted ? CheckCircle2 : isLocked ? Lock : PlayCircle;

        return (
          <div key={lesson.id} className="relative mb-5 min-h-[118px] last:mb-0">
            <div
              className={cn(
                "absolute left-8 top-1/2 z-10 flex size-13 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-background shadow-sm sm:left-1/2",
                isCompleted && "bg-jade text-white",
                isCurrent && !isCompleted && "bg-primary text-primary-foreground",
                isLocked && "bg-muted text-muted-foreground",
              )}
            >
              <NodeIcon size={24} />
            </div>
            <button
              type="button"
              disabled={isLocked}
              onClick={() => {
                if (isUnlocked) onSelectLesson(lesson.id);
              }}
              className={cn(
                "ml-20 flex min-h-[118px] w-[calc(100%-5rem)] flex-col justify-between rounded-lg border bg-card p-4 text-left shadow-sm transition sm:w-[44%]",
                isLeft ? "sm:ml-0 sm:mr-auto" : "sm:ml-auto sm:mr-0",
                isCompleted && "border-jade/40 bg-jade/5",
                isCurrent && !isCompleted && "border-primary/50 ring-2 ring-primary/10 hover:-translate-y-0.5 hover:shadow-md",
                isLocked && "cursor-not-allowed border-dashed bg-secondary/70 opacity-75",
                !isLocked && !isCurrent && "cursor-pointer hover:-translate-y-0.5 hover:shadow-md",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className={cn("text-xs font-bold uppercase", isCompleted ? "text-jade" : isLocked ? "text-muted-foreground" : "text-primary")}>
                    {t("learn.lesson")} {lesson.order} - {lesson.skill.toUpperCase()}
                  </span>
                  <h4 className="mt-1 line-clamp-2 text-[1.05rem] font-extrabold">{lesson.title}</h4>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-md px-2 py-1 text-[0.7rem] font-extrabold",
                    isCompleted && "bg-jade/10 text-jade",
                    isCurrent && !isCompleted && "bg-primary/10 text-primary",
                    isLocked && "bg-muted text-muted-foreground",
                  )}
                >
                  {t(statusKey)}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-[0.84rem] text-muted-foreground">{lesson.subtitle}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-bold text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock3 size={14} />
                  {lesson.estimatedMinutes} min
                </span>
                <span>+{lesson.xpReward} XP</span>
                {isCompleted && <span className="text-jade">{Math.round(lesson.bestAccuracy)}% Acc</span>}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
