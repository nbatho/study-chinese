import type { TranslationKey } from "../i18n";

type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

export type NumberedLesson = {
  order: number;
  title: string;
  hskLevel: number;
};

// Foundation lessons are stored as HSK 0, which is not a real level to show.
export const formatLessonTitle = (t: Translate, lesson: NumberedLesson) =>
  t(lesson.hskLevel >= 1 ? "learn.lessonTitle" : "learn.lessonTitleNoHsk", {
    lessonWord: t("learn.lesson"),
    order: lesson.order,
    title: lesson.title,
    hsk: lesson.hskLevel,
  });
