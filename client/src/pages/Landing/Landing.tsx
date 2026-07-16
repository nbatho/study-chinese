import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Camera,
  CheckCircle2,
  Globe2,
  Languages,
  Mic2,
  Play,
  RefreshCw,
  Rocket,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { DropdownSelect } from "../../components/ui/dropdown-select";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";
import { FadeIn } from "../../components/ui/FadeIn";
import { useDocumentLanguage, useI18n } from "../../i18n";
import { landingCopy } from "../../i18n/landing";
import type {
  LandingFeatureId,
  LandingFlowId,
  LandingFooterGroupId,
  LandingLinkId,
} from "../../i18n/landing";
import { LANGUAGES, LANGUAGE_META } from "../../i18n/languages";

// Layout and destinations only; the matching copy lives in `i18n/landing`.
const featureCards: Array<{ id: LandingFeatureId; icon: LucideIcon; href: string; className: string }> = [
  { id: "path", icon: BookOpen, href: "/learn", className: "lg:col-span-2" },
  { id: "practice", icon: Mic2, href: "/practice", className: "lg:row-span-2" },
  { id: "dictionary", icon: BookMarked, href: "/dictionary", className: "" },
  { id: "translate", icon: Camera, href: "/translate", className: "" },
  { id: "tutor", icon: Sparkles, href: "/ai-tutor", className: "lg:col-span-2" },
  { id: "community", icon: Users, href: "/community", className: "" },
];

const studyFlow: Array<{ id: LandingFlowId; icon: LucideIcon }> = [
  { id: "goal", icon: WandSparkles },
  { id: "lessons", icon: BookOpen },
  { id: "review", icon: RefreshCw },
];

const previewRows: Array<{ hanzi: string; pinyin: string }> = [
  { hanzi: "你好", pinyin: "nǐ hǎo" },
  { hanzi: "我想点菜", pinyin: "wǒ xiǎng diǎn cài" },
  { hanzi: "今天很忙", pinyin: "jīn tiān hěn máng" },
];

const productStats: Array<{ id: "statSession" | "statNewWords" | "statReviews"; value: string }> = [
  { id: "statSession", value: "18m" },
  { id: "statNewWords", value: "12" },
  { id: "statReviews", value: "24" },
];

const footerGroups: Array<{ id: LandingFooterGroupId; links: Array<{ id: LandingLinkId; href: string }> }> = [
  {
    id: "learn",
    links: [
      { id: "learn", href: "/learn" },
      { id: "foundation", href: "/foundation" },
      { id: "grammar", href: "/grammar" },
      { id: "radicals", href: "/radicals" },
    ],
  },
  {
    id: "practice",
    links: [
      { id: "practice", href: "/practice" },
      { id: "review", href: "/review" },
      { id: "tutor", href: "/ai-tutor" },
    ],
  },
  {
    id: "tools",
    links: [
      { id: "dictionary", href: "/dictionary" },
      { id: "translate", href: "/translate" },
      { id: "community", href: "/community" },
      { id: "guide", href: "/guide" },
    ],
  },
];

const languageOptions = LANGUAGES.map((value) => ({
  value,
  code: LANGUAGE_META[value].code,
  label: LANGUAGE_META[value].nativeLabel,
}));

export default function Landing() {
  const navigate = useNavigate();
  const { language, setLanguage } = useI18n();
  useDocumentLanguage();
  const copy = landingCopy[language];
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const primaryTarget = "/home";
  const primaryCta = isAuthenticated ? copy.hero.ctaAuthed : copy.hero.ctaGuest;

  return (
    <div className="min-h-[100dvh] overflow-hidden bg-background selection:bg-primary/20">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/88 backdrop-blur-xl">
        <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/landing")}
            className="flex min-w-0 items-center gap-3 rounded-2xl text-left transition hover:text-primary"
            title="Study Chinese"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary font-serif text-2xl font-extrabold text-primary-foreground shadow-sm">
              学
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold">Study Chinese</span>
              <span className="block truncate text-xs font-semibold text-muted-foreground">{copy.nav.tagline}</span>
            </span>
          </button>

          <div className="hidden items-center gap-7 text-sm font-bold text-muted-foreground md:flex">
            <button type="button" onClick={() => navigate("/learn")} className="transition hover:text-foreground">
              {copy.nav.roadmap}
            </button>
            <button type="button" onClick={() => navigate("/practice")} className="transition hover:text-foreground">
              {copy.nav.practice}
            </button>
            <button type="button" onClick={() => navigate("/translate")} className="transition hover:text-foreground">
              {copy.nav.translate}
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <DropdownSelect
              value={language}
              label={copy.nav.languageLabel}
              icon={<Globe2 size={16} />}
              onChange={setLanguage}
              options={languageOptions}
              buttonClassName="hidden h-11 rounded-full sm:inline-flex"
            />
            <Button className="h-11 rounded-full px-5" onClick={() => navigate(primaryTarget)}>
              {primaryCta}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </nav>
      </header>

      <main>
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
                onClick={() => navigate(primaryTarget)}
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

        <section className="border-y bg-secondary/40 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <FadeIn className="mb-12 max-w-3xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {copy.features.title}
              </h2>
              <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground">
                {copy.features.subtitle}
              </p>
            </FadeIn>

            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featureCards.map((feature, index) => {
                const Icon = feature.icon;
                const item = copy.features.items[feature.id];

                return (
                  <FadeIn key={feature.id} delay={index * 60}>
                    <button
                      type="button"
                      onClick={() => navigate(feature.href)}
                      className={cn(
                        "group flex h-full w-full flex-col justify-between rounded-[1.5rem] border bg-card p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10 active:translate-y-px",
                        feature.className,
                      )}
                    >
                      <span className="mb-8 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon size={24} />
                      </span>
                      <span>
                        <span className="block text-xl font-extrabold text-foreground">{item.title}</span>
                        <span className="mt-3 block text-sm font-medium leading-relaxed text-muted-foreground">
                          {item.description}
                        </span>
                      </span>
                      <span className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-primary">
                        {copy.features.open}
                        <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                      </span>
                    </button>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <FadeIn>
              <div className="sticky top-28">
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  {copy.flow.title}
                </h2>
                <p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-muted-foreground">
                  {copy.flow.subtitle}
                </p>
              </div>
            </FadeIn>

            <div className="grid gap-4">
              {studyFlow.map((step, index) => {
                const Icon = step.icon;
                const item = copy.flow.steps[step.id];

                return (
                  <FadeIn key={step.id} delay={index * 90} direction="right">
                    <div className="grid gap-4 rounded-[1.5rem] border bg-card p-5 shadow-sm transition hover:border-primary/30 sm:grid-cols-[64px_minmax(0,1fr)]">
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon size={25} />
                      </div>
                      <div>
                        <span className="text-sm font-extrabold text-primary">{item.label}</span>
                        <h3 className="mt-1 text-xl font-extrabold text-foreground">{item.title}</h3>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-[2rem] border bg-card p-6 shadow-2xl shadow-primary/10 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Rocket size={28} />
                </div>
                <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  {copy.cta.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground">
                  {copy.cta.subtitle}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button
                  size="lg"
                  className="h-14 rounded-full px-8 text-base font-extrabold shadow-lg shadow-primary/20 active:translate-y-px"
                  onClick={() => navigate(primaryTarget)}
                >
                  {primaryCta}
                  <ArrowRight className="size-5" />
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-14 rounded-full border px-8 text-base font-extrabold active:translate-y-px"
                  onClick={() => navigate("/translate")}
                >
                  <Camera className="size-5" />
                  {copy.cta.translate}
                </Button>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>

      <footer className="border-t bg-secondary/40 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
            <div className="max-w-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary font-serif text-2xl font-extrabold text-primary-foreground shadow-sm">
                  学
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-extrabold text-foreground">Study Chinese</span>
                  <span className="block truncate text-xs font-semibold text-muted-foreground">{copy.nav.tagline}</span>
                </span>
              </div>
              <p className="mt-4 text-sm font-medium leading-relaxed text-muted-foreground">{copy.footer.tagline}</p>
              <DropdownSelect
                value={language}
                label={copy.nav.languageLabel}
                icon={<Globe2 size={16} />}
                onChange={setLanguage}
                options={languageOptions}
                align="left"
                className="mt-6"
                buttonClassName="min-w-40"
              />
            </div>

            <nav className="grid gap-8 sm:grid-cols-3" aria-label={copy.footer.navLabel}>
              {footerGroups.map((group) => (
                <div key={group.id}>
                  <h2 className="text-sm font-extrabold text-foreground">{copy.footer.groups[group.id]}</h2>
                  <ul className="mt-4 grid gap-2.5">
                    {group.links.map((link) => (
                      <li key={link.id}>
                        <button
                          type="button"
                          onClick={() => navigate(link.href)}
                          className="text-sm font-semibold text-muted-foreground transition hover:text-primary"
                        >
                          {copy.footer.links[link.id]}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="mt-12 border-t pt-6">
            <p className="text-xs font-semibold text-muted-foreground">
              {copy.footer.copyright.replace("{year}", String(new Date().getFullYear()))}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
