import { CheckCircle2, Clock3, FileText, Headphones, Lock, MessageCircle, PenLine, PlayCircle, Sparkles } from "lucide-react";
import type { LessonSummary } from "../../../api/lessons";
import { useI18n } from "../../../i18n";
import type { TranslationKey } from "../../../i18n";
import { cn } from "../../../utils/cn";
import type { CurriculumLesson, CurriculumSkill, HskCurriculumLevel } from "../curriculum";

const SKILL_ICON = {
  grammar: FileText,
  vocabulary: Sparkles,
  writing: PenLine,
  listening: Headphones,
  speaking: MessageCircle,
  reading: FileText,
  test: CheckCircle2,
} satisfies Record<CurriculumSkill, typeof FileText>;

type CurriculumLessonEntry = {
  curriculumLesson: CurriculumLesson;
  serverLesson?: LessonSummary;
};

export default function LessonPath({
  curriculum,
  lessons,
  onSelectLesson,
  isLessonLocked,
  isCurriculumLocked,
}: {
  curriculum: HskCurriculumLevel;
  lessons: LessonSummary[];
  onSelectLesson: (lessonId: string) => void;
  isLessonLocked?: (lesson: LessonSummary) => boolean;
  isCurriculumLocked?: (lesson: CurriculumLesson) => boolean;
}) {
  const { t } = useI18n();
  const lessonsByOrder = new Map(lessons.map((lesson) => [lesson.order, lesson]));
  const flatEntries: CurriculumLessonEntry[] = [
    ...curriculum.topics.flatMap((topic) =>
      topic.lessons.map((curriculumLesson) => ({
        curriculumLesson,
        serverLesson: lessonsByOrder.get(curriculumLesson.order),
      })),
    ),
    {
      curriculumLesson: curriculum.endTest,
      serverLesson: lessonsByOrder.get(curriculum.endTest.order),
    },
  ];
  const firstIncompleteIndex = flatEntries.findIndex(
    (entry) => entry.serverLesson && !entry.serverLesson.completedAt && !isLessonLocked?.(entry.serverLesson),
  );

  if (!flatEntries.length) {
    return (
      <div className="rounded-lg border bg-card p-5 text-center text-sm font-semibold text-muted-foreground">
        {t("home.noLessons")}
      </div>
    );
  }

  const renderLesson = (entry: CurriculumLessonEntry, index: number) => {
    const { curriculumLesson, serverLesson } = entry;
    const isCompleted = !!serverLesson?.completedAt;
    const isLockedByLevel = !isCompleted && (serverLesson ? Boolean(isLessonLocked?.(serverLesson)) : Boolean(isCurriculumLocked?.(curriculumLesson)));
    const isCurrent = Boolean(serverLesson) && !isLockedByLevel && (firstIncompleteIndex === index || (firstIncompleteIndex === -1 && index === flatEntries.length - 1));
    const isUnlockedByProgress = isCompleted || firstIncompleteIndex === -1 || index === firstIncompleteIndex;
    const isMissingContent = !serverLesson;
    const isLocked = isLockedByLevel || isMissingContent || !isUnlockedByProgress;
    const isLeft = index % 2 === 0;
    const statusKey: TranslationKey = isCompleted
      ? "learn.pathCompleted"
      : isLocked
        ? "learn.pathLocked"
        : "learn.pathUnlocked";
    const SkillIcon = SKILL_ICON[curriculumLesson.skill];
    const NodeIcon = isCompleted ? CheckCircle2 : isLocked ? Lock : PlayCircle;
    const statusText = isMissingContent && !isLockedByLevel ? "Soon" : t(statusKey);

    return (
      <div key={curriculumLesson.order} className="relative mb-5 min-h-29.5 last:mb-0">
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
            if (!isLocked && serverLesson) onSelectLesson(serverLesson.id);
          }}
          className={cn(
            "ml-20 flex min-h-29.5 w-[calc(100%-5rem)] flex-col justify-between rounded-lg border bg-card p-4 text-left shadow-sm transition sm:w-[44%]",
            isLeft ? "sm:ml-0 sm:mr-auto" : "sm:ml-auto sm:mr-0",
            isCompleted && "border-jade/40 bg-jade/5",
            isCurrent && !isCompleted && "border-primary/50 ring-2 ring-primary/10 hover:-translate-y-0.5 hover:shadow-md",
            isLocked && "cursor-not-allowed border-dashed bg-secondary/70 opacity-75",
            !isLocked && !isCurrent && "cursor-pointer hover:-translate-y-0.5 hover:shadow-md",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className={cn("inline-flex items-center gap-1.5 text-xs font-bold uppercase", isCompleted ? "text-jade" : isLocked ? "text-muted-foreground" : "text-primary")}>
                <SkillIcon size={14} />
                {t("learn.lesson")} {curriculumLesson.order} - {curriculumLesson.skill}
              </span>
              <h4 className="mt-1 line-clamp-2 text-[1.05rem] font-extrabold">{curriculumLesson.title}</h4>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-md px-2 py-1 text-[0.7rem] font-extrabold",
                isCompleted && "bg-jade/10 text-jade",
                isCurrent && !isCompleted && "bg-primary/10 text-primary",
                isLocked && "bg-muted text-muted-foreground",
              )}
            >
              {statusText}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-[0.84rem] text-muted-foreground">{curriculumLesson.objective}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-bold text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock3 size={14} />
              {serverLesson?.estimatedMinutes ?? curriculumLesson.estimatedMinutes} min
            </span>
            <span>+{serverLesson?.xpReward ?? curriculumLesson.xpReward} XP</span>
            <span>Level {serverLesson?.cefrLevel ?? curriculum.cefrLevel}</span>
            {isCompleted && <span className="text-jade">{Math.round(serverLesson.bestAccuracy)}% Acc</span>}
          </div>
        </button>
      </div>
    );
  };

  let globalIndex = 0;

  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-secondary/50 p-4 text-left">
        <div className="text-xs font-bold uppercase text-primary">HSK {curriculum.hskLevel} - CEFR {curriculum.cefrLevel}</div>
        <h3 className="mt-1 text-xl font-extrabold">{curriculum.focus}</h3>
      </div>

      {curriculum.topics.map((topic, topicIndex) => (
        <section key={topic.id} className="border-t pt-5">
          <div className="mb-4 text-left">
            <span className="text-xs font-bold uppercase text-muted-foreground">Topic {topicIndex + 1}</span>
            <h3 className="mt-1 text-xl font-extrabold">{topic.title}</h3>
          </div>
          <div className="relative mx-auto max-w-195 py-1">
            <div className="absolute bottom-10 left-8 top-10 w-1 -translate-x-1/2 rounded-full bg-border sm:left-1/2" />
            {topic.lessons.map((curriculumLesson) => {
              const entry = {
                curriculumLesson,
                serverLesson: lessonsByOrder.get(curriculumLesson.order),
              };
              const rendered = renderLesson(entry, globalIndex);
              globalIndex += 1;
              return rendered;
            })}
          </div>
        </section>
      ))}

      <section className="border-t pt-5">
        <div className="mb-4 text-left">
          <span className="text-xs font-bold uppercase text-muted-foreground">End-of-level test</span>
          <h3 className="mt-1 text-xl font-extrabold">Can-do checkpoint</h3>
        </div>
        <div className="relative mx-auto max-w-195 py-1">
          <div className="absolute bottom-10 left-8 top-10 w-1 -translate-x-1/2 rounded-full bg-border sm:left-1/2" />
          {renderLesson(
            {
              curriculumLesson: curriculum.endTest,
              serverLesson: lessonsByOrder.get(curriculum.endTest.order),
            },
            globalIndex,
          )}
        </div>
      </section>
    </div>
  );
}
