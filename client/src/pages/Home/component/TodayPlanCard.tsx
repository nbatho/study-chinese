import { useNavigate, useOutletContext } from "react-router-dom";
import { CheckCircle2, Clock3 } from "lucide-react";
import { type TodayPlanStep, useLessonsQuery, useTodayPlanQuery } from "../../../api";
import { Button } from "../../../components/ui/button";
import { useI18n } from "../../../i18n";
import type { TranslationKey } from "../../../i18n";
import { useAppSelector } from "../../../store/hooks";
import { cn } from "../../../utils/cn";
import { asNumber, asString, skillLabel } from "./homeHelpers";

export default function TodayPlanCard() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { setSelectedLessonId } = useOutletContext<{
    setSelectedLessonId: (lessonId: string | null) => void;
  }>();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const lessonsQuery = useLessonsQuery(isAuthenticated);
  const todayPlanQuery = useTodayPlanQuery(isAuthenticated);
  const lessons = lessonsQuery.data?.lessons ?? [];
  const todayPlan = todayPlanQuery.data?.plan;

  const planStepTitle = (step: TodayPlanStep) => t(`home.planStep.${step.id}.title` as TranslationKey);

  const planStepDescription = (step: TodayPlanStep) => {
    const meta = step.meta ?? {};

    switch (step.id) {
      case "srs-review":
        return t("home.planStep.srs-review.desc", { count: asNumber(meta.dueCount) ?? 0 });
      case "weak-practice":
        return t("home.planStep.weak-practice.desc", {
          count: asNumber(meta.needsPracticeCount) ?? 0,
          skill: skillLabel(t, meta.skill),
        });
      case "next-lesson": {
        const title = asString(meta.lessonTitle) ?? "";
        const order = asNumber(meta.lessonOrder);
        const hsk = asNumber(meta.hskLevel);
        const lesson = order
          ? hsk
            ? t("home.planLessonLabelHsk", { order, title, hsk })
            : t("home.planLessonLabel", { order, title })
          : title;
        return t("home.planStep.next-lesson.desc", { lesson, skill: skillLabel(t, meta.skill) });
      }
      case "ai-warmup": {
        const focusSkill = asString(meta.focusSkill);
        return focusSkill
          ? t("home.planStep.ai-warmup.descFocus", { skill: skillLabel(t, focusSkill) })
          : t("home.planStep.ai-warmup.desc");
      }
      default:
        return "";
    }
  };

  const handlePlanStep = (stepHref: string, lessonId?: unknown) => {
    if (typeof lessonId === "string") {
      const lesson = lessons.find((l) => l.id === lessonId);
      if (lesson?.hskLevel === 0) {
        navigate("/foundation");
        return;
      }
      setSelectedLessonId(lessonId);
      navigate("/learn");
      return;
    }

    navigate(stepHref);
  };

  return (
    <section className="app-surface-padded min-w-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold">{t("home.todayPlan")}</h2>
          <p className="text-sm font-medium text-muted-foreground">
            {todayPlan
              ? t("home.todayPlanMeta", {
                  xp: todayPlan.todayXp,
                  target: todayPlan.xpTarget,
                  minutes: todayPlan.dailyMinutes,
                })
              : t("home.loginToPersonalize")}
          </p>
        </div>
        <Clock3 size={22} className="text-primary" />
      </div>

      {isAuthenticated && todayPlan ? (
        <div className="grid gap-2.5">
          {todayPlan.steps.map((step, index) => {
            const isDone = step.status === "done";
            const isCurrent = step.status === "current";

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handlePlanStep(step.href, step.meta?.lessonId)}
                className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border bg-background/80 px-3 py-3 text-left transition hover:border-primary/50 hover:bg-secondary/60"
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl text-xs font-extrabold",
                    isDone && "bg-tone-2/12 text-tone-2",
                    isCurrent && "bg-primary text-primary-foreground",
                    !isDone && !isCurrent && "bg-secondary text-muted-foreground",
                  )}
                >
                  {isDone ? <CheckCircle2 size={17} /> : index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-extrabold">{planStepTitle(step)}</span>
                  <span className="block truncate text-xs font-medium text-muted-foreground">
                    {planStepDescription(step)}
                  </span>
                </span>
                <span className="shrink-0 text-xs font-extrabold text-primary">{step.estimateMinutes}m</span>
              </button>
            );
          })}
        </div>
      ) : (
        <Button type="button" onClick={() => navigate("/auth")} className="w-full rounded-xl">
          {t("auth.login")}
        </Button>
      )}
    </section>
  );
}
