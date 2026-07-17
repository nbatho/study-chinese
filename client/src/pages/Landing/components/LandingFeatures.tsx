import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "../../../components/ui/FadeIn";
import { useI18n } from "../../../i18n";
import { landingCopy } from "../../../i18n/landing";
import { cn } from "../../../utils/cn";
import { featureCards } from "./landingData";

export default function LandingFeatures() {
  const navigate = useNavigate();
  const { language } = useI18n();
  const copy = landingCopy[language];

  return (
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
  );
}
