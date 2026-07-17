import { useNavigate, useOutletContext } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { useLessonsQuery } from "../../../api";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { useI18n } from "../../../i18n";
import { useAppSelector } from "../../../store/hooks";
import { formatLessonTitle } from "../../../utils/lessonTitle";
import { CURRICULUM_NEXT_ID, useNextLesson } from "../../../hooks/useNextLesson";

export default function ContinueLearningCard() {
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const { setSelectedLessonId } = useOutletContext<{
    setSelectedLessonId: (lessonId: string | null) => void;
  }>();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const lessonsQuery = useLessonsQuery(isAuthenticated);
  const lessons = lessonsQuery.data?.lessons ?? [];
  const { nextLesson } = useNextLesson(lessons, language, !isAuthenticated);

  const handleLessonStart = () => {
    if (!nextLesson || nextLesson.id === CURRICULUM_NEXT_ID) {
      navigate("/learn");
      return;
    }

    if (nextLesson.hskLevel === 0) {
      navigate(`/foundation?stage=${nextLesson.order - 1}`);
      return;
    }

    setSelectedLessonId(nextLesson.id);
    navigate("/learn");
  };

  return (
    <section className="app-surface-padded min-w-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold">{t("home.continueLearning")}</h2>
          <p className="text-sm font-medium text-muted-foreground">{t("home.nextLessonHint")}</p>
        </div>
        <Button type="button" variant="ghost" onClick={() => navigate("/learn")} className="shrink-0 rounded-xl">
          {t("home.allLessons")}
          <ArrowRight size={16} />
        </Button>
      </div>

      {nextLesson ? (
        <button
          type="button"
          onClick={handleLessonStart}
          className="group grid w-full gap-4 rounded-xl border bg-background/80 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg sm:grid-cols-[minmax(0,1fr)_auto]"
        >
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-lg">
                HSK {nextLesson.hskLevel}
              </Badge>
              <span className="text-xs font-bold text-muted-foreground">
                {nextLesson.estimatedMinutes} min · +{nextLesson.xpReward} XP
              </span>
            </div>
            <h3 className="truncate text-xl font-extrabold">{formatLessonTitle(t, nextLesson)}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{nextLesson.subtitle}</p>
          </div>
          <span className="flex size-16 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_0_rgba(217,63,71,0)] transition group-hover:scale-105 group-hover:shadow-[0_0_28px_rgba(217,63,71,0.35)]">
            <Play size={28} fill="currentColor" />
          </span>
        </button>
      ) : (
        <div className="rounded-xl border border-dashed bg-background p-6 text-center font-bold text-muted-foreground">
          {isAuthenticated ? t("home.noLessons") : t("home.loginToPersonalize")}
        </div>
      )}
    </section>
  );
}
