import { useState } from "react";
import { useStore } from "../store/store";
import type { ReviewQuality } from "../store/store";
import { VOCAB } from "../resources/vocab";
import { Volume2, Layers } from "lucide-react";

export default function Review() {
  const store = useStore();
  const dueCards = store.getDueSRSCards(15);
  const [activeIdx, setActiveIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const activeCard = dueCards[activeIdx];
  const word = activeCard ? VOCAB.find(w => w.id === activeCard.wordId) : null;

  const handleQualitySelect = (quality: ReviewQuality) => {
    if (!word) return;
    store.reviewSRS(word.id, quality);
    setFlipped(false);
    // Don't increment index if cards are updated since the current card is removed from dueCards list automatically!
    if (dueCards.length <= 1) {
      setActiveIdx(0);
    }
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
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, textAlign: "left" }}>SRS Review</h2>
        <span style={{
          backgroundColor: "rgba(242, 191, 76, 0.12)",
          color: "var(--gold)",
          padding: "6px 12px",
          borderRadius: "8px",
          fontSize: "0.8rem",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          <Layers size={14} /> Due: {dueCards.length} Cards
        </span>
      </div>

      {word ? (
        <div>
          {/* Progress Indicator */}
          <div style={{
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            fontWeight: 600,
            marginBottom: "16px",
            textAlign: "left"
          }}>
            Reviewing word {activeIdx + 1} of {Math.max(dueCards.length, activeIdx + 1)}
          </div>

          {/* Flashcard Box */}
          <div
            onClick={() => !flipped && setFlipped(true)}
            className="card"
            style={{
              padding: "48px 24px",
              minHeight: "300px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: flipped ? "default" : "pointer",
              borderRadius: "24px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.025)",
              border: flipped ? "1px solid var(--border-color)" : "2px dashed var(--primary-red)",
              backgroundColor: flipped ? "var(--bg-card)" : "rgba(217, 63, 71, 0.02)",
              transition: "var(--transition-smooth)",
              marginBottom: "32px",
              position: "relative"
            }}
          >
            {/* Tone colors border on top if flipped */}
            {flipped && word.tones.length > 0 && (
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "6px",
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px",
                backgroundColor: `var(--tone-${word.tones[0]})`
              }} />
            )}

            {!flipped ? (
              <div className="anim-pop" style={{ textAlign: "center" }}>
                <h1 className="hanzi-text" style={{ fontSize: "5rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "2px" }}>
                  {word.simplified}
                </h1>
                <span style={{ fontSize: "0.8rem", color: "var(--primary-red)", fontWeight: 700, textTransform: "uppercase", marginTop: "16px", display: "inline-block" }}>
                  Tap Card to Reveal
                </span>
              </div>
            ) : (
              <div className="anim-slide" style={{ width: "100%", textAlign: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <h1 className="hanzi-text" style={{ fontSize: "4.5rem", fontWeight: 800, color: "var(--text-main)" }}>
                    {word.simplified}
                  </h1>
                  <button
                    onClick={() => playTTS(word.simplified)}
                    style={{
                      border: "none",
                      background: "none",
                      color: "var(--primary-red)",
                      cursor: "pointer"
                    }}
                  >
                    <Volume2 size={28} />
                  </button>
                </div>

                <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--primary-red)" }}>
                  {word.pinyin}
                </div>

                <div style={{
                  display: "inline-block",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  backgroundColor: "var(--bg-card-hover)",
                  border: "1px solid var(--border-color)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  marginTop: "6px"
                }}>
                  {word.partOfSpeech.toUpperCase()} · HSK {word.hskLevel}
                </div>

                <p style={{ fontSize: "1.25rem", color: "var(--text-main)", fontWeight: 600, marginTop: "20px" }}>
                  {word.english}
                </p>

                {/* Example Sentences */}
                {word.category && (
                  <div style={{
                    marginTop: "24px",
                    paddingTop: "16px",
                    borderTop: "1px dashed var(--border-color)",
                    textAlign: "left"
                  }}>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Category:</label>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-main)", fontWeight: 600, marginLeft: "6px" }}>{word.category}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Grade recall levels buttons if flipped */}
          {flipped ? (
            <div className="anim-slide" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
              {[
                { id: "again", label: "Again", hint: "< 1m", color: "var(--tone-4)" },
                { id: "hard", label: "Hard", hint: "< 6m", color: "var(--tone-3)" },
                { id: "good", label: "Good", hint: "10m", color: "var(--tone-1)" },
                { id: "easy", label: "Easy", hint: "4d", color: "var(--tone-2)" }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => handleQualitySelect(btn.id as ReviewQuality)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "12px 6px",
                    borderRadius: "12px",
                    border: `1.5px solid ${btn.color}`,
                    background: "none",
                    cursor: "pointer",
                    transition: "var(--transition-smooth)"
                  }}
                  className="grade-btn"
                >
                  <span style={{ fontWeight: 700, color: btn.color, fontSize: "0.95rem" }}>{btn.label}</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>{btn.hint}</span>
                </button>
              ))}
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => setFlipped(true)} style={{ width: "100%" }}>
              Reveal Card Detail
            </button>
          )}
        </div>
      ) : (
        // Congratulations! All caught up.
        <div className="card anim-pop" style={{ padding: "48px 24px", textAlign: "center" }}>
          <div style={{
            fontSize: "4.5rem",
            marginBottom: "16px",
            filter: "drop-shadow(0px 4px 10px rgba(16, 185, 129, 0.15))"
          }}>
            🎉
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>All Caught Up!</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "8px 0 28px", maxWidth: "320px", display: "inline-block" }}>
            No reviews due right now. You can study new curriculum lessons to learn more words.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            <div style={{ padding: "16px", borderRadius: "12px", backgroundColor: "var(--bg-app)", minWidth: "120px" }}>
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>Total Learned</span>
              <strong style={{ fontSize: "1.4rem", color: "var(--primary-red)" }}>{store.getTotalStudiedWordsCount()}</strong>
            </div>
            <div style={{ padding: "16px", borderRadius: "12px", backgroundColor: "var(--bg-app)", minWidth: "120px" }}>
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>Mastered</span>
              <strong style={{ fontSize: "1.4rem", color: "var(--jade)" }}>{store.getMasteredWordsCount()}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
