import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpenCheck, CheckCircle2, ClipboardCheck, Lock, PenLine, Search, Trophy, Volume2 } from "lucide-react";
import { useLessonsQuery, useUserProfileQuery } from "../../api";
import LoginPromptCard from "../../components/LoginPromptCard";
import { useI18n } from "../../i18n";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";
import { speakChinese } from "../../utils/tts";
import LessonPath from "./components/LessonPath";
import LessonPlayer from "./components/LessonPlayer";
import { getCurriculumLessonCount, getCurriculumLessons, HSK_CURRICULUM } from "./curriculum";

const CEFR_RANK = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 } as const;
const CEFR_RECOMMENDED_HSK = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 } as const;
const VISIBLE_HSK_LEVELS = HSK_CURRICULUM.map((level) => level.hskLevel);
const BASIC_STROKES = [
  { name: "Ngang", mark: "一", description: "Kéo thẳng từ trái sang phải.", example: "一" },
  { name: "Sổ", mark: "丨", description: "Kéo thẳng từ trên xuống dưới.", example: "十" },
  { name: "Chấm", mark: "丶", description: "Chấm nhỏ, hơi xiên nhẹ xuống dưới.", example: "六" },
  { name: "Phẩy", mark: "丿", description: "Kéo từ trên xuống, lượn từ phải qua trái.", example: "八" },
  { name: "Mác", mark: "㇏", description: "Xiên xuống từ trái sang phải, cuối nét dày hơn.", example: "八" },
  { name: "Hất", mark: "㇀", description: "Kéo vút lên từ trái sang phải.", example: "冰" },
  { name: "Gập", mark: "𠃍", description: "Đổi hướng liền mạch mà không nhấc bút.", example: "口" },
  { name: "Móc", mark: "亅", description: "Kết thúc bằng móc nhọn hất lên.", example: "小" },
];
const STROKE_RULES = [
  "Ngang trước, sổ sau",
  "Phẩy trước, mác sau",
  "Trên trước, dưới sau",
  "Trái trước, phải sau",
  "Ngoài trước, trong sau",
  "Vào trước, đóng sau",
];
type ToneContour = "level" | "rising" | "dipping" | "falling" | "neutral";
type ToneInfo = {
  name: string;
  pinyin: string;
  contour: ToneContour;
  example: string;
  description: string;
};
const TONES: ToneInfo[] = [
  { name: "Âm bình (阴平)", pinyin: "mā", contour: "level", example: "妈", description: "Cao và đều, không đổi âm vực." },
  { name: "Dương bình (阳平)", pinyin: "má", contour: "rising", example: "麻", description: "Từ thấp lên cao, giống câu hỏi ngắn." },
  { name: "Thượng thanh (上声)", pinyin: "mǎ", contour: "dipping", example: "马", description: "Hạ xuống thấp rồi kéo lên." },
  { name: "Khứ thanh (去声)", pinyin: "mà", contour: "falling", example: "骂", description: "Rơi nhanh từ cao xuống thấp, dứt khoát." },
  { name: "Khinh thanh (轻声)", pinyin: "ma", contour: "neutral", example: "吗", description: "Đọc nhẹ, ngắn, phụ thuộc âm trước." },
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
  const lessons = lessonsQuery.data?.lessons ?? [];
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
    <div className="app-page">
      {selectedLessonId ? (
        <LessonPlayer lessonId={selectedLessonId} onClose={closeSelectedLesson} />
      ) : (
        <div className="grid gap-5">
          {needsPlacementTest && (
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
                    Lộ trình HSK {selectedHSK}
                  </span>
                  <span className="rounded-xl bg-secondary px-3 py-1.5 text-sm font-bold text-muted-foreground">
                    CEFR {selectedCurriculum.cefrLevel}
                  </span>
                </div>
                <h1 className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">
                  Học theo bài tiếp theo, không cần tự đoán nên bắt đầu ở đâu.
                </h1>
                <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-muted-foreground sm:text-base">
                  Chọn cấp HSK, xem tiến độ và mở bài đang phù hợp với trình độ hiện tại của bạn.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={!nextLesson}
                    onClick={() => nextLesson && setSelectedLessonId(nextLesson.id)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:translate-y-px disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                  >
                    {nextLesson ? `Học tiếp: Bài ${nextLesson.order}` : "Chưa có bài mở"}
                    <ArrowRight size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/practice?tool=hanzi")}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border bg-background px-5 py-3 text-sm font-extrabold transition hover:border-primary hover:text-primary active:translate-y-px"
                  >
                    <PenLine size={17} />
                    Luyện viết
                  </button>
                </div>
              </div>
              <div className="border-t bg-secondary/45 p-5 lg:border-l lg:border-t-0">
                <div className="grid h-full content-between gap-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-muted-foreground">
                      <span>Tiến độ cấp đang học</span>
                      <span>{selectedProgressPercent}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-background">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${selectedProgressPercent}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-xl border bg-card p-3">
                      <span className="text-xs font-bold text-muted-foreground">Đã học</span>
                      <strong className="mt-1 block text-xl">{selectedCompletedCount}/{selectedLessonCount}</strong>
                    </div>
                    <div className="rounded-xl border bg-card p-3">
                      <span className="text-xs font-bold text-muted-foreground">Chủ đề</span>
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
                <h2 className="text-2xl font-extrabold">Chọn cấp HSK</h2>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  Bài vượt quá kết quả kiểm tra đầu vào vẫn hiển thị nhưng sẽ khóa để bạn nhìn được toàn lộ trình.
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
                      <h3 className="mt-1 line-clamp-1 text-lg font-extrabold">{levelStats.focus}</h3>
                    </div>
                    <span className={cn("flex size-10 items-center justify-center rounded-xl", levelStats.percent === 100 ? "bg-jade/10 text-jade" : levelStats.isLocked ? "bg-muted text-muted-foreground" : "bg-secondary text-muted-foreground")}>
                      {levelStats.percent === 100 ? <CheckCircle2 size={19} /> : levelStats.isLocked ? <Lock size={18} /> : <BookOpenCheck size={19} />}
                    </span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${levelStats.percent}%` }} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold text-muted-foreground">
                    <span>{levelStats.completedCount}/{levelStats.lessonCount} bài</span>
                    <span>{levelStats.topicCount} chủ đề</span>
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
                <h2 className="text-2xl font-extrabold">Nền tảng phát âm và nét viết</h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  Ôn nhanh nét cơ bản, bút thuận và thanh điệu trước khi vào bài để đọc, nghe và viết ổn định hơn.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/practice?tool=hanzi")}
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border bg-background px-4 py-2 text-sm font-bold transition hover:border-primary hover:text-primary active:translate-y-px"
              >
                <PenLine size={17} />
                Luyện viết
              </button>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              <div>
                <h3 className="mb-3 text-sm font-extrabold text-muted-foreground">8 nét cơ bản</h3>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {BASIC_STROKES.map((stroke) => (
                    <article key={stroke.name} className="rounded-xl border bg-background p-3">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="font-serif text-4xl font-extrabold text-primary">{stroke.mark}</span>
                        <span className="rounded-lg bg-secondary px-2 py-1 font-serif text-lg font-bold">{stroke.example}</span>
                      </div>
                      <h4 className="font-extrabold">{stroke.name}</h4>
                      <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">{stroke.description}</p>
                    </article>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border bg-background p-4">
                  <h3 className="mb-3 text-sm font-extrabold text-muted-foreground">Quy tắc bút thuận</h3>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {STROKE_RULES.map((rule, index) => (
                      <div key={rule} className="flex items-center gap-2 rounded-xl bg-card px-3 py-2 text-sm font-bold">
                        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs text-primary">{index + 1}</span>
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-extrabold text-muted-foreground">Thanh điệu phổ thông</h3>
                <div className="grid gap-2">
                  {TONES.map((tone) => (
                    <article key={tone.name} className="rounded-xl border bg-background p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="grid size-16 shrink-0 place-items-center rounded-lg bg-primary/10">
                            <ToneContourIcon contour={tone.contour} />
                          </span>
                          <div className="min-w-0">
                            <div className="font-extrabold leading-tight">{tone.name}</div>
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
                          aria-label={`Nghe ${tone.pinyin}`}
                          title={`Nghe ${tone.pinyin}`}
                        >
                          <Volume2 size={18} />
                        </button>
                      </div>
                      <p className="mt-2 text-xs font-semibold leading-relaxed text-muted-foreground">{tone.description}</p>
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
          />
        </div>
      )}
    </div>
  );
}
