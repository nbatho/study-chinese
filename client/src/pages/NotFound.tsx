import { ArrowLeft, BookOpen, Home, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="anim-slide"
      style={{
        minHeight: "calc(100vh - 140px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 0 40px",
      }}
    >
      <section
        className="card card-gradient-red"
        style={{
          width: "100%",
          maxWidth: "560px",
          textAlign: "center",
          padding: "32px 24px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "auto -32px -48px auto",
            fontFamily: "var(--font-serif)",
            fontSize: "8rem",
            color: "rgba(217, 63, 71, 0.08)",
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          404
        </div>

        <div
          style={{
            width: "76px",
            height: "76px",
            borderRadius: "20px",
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(217, 63, 71, 0.1)",
            border: "1px solid rgba(217, 63, 71, 0.18)",
            color: "var(--primary-red)",
          }}
        >
          <SearchX size={38} />
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 10px",
            borderRadius: "999px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            color: "var(--text-muted)",
            fontSize: "0.78rem",
            fontWeight: 700,
            marginBottom: "14px",
          }}
        >
          <BookOpen size={14} />
          LESSON NOT FOUND
        </span>

        <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>
          This page is off the study path
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.95rem",
            maxWidth: "420px",
            margin: "0 auto 28px",
          }}
        >
          The route you opened does not match any lesson, practice deck, or app screen.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
            position: "relative",
            zIndex: 1,
          }}
        >
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Go back
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/home", { replace: true })}>
            <Home size={18} />
            Back home
          </button>
        </div>
      </section>
    </div>
  );
}
