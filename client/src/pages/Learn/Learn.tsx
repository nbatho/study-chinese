import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpenCheck, CheckCircle2, ClipboardCheck, Lock, LogIn, PenLine, Trophy } from "lucide-react";
import { useLessonsQuery, useUserProfileQuery } from "../../api";
import { useSampleLessonsQuery } from "../../api/lessons/queries";
import { useI18n } from "../../i18n";
import type { TranslationKey } from "../../i18n";
import { useSelectedHskLevel } from "../../hooks/useSelectedHskLevel";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";
import LessonPath from "./components/LessonPath";
import LessonPlayer from "./components/LessonPlayer";
import { CEFR_RANK, getCurriculumLessons, getLevelProgress, HSK_CURRICULUM } from "./curriculum";
import { FOUNDATION_STAGES, isFoundationComplete, loadFoundationProgress } from "../Foundation/foundationCourse";


export default function Learn() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const { selectedLessonId, setSelectedLessonId } = useOutletContext<{
    selectedLessonId: string | null;
    setSelectedLessonId: (lessonId: string | null) => void;
  }>();
  const lessonsQuery = useLessonsQuery(isAuthenticated);
  const profileQuery = useUserProfileQuery(isAuthenticated);
  const lessonPathRef = useRef<HTMLDivElement | null>(null);
  const sampleLessonsQuery = useSampleLessonsQuery(!isAuthenticated);
  // Guests get the same UI, fed by the public HSK1 trial lessons.
  const lessons = isAuthenticated
    ? (lessonsQuery.data?.lessons ?? [])
    : (sampleLessonsQuery.data?.lessons ?? []);
  // Guests may only open HSK1's first topic (chủ đề 1); everything else is
  // locked and prompts login on click.
  const guestUnlockedOrders = useMemo(() => {
    const hsk1 = HSK_CURRICULUM.find((level) => level.hskLevel === 1);
    return new Set<number>(hsk1?.topics[0]?.lessons.map((lesson) => lesson.order) ?? []);
  }, []);
  const profile = profileQuery.data?.profile;
  const userCefrLevel = profile?.cefrLevel ?? "A1";
  const placementAt = profile?.placementTestCompletedAt ?? null;
  const needsPlacementTest = !profile?.placementTestCompletedAt;
  const { selectedHsk: selectedHSK, selectedCurriculum, selectHskLevel: selectHskLevelState } = useSelectedHskLevel(
    userCefrLevel,
    placementAt,
  );

  // Foundation completion check: DB (signed-in) or localStorage (guest/offline).
  const foundationComplete = useMemo(() => {
    const dbLessons = lessons.filter((l) => l.hskLevel === 0 && l.completedAt);
    const dbFoundationDone = FOUNDATION_STAGES.every((stage) =>
      dbLessons.some((l) => l.id === stage.lessonId),
    );
    return dbFoundationDone || isFoundationComplete(loadFoundationProgress());
  }, [lessons]);

  // Per-level progress lookup for prerequisite checks.
  const levelProgressMap = useMemo(() => {
    const map = new Map<number, number>();
    for (const curriculum of HSK_CURRICULUM) {
      map.set(curriculum.hskLevel, getLevelProgress(curriculum, lessons).percent);
    }
    return map;
  }, [lessons]);

  /**
   * HSK locking with prerequisites:
   * - HSK1: always open
   * - HSK2+: requires Foundation complete AND the previous HSK level at 100%
   */
  const isHskLevelLocked = (hskLevel: number): boolean => {
    if (hskLevel <= 1) return false;
    if (!foundationComplete) return true;
    // Check all previous levels are complete
    for (let prev = 1; prev < hskLevel; prev++) {
      if ((levelProgressMap.get(prev) ?? 0) < 100) return true;
    }
    return false;
  };

  /** Human-readable reason why a level is locked, or null if open. */
  const getLockReason = (hskLevel: number): string | null => {
    if (hskLevel <= 1) return null;
    if (!foundationComplete) return t("learn.lockReasonFoundation");
    for (let prev = 1; prev < hskLevel; prev++) {
      if ((levelProgressMap.get(prev) ?? 0) < 100) {
        return t("learn.lockReasonPrevLevel", { level: prev });
      }
    }
    return null;
  };

  const isLessonLockedByCefr = (lesson: { cefrLevel?: keyof typeof CEFR_RANK; completedAt?: string | null; hskLevel?: number }) => {
    if (lesson.hskLevel !== undefined && isHskLevelLocked(lesson.hskLevel)) return true;
    return CEFR_RANK[lesson.cefrLevel ?? "A1"] > CEFR_RANK[userCefrLevel];
  };
  const isCurriculumLessonLocked = () => {
    if (isHskLevelLocked(selectedCurriculum.hskLevel)) return true;
    return CEFR_RANK[selectedCurriculum.cefrLevel] > CEFR_RANK[userCefrLevel];
  };

  const hskStats = [
    {
      level: 0,
      cefrLevel: "A1" as const,
      isLocked: false,
      lockReason: null,
      completedCount: lessons.filter((l) => l.hskLevel === 0 && l.completedAt).length,
      lessonCount: FOUNDATION_STAGES.length,
      percent: Math.round((lessons.filter((l) => l.hskLevel === 0 && l.completedAt).length / FOUNDATION_STAGES.length) * 100) || 0,
      skills: ["pronunciation", "pinyin"],
      topicCount: 1,
      focus: t("learn.foundationTitle"),
      xpReward: FOUNDATION_STAGES.reduce((total, stage) => total + stage.xp, 0),
    },
    ...HSK_CURRICULUM.map((curriculumLevel) => {
      const level = curriculumLevel.hskLevel;
      const hskLessons = lessons.filter((lesson) => lesson.hskLevel === level);
      const curriculumLessons = getCurriculumLessons(curriculumLevel);
      const { completedCount, lessonCount, percent } = getLevelProgress(curriculumLevel, lessons);
      const skills = Array.from(new Set(curriculumLessons.map((lesson) => lesson.skill))).slice(0, 4);
      const cefrLevel = curriculumLevel.cefrLevel;
      const isLocked = isHskLevelLocked(level);
      const lockReason = getLockReason(level);

      return {
        level,
        cefrLevel,
        isLocked,
        lockReason,
        completedCount,
        lessonCount,
        percent,
        skills,
        topicCount: curriculumLevel.topics.length,
        focus: curriculumLevel.focus,
        xpReward: hskLessons.length
          ? hskLessons.reduce((total, lesson) => total + lesson.xpReward, 0)
          : curriculumLessons.reduce((total, lesson) => total + lesson.xpReward, 0),
      };
    })
  ];
  const levelLessons = useMemo(() => {
    return lessons.filter((lesson) => lesson.hskLevel === selectedHSK).sort((a, b) => a.order - b.order);
  }, [lessons, selectedHSK]);

  const lessonsByOrder = useMemo(() => {
    return new Map(levelLessons.map((lesson) => [lesson.order, lesson]));
  }, [levelLessons]);

  const {
    completedCount: selectedCompletedCount,
    lessonCount: selectedLessonCount,
    percent: selectedProgressPercent,
  } = useMemo(() => getLevelProgress(selectedCurriculum, lessons), [selectedCurriculum, lessons]);
  const selectedLevelStats = hskStats.find((levelStats) => levelStats.level === selectedHSK) ?? hskStats[0];

  const nextLesson = useMemo(() => {
    return lessons.find((lesson) => !lesson.completedAt) ?? lessons[0] ?? null;
  }, [lessons]);

  useEffect(() => {
    const lessonIdFromUrl = searchParams.get("lessonId");

    if (lessonIdFromUrl && lessonIdFromUrl !== selectedLessonId) {
      setSelectedLessonId(lessonIdFromUrl);
    }
  }, [searchParams, selectedLessonId, setSelectedLessonId]);

  // The lesson path sits below the foundation section, so picking a level has no
  // visible result without scrolling to it.
  const selectHskLevel = (level: number) => {
    selectHskLevelState(level);

    requestAnimationFrame(() => {
      lessonPathRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
  };

  const closeSelectedLesson = () => {
    setSelectedLessonId(null);

    if (searchParams.has("lessonId")) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("lessonId");
      setSearchParams(nextParams, { replace: true });
    }
  };

  return (
    <div className="app-page">
      {selectedLessonId ? (
        <LessonPlayer lessonId={selectedLessonId} demo={!isAuthenticated} onClose={closeSelectedLesson} />
      ) : (
        <div className="grid gap-5">
          {!isAuthenticated && (
            <div className="app-surface-padded flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-muted-foreground">{t("learn.guestBody")}</p>
              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:translate-y-px"
              >
                <LogIn size={16} />
                {t("loginPrompt.login")}
              </button>
            </div>
          )}

          {isAuthenticated && needsPlacementTest && (
            <div className="app-surface-padded flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ClipboardCheck size={20} />
                </span>
                <div>
                  <p className="text-sm font-extrabold">{t("placement.title")}</p>
                  <p className="text-xs font-semibold text-muted-foreground">{t("placement.subtitle")}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/placement-test")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border bg-secondary px-4 text-sm font-bold transition hover:bg-secondary/80 active:translate-y-px"
              >
                <ClipboardCheck size={16} />
                {t("placement.startTest")}
              </button>
            </div>
          )}

          <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
              <div className="p-5 text-left sm:p-6">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
                    <BookOpenCheck size={17} />
                    {t("learn.hskRoadmap", { level: selectedHSK })}
                  </span>
                  <span className="rounded-xl bg-secondary px-3 py-1.5 text-sm font-bold text-muted-foreground">
                    CEFR {selectedCurriculum.cefrLevel}
                  </span>
                </div>
                <h1 className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">
                  {t("learn.heroTitle")}
                </h1>
                <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-muted-foreground sm:text-base">
                  {t("learn.heroSubtitle")}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={!nextLesson}
                    onClick={() => {
                      if (!nextLesson) return;
                      if (nextLesson.hskLevel === 0) {
                        navigate("/foundation");
                      } else {
                        setSelectedLessonId(nextLesson.id);
                      }
                    }}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:translate-y-px disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                  >
                    {nextLesson
                      ? nextLesson.hskLevel === 0
                        ? t("learn.startFoundation")
                        : t("learn.continueLesson", { order: nextLesson.order })
                      : t("learn.noLessonOpen")}
                    <ArrowRight size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/practice?tool=hanzi&from=learn")}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border bg-background px-5 py-3 text-sm font-extrabold transition hover:border-primary hover:text-primary active:translate-y-px"
                  >
                    <PenLine size={17} />
                    {t("learn.practiceWriting")}
                  </button>
                </div>
              </div>
              <div className="border-t bg-secondary/45 p-5 lg:border-l lg:border-t-0">
                <div className="grid h-full content-between gap-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-muted-foreground">
                      <span>{t("learn.currentLevelProgress")}</span>
                      <span>{selectedProgressPercent}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-background">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${selectedProgressPercent}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-xl border bg-card p-3">
                      <span className="text-xs font-bold text-muted-foreground">{t("learn.learned")}</span>
                      <strong className="mt-1 block text-xl">{selectedCompletedCount}/{selectedLessonCount}</strong>
                    </div>
                    <div className="rounded-xl border bg-card p-3">
                      <span className="text-xs font-bold text-muted-foreground">{t("learn.topicsLabel")}</span>
                      <strong className="mt-1 block text-xl">{selectedCurriculum.topics.length}</strong>
                    </div>
                    <div className="rounded-xl border bg-card p-3">
                      <span className="text-xs font-bold text-muted-foreground">XP</span>
                      <strong className="mt-1 block text-xl text-gold">{selectedLevelStats?.xpReward ?? 0}</strong>
                    </div>
                  </div>
                  <p className="text-sm font-semibold leading-relaxed text-muted-foreground">
                    {selectedCurriculum.focus}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-4 text-left shadow-sm sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold">{t("learn.selectHsk")}</h2>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  {t("learn.selectHskHint")}
                </p>
              </div>
              <div className="text-sm font-bold text-muted-foreground">
                {t("learn.progress", { level: selectedHSK, percent: selectedProgressPercent })}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {hskStats.map((levelStats) => (
                <button
                  key={levelStats.level}
                  type="button"
                  onClick={() => {
                    if (levelStats.level === 0) {
                      navigate("/foundation");
                    } else {
                      selectHskLevel(levelStats.level);
                    }
                  }}
                  className={cn(
                    "group min-h-31 rounded-2xl border bg-background p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-md active:translate-y-px",
                    selectedHSK === levelStats.level && "border-primary bg-primary/5 ring-2 ring-primary/10",
                    levelStats.isLocked && "border-dashed opacity-75",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold text-primary">HSK {levelStats.level}</div>
                      <h3 className="mt-1 line-clamp-1 text-lg font-extrabold">
                        {levelStats.level >= 1 && levelStats.level <= 6
                          ? t(`learn.hskFocus${levelStats.level}` as TranslationKey)
                          : levelStats.focus}
                      </h3>
                    </div>
                    <span className={cn("flex size-10 items-center justify-center rounded-xl", levelStats.percent === 100 ? "bg-jade/10 text-jade" : levelStats.isLocked ? "bg-muted text-muted-foreground" : "bg-secondary text-muted-foreground")}>
                      {levelStats.percent === 100 ? <CheckCircle2 size={19} /> : levelStats.isLocked ? <Lock size={18} /> : <BookOpenCheck size={19} />}
                    </span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${levelStats.percent}%` }} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold text-muted-foreground">
                    <span>{levelStats.completedCount}/{levelStats.lessonCount} {t("learn.lessonsWord")}</span>
                    <span>{levelStats.topicCount} {t("learn.topicsWord")}</span>
                    <span>{levelStats.percent}%</span>
                    {levelStats.xpReward > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-gold/10 px-2 py-1 text-gold">
                        <Trophy size={12} />
                        {levelStats.xpReward} XP
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className={cn("rounded-lg px-2 py-1 text-[0.68rem] font-extrabold", levelStats.isLocked ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary")}>
                      CEFR {levelStats.cefrLevel}
                    </span>
                    {levelStats.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="rounded-lg bg-secondary px-2 py-1 text-[0.68rem] font-extrabold text-muted-foreground">
                        {skill}
                      </span>
                    ))}
                  </div>
                  {levelStats.isLocked && levelStats.lockReason && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-amber-600">
                      <Lock size={12} />
                      {levelStats.lockReason}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>



          <div ref={lessonPathRef} className="scroll-mt-24">
            <LessonPath
              curriculum={selectedCurriculum}
              lessons={levelLessons}
              onSelectLesson={setSelectedLessonId}
              isLessonLocked={isLessonLockedByCefr}
              isCurriculumLocked={isCurriculumLessonLocked}
              guestMode={!isAuthenticated}
              guestUnlockedOrders={guestUnlockedOrders}
              onLockedClick={() => navigate("/auth")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
