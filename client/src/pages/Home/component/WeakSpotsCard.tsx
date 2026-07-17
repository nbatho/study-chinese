import { useNavigate } from "react-router-dom";
import { Target } from "lucide-react";
import { useUserMistakesQuery } from "../../../api";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { useI18n } from "../../../i18n";
import { useAppSelector } from "../../../store/hooks";
import {
  categoryOf,
  isLessonSkill,
  weakCategoryLabel,
} from "../../Practice/components/weakCategories";

export default function WeakSpotsCard() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const mistakesQuery = useUserMistakesQuery(20, isAuthenticated);
  const weakSpots = (mistakesQuery.data?.mistakes ?? [])
    .filter((item) => item.needsPracticeCount > 0)
    .slice(0, 4);

  return (
    <section className="app-surface-padded min-w-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold">{t("home.weakSpots")}</h2>
          <p className="text-sm font-medium text-muted-foreground">{t("home.weakSpotsHint")}</p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Target size={22} />
        </span>
      </div>

      {!isAuthenticated ? (
        <div className="rounded-xl border border-dashed bg-background p-5 text-sm font-semibold text-muted-foreground">
          {t("home.loginToPersonalize")}
        </div>
      ) : mistakesQuery.isLoading ? (
        <div className="grid gap-2.5">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-15 w-full rounded-xl" />
          ))}
        </div>
      ) : weakSpots.length ? (
        <>
          <div className="grid gap-2.5">
            {weakSpots.map((spot) => {
              const category = weakCategoryLabel(t, categoryOf(spot.skill));
              const lesson = isLessonSkill(spot.skill);
              // Lesson rows keep the localized instruction in gloss/english, so
              // the correct answer is the only meaningful line there.
              const answer = lesson
                ? spot.correctAnswer
                : spot.gloss || spot.correctAnswer;
              const hanzi = spot.simplified;
              return (
                <div
                  key={spot.id}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border bg-background/80 px-3 py-2.5"
                >
                  {hanzi ? (
                    <span className="font-serif text-2xl font-extrabold text-primary">{hanzi}</span>
                  ) : (
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Target size={16} />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-extrabold">
                      {hanzi ? spot.pinyin || category : spot.prompt || category}
                    </span>
                    <span className="block truncate text-xs font-medium text-muted-foreground">
                      {answer
                        ? t("home.weakSpotAnswer", { answer })
                        : category}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-lg bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                    x{spot.needsPracticeCount}
                  </span>
                </div>
              );
            })}
          </div>
          <Button
            type="button"
            onClick={() => navigate("/practice?tool=weak&from=home")}
            className="mt-4 w-full rounded-xl"
          >
            <Target size={17} />
            {t("home.weakSpotsReview")}
          </Button>
        </>
      ) : (
        <div className="rounded-xl border border-dashed bg-background p-5 text-center text-sm font-semibold text-muted-foreground">
          {t("home.weakSpotsEmpty")}
        </div>
      )}
    </section>
  );
}
