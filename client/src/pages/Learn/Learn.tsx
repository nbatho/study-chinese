import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpenCheck, CheckCircle2, ClipboardCheck, Lock, LogIn, PenLine, Trophy, Volume2 } from "lucide-react";
import { useLessonsQuery, useUserProfileQuery } from "../../api";
import { useSampleLessonsQuery } from "../../api/lessons/queries";
import { useI18n } from "../../i18n";
import type { TranslationKey } from "../../i18n";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";
import { speakChinese } from "../../utils/tts";
import LessonPath from "./components/LessonPath";
import LessonPlayer from "./components/LessonPlayer";
import { getCurriculumLessonCount, getCurriculumLessons, HSK_CURRICULUM } from "./curriculum";

const CEFR_RANK = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 } as const;
const CEFR_RECOMMENDED_HSK = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 } as const;
const VISIBLE_HSK_LEVELS = HSK_CURRICULUM.map((level) => level.hskLevel);
type StrokeInfo = { nameKey: TranslationKey; descKey: TranslationKey; mark: string; example: string };
const BASIC_STROKES: StrokeInfo[] = [
  { nameKey: "learn.stroke.heng.name", descKey: "learn.stroke.heng.desc", mark: "一", example: "一" },
  { nameKey: "learn.stroke.shu.name", descKey: "learn.stroke.shu.desc", mark: "丨", example: "十" },
  { nameKey: "learn.stroke.dian.name", descKey: "learn.stroke.dian.desc", mark: "丶", example: "六" },
  { nameKey: "learn.stroke.pie.name", descKey: "learn.stroke.pie.desc", mark: "丿", example: "八" },
  { nameKey: "learn.stroke.na.name", descKey: "learn.stroke.na.desc", mark: "㇏", example: "八" },
  { nameKey: "learn.stroke.ti.name", descKey: "learn.stroke.ti.desc", mark: "㇀", example: "冰" },
  { nameKey: "learn.stroke.zhe.name", descKey: "learn.stroke.zhe.desc", mark: "𠃍", example: "口" },
  { nameKey: "learn.stroke.gou.name", descKey: "learn.stroke.gou.desc", mark: "亅", example: "小" },
];
const STROKE_RULES: TranslationKey[] = [
  "learn.strokeRule.horizontalVertical",
  "learn.strokeRule.leftRightFalling",
  "learn.strokeRule.topBottom",
  "learn.strokeRule.leftRight",
  "learn.strokeRule.outsideInside",
  "learn.strokeRule.insideClose",
];
type ToneContour = "level" | "rising" | "dipping" | "falling" | "neutral";
type ToneInfo = {
  nameKey: TranslationKey;
  pinyin: string;
  contour: ToneContour;
  example: string;
  descKey: TranslationKey;
};
const TONES: ToneInfo[] = [
  { nameKey: "learn.tone.first.name", pinyin: "mā", contour: "level", example: "妈", descKey: "learn.tone.first.desc" },
  { nameKey: "learn.tone.second.name", pinyin: "má", contour: "rising", example: "麻", descKey: "learn.tone.second.desc" },
  { nameKey: "learn.tone.third.name", pinyin: "mǎ", contour: "dipping", example: "马", descKey: "learn.tone.third.desc" },
  { nameKey: "learn.tone.fourth.name", pinyin: "mà", contour: "falling", example: "骂", descKey: "learn.tone.fourth.desc" },
  { nameKey: "learn.tone.neutral.name", pinyin: "ma", contour: "neutral", example: "吗", descKey: "learn.tone.neutral.desc" },
];

function ToneContourIcon({ contour }: { contour: ToneContour }) {
  if (contour === "neutral") {
    return (
      <svg aria-hidden="true" viewBox="0 0 72 56" className="size-14 overflow-visible">
        <path d="M10 48H62" className="stroke-primary/15" strokeWidth="5" strokeLinecap="round" fill="none" />
        <circle cx="36" cy="28" r="9" className="fill-primary" />
      </svg>
    );
  }

  const path = {
    level: "M14 18H58",
    rising: "M16 42L58 14",
    dipping: "M14 22C24 45 43 45 58 18",
    falling: "M16 14L58 42",
  }[contour];

  return (
    <svg aria-hidden="true" viewBox="0 0 72 56" className="size-14 overflow-visible">
      <path d="M10 48H62" className="stroke-primary/15" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d={path} className="stroke-primary" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

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
  const [manualHskSelection, setManualHskSelection] = useState<{ placementAt: string | null; level: number } | null>(null);
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
  const visibleHskLevels = VISIBLE_HSK_LEVELS;
  const targetHsk = CEFR_RECOMMENDED_HSK[userCefrLevel];
  const recommendedHsk = visibleHskLevels.reduce((best, level) => {
    if (level <= targetHsk && level > best) return level;
    return best;
  }, visibleHskLevels[0]);
  const selectedHSK = manualHskSelection?.placementAt === placementAt ? manualHskSelection.level : recommendedHsk;
  const selectedCurriculum = HSK_CURRICULUM.find((level) => level.hskLevel === selectedHSK) ?? HSK_CURRICULUM[0];

  const isLessonLockedByCefr = (lesson: { cefrLevel?: keyof typeof CEFR_RANK; completedAt?: string | null }) =>
    CEFR_RANK[lesson.cefrLevel ?? "A1"] > CEFR_RANK[userCefrLevel];
  const isCurriculumLessonLocked = () => CEFR_RANK[selectedCurriculum.cefrLevel] > CEFR_RANK[userCefrLevel];

  const hskStats = HSK_CURRICULUM.map((curriculumLevel) => {
    const level = curriculumLevel.hskLevel;
    const hskLessons = lessons.filter((lesson) => lesson.hskLevel === level);
    const curriculumLessons = getCurriculumLessons(curriculumLevel);
    const curriculumOrders = new Set(curriculumLessons.map((lesson) => lesson.order));
    const completedCount = hskLessons.filter((lesson) => curriculumOrders.has(lesson.order) && lesson.completedAt).length;
    const lessonCount = getCurriculumLessonCount(curriculumLevel);
    const percent = Math.round(lessonCount ? (completedCount / lessonCount) * 100 : 0);
    const skills = Array.from(new Set(curriculumLessons.map((lesson) => lesson.skill))).slice(0, 4);
    const cefrLevel = curriculumLevel.cefrLevel;
    const isLocked = CEFR_RANK[cefrLevel] > CEFR_RANK[userCefrLevel];

    return {
      level,
      cefrLevel,
      isLocked,
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
  });
  const levelLessons = lessons.filter((lesson) => lesson.hskLevel === selectedHSK).sort((a, b) => a.order - b.order);
  const selectedLessonCount = getCurriculumLessonCount(selectedCurriculum);
  const selectedCurriculumOrders = new Set(getCurriculumLessons(selectedCurriculum).map((lesson) => lesson.order));
  const selectedCompletedCount = levelLessons.filter((lesson) => selectedCurriculumOrders.has(lesson.order) && lesson.completedAt).length;
  const selectedProgressPercent = Math.round(selectedLessonCount ? (selectedCompletedCount / selectedLessonCount) * 100 : 0);
  const selectedLevelStats = hskStats.find((levelStats) => levelStats.level === selectedHSK) ?? hskStats[0];
  const nextLesson = levelLessons.find(
    (lesson) => selectedCurriculumOrders.has(lesson.order) && !lesson.completedAt && !isLessonLockedByCefr(lesson),
  );

  useEffect(() => {
    const lessonIdFromUrl = searchParams.get("lessonId");

    if (lessonIdFromUrl && lessonIdFromUrl !== selectedLessonId) {
      setSelectedLessonId(lessonIdFromUrl);
    }
  }, [searchParams, selectedLessonId, setSelectedLessonId]);

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
                    onClick={() => nextLesson && setSelectedLessonId(nextLesson.id)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:translate-y-px disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                  >
                    {nextLesson ? t("learn.continueLesson", { order: nextLesson.order }) : t("learn.noLessonOpen")}
                    <ArrowRight size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/practice?tool=hanzi")}
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
                  onClick={() => setManualHskSelection({ placementAt, level: levelStats.level })}
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
                </button>
              ))}
            </div>
          </section>

          <section className="app-surface-padded text-left">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold">{t("learn.foundationTitle")}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {t("learn.foundationSubtitle")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/practice?tool=hanzi")}
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border bg-background px-4 py-2 text-sm font-bold transition hover:border-primary hover:text-primary active:translate-y-px"
              >
                <PenLine size={17} />
                {t("learn.practiceWriting")}
              </button>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              <div>
                <h3 className="mb-3 text-sm font-extrabold text-muted-foreground">{t("learn.strokesTitle")}</h3>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {BASIC_STROKES.map((stroke) => (
                    <article key={stroke.nameKey} className="rounded-xl border bg-background p-3">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="font-serif text-4xl font-extrabold text-primary">{stroke.mark}</span>
                        <span className="rounded-lg bg-secondary px-2 py-1 font-serif text-lg font-bold">{stroke.example}</span>
                      </div>
                      <h4 className="font-extrabold">{t(stroke.nameKey)}</h4>
                      <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">{t(stroke.descKey)}</p>
                    </article>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border bg-background p-4">
                  <h3 className="mb-3 text-sm font-extrabold text-muted-foreground">{t("learn.strokeRulesTitle")}</h3>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {STROKE_RULES.map((ruleKey, index) => (
                      <div key={ruleKey} className="flex items-center gap-2 rounded-xl bg-card px-3 py-2 text-sm font-bold">
                        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs text-primary">{index + 1}</span>
                        <span>{t(ruleKey)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-extrabold text-muted-foreground">{t("learn.tonesTitle")}</h3>
                <div className="grid gap-2">
                  {TONES.map((tone) => (
                    <article key={tone.nameKey} className="rounded-xl border bg-background p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="grid size-16 shrink-0 place-items-center rounded-lg bg-primary/10">
                            <ToneContourIcon contour={tone.contour} />
                          </span>
                          <div className="min-w-0">
                            <div className="font-extrabold leading-tight">{t(tone.nameKey)}</div>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="font-serif text-2xl font-extrabold text-primary">{tone.example}</span>
                              <span className="text-sm font-bold text-muted-foreground">{tone.pinyin}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => speakChinese(tone.example)}
                          className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border bg-card text-muted-foreground transition hover:border-primary hover:text-primary"
                          aria-label={t("learn.listenTone", { pinyin: tone.pinyin })}
                          title={t("learn.listenTone", { pinyin: tone.pinyin })}
                        >
                          <Volume2 size={18} />
                        </button>
                      </div>
                      <p className="mt-2 text-xs font-semibold leading-relaxed text-muted-foreground">{t(tone.descKey)}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

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
      )}
    </div>
  );
}
