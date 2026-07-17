import { useMemo } from "react";
import type { LessonSummary } from "../api/lessons/types";
import type { Language } from "../i18n";
import {
  FOUNDATION_STAGES,
  isFoundationComplete,
  loadFoundationProgress,
  localized,
} from "../pages/Foundation/foundationCourse";
import { getCurriculumLessons, HSK_CURRICULUM } from "../pages/Learn/curriculum";

/**
 * Sentinel id for a lesson that exists in the curriculum plan but has no DB row
 * yet; call sites route to the lesson list instead of opening it directly.
 */
export const CURRICULUM_NEXT_ID = "curriculum-next";

export type NextLesson = Pick<
  LessonSummary,
  "id" | "hskLevel" | "order" | "title" | "subtitle" | "estimatedMinutes" | "xpReward" | "completedAt"
>;

/**
 * The app's "what do I study next" rule, shared by Home and Learn:
 * an unfinished Foundation stage first, then the first uncompleted DB lesson,
 * then the curriculum entry after the highest completed lesson.
 */
export function useNextLesson(lessons: LessonSummary[], language: Language) {
  // Foundation completion check: DB (signed-in) or localStorage (guest/offline).
  const foundationComplete = useMemo(() => {
    const dbLessons = lessons.filter((l) => l.hskLevel === 0 && l.completedAt);
    const dbFoundationDone = FOUNDATION_STAGES.every((stage) =>
      dbLessons.some((l) => l.id === stage.lessonId),
    );
    return dbFoundationDone || isFoundationComplete(loadFoundationProgress());
  }, [lessons]);

  const nextLesson = useMemo<NextLesson | null>(() => {
    if (!foundationComplete) {
      const localDone = loadFoundationProgress();
      const dbDone = new Set(lessons.filter((l) => l.hskLevel === 0 && l.completedAt).map((l) => l.id));
      const firstUnfinishedIndex = FOUNDATION_STAGES.findIndex(
        (stage) => !localDone.has(stage.id) && !dbDone.has(stage.lessonId)
      );
      if (firstUnfinishedIndex !== -1) {
        const stage = FOUNDATION_STAGES[firstUnfinishedIndex];
        return {
          id: stage.lessonId,
          hskLevel: 0,
          order: firstUnfinishedIndex + 1,
          title: localized(stage.title, language),
          subtitle: localized(stage.subtitle, language),
          estimatedMinutes: stage.minutes,
          xpReward: stage.xp,
          completedAt: null,
        };
      }
    }

    const sorted = [...lessons]
      .filter((l) => l.hskLevel > 0)
      .sort((a, b) => {
        if (a.hskLevel !== b.hskLevel) return a.hskLevel - b.hskLevel;
        return a.order - b.order;
      });

    const nextDbLesson = sorted.find((lesson) => !lesson.completedAt);
    if (nextDbLesson) return nextDbLesson;

    const highest = [...sorted]
      .filter((l) => l.completedAt)
      .sort((a, b) => {
        if (b.hskLevel !== a.hskLevel) return b.hskLevel - a.hskLevel;
        return b.order - a.order;
      })[0];

    let targetLevel = 1;
    let targetOrder = 1;

    if (highest) {
      const currLevel = HSK_CURRICULUM.find(c => c.hskLevel === highest.hskLevel);
      if (currLevel) {
        const currLessons = getCurriculumLessons(currLevel);
        const lastOrder = currLessons[currLessons.length - 1]?.order ?? 1;
        if (highest.order >= lastOrder) {
          targetLevel = highest.hskLevel + 1;
          targetOrder = 1;
        } else {
          targetLevel = highest.hskLevel;
          const nextCL = currLessons.find(l => l.order > highest.order);
          targetOrder = nextCL ? nextCL.order : highest.order + 1;
        }
      }
    }

    const targetCurriculumLevel = HSK_CURRICULUM.find(c => c.hskLevel === targetLevel);
    if (targetCurriculumLevel) {
      const targetCL = getCurriculumLessons(targetCurriculumLevel).find(l => l.order === targetOrder);
      if (targetCL) {
        return {
          id: CURRICULUM_NEXT_ID,
          hskLevel: targetLevel,
          order: targetOrder,
          title: targetCL.title,
          subtitle: targetCL.objective,
          estimatedMinutes: targetCL.estimatedMinutes,
          xpReward: targetCL.xpReward,
          completedAt: null,
        };
      }
    }

    return sorted[0] ?? null;
  }, [lessons, foundationComplete, language]);

  return { foundationComplete, nextLesson };
}
