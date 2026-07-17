import { FadeIn } from "../../../components/ui/FadeIn";
import { useI18n } from "../../../i18n";
import { landingCopy } from "../../../i18n/landing";
import { studyFlow } from "./landingData";

export default function LandingFlow() {
  const { language } = useI18n();
  const copy = landingCopy[language];

  return (
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
  );
}
