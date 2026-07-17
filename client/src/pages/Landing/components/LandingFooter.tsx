import { useNavigate } from "react-router-dom";
import { Globe2 } from "lucide-react";
import { DropdownSelect } from "../../../components/ui/dropdown-select";
import { useI18n } from "../../../i18n";
import { landingCopy } from "../../../i18n/landing";
import { footerGroups, languageOptions } from "./landingData";

export default function LandingFooter() {
  const navigate = useNavigate();
  const { language, setLanguage } = useI18n();
  const copy = landingCopy[language];

  return (
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
  );
}
