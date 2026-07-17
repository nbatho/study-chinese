import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Lock } from "lucide-react";
import { useCompleteLessonByIdMutation, useLessonsQuery, useUserProfileQuery } from "../../api";
import { useI18n } from "../../i18n";
import { useAppSelector } from "../../store/hooks";
import { useSelectedHskLevel } from "../../hooks/useSelectedHskLevel";
import { cn } from "../../utils/cn";
import {
  FOUNDATION_STAGES,
  FOUNDATION_TOTAL_MINUTES,
  loadFoundationProgress,
  localized,
  saveFoundationProgress,
  type FoundationStage,
} from "./foundationCourse";
import StageBody from "./components/StageBody";

export default function Foundation() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const lessonsQuery = useLessonsQuery(isAuthenticated);
  const completeMutation = useCompleteLessonByIdMutation();
  const profileQuery = useUserProfileQuery(isAuthenticated);

  const profile = profileQuery.data?.profile;
  const { selectHskLevel } = useSelectedHskLevel(
    profile?.cefrLevel ?? "A1",
    profile?.placementTestCompletedAt ?? null,
    false,
  );

  useEffect(() => {
    selectHskLevel(0);
  }, [selectHskLevel]);

  const [searchParams] = useSearchParams();

  // Guest progress lives in localStorage; signed-in progress lives in the DB
  // (lessons table, hsk_level 0) so it counts toward XP/streak and syncs per account.
  const [localCompleted, setLocalCompleted] = useState<Set<string>>(() => loadFoundationProgress());

  const dbCompletedLessonIds = useMemo(
    () => new Set((lessonsQuery.data?.lessons ?? []).filter((lesson) => lesson.completedAt).map((lesson) => lesson.id)),
    [lessonsQuery.data?.lessons],
  );

  const completedStageIds = useMemo(() => {
    const ids = new Set<string>();
    for (const stage of FOUNDATION_STAGES) {
      // Signed-in users: DB is the single source of truth so progress stays in
      // sync after resets and across devices. Guests fall back to localStorage.
      const done = isAuthenticated
        ? dbCompletedLessonIds.has(stage.lessonId)
        : localCompleted.has(stage.id) || dbCompletedLessonIds.has(stage.lessonId);
      if (done) ids.add(stage.id);
    }
    return ids;
  }, [isAuthenticated, localCompleted, dbCompletedLessonIds]);

  const [activeIndex, setActiveIndex] = useState(() => {
    const stageParam = searchParams.get("stage");
    if (stageParam !== null) {
      const idx = parseInt(stageParam, 10);
      if (!isNaN(idx) && idx >= 0 && idx < FOUNDATION_STAGES.length) {
        return idx;
      }
    }
    const firstUnfinished = FOUNDATION_STAGES.findIndex((stage) => !completedStageIds.has(stage.id));
    return firstUnfinished === -1 ? 0 : firstUnfinished;
  });





  const stage = FOUNDATION_STAGES[activeIndex];
  const totalStages = FOUNDATION_STAGES.length;
  const completedCount = completedStageIds.size;
  const percent = Math.round((completedCount / totalStages) * 100);
  const courseDone = completedCount === totalStages;
  const isStageDone = completedStageIds.has(stage.id);

  const markStageDone = (target: FoundationStage, accuracy = 100) => {
    setLocalCompleted((prev) => {
      if (prev.has(target.id)) return prev;
      const nextSet = new Set(prev);
      nextSet.add(target.id);
      saveFoundationProgress(nextSet);
      return nextSet;
    });

    if (isAuthenticated && !dbCompletedLessonIds.has(target.lessonId)) {
      completeMutation.mutate({ lessonId: target.lessonId, accuracy, minutes: target.minutes });
    }
  };

  const goNext = () => {
    markStageDone(stage);
    if (activeIndex + 1 < totalStages) setActiveIndex(activeIndex + 1);
  };

  return (
    <div className="app-page">
      <div className="grid gap-5">
        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="p-5 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
                <GraduationCap size={17} />
                {t("foundation.badge")}
              </span>
              <span className="rounded-xl bg-secondary px-3 py-1.5 text-sm font-bold text-muted-foreground">
                {t("foundation.beforeHsk1")}
              </span>
              <span className="rounded-xl bg-secondary px-3 py-1.5 text-sm font-bold text-muted-foreground">
                ~{FOUNDATION_TOTAL_MINUTES} {t("common.minutes")}
              </span>
            </div>
            <h1 className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">{t("foundation.title")}</h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-muted-foreground sm:text-base">
              {t("foundation.subtitle")}
            </p>
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-muted-foreground">
                <span>{t("foundation.progress")}</span>
                <span>{completedCount}/{totalStages} · {percent}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
              </div>
            </div>
            {courseDone && (
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-dashed border-jade bg-jade/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-jade">
                  <CheckCircle2 size={18} />
                  {t("foundation.doneBanner")}
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/learn")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:translate-y-px"
                >
                  {t("foundation.goToHsk1")}
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </section>
 
        <div className="grid gap-4 lg:grid-cols-[minmax(240px,0.32fr)_minmax(0,1fr)]">
          <aside className="rounded-2xl border bg-card p-3 shadow-sm">
            <h2 className="px-2 py-1 text-sm font-extrabold text-muted-foreground">{t("foundation.stages")}</h2>
            <ol className="mt-1 grid gap-1">
              {FOUNDATION_STAGES.map((item, itemIndex) => {
                const done = completedStageIds.has(item.id);
                const locked = itemIndex > 0 && !completedStageIds.has(FOUNDATION_STAGES[itemIndex - 1].id) && !done;
                const isActive = itemIndex === activeIndex;
                return (
                  <li key={item.id} className="min-w-0">
                    <button
                      type="button"
                      disabled={locked}
                      onClick={() => setActiveIndex(itemIndex)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                        isActive ? "bg-primary/10 text-primary" : "hover:bg-secondary",
                        locked && "cursor-not-allowed opacity-50",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-7 shrink-0 place-items-center rounded-lg text-xs font-extrabold",
                          done ? "bg-jade/15 text-jade" : isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                        )}
                      >
                        {done ? <CheckCircle2 size={16} /> : locked ? <Lock size={13} /> : itemIndex + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold">{localized(item.title, language)}</span>
                        <span className="block text-xs font-semibold text-muted-foreground">~{item.minutes} {t("common.minutes")}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>
 
          <section className="rounded-2xl border bg-card p-4 text-left shadow-sm sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-extrabold text-primary">
                  {t("foundation.stepOf", { current: activeIndex + 1, total: totalStages })}
                </div>
                <h2 className="mt-1 text-2xl font-extrabold">{localized(stage.title, language)}</h2>
                <p className="mt-1 max-w-2xl text-sm font-semibold leading-relaxed text-muted-foreground">{localized(stage.subtitle, language)}</p>
              </div>
              {isStageDone && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-jade/10 px-2 py-1 text-xs font-extrabold text-jade">
                  <CheckCircle2 size={14} /> {t("foundation.completed")}
                </span>
              )}
            </div>

            <StageBody stage={stage} onDone={(accuracy) => markStageDone(stage, accuracy)} />

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                className="inline-flex items-center justify-center gap-2 rounded-xl border bg-background px-4 py-2.5 text-sm font-bold transition hover:border-primary hover:text-primary active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={16} /> {t("common.back")}
              </button>
              {activeIndex + 1 < totalStages ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:translate-y-px"
                >
                  {t("foundation.markAndNext")}
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    markStageDone(stage);
                    navigate("/learn");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:translate-y-px"
                >
                  {t("foundation.finish")}
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
