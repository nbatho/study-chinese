import { BookOpen } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { useI18n } from "../../../i18n";

export default function AuthHero() {
  const { t } = useI18n();

  return (
    <aside className="flex min-h-auto flex-col justify-between border-b bg-primary/10 p-5 sm:p-7 md:min-h-140 md:border-b-0 md:border-r md:p-9">
      <div>
        <div className="mb-9 inline-flex items-center gap-2.5">
          <span className="inline-flex size-10.5 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BookOpen size={21} />
          </span>
          <strong className="text-[1.05rem]">Study Chinese</strong>
        </div>

        <h1 className="mb-4 text-3xl leading-[1.1] sm:text-[2.4rem]">
          {t("auth.heroTitle")}
        </h1>
        <p className="max-w-90 text-base text-muted-foreground">
          {t("auth.heroSubtitle")}
        </p>
      </div>

      <div className="grid gap-3">
        {[t("auth.featurePath"), t("auth.featureReview"), t("auth.featureTutor")].map((item) => (
          <Card key={item} className="border-primary/10 bg-white/50 p-3.5 font-bold shadow-none dark:bg-white/5">
            {item}
          </Card>
        ))}
      </div>
    </aside>
  );
}
