import { useState } from "react";
import { useDueSrsCardsQuery, useReviewSrsMutation } from "../api/srs/queries";
import type { ReviewQuality } from "../api/srs";
import { Layers } from "lucide-react";
import { useI18n } from "../i18n";
import { cn } from "../utils/cn";
import LoadingCard from "../components/LoadingCard";
import TtsButton from "../components/TtsButton";

export default function Review() {
  const { t } = useI18n();
  const dueCardsQuery = useDueSrsCardsQuery(15);
  const reviewMutation = useReviewSrsMutation();
  const [activeIdx, setActiveIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const dueCards = dueCardsQuery.data?.cards ?? [];
  const activeCard = dueCards[activeIdx] ?? dueCards[0];

  const handleQualitySelect = async (quality: ReviewQuality) => {
    if (!activeCard) return;
    await reviewMutation.mutateAsync({
      wordId: activeCard.wordId,
      quality,
      mistake: quality === "again" || quality === "hard" ? {
        wordId: activeCard.wordId,
        skill: "srs",
        prompt: activeCard.simplified,
        userAnswer: quality,
        correctAnswer: activeCard.english,
        simplified: activeCard.simplified,
        pinyin: activeCard.pinyin,
        english: activeCard.english,
        context: { tool: "review", quality },
      } : undefined,
    });
    setFlipped(false);
    setActiveIdx((idx) => Math.max(0, Math.min(idx, dueCards.length - 2)));
  };

  return (
    <div className="anim-slide">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-left text-2xl font-extrabold">{t("review.title")}</h2>
        <span className="flex items-center gap-1.5 rounded-lg bg-gold/10 px-3 py-1.5 text-[0.8rem] font-bold text-gold">
          <Layers size={14} /> {t("review.due", { count: dueCards.length })}
        </span>
      </div>

      {dueCardsQuery.isLoading && (
        <LoadingCard label={t("review.loading")} />
      )}

      {activeCard ? (
        <div>
          <div className="mb-4 text-left text-[0.85rem] font-semibold text-muted-foreground">
            {t("review.progress", { current: activeIdx + 1, total: dueCards.length })}
          </div>

          <div
            onClick={() => !flipped && setFlipped(true)}
            className={cn(
              "mb-8 flex min-h-[300px] flex-col items-center justify-center rounded-3xl p-6 text-center shadow-sm transition sm:px-8 sm:py-12",
              flipped ? "cursor-default border bg-card" : "cursor-pointer border-2 border-dashed border-primary bg-primary/5",
            )}
          >
            {!flipped ? (
              <div className="anim-pop text-center">
                <h1 className="font-serif text-7xl font-extrabold tracking-[2px] sm:text-8xl">
                  {activeCard.simplified}
                </h1>
                <span className="mt-4 inline-block text-[0.8rem] font-bold uppercase text-primary">
                  {t("review.tap")}
                </span>
              </div>
            ) : (
              <div className="anim-slide w-full text-center">
                <div className="mb-2 inline-flex items-center gap-3">
                  <h1 className="font-serif text-6xl font-extrabold sm:text-7xl">
                    {activeCard.simplified}
                  </h1>
                  <TtsButton
                    text={activeCard.simplified}
                    aria-label={t("common.listen")}
                    className="border-0 bg-transparent p-1 text-primary shadow-none hover:bg-transparent"
                    iconSize={28}
                  />
                </div>
                <div className="text-xl font-bold text-primary">{activeCard.pinyin}</div>
                <p className="mt-5 text-lg font-semibold sm:text-xl">
                  {activeCard.english}
                </p>
                <div className="mt-[18px] text-[0.8rem] text-muted-foreground">
                  {t("review.mastery", { value: activeCard.dueCardDetails.masteryLevel })}
                </div>
              </div>
            )}
          </div>

          {flipped ? (
            <div className="anim-slide grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                { id: "again", label: t("review.again"), hint: "< 1m", cls: "border-tone-4 text-tone-4" },
                { id: "hard", label: t("review.hard"), hint: "< 6m", cls: "border-tone-3 text-tone-3" },
                { id: "good", label: t("review.good"), hint: "10m", cls: "border-tone-1 text-tone-1" },
                { id: "easy", label: t("review.easy"), hint: "4d", cls: "border-tone-2 text-tone-2" },
              ].map((btn) => (
                <button key={btn.id} onClick={() => handleQualitySelect(btn.id as ReviewQuality)} disabled={reviewMutation.isPending} className={cn("flex flex-col items-center rounded-xl border-[1.5px] px-1.5 py-3 disabled:opacity-60", btn.cls)}>
                  <span className="text-[0.95rem] font-bold">{btn.label}</span>
                  <span className="mt-0.5 text-[0.7rem] text-muted-foreground">{btn.hint}</span>
                </button>
              ))}
            </div>
          ) : (
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90" onClick={() => setFlipped(true)}>
              {t("review.reveal")}
            </button>
          )}
        </div>
      ) : !dueCardsQuery.isLoading && (
        <div className="anim-pop rounded-lg border bg-card px-6 py-12 text-center shadow-sm">
          <div className="mb-4 text-7xl">✓</div>
          <h2 className="text-2xl font-extrabold">{t("review.done")}</h2>
          <p className="mt-2 inline-block max-w-80 text-[0.9rem] text-muted-foreground">
            {t("review.doneBody")}
          </p>
        </div>
      )}
    </div>
  );
}
