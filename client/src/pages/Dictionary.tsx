import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  BookmarkPlus,
  BookOpen,
  Check,
  Filter,
  Heart,
  ListPlus,
  Plus,
  Search,
  Volume2,
} from "lucide-react";
import {
  useAddWordToListMutation,
  useCreateListMutation,
  useEnrollWordMutation,
  useListsQuery,
  useToggleFavoriteMutation,
  useVocabularyQuery,
} from "../api";
import type { Word } from "../api/vocabulary";
import { useI18n } from "../i18n";
import { cn } from "../utils/cn";
import { speakChinese } from "../utils/tts";
import LoadingCard from "../components/LoadingCard";

const hskLevels = [1, 2, 3];
const listEmojis = ["📘", "⭐", "🧠", "✍️"];

export default function Dictionary() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [selectedHsk, setSelectedHsk] = useState<number | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedListId, setSelectedListId] = useState<string>("");
  const [newListName, setNewListName] = useState("");
  const [newListEmoji, setNewListEmoji] = useState(listEmojis[0]);
  const [favoriteWordIds, setFavoriteWordIds] = useState<string[]>([]);

  const searchParams = {
    q: query.trim() || undefined,
    hsk: selectedHsk === "all" ? undefined : selectedHsk,
    category: selectedCategory === "all" ? undefined : selectedCategory,
  };

  const vocabularyQuery = useVocabularyQuery(searchParams);
  const listsQuery = useListsQuery();
  const favoriteMutation = useToggleFavoriteMutation();
  const enrollMutation = useEnrollWordMutation();
  const createListMutation = useCreateListMutation();
  const addWordMutation = useAddWordToListMutation(selectedListId);

  const words = useMemo(() => vocabularyQuery.data?.vocab ?? [], [vocabularyQuery.data?.vocab]);
  const lists = listsQuery.data?.lists ?? [];
  const selectedList = lists.find((list) => list.id === selectedListId);
  const selectedListWordIds = useMemo(() => new Set(selectedList?.wordIds ?? []), [selectedList]);
  const favoriteIds = useMemo(() => new Set(favoriteWordIds), [favoriteWordIds]);
  const categories = useMemo(() => {
    const values = new Set(words.map((word) => word.category).filter(Boolean));
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [words]);

  const handleCreateList = async (event: React.FormEvent) => {
    event.preventDefault();
    const name = newListName.trim();
    if (!name) return;

    const response = await createListMutation.mutateAsync({ name, emoji: newListEmoji });
    setSelectedListId(response.list.id);
    setNewListName("");
    toast.success(t("dictionary.listCreated"));
  };

  const handleAddToList = async (word: Word) => {
    if (!selectedListId) {
      toast.info(t("dictionary.chooseList"));
      return;
    }

    await addWordMutation.mutateAsync(word.id);
    toast.success(t("dictionary.addedToList", { word: word.simplified }));
  };

  const handleEnroll = async (word: Word) => {
    const response = await enrollMutation.mutateAsync({ wordId: word.id });
    toast.success(response.enrolled ? t("dictionary.enrolled") : t("dictionary.alreadyEnrolled"));
  };

  const handleFavorite = async (word: Word) => {
    const response = await favoriteMutation.mutateAsync({ wordId: word.id });
    setFavoriteWordIds((current) =>
      response.isFavorite
        ? Array.from(new Set([...current, word.id]))
        : current.filter((wordId) => wordId !== word.id),
    );
    toast.success(response.isFavorite ? t("dictionary.favoriteSaved") : t("dictionary.favoriteRemoved"));
  };

  return (
    <div className="anim-slide pb-8">
      <header className="mb-5 text-left">
        <div className="mb-2 flex items-center gap-2">
          <BookOpen size={24} className="text-primary" />
          <h1 className="text-2xl font-extrabold">{t("dictionary.title")}</h1>
        </div>
        <p className="text-[0.9rem] text-muted-foreground">{t("dictionary.subtitle")}</p>
      </header>

      <section className="mb-4 rounded-lg border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 rounded-lg border bg-background px-3 py-2.5">
          <Search size={18} className="shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("dictionary.searchPlaceholder")}
            className="min-w-0 flex-1 bg-transparent text-[0.95rem] outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3 py-2">
            <Filter size={16} className="text-muted-foreground" />
            <select
              value={selectedHsk}
              onChange={(event) => setSelectedHsk(event.target.value === "all" ? "all" : Number(event.target.value))}
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
            >
              <option value="all">{t("dictionary.allHsk")}</option>
              {hskLevels.map((level) => (
                <option key={level} value={level}>HSK {level}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3 py-2">
            <Filter size={16} className="text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
            >
              <option value="all">{t("dictionary.allCategories")}</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="mb-5 rounded-lg border bg-card p-4 shadow-sm">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-left">
            <h2 className="text-base font-extrabold">{t("dictionary.myLists")}</h2>
            <p className="text-xs text-muted-foreground">{t("dictionary.myListsHint")}</p>
          </div>
          <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-bold text-muted-foreground">
            {lists.length} {t("dictionary.lists")}
          </span>
        </div>

        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {lists.length === 0 ? (
            <span className="rounded-lg border border-dashed px-3 py-2 text-sm font-semibold text-muted-foreground">
              {t("dictionary.noLists")}
            </span>
          ) : (
            lists.map((list) => (
              <button
                key={list.id}
                type="button"
                onClick={() => setSelectedListId(list.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold transition",
                  selectedListId === list.id ? "border-primary bg-primary text-primary-foreground" : "bg-background",
                )}
              >
                <span>{list.emoji}</span>
                <span>{list.name}</span>
                <span className={selectedListId === list.id ? "text-primary-foreground/75" : "text-muted-foreground"}>
                  {list.wordIds.length}
                </span>
              </button>
            ))
          )}
        </div>

        <form onSubmit={handleCreateList} className="grid gap-2 sm:grid-cols-[92px_1fr_auto]">
          <select
            value={newListEmoji}
            onChange={(event) => setNewListEmoji(event.target.value)}
            className="rounded-lg border bg-background px-3 py-2 text-sm font-semibold outline-none"
          >
            {listEmojis.map((emoji) => (
              <option key={emoji} value={emoji}>{emoji}</option>
            ))}
          </select>
          <input
            value={newListName}
            onChange={(event) => setNewListName(event.target.value)}
            placeholder={t("dictionary.newListPlaceholder")}
            className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={!newListName.trim() || createListMutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          >
            <Plus size={16} />
            {t("dictionary.createList")}
          </button>
        </form>
      </section>

      <section className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-left text-base font-extrabold">
          {t("dictionary.results", { count: words.length })}
        </h2>
        {(vocabularyQuery.isFetching || listsQuery.isFetching) && (
          <span className="text-xs font-semibold text-muted-foreground">{t("common.loading")}</span>
        )}
      </section>

      {vocabularyQuery.isLoading ? (
        <LoadingCard label={t("dictionary.loading")} />
      ) : words.length === 0 ? (
        <div className="rounded-lg border bg-card px-5 py-10 text-center shadow-sm">
          <Search className="mx-auto mb-3 text-muted-foreground" size={36} />
          <h3 className="font-extrabold">{t("dictionary.emptyTitle")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("dictionary.emptyBody")}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {words.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              favorite={favoriteIds.has(word.id)}
              inSelectedList={selectedListWordIds.has(word.id)}
              hasSelectedList={!!selectedListId}
              onSpeak={() => speakChinese(word.simplified)}
              onFavorite={() => void handleFavorite(word)}
              onEnroll={() => void handleEnroll(word)}
              onAddToList={() => void handleAddToList(word)}
              busy={
                favoriteMutation.isPending ||
                enrollMutation.isPending ||
                addWordMutation.isPending ||
                createListMutation.isPending
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WordCard({
  word,
  favorite,
  inSelectedList,
  hasSelectedList,
  onSpeak,
  onFavorite,
  onEnroll,
  onAddToList,
  busy,
}: {
  word: Word;
  favorite: boolean;
  inSelectedList: boolean;
  hasSelectedList: boolean;
  onSpeak: () => void;
  onFavorite: () => void;
  onEnroll: () => void;
  onAddToList: () => void;
  busy: boolean;
}) {
  const { t } = useI18n();

  return (
    <article className="rounded-lg border bg-card p-4 text-left shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
              HSK {word.hskLevel}
            </span>
            <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-muted-foreground">
              {word.category}
            </span>
            <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-muted-foreground">
              {word.partOfSpeech}
            </span>
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
