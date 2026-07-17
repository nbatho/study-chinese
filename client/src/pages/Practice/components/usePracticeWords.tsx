// Practice words follow the lesson the user is currently on: the first
// uncompleted course lesson (foundation stages, hsk_level 0, carry no vocab and

import { useMemo } from "react";
import { useLessonDetailQuery, useLessonsQuery, useVocabularyQuery } from "../../../api";

// are skipped). Falls back to the HSK1 vocab list when no lesson words exist.
export default function usePracticeWords() {
    const lessonsQuery = useLessonsQuery();
    const courseLessons = useMemo(
        () => (lessonsQuery.data?.lessons ?? []).filter((lesson) => lesson.hskLevel >= 1),
        [lessonsQuery.data?.lessons],
    );
    const currentLesson =
        courseLessons.find((lesson) => !lesson.completedAt) ?? courseLessons[courseLessons.length - 1];
    const lessonDetailQuery = useLessonDetailQuery(currentLesson?.id ?? "", Boolean(currentLesson));
    const lessonWords = lessonDetailQuery.data?.lesson.newWords ?? [];

    const lessonResolved =
        lessonsQuery.isError ||
        lessonDetailQuery.isError ||
        (lessonsQuery.isSuccess && !currentLesson) ||
        lessonDetailQuery.isSuccess;
    const useFallback = lessonResolved && lessonWords.length === 0;
    const vocabQuery = useVocabularyQuery({ hsk: 1 }, useFallback);

    return {
        isLoading:
            lessonsQuery.isLoading || lessonDetailQuery.isLoading || (useFallback && vocabQuery.isLoading),
        words: lessonWords.length > 0 ? lessonWords : vocabQuery.data?.vocab ?? [],
        lessonTitle: lessonWords.length > 0 ? currentLesson?.title : undefined,
    };
}