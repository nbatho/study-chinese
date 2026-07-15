import { CheckCircle2, ChevronRight, Clock3, FileText, Headphones, Lock, MessageCircle, PenLine, PlayCircle, Sparkles } from "lucide-react";
import type { LessonSummary } from "../../../api/lessons";
import { useI18n } from "../../../i18n";
import type { TranslationKey } from "../../../i18n";
import { cn } from "../../../utils/cn";
import { formatLessonTitle } from "../../../utils/lessonTitle";
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
  guestMode = false,
  guestUnlockedOrders,
  onLockedClick,
}: {
  curriculum: HskCurriculumLevel;
  lessons: LessonSummary[];
  onSelectLesson: (lessonId: string) => void;
  isLessonLocked?: (lesson: LessonSummary) => boolean;
  isCurriculumLocked?: (lesson: CurriculumLesson) => boolean;
  guestMode?: boolean;
  guestUnlockedOrders?: Set<number>;
  onLockedClick?: () => void;
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
  const entryIndexByOrder = new Map(flatEntries.map((entry, index) => [entry.curriculumLesson.order, index]));
  const completedCount = flatEntries.filter((entry) => entry.serverLesson?.completedAt).length;
  const availableCount = flatEntries.filter((entry) => entry.serverLesson).length;
  const progressPercent = Math.round(flatEntries.length ? (completedCount / flatEntries.length) * 100 : 0);

  if (!flatEntries.length) {
    return (
      <div className="rounded-lg border bg-card p-5 text-center text-sm font-semibold text-muted-foreground">
        {t("home.noLessons")}
      </div>
    );
  }

  const renderLesson = (entry: CurriculumLessonEntry, index: number) => {
    const { curriculumLesson, serverLesson } = entry;
    const title = formatLessonTitle(t, {
      order: curriculumLesson.order,
      title: serverLesson?.title || curriculumLesson.title,
      hskLevel: serverLesson?.hskLevel ?? curriculum.hskLevel,
    });
    const objective = serverLesson?.subtitle || curriculumLesson.objective;
    const isCompleted = !!serverLesson?.completedAt;
    const isLockedByLevel = !isCompleted && (serverLesson ? Boolean(isLessonLocked?.(serverLesson)) : Boolean(isCurriculumLocked?.(curriculumLesson)));
    const isCurrent = Boolean(serverLesson) && !isLockedByLevel && (firstIncompleteIndex === index || (firstIncompleteIndex === -1 && index === flatEntries.length - 1));
    const isUnlockedByProgress = isCompleted || firstIncompleteIndex === -1 || index === firstIncompleteIndex;
    const isMissingContent = !serverLesson;
    // Guests: only lessons in the free trial set (HSK1 topic 1) are open; every
    // other lesson is locked and prompts login when clicked.
    const isLocked = guestMode
      ? !(serverLesson && guestUnlockedOrders?.has(curriculumLesson.order))
      : isLockedByLevel || isMissingContent || !isUnlockedByProgress;
    const statusKey: TranslationKey = isCompleted
      ? "learn.pathCompleted"
      : isLocked
        ? "learn.pathLocked"
        : "learn.pathUnlocked";
    const SkillIcon = SKILL_ICON[curriculumLesson.skill];
    const NodeIcon = isCompleted ? CheckCircle2 : isLocked ? Lock : PlayCircle;
    const statusText = isMissingContent && !isLockedByLevel ? "Soon" : t(statusKey);

    return (
      <div key={curriculumLesson.order} className="relative pl-13">
        <div
          className={cn(
            "absolute left-0 top-4 z-10 flex size-9 items-center justify-center rounded-xl border bg-card shadow-sm",
            isCompleted && "border-jade/35 bg-jade text-white",
            isCurrent && !isCompleted && "border-primary bg-primary text-primary-foreground",
            isLocked && "border-dashed bg-muted text-muted-foreground",
          )}
        >
          <NodeIcon size={18} />
        </div>
        <button
          type="button"
          disabled={isLocked && !(guestMode && onLockedClick)}
          onClick={() => {
            if (isLocked) {
              if (guestMode) onLockedClick?.();
              return;
            }
            if (serverLesson) onSelectLesson(serverLesson.id);
          }}
          className={cn(
            "group flex w-full flex-col gap-3 rounded-xl border bg-card p-4 text-left shadow-sm transition sm:p-5",
            isCompleted && "border-jade/40 bg-jade/5",
            isCurrent && !isCompleted && "border-primary/50 bg-primary/5 ring-2 ring-primary/10 hover:-translate-y-0.5 hover:shadow-md",
            isLocked && !(guestMode && onLockedClick) && "cursor-not-allowed border-dashed bg-secondary/70 opacity-75",
            isLocked && guestMode && onLockedClick && "cursor-pointer border-dashed bg-secondary/60 opacity-90 hover:-translate-y-0.5 hover:shadow-md",
            !isLocked && !isCurrent && "cursor-pointer hover:-translate-y-0.5 hover:shadow-md",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className={cn("inline-flex items-center gap-1.5 text-xs font-bold", isCompleted ? "text-jade" : isLocked ? "text-muted-foreground" : "text-primary")}>
                <SkillIcon size={14} />
                {curriculumLesson.skill}
              </span>
              <h4 className="mt-1 line-clamp-2 text-[1.05rem] font-extrabold">{title}</h4>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={cn(
                  "rounded-lg px-2.5 py-1 text-[0.72rem] font-extrabold",
                  isCompleted && "bg-jade/10 text-jade",
                  isCurrent && !isCompleted && "bg-primary/10 text-primary",
                  isLocked && "bg-muted text-muted-foreground",
                )}
              >
                {statusText}
              </span>
              {!isLocked && <ChevronRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />}
            </div>
          </div>
          <p className="mt-2 line-clamp-2 text-[0.84rem] text-muted-foreground">{objective}</p>
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

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border bg-card p-4 text-left shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-sm font-extrabold text-primary">HSK {curriculum.hskLevel} - CEFR {curriculum.cefrLevel}</div>
            <h3 className="mt-1 text-2xl font-extrabold">{curriculum.focus}</h3>
            <p className="mt-2 max-w-2xl text-sm font-semibold text-muted-foreground">
              {t("learn.path.summary", { completed: completedCount, total: flatEntries.length, available: availableCount })}
            </p>
          </div>
          <div className="min-w-[180px] rounded-xl bg-secondary p-3">
            <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-muted-foreground">
              <span>{t("learn.path.progress")}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-background">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

        </div>
      </div>

      {curriculum.topics.map((topic, topicIndex) => (
        <section key={topic.id} className="rounded-2xl border bg-card p-4 text-left shadow-sm sm:p-5">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-sm font-bold text-primary">{t("learn.path.topic", { index: topicIndex + 1 })}</span>
              <h3 className="mt-1 text-xl font-extrabold">{topic.title}</h3>
            </div>
            <span className="text-xs font-bold text-muted-foreground">{t("learn.path.lessonsCount", { count: topic.lessons.length })}</span>
          </div>
          <div className="relative grid gap-3">
            <div className="absolute bottom-5 left-4 top-5 w-px bg-border" />
            {topic.lessons.map((curriculumLesson) => {
              const entry = {
                curriculumLesson,
                serverLesson: lessonsByOrder.get(curriculumLesson.order),
              };
              return renderLesson(entry, entryIndexByOrder.get(curriculumLesson.order) ?? 0);
            })}
          </div>
        </section>
      ))}

      <section className="rounded-2xl border bg-card p-4 text-left shadow-sm sm:p-5">
        <div className="mb-5">
          <span className="text-sm font-bold text-primary">{t("learn.path.finalTest")}</span>
          <h3 className="mt-1 text-xl font-extrabold">{t("learn.path.milestone")}</h3>
        </div>
        <div className="relative">
          {renderLesson(
            {
              curriculumLesson: curriculum.endTest,
              serverLesson: lessonsByOrder.get(curriculum.endTest.order),
            },
            entryIndexByOrder.get(curriculum.endTest.order) ?? flatEntries.length - 1,
          )}
        </div>
      </section>
    </div>
  );
}
