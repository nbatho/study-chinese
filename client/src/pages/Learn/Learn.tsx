import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { BookOpenCheck, CheckCircle2, ClipboardCheck, Lock, Search, Trophy } from "lucide-react";
import { useLessonsQuery, useUserProfileQuery } from "../../api";
import LoginPromptCard from "../../components/LoginPromptCard";
import { useI18n } from "../../i18n";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";
import LessonPath from "./components/LessonPath";
import LessonPlayer from "./components/LessonPlayer";
import { getCurriculumLessonCount, getCurriculumLessons, HSK_CURRICULUM } from "./curriculum";

const CEFR_RANK = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 } as const;
const CEFR_RECOMMENDED_HSK = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 } as const;
const VISIBLE_HSK_LEVELS = HSK_CURRICULUM.map((level) => level.hskLevel);

export default function Learn() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const { selectedLessonId, setSelectedLessonId } = useOutletContext<{
    selectedLessonId: string | null;
    setSelectedLessonId: (lessonId: string | null) => void;
  }>();
  const lessonsQuery = useLessonsQuery(isAuthenticated);
  const profileQuery = useUserProfileQuery(isAuthenticated);
  const [selectedHSK, setSelectedHSK] = useState<number>(1);
  const [appliedPlacementAt, setAppliedPlacementAt] = useState<string | null>(null);
  const lessons = lessonsQuery.data?.lessons ?? [];
  const profile = profileQuery.data?.profile;
  const userCefrLevel = profile?.cefrLevel ?? "A1";
  const needsPlacementTest = !profile?.placementTestCompletedAt;
  const selectedCurriculum = HSK_CURRICULUM.find((level) => level.hskLevel === selectedHSK) ?? HSK_CURRICULUM[0];
  const visibleHskLevels = VISIBLE_HSK_LEVELS;

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

  useEffect(() => {
    const placementAt = profile?.placementTestCompletedAt ?? null;
    if (!placementAt || placementAt === appliedPlacementAt || !visibleHskLevels.length) return;

    const targetHsk = CEFR_RECOMMENDED_HSK[userCefrLevel];
    const recommendedHsk = visibleHskLevels.reduce((best, level) => {
      if (level <= targetHsk && level > best) return level;
      return best;
    }, visibleHskLevels[0]);

    setSelectedHSK(recommendedHsk);
    setAppliedPlacementAt(placementAt);
  }, [appliedPlacementAt, profile?.placementTestCompletedAt, userCefrLevel, visibleHskLevels]);

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={Search}
        title={t("loginPrompt.learnTitle")}
        description={t("loginPrompt.learnBody")}
      />
    );
  }

  return (
    <div className="anim-slide">
      {selectedLessonId ? (
        <LessonPlayer lessonId={selectedLessonId} onClose={() => setSelectedLessonId(null)} />
      ) : (
        <div>
          {needsPlacementTest && (
            <div className="mb-5 flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border bg-secondary px-4 text-sm font-bold transition hover:bg-secondary/80"
              >
                <ClipboardCheck size={16} />
                {t("placement.startTest")}
              </button>
            </div>
          )}

          <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {hskStats.map((levelStats) => (
              <button
                key={levelStats.level}
                type="button"
                onClick={() => setSelectedHSK(levelStats.level)}
                className={cn(
                  "min-h-36 rounded-lg border-2 bg-card p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                  selectedHSK === levelStats.level ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground",
                  levelStats.isLocked && "border-dashed opacity-75",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase text-muted-foreground">Curriculum</span>
                    <h3 className="mt-1 text-2xl font-extrabold">HSK {levelStats.level}</h3>
                  </div>
                  <span className={cn("flex size-9 items-center justify-center rounded-full", levelStats.percent === 100 ? "bg-jade/10 text-jade" : levelStats.isLocked ? "bg-muted text-muted-foreground" : "bg-secondary text-muted-foreground")}>
                    {levelStats.percent === 100 ? <CheckCircle2 size={19} /> : levelStats.isLocked ? <Lock size={18} /> : <BookOpenCheck size={19} />}
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${levelStats.percent}%` }} />
                </div>
                <p className="mt-3 line-clamp-2 text-xs font-semibold text-muted-foreground">{levelStats.focus}</p>
                <div className="mt-3 flex items-center justify-between gap-2 text-xs font-bold text-muted-foreground">
                  <span>{levelStats.completedCount}/{levelStats.lessonCount} {t("home.lessons")}</span>
                  <span>{levelStats.topicCount} topics</span>
                  <span>{levelStats.percent}%</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className={cn("rounded-md px-2 py-1 text-[0.68rem] font-extrabold", levelStats.isLocked ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary")}>
                    Level {levelStats.cefrLevel}
                  </span>
                  {levelStats.skills.map((skill) => (
                    <span key={skill} className="rounded-md bg-secondary px-2 py-1 text-[0.68rem] font-extrabold uppercase text-muted-foreground">
                      {skill}
                    </span>
                  ))}
                  {levelStats.xpReward > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-gold/10 px-2 py-1 text-[0.68rem] font-extrabold text-gold">
                      <Trophy size={12} />
                      {levelStats.xpReward} XP
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="mb-4 text-left text-[0.85rem] font-semibold text-muted-foreground">
            {t("learn.progress", { level: selectedHSK, percent: selectedProgressPercent })}
          </div>
          <LessonPath
            curriculum={selectedCurriculum}
            lessons={levelLessons}
            onSelectLesson={setSelectedLessonId}
            isLessonLocked={isLessonLockedByCefr}
            isCurriculumLocked={isCurriculumLessonLocked}
          />
        </div>
      )}
    </div>
  );
}
