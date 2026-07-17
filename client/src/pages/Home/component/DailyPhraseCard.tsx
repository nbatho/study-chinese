import { useDailyContentQuery } from "../../../api";
import TtsButton from "../../../components/TtsButton";
import { Skeleton } from "../../../components/ui/skeleton";
import { useI18n } from "../../../i18n";
import { useAppSelector } from "../../../store/hooks";

export default function DailyPhraseCard() {
  const { t } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const dailyContentQuery = useDailyContentQuery(isAuthenticated);
  const currentPhrase = dailyContentQuery.data?.phrase;

  return (
    <section className="app-surface-padded min-w-0">
      <h2 className="mb-4 text-lg font-extrabold">{t("home.phrase")}</h2>
      {currentPhrase ? (
        <div>
          <div className="font-serif text-5xl font-extrabold text-primary sm:text-6xl">
            {currentPhrase.simplified}
          </div>
          <div className="mt-2 text-base font-semibold text-muted-foreground">{currentPhrase.pinyin}</div>
          <p className="mt-3 text-base font-bold">{currentPhrase.gloss}</p>
          {currentPhrase.note ? (
            <p className="mt-2 border-l-2 border-primary/30 pl-3 text-sm text-muted-foreground">
              {currentPhrase.note}
            </p>
          ) : null}
          {currentPhrase.gloss !== currentPhrase.english ? (
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {t("home.phraseSource", { text: currentPhrase.english })}
            </p>
          ) : null}
          <TtsButton text={currentPhrase.simplified} className="mt-4">
            {t("common.listen")}
          </TtsButton>
        </div>
      ) : isAuthenticated ? (
        <div className="grid gap-3">
          <Skeleton className="h-14 w-40" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed bg-background p-5 text-sm font-semibold text-muted-foreground">
          {t("home.loginToPersonalize")}
        </div>
      )}
    </section>
  );
}
