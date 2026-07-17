import { useMemo } from "react";
import { useLessonsQuery } from "../api/lessons/queries";
import { useUserProfileQuery } from "../api/users/queries";
import { useI18n } from "../i18n";
import { FOUNDATION_STAGES } from "../pages/Foundation/foundationCourse";
import { getLevelProgress } from "../pages/Learn/curriculum";
import { useAppSelector } from "../store/hooks";
import { useNextLesson } from "./useNextLesson";
import { useSelectedHskLevel } from "./useSelectedHskLevel";

/**
 * Progress on the roadmap level the learner is currently on: Foundation until it
 * is finished, then the HSK level selected on the Learn screen.
 *
 * Home, Navbar, and Profile all label this "curriculum progress", so they read it
 * from here instead of each counting lessons their own way — the numbers must
 * agree across the app.
 */
export const useRoadmapProgress = () => {
  const { t, language } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const profileQuery = useUserProfileQuery(isAuthenticated);
  const lessonsQuery = useLessonsQuery(isAuthenticated);

  const profile = profileQuery.data?.profile;
  const lessons = useMemo(() => lessonsQuery.data?.lessons ?? [], [lessonsQuery.data?.lessons]);
  const { foundationComplete } = useNextLesson(lessons, language, !isAuthenticated);
  const { selectedHsk, selectedCurriculum } = useSelectedHskLevel(
    profile?.cefrLevel ?? "A1",
    profile?.placementTestCompletedAt ?? null,
    foundationComplete,
  );

  const { completedLessons, totalLessons, progressPercent } = useMemo(() => {
    if (selectedHsk === 0) {
      const completed = lessons.filter((lesson) => lesson.hskLevel === 0 && lesson.completedAt).length;
      const total = FOUNDATION_STAGES.length;
      return {
        completedLessons: completed,
        totalLessons: total,
        progressPercent: total ? Math.round((completed / total) * 100) : 0,
      };
    }
    const { completedCount, lessonCount, percent } = getLevelProgress(selectedCurriculum, lessons);
    return { completedLessons: completedCount, totalLessons: lessonCount, progressPercent: percent };
  }, [lessons, selectedHsk, selectedCurriculum]);

  return {
    selectedHsk,
    /** Short name of the level, for badges: "Foundation" or "HSK 3". */
    levelLabel: selectedHsk === 0 ? t("nav.foundation") : `HSK ${selectedHsk}`,
    completedLessons,
    totalLessons,
    progressPercent,
  };
};
