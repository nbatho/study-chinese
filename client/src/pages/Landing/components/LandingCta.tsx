import { useNavigate } from "react-router-dom";
import { ArrowRight, Camera, Rocket } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { FadeIn } from "../../../components/ui/FadeIn";
import { useI18n } from "../../../i18n";
import { landingCopy } from "../../../i18n/landing";
import { useAppSelector } from "../../../store/hooks";

export default function LandingCta() {
  const navigate = useNavigate();
  const { language } = useI18n();
  const copy = landingCopy[language];
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const primaryCta = isAuthenticated ? copy.hero.ctaAuthed : copy.hero.ctaGuest;

  return (
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
              onClick={() => navigate("/home")}
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
  );
}
