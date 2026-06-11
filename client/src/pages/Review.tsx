import { useState } from "react";
import { useDueSrsCardsQuery, useReviewSrsMutation } from "../api/srs/queries";
import type { ReviewQuality } from "../api/srs";
import { Layers, Volume2 } from "lucide-react";
import { useI18n } from "../i18n";

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
    await reviewMutation.mutateAsync({ wordId: activeCard.wordId, quality });
    setFlipped(false);
    setActiveIdx((idx) => Math.max(0, Math.min(idx, dueCards.length - 2)));
  };

  const playTTS = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="anim-slide">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, textAlign: "left" }}>{t("review.title")}</h2>
        <span style={{ backgroundColor: "rgba(242, 191, 76, 0.12)", color: "var(--gold)", padding: "6px 12px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
          <Layers size={14} /> {t("review.due", { count: dueCards.length })}
        </span>
      </div>

      {dueCardsQuery.isLoading && (
        <div className="card" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
          {t("review.loading")}
        </div>
      )}

      {activeCard ? (
        <div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "16px", textAlign: "left" }}>
            {t("review.progress", { current: activeIdx + 1, total: dueCards.length })}
          </div>

          <div
            onClick={() => !flipped && setFlipped(true)}
            className="card"
            style={{ padding: "48px 24px", minHeight: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: flipped ? "default" : "pointer", borderRadius: "24px", border: flipped ? "1px solid var(--border-color)" : "2px dashed var(--primary-red)", backgroundColor: flipped ? "var(--bg-card)" : "rgba(217, 63, 71, 0.02)", marginBottom: "32px" }}
          >
            {!flipped ? (
              <div className="anim-pop" style={{ textAlign: "center" }}>
                <h1 className="hanzi-text" style={{ fontSize: "5rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "2px" }}>
                  {activeCard.simplified}
                </h1>
                <span style={{ fontSize: "0.8rem", color: "var(--primary-red)", fontWeight: 700, textTransform: "uppercase", marginTop: "16px", display: "inline-block" }}>
                  {t("review.tap")}
                </span>
              </div>
            ) : (
              <div className="anim-slide" style={{ width: "100%", textAlign: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <h1 className="hanzi-text" style={{ fontSize: "4.5rem", fontWeight: 800, color: "var(--text-main)" }}>
                    {activeCard.simplified}
                  </h1>
                  <button onClick={() => playTTS(activeCard.simplified)} aria-label={t("common.listen")} style={{ border: "none", background: "none", color: "var(--primary-red)", cursor: "pointer" }}>
                    <Volume2 size={28} />
                  </button>
                </div>
                <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--primary-red)" }}>{activeCard.pinyin}</div>
                <p style={{ fontSize: "1.25rem", color: "var(--text-main)", fontWeight: 600, marginTop: "20px" }}>
                  {activeCard.english}
                </p>
                <div style={{ marginTop: "18px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {t("review.mastery", { value: activeCard.dueCardDetails.masteryLevel })}
                </div>
              </div>
            )}
          </div>

          {flipped ? (
            <div className="anim-slide" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
              {[
                { id: "again", label: t("review.again"), hint: "< 1m", color: "var(--tone-4)" },
                { id: "hard", label: t("review.hard"), hint: "< 6m", color: "var(--tone-3)" },
                { id: "good", label: t("review.good"), hint: "10m", color: "var(--tone-1)" },
                { id: "easy", label: t("review.easy"), hint: "4d", color: "var(--tone-2)" },
              ].map((btn) => (
                <button key={btn.id} onClick={() => handleQualitySelect(btn.id as ReviewQuality)} disabled={reviewMutation.isPending} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 6px", borderRadius: "12px", border: `1.5px solid ${btn.color}`, background: "none", cursor: "pointer" }}>
                  <span style={{ fontWeight: 700, color: btn.color, fontSize: "0.95rem" }}>{btn.label}</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>{btn.hint}</span>
                </button>
              ))}
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => setFlipped(true)} style={{ width: "100%" }}>
              {t("review.reveal")}
            </button>
          )}
        </div>
      ) : !dueCardsQuery.isLoading && (
        <div className="card anim-pop" style={{ padding: "48px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "4.5rem", marginBottom: "16px" }}>✓</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>{t("review.done")}</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "8px 0 0", maxWidth: "320px", display: "inline-block" }}>
            {t("review.doneBody")}
          </p>
        </div>
      )}
    </div>
  );
}
