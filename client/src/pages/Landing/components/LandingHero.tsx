import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Languages, Play, Sparkles } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { FadeIn } from "../../../components/ui/FadeIn";
import { useI18n } from "../../../i18n";
import { landingCopy } from "../../../i18n/landing";
import { useAppSelector } from "../../../store/hooks";
import { previewRows, productStats } from "./landingData";

export default function LandingHero() {
  const navigate = useNavigate();
  const { language } = useI18n();
  const copy = landingCopy[language];
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const primaryCta = isAuthenticated ? copy.hero.ctaAuthed : copy.hero.ctaGuest;

  return (
    <section className="relative mx-auto grid min-h-[100dvh] max-w-7xl items-center gap-10 px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-[4.5rem] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <FadeIn direction="up" delay={80} className="relative z-10 max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
          <Sparkles size={16} />
          <span>{copy.hero.badge}</span>
        </div>
        <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {copy.hero.title}
        </h1>
        <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground sm:text-lg">
          {copy.hero.subtitle}
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button
            size="lg"
            className="h-14 rounded-full px-8 text-base font-extrabold shadow-lg shadow-primary/20 active:translate-y-px"
            onClick={() => navigate("/home")}
          >
            {primaryCta}
            <ArrowRight className="size-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 rounded-full border-2 bg-background/70 px-8 text-base font-extrabold active:translate-y-px"
            onClick={() => navigate("/guide")}
          >
            <Play className="size-5" />
            {copy.hero.secondary}
          </Button>
        </div>
      </FadeIn>

      <FadeIn direction="left" delay={160} className="relative z-10">
        <div className="relative mx-auto max-w-xl">
          <div className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border bg-card shadow-2xl shadow-primary/10">
            <div className="border-b bg-secondary/50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Languages size={22} />
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-foreground">{copy.preview.sessionTitle}</p>
                    <p className="text-xs font-semibold text-muted-foreground">{copy.preview.sessionSubtitle}</p>
                  </div>
                </div>
                <CheckCircle2 className="size-6 text-primary" />
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:p-6">
              <div className="grid grid-cols-3 gap-3">
                {productStats.map((stat) => (
                  <div key={stat.id} className="rounded-2xl border bg-background p-3">
                    <span className="block text-xs font-bold text-muted-foreground">{copy.preview[stat.id]}</span>
                    <strong className="mt-1 block text-2xl text-foreground">{stat.value}</strong>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.5rem] border bg-background p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-extrabold text-foreground">{copy.preview.wordsTitle}</h2>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    {copy.preview.wordsBadge}
                  </span>
                </div>
                <div className="grid gap-3">
                  {previewRows.map((row, index) => (
                    <div key={row.hanzi} className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-3 rounded-2xl bg-card p-3 shadow-sm">
                      <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 font-serif text-2xl font-bold text-primary">
                        {row.hanzi.slice(0, 1)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-serif text-2xl font-bold text-foreground">{row.hanzi}</span>
                        <span className="block truncate text-sm font-medium text-muted-foreground">
                          {row.pinyin} / {copy.preview.meanings[index]}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-primary p-5 text-primary-foreground shadow-lg shadow-primary/20">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles size={20} />
                  <span className="font-extrabold">{copy.preview.aiTitle}</span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-primary-foreground/90">
                  {copy.preview.aiBody}
                </p>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
