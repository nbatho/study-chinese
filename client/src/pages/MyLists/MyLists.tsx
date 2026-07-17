import { type FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  BookmarkPlus,
  BookOpen,
  Filter,
  Heart,
  ListChecks,
  Plus,
  Search,
  Trash2,
  Volume2,
} from "lucide-react";
import {
  useCreateListMutation,
  useDeleteListMutation,
  useEnrollWordMutation,
  useFavoriteWordsQuery,
  useListDetailQuery,
  useListsQuery,
  useRemoveWordFromListMutation,
  useToggleFavoriteMutation,
} from "../../api";
import type { CustomListWord } from "../../api/lists";
import type { Word } from "../../api/vocabulary";
import ConfirmDialog from "../../components/ConfirmDialog";
import LoadingCard from "../../components/LoadingCard";
import LoginPromptCard from "../../components/LoginPromptCard";
import { DropdownSelect } from "../../components/ui/dropdown-select";
import { useAuthGate } from "../../hooks/useAuthGate";
import { tOrRaw, useI18n } from "../../i18n";
import { speakChinese } from "../../utils/tts";
import WordCard from "../Dictionary/components/WordCard";
import ListPickerModal from "../Dictionary/components/ListPickerModal";

const hskLevels = [1, 2, 3, 4, 5, 6, 7];
const listEmojis = ["📘", "⭐", "🧠", "✍️"];

type ListSort = "hsk" | "alphabetical";

export default function MyLists() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { isResolving, isAuthenticated } = useAuthGate();

  const listsQuery = useListsQuery();
  const favoritesQuery = useFavoriteWordsQuery(isAuthenticated);
  const createListMutation = useCreateListMutation();
  const deleteListMutation = useDeleteListMutation();
  const enrollMutation = useEnrollWordMutation();
  const favoriteMutation = useToggleFavoriteMutation();

  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [pickerWord, setPickerWord] = useState<Word | null>(null);
  const [newListName, setNewListName] = useState("");
  const [newListEmoji, setNewListEmoji] = useState(listEmojis[0]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [query, setQuery] = useState("");
  const [selectedHsk, setSelectedHsk] = useState<number | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPos, setSelectedPos] = useState<string>("all");
  const [sort, setSort] = useState<ListSort>("hsk");

  const lists = useMemo(() => listsQuery.data?.lists ?? [], [listsQuery.data?.lists]);
  // Fall back to the first list so the page opens with content right away.
  const activeListId = selectedListId ?? lists[0]?.id ?? "";
  const activeList = lists.find((list) => list.id === activeListId);

  const favoriteWords = favoritesQuery.data?.words ?? [];
  const wordIdsInAnyList = useMemo(
    () => new Set(lists.flatMap((list) => list.wordIds)),
    [lists],
  );

  const detailQuery = useListDetailQuery(activeListId, Boolean(activeListId));
  const removeWordMutation = useRemoveWordFromListMutation(activeListId);

  const words = useMemo(() => detailQuery.data?.list.words ?? [], [detailQuery.data?.list.words]);

  const categories = useMemo(() => {
    const values = new Set(words.map((word) => word.category).filter(Boolean));
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [words]);

  const partsOfSpeech = useMemo(() => {
    const values = new Set(words.map((word) => word.partOfSpeech).filter(Boolean));
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [words]);

  const filteredWords = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = words.filter((word) => {
      if (selectedHsk !== "all" && word.hskLevel !== selectedHsk) return false;
      if (selectedCategory !== "all" && word.category !== selectedCategory) return false;
      if (selectedPos !== "all" && word.partOfSpeech !== selectedPos) return false;
      if (!needle) return true;
      return [word.simplified, word.traditional, word.pinyin, word.gloss, word.english]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(needle));
    });

    return matches.sort((a, b) =>
      sort === "hsk"
        ? a.hskLevel - b.hskLevel || a.pinyin.localeCompare(b.pinyin)
        : a.pinyin.localeCompare(b.pinyin),
    );
  }, [words, query, selectedHsk, selectedCategory, selectedPos, sort]);

  // Localize DB labels (stored as English keys) to the app language.
  const localizeLabel = (prefix: string, raw: string) => tOrRaw(t, prefix, raw);

  const selectList = (listId: string) => {
    setShowFavorites(false);
    setSelectedListId(listId);
    setQuery("");
    setSelectedHsk("all");
    setSelectedCategory("all");
    setSelectedPos("all");
  };

  const handleUnfavorite = async (word: Word) => {
    const response = await favoriteMutation.mutateAsync({ wordId: word.id });
    toast.success(
      response.isFavorite ? t("dictionary.favoriteSaved") : t("dictionary.favoriteRemoved"),
    );
  };

  const handleEnrollWord = async (word: Word) => {
    const response = await enrollMutation.mutateAsync({ wordId: word.id });
    toast.success(response.enrolled ? t("dictionary.enrolled") : t("dictionary.alreadyEnrolled"));
  };

  const handleCreateList = async (event: FormEvent) => {
    event.preventDefault();
    const name = newListName.trim();
    if (!name) return;

    const response = await createListMutation.mutateAsync({ name, emoji: newListEmoji });
    setNewListName("");
    selectList(response.list.id);
    toast.success(t("dictionary.listCreated"));
  };

  const handleDeleteList = async () => {
    setConfirmDelete(false);
    if (!activeListId) return;
    await deleteListMutation.mutateAsync(activeListId);
    setSelectedListId(null);
    toast.success(t("dictionary.listDeleted"));
  };

  const handleRemoveWord = async (word: CustomListWord) => {
    await removeWordMutation.mutateAsync(word.id);
    toast.success(t("dictionary.removedFromList", { word: word.simplified }));
  };

  const handleEnroll = async (word: CustomListWord) => {
    const response = await enrollMutation.mutateAsync({ wordId: word.id });
    toast.success(response.enrolled ? t("dictionary.enrolled") : t("dictionary.alreadyEnrolled"));
  };

  if (isResolving) {
    return <LoadingCard label={t("common.loading")} />;
  }

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={ListChecks}
        title={t("dictionary.myLists")}
        description={t("myLists.loginBody")}
      />
    );
  }

  return (
    <div className="app-page">
      <header className="app-page-header mb-5">
        <div className="mb-2 flex items-center gap-2">
          <ListChecks size={24} className="text-primary" />
          <h1 className="text-2xl font-extrabold">{t("dictionary.myLists")}</h1>
        </div>
        <p className="text-[0.9rem] text-muted-foreground">{t("myLists.subtitle")}</p>
      </header>

      <section className="app-surface-padded mb-4">
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
          <button
            type="button"
            onClick={() => setShowFavorites(true)}
            className={
              showFavorites
                ? "flex shrink-0 items-center gap-2 rounded-xl border border-primary bg-primary/5 px-3 py-2 text-sm font-bold text-primary transition"
                : "flex shrink-0 items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm font-bold transition hover:border-primary"
            }
          >
            <Heart size={15} className="fill-primary text-primary" />
            <span>{t("dictionary.favoritesChip")}</span>
            <span className="text-muted-foreground">{favoriteWords.length}</span>
          </button>
          {lists.length === 0 ? (
            <span className="rounded-xl border border-dashed px-3 py-2 text-sm font-semibold text-muted-foreground">
              {t("dictionary.noLists")}
            </span>
          ) : (
            lists.map((list) => (
              <button
                key={list.id}
                type="button"
                onClick={() => selectList(list.id)}
                title={t("dictionary.viewList")}
                className={
                  !showFavorites && list.id === activeListId
                    ? "flex shrink-0 items-center gap-2 rounded-xl border border-primary bg-primary/5 px-3 py-2 text-sm font-bold text-primary transition"
                    : "flex shrink-0 items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm font-bold transition hover:border-primary"
                }
              >
                <span>{list.emoji}</span>
                <span>{list.name}</span>
                <span className="text-muted-foreground">{list.wordIds.length}</span>
              </button>
            ))
          )}
        </div>

        <form onSubmit={handleCreateList} className="grid gap-2 sm:grid-cols-[92px_1fr_auto]">
          <DropdownSelect
            label={t("dictionary.listEmoji")}
            value={newListEmoji}
            onChange={setNewListEmoji}
            options={listEmojis.map((emoji) => ({ value: emoji, label: emoji }))}
            align="left"
            className="min-w-0"
            buttonClassName="w-full justify-between text-base"
            menuClassName="w-full min-w-24"
          />
          <input
            value={newListName}
            onChange={(event) => setNewListName(event.target.value)}
            placeholder={t("dictionary.newListPlaceholder")}
            className="app-control text-sm"
          />
          <button
            type="submit"
            disabled={!newListName.trim() || createListMutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 active:translate-y-px disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          >
            <Plus size={16} />
            {t("dictionary.createList")}
          </button>
        </form>
      </section>

      {showFavorites ? (
        <>
          <section className="mb-3 flex items-center justify-between gap-3">
            <h2 className="flex min-w-0 items-center gap-2 text-left text-base font-extrabold">
              <Heart size={18} className="shrink-0 fill-primary text-primary" />
              <span className="truncate">{t("dictionary.favoritesTitle")}</span>
              <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-xs font-bold text-muted-foreground">
                {t("dictionary.results", { count: favoriteWords.length })}
              </span>
            </h2>
          </section>

          {favoritesQuery.isLoading ? (
            <LoadingCard label={t("common.loading")} />
          ) : favoriteWords.length === 0 ? (
            <div className="app-surface px-5 py-10 text-center">
              <Heart className="mx-auto mb-3 text-muted-foreground" size={36} />
              <h3 className="font-extrabold">{t("dictionary.favoritesEmptyTitle")}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t("dictionary.favoritesEmptyBody")}</p>
              <button
                type="button"
                onClick={() => navigate("/dictionary")}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 active:translate-y-px"
              >
                <BookOpen size={16} />
                {t("dictionary.openDictionary")}
              </button>
            </div>
          ) : (
            <div className="grid gap-3">
              {favoriteWords.map((word) => (
                <WordCard
                  key={word.id}
                  word={word}
                  favorite
                  inList={wordIdsInAnyList.has(word.id)}
                  onSpeak={() => speakChinese(word.simplified)}
                  onFavorite={() => void handleUnfavorite(word)}
                  onEnroll={() => void handleEnrollWord(word)}
                  onAddToList={() => setPickerWord(word)}
                  busy={favoriteMutation.isPending || enrollMutation.isPending}
                />
              ))}
            </div>
          )}
        </>
      ) : lists.length === 0 ? (
        <div className="app-surface px-5 py-10 text-center">
          <ListChecks className="mx-auto mb-3 text-muted-foreground" size={36} />
          <h3 className="font-extrabold">{t("myLists.emptyTitle")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("myLists.emptyBody")}</p>
        </div>
      ) : (
        <>
          <section className="app-surface-padded mb-4">
            <div className="mb-3 flex items-center gap-2 rounded-xl border bg-background px-3 py-2.5">
              <Search size={18} className="shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("dictionary.searchPlaceholder")}
                className="min-w-0 flex-1 bg-transparent text-[0.95rem] outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <DropdownSelect
                label={t("dictionary.hskFilter")}
                icon={<Filter size={16} />}
                value={String(selectedHsk)}
                onChange={(value) => setSelectedHsk(value === "all" ? "all" : Number(value))}
                options={[
                  { value: "all", label: t("dictionary.allHsk") },
                  ...hskLevels.map((level) => ({ value: String(level), label: `HSK ${level}` })),
                ]}
                align="left"
                className="min-w-0"
                buttonClassName="w-full justify-between"
                menuClassName="w-full min-w-48"
              />

              <DropdownSelect
                label={t("dictionary.categoryFilter")}
                icon={<Filter size={16} />}
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={[
                  { value: "all", label: t("dictionary.allCategories") },
                  ...categories.map((category) => ({
                    value: category,
                    label: localizeLabel("wordCategory", category),
                  })),
                ]}
                align="left"
                className="min-w-0"
                buttonClassName="w-full justify-between"
                menuClassName="w-full min-w-48"
              />

              <DropdownSelect
                label={t("myLists.posFilter")}
                icon={<Filter size={16} />}
                value={selectedPos}
                onChange={setSelectedPos}
                options={[
                  { value: "all", label: t("myLists.allPos") },
                  ...partsOfSpeech.map((pos) => ({
                    value: pos,
                    label: localizeLabel("pos", pos),
                  })),
                ]}
                align="left"
                className="min-w-0"
                buttonClassName="w-full justify-between"
                menuClassName="w-full min-w-48"
              />

              <DropdownSelect
                label={t("dictionary.sortAria")}
                icon={<Filter size={16} />}
                value={sort}
                onChange={setSort}
                options={[
                  { value: "hsk", label: t("dictionary.sortHsk") },
                  { value: "alphabetical", label: t("dictionary.sortAlphabetical") },
                ]}
                align="left"
                className="min-w-0"
                buttonClassName="w-full justify-between"
                menuClassName="w-full min-w-48"
              />
            </div>
          </section>

          <section className="mb-3 flex items-center justify-between gap-3">
            <h2 className="flex min-w-0 items-center gap-2 text-left text-base font-extrabold">
              {activeList && (
                <span className="shrink-0 text-lg">{activeList.emoji}</span>
              )}
              <span className="truncate">{activeList?.name}</span>
              <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-xs font-bold text-muted-foreground">
                {t("dictionary.results", { count: filteredWords.length })}
              </span>
            </h2>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={!activeListId || deleteListMutation.isPending}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold text-tone-4 transition hover:border-tone-4 active:translate-y-px disabled:opacity-60"
            >
              <Trash2 size={15} />
              {t("dictionary.deleteList")}
            </button>
          </section>

          {detailQuery.isLoading ? (
            <LoadingCard label={t("common.loading")} />
          ) : words.length === 0 ? (
            <div className="app-surface px-5 py-10 text-center">
              <ListChecks className="mx-auto mb-3 text-muted-foreground" size={36} />
              <h3 className="font-extrabold">{t("dictionary.listDetailEmpty")}</h3>
            </div>
          ) : filteredWords.length === 0 ? (
            <div className="app-surface px-5 py-10 text-center">
              <Search className="mx-auto mb-3 text-muted-foreground" size={36} />
              <h3 className="font-extrabold">{t("dictionary.emptyTitle")}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t("dictionary.emptyBody")}</p>
            </div>
          ) : (
            <div className="grid gap-2">
              {filteredWords.map((word) => (
                <div key={word.id} className="flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5">
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-serif text-xl font-extrabold">{word.simplified}</span>
                      <span className="text-sm font-bold text-primary">{word.pinyin}</span>
                      {word.hskLevel > 0 && (
                        <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[0.65rem] font-bold text-primary">
                          HSK {word.hskLevel}
                        </span>
                      )}
                      {word.partOfSpeech && (
                        <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[0.65rem] font-semibold text-muted-foreground">
                          {localizeLabel("pos", word.partOfSpeech)}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-sm font-medium text-muted-foreground">{word.gloss}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakChinese(word.simplified)}
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-secondary text-primary transition hover:bg-accent active:translate-y-px"
                    aria-label={t("common.listen")}
                  >
                    <Volume2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleEnroll(word)}
                    disabled={enrollMutation.isPending}
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-primary transition hover:border-primary active:translate-y-px disabled:opacity-60"
                    aria-label={t("dictionary.review")}
                    title={t("dictionary.review")}
                  >
                    <BookmarkPlus size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleRemoveWord(word)}
                    disabled={removeWordMutation.isPending}
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-tone-4 transition hover:border-tone-4 active:translate-y-px disabled:opacity-60"
                    aria-label={t("dictionary.removeFromList")}
                    title={t("dictionary.removeFromList")}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title={t("dictionary.deleteListConfirmTitle")}
        description={t("dictionary.deleteListConfirmBody", { name: activeList?.name ?? "" })}
        confirmLabel={t("dictionary.deleteList")}
        onConfirm={() => void handleDeleteList()}
        onCancel={() => setConfirmDelete(false)}
      />

      <ListPickerModal items={pickerWord ? [pickerWord] : null} onClose={() => setPickerWord(null)} />
    </div>
  );
}
