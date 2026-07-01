import { ArrowLeft, BookOpen, Home, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../i18n";

export default function NotFound() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="anim-slide flex min-h-[calc(100vh-140px)] items-center justify-center px-0 pb-10 pt-4">
      <section className="relative w-full max-w-140 overflow-hidden rounded-lg border border-primary/20 bg-[linear-gradient(135deg,rgba(217,63,71,0.15),rgba(242,89,82,0.05))] px-6 py-8 text-center shadow-sm">
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-12 -right-8 font-serif text-9xl leading-none text-primary/10">
          404
        </div>

        <div className="mx-auto mb-5 flex size-19 items-center justify-center rounded-[20px] border border-primary/20 bg-primary/10 text-primary">
          <SearchX size={38} />
        </div>

        <span className="mb-3.5 inline-flex items-center gap-2 rounded-full border bg-card px-2.5 py-1.5 text-[0.78rem] font-bold text-muted-foreground">
          <BookOpen size={14} />
          {t("notFound.badge")}
        </span>

        <h1 className="mb-2.5 text-3xl">
          {t("notFound.title")}
        </h1>
        <p className="mx-auto mb-7 max-w-105 text-[0.95rem] text-muted-foreground">
          {t("notFound.body")}
        </p>

        <div className="relative z-1 flex flex-wrap justify-center gap-3">
          <button className="inline-flex items-center justify-center gap-2 rounded-lg border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition hover:bg-accent" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            {t("notFound.goBack")}
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90" onClick={() => navigate("/home", { replace: true })}>
            <Home size={18} />
            {t("notFound.backHome")}
          </button>
        </div>
      </section>
    </div>
  );
}
