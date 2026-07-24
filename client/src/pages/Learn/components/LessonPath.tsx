import { useState } from "react";
import { BookOpen, CheckCircle2, ChevronDown, ChevronRight, Clock3, FileText, Headphones, ListChecks, Lock, MessageCircle, PenLine, PlayCircle, Sparkles } from "lucide-react";
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
  // Topics start collapsed to a compact, name-only list so a long roadmap stays
  // scannable; tracking the expanded set (empty by default) keeps every topic —
  // including ones from a newly selected level — collapsed until opened.
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(() => new Set());
  const toggleTopic = (topicId: string) =>
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
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

  if (!flatEntries.length) {
    return (
      <div className="rounded-lg border bg-card p-5 text-center text-sm font-semibold text-muted-foreground">
        {t("home.noLessons")}
      </div>
    );
  }

  const renderLesson = (entry: CurriculumLessonEntry, index: number, compact = false) => {
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
    const counts = serverLesson?.contentCounts;
    const contentBadges = (counts
      ? [
          { icon: Sparkles, count: counts.vocab, key: "learn.content.vocab" as TranslationKey },
          { icon: FileText, count: counts.grammar, key: "learn.content.grammar" as TranslationKey },
          { icon: MessageCircle, count: counts.dialogueLines, key: "learn.content.dialogue" as TranslationKey },
          { icon: BookOpen, count: counts.readingPassages, key: "learn.content.reading" as TranslationKey },
          { icon: ListChecks, count: counts.exercises, key: "learn.content.exercises" as TranslationKey },
        ]
      : []
    ).filter((badge) => badge.count > 0);

    return (
      <div key={curriculumLesson.order} className="relative pl-13">
        <div
          className={cn(
            "absolute left-0 z-10 flex size-9 items-center justify-center rounded-xl border bg-card shadow-sm",
            compact ? "top-2.5" : "top-4",
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
            "group flex w-full flex-col gap-3 rounded-xl border bg-card text-left shadow-sm transition",
            compact ? "p-3" : "p-4 sm:p-5",
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
              <h4 className={cn("mt-1 text-[1.05rem] font-extrabold", compact ? "line-clamp-1" : "line-clamp-2")}>{title}</h4>
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
          {!compact && (
            <>
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
          {contentBadges.length > 0 && (
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              {contentBadges.map((badge) => {
                const BadgeIcon = badge.icon;
                return (
                  <span
                    key={badge.key}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[0.7rem] font-bold",
                      isLocked ? "bg-muted text-muted-foreground" : "bg-secondary text-muted-foreground",
                    )}
                  >
                    <BadgeIcon size={12} />
                    {t(badge.key, { count: badge.count })}
                  </span>
                );
              })}
            </div>
          )}
            </>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {curriculum.topics.map((topic, topicIndex) => {
        const isCollapsed = !expandedTopics.has(topic.id);
        return (
        <section key={topic.id} className="rounded-2xl border bg-card p-4 text-left shadow-sm sm:p-5">
          <button
            type="button"
            onClick={() => toggleTopic(topic.id)}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? t("learn.path.expand") : t("learn.path.collapse")}
            className={cn(
              "group flex w-full items-center justify-between gap-3 text-left transition",
              isCollapsed ? "mb-0" : "mb-5",
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition group-hover:text-primary">
                <ChevronDown className={cn("size-4 transition-transform", isCollapsed && "-rotate-90")} />
              </span>
              <div className="min-w-0">
                <span className="text-sm font-bold text-primary">{t("learn.path.topic", { index: topicIndex + 1 })}</span>
                <h3 className="mt-0.5 truncate text-xl font-extrabold">{topic.title}</h3>
              </div>
            </div>
            <span className="shrink-0 text-xs font-bold text-muted-foreground">{t("learn.path.lessonsCount", { count: topic.lessons.length })}</span>
          </button>
          <div className={cn("relative grid gap-3", isCollapsed && "gap-2")}>
            {!isCollapsed && <div className="absolute bottom-5 left-4 top-5 w-px bg-border" />}
            {topic.lessons.map((curriculumLesson) => {
              const entry = {
                curriculumLesson,
                serverLesson: lessonsByOrder.get(curriculumLesson.order),
              };
              return renderLesson(entry, entryIndexByOrder.get(curriculumLesson.order) ?? 0, isCollapsed);
            })}
          </div>
        </section>
        );
      })}

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
