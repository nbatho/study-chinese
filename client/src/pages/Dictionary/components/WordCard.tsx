import { BookmarkPlus, Check, Heart, ListPlus, Volume2 } from "lucide-react";
import type { Word } from "../../../api/vocabulary";
import { useI18n } from "../../../i18n";

interface WordCardProps {
  word: Word;
  favorite: boolean;
  inSelectedList: boolean;
  hasSelectedList: boolean;
  onSpeak: () => void;
  onFavorite: () => void;
  onEnroll: () => void;
  onAddToList: () => void;
  busy: boolean;
}

export default function WordCard({
  word,
  favorite,
  inSelectedList,
  hasSelectedList,
  onSpeak,
  onFavorite,
  onEnroll,
  onAddToList,
  busy,
}: WordCardProps) {
  const { t } = useI18n();

  return (
    <article className="rounded-lg border bg-card p-4 text-left shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
              HSK {word.hskLevel}
            </span>
            <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
              {word.cefrLevel}
            </span>
            <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-muted-foreground">
              {word.category}
            </span>
            <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-muted-foreground">
              {word.partOfSpeech}
            </span>
            {word.radical && (
              <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-muted-foreground">
                Radical {word.radical}
              </span>
            )}
            {word.frequency && (
              <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-muted-foreground">
                #{word.frequency}
              </span>
            )}
          </div>
          <h3 className="font-serif text-4xl font-extrabold text-foreground">{word.simplified}</h3>
          {word.traditional !== word.simplified && (
            <div className="mt-0.5 text-sm font-semibold text-muted-foreground">
              {t("dictionary.traditional")} {word.traditional}
            </div>
          )}
          <div className="mt-1 text-base font-bold text-primary">{word.pinyin}</div>
          <p className="mt-2 text-[0.95rem] font-medium">{word.english}</p>
        </div>
        <button
          type="button"
          onClick={onSpeak}
          className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-secondary text-primary transition hover:bg-accent"
          aria-label={t("common.listen")}
        >
          <Volume2 size={20} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={onFavorite}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-semibold transition hover:border-primary disabled:opacity-60"
        >
          <Heart size={16} className={favorite ? "fill-primary text-primary" : "text-primary"} />
          {favorite ? t("dictionary.favorited") : t("dictionary.favorite")}
        </button>
        <button
          type="button"
          onClick={onEnroll}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-semibold transition hover:border-primary disabled:opacity-60"
        >
          <BookmarkPlus size={16} className="text-primary" />
          {t("dictionary.review")}
        </button>
        <button
          type="button"
          onClick={onAddToList}
          disabled={busy || !hasSelectedList || inSelectedList}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
        >
          {inSelectedList ? <Check size={16} /> : <ListPlus size={16} />}
          {inSelectedList ? t("dictionary.inList") : t("dictionary.addToList")}
        </button>
      </div>
    </article>
  );
}
