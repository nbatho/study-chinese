import { useNavigate } from "react-router-dom";
import { ArrowRight, Globe2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { DropdownSelect } from "../../../components/ui/dropdown-select";
import { useI18n } from "../../../i18n";
import { landingCopy } from "../../../i18n/landing";
import { useAppSelector } from "../../../store/hooks";
import { languageOptions } from "./landingData";

export default function LandingHeader() {
  const navigate = useNavigate();
  const { language, setLanguage } = useI18n();
  const copy = landingCopy[language];
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const primaryCta = isAuthenticated ? copy.hero.ctaAuthed : copy.hero.ctaGuest;

  return (
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
          <Button className="h-11 rounded-full px-5" onClick={() => navigate("/home")}>
            {primaryCta}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </nav>
    </header>
  );
}
