import { BookmarkPlus, Check, Heart, ListPlus, Volume2 } from "lucide-react";
import type { Word } from "../../../api/vocabulary";
import { HanziText } from "../../../components/HanziLookup";
import { tOrRaw, useI18n } from "../../../i18n";

interface WordCardProps {
  word: Word;
  favorite: boolean;
  /** Whether the word is already saved in at least one custom list. */
  inList?: boolean;
  onSpeak: () => void;
  onFavorite: () => void;
  onEnroll: () => void;
  /** Opens the list-picker popup. */
  onAddToList: () => void;
  busy: boolean;
  showActions?: boolean;
}

export default function WordCard({
  word,
  favorite,
  inList = false,
  onSpeak,
  onFavorite,
  onEnroll,
  onAddToList,
  busy,
  showActions = true,
}: WordCardProps) {
  const { t } = useI18n();

  // Localize DB labels (stored as English keys) to the app language,
  // falling back to the raw value for any unmapped category/part of speech.
  const localizeLabel = (prefix: string, raw: string) => tOrRaw(t, prefix, raw);

  return (
    <article className="app-card-button p-4">
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
              {localizeLabel("wordCategory", word.category)}
            </span>
            <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-muted-foreground">
              {localizeLabel("pos", word.partOfSpeech)}
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
          <HanziText as="h3" className="font-serif text-4xl font-extrabold text-foreground">{word.simplified}</HanziText>
          {word.traditional !== word.simplified && (
            <div className="mt-0.5 text-sm font-semibold text-muted-foreground">
              {t("dictionary.traditional")} {word.traditional}
            </div>
          )}
          <div className="mt-1 text-base font-bold text-primary">{word.pinyin}</div>
          {word.hanViet && (
            <div className="mt-0.5 text-sm font-semibold capitalize text-muted-foreground">
              {t("lookup.hanViet")}: {word.hanViet}
            </div>
          )}
          <p className="mt-2 text-[0.95rem] font-medium">{word.gloss}</p>
        </div>
        <button
          type="button"
          onClick={onSpeak}
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-secondary text-primary transition hover:bg-accent active:translate-y-px"
          aria-label={t("common.listen")}
        >
          <Volume2 size={20} />
        </button>
      </div>

      {showActions && (
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={onFavorite}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm font-semibold transition hover:border-primary active:translate-y-px disabled:opacity-60"
        >
          <Heart size={16} className={favorite ? "fill-primary text-primary" : "text-primary"} />
          {favorite ? t("dictionary.favorited") : t("dictionary.favorite")}
        </button>
        <button
          type="button"
          onClick={onEnroll}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm font-semibold transition hover:border-primary active:translate-y-px disabled:opacity-60"
        >
          <BookmarkPlus size={16} className="text-primary" />
          {t("dictionary.review")}
        </button>
        <button
          type="button"
          onClick={onAddToList}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 active:translate-y-px disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
        >
          {inList ? <Check size={16} /> : <ListPlus size={16} />}
          {inList ? t("dictionary.inList") : t("dictionary.addToList")}
        </button>
      </div>
      )}
    </article>
  );
}
