import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Filter,
  ListChecks,
  LogIn,
  Search,
} from "lucide-react";
import {
  useEnrollWordMutation,
  useFavoriteWordsQuery,
  useListsQuery,
  useToggleFavoriteMutation,
  useVocabularyRadicalsQuery,
  useVocabularyQuery,
  useVocabularyTopicsQuery,
} from "../../api";
import type { CefrLevel } from "../../api/users";
import type { VocabularySort, Word } from "../../api/vocabulary";
import { useI18n } from "../../i18n";
import type { TranslationKey } from "../../i18n";
import { useAppSelector } from "../../store/hooks";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { speakChinese } from "../../utils/tts";
import { DropdownSelect } from "../../components/ui/dropdown-select";
import LoadingCard from "../../components/LoadingCard";
import WordCard from "./components/WordCard";
import ListPickerModal from "./components/ListPickerModal";
import ListDetailModal from "./components/ListDetailModal";

const hskLevels = [1, 2, 3, 4, 5, 6, 7];
const cefrLevels: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const pageSize = 24;
export default function Dictionary() {
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const sortOptions: Array<{ value: VocabularySort; label: string }> = [
    { value: "hsk", label: t("dictionary.sortHsk") },
    { value: "frequency", label: t("dictionary.sortFrequency") },
    { value: "alphabetical", label: t("dictionary.sortAlphabetical") },
  ];
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const radicalParam = urlSearchParams.get("radical");
  const [query, setQuery] = useState("");
  const [selectedHsk, setSelectedHsk] = useState<number | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCefr, setSelectedCefr] = useState<CefrLevel | "all">("all");
  const [selectedRadical, setSelectedRadical] = useState<string>(() => radicalParam || "all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [sort, setSort] = useState<VocabularySort>("hsk");
  const [page, setPage] = useState(1);
  const [pickerWord, setPickerWord] = useState<Word | null>(null);
  const [selectedListDetailId, setSelectedListDetailId] = useState<string | null>(null);

  const debouncedQuery = useDebouncedValue(query);

  const vocabularySearchParams = {
    q: debouncedQuery.trim() || undefined,
    hsk: selectedHsk === "all" ? undefined : selectedHsk,
    category: selectedCategory === "all" ? undefined : selectedCategory,
    cefr: selectedCefr === "all" ? undefined : selectedCefr,
    radical: selectedRadical === "all" ? undefined : selectedRadical,
    topic: selectedTopic === "all" ? undefined : selectedTopic,
    sort,
    page,
    limit: pageSize,
  };

  const vocabularyQuery = useVocabularyQuery(vocabularySearchParams);
  const topicsQuery = useVocabularyTopicsQuery();
  const radicalsQuery = useVocabularyRadicalsQuery();
  const listsQuery = useListsQuery();
  const favoritesQuery = useFavoriteWordsQuery(isAuthenticated);
  const favoriteMutation = useToggleFavoriteMutation();
  const enrollMutation = useEnrollWordMutation();

  const words = useMemo(() => vocabularyQuery.data?.vocab ?? [], [vocabularyQuery.data?.vocab]);
  const pagination = vocabularyQuery.data?.pagination;
  const topics = topicsQuery.data?.topics ?? [];
  const radicals = radicalsQuery.data?.radicals ?? [];
  const lists = useMemo(() => listsQuery.data?.lists ?? [], [listsQuery.data?.lists]);
  const wordIdsInAnyList = useMemo(() => new Set(lists.flatMap((list) => list.wordIds)), [lists]);
  const favoriteIds = useMemo(
    () => new Set((favoritesQuery.data?.words ?? []).map((word) => word.id)),
    [favoritesQuery.data?.words],
  );
  const categories = useMemo(() => {
    const values = new Set(words.map((word) => word.category).filter(Boolean));
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [words]);

  const resetPage = () => setPage(1);

  useEffect(() => {
    const nextRadical = radicalParam || "all";

    if (nextRadical !== selectedRadical) {
      setSelectedRadical(nextRadical);
      setPage(1);
    }
  }, [radicalParam, selectedRadical]);

  const updateRadicalFilter = (value: string) => {
    setSelectedRadical(value);
    resetPage();

    const nextParams = new URLSearchParams(urlSearchParams);
    if (value === "all") {
      nextParams.delete("radical");
    } else {
      nextParams.set("radical", value);
    }
    setUrlSearchParams(nextParams, { replace: true });
  };

  const handleEnroll = async (word: Word) => {
    const response = await enrollMutation.mutateAsync({ wordId: word.id });
    toast.success(response.enrolled ? t("dictionary.enrolled") : t("dictionary.alreadyEnrolled"));
  };

  const handleFavorite = async (word: Word) => {
    const response = await favoriteMutation.mutateAsync({ wordId: word.id });
    toast.success(response.isFavorite ? t("dictionary.favoriteSaved") : t("dictionary.favoriteRemoved"));
  };

  return (
    <div className="app-page">
      {radicalParam && (
        <button
          type="button"
          onClick={() => navigate("/radicals")}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border bg-background px-3.5 py-2 text-xs font-bold transition hover:border-primary hover:text-primary active:translate-y-px"
        >
          <ChevronLeft size={14} />
          {t("common.back")}
        </button>
      )}

      <header className="app-page-header mb-5">
        <div className="mb-2 flex items-center gap-2">
          <BookOpen size={24} className="text-primary" />
          <h1 className="text-2xl font-extrabold">{t("dictionary.title")}</h1>
        </div>
        <p className="text-[0.9rem] text-muted-foreground">{t("dictionary.subtitle")}</p>
      </header>

      {!isAuthenticated && (
        <div className="app-surface-padded mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-muted-foreground">{t("dictionary.guestHint")}</p>
          <button
            type="button"
            onClick={() => navigate("/auth")}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 active:translate-y-px"
          >
            <LogIn size={16} />
            {t("loginPrompt.login")}
          </button>
        </div>
      )}

      <section className="app-surface-padded mb-4">
        <div className="mb-3 flex items-center gap-2 rounded-xl border bg-background px-3 py-2.5">
          <Search size={18} className="shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              resetPage();
            }}
            placeholder={t("dictionary.searchPlaceholder")}
            className="min-w-0 flex-1 bg-transparent text-[0.95rem] outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <DropdownSelect
            label={t("dictionary.hskFilter")}
            icon={<Filter size={16} />}
            value={String(selectedHsk)}
            onChange={(value) => {
              setSelectedHsk(value === "all" ? "all" : Number(value));
              resetPage();
            }}
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
            onChange={(value) => {
              setSelectedCategory(value);
              resetPage();
            }}
            options={[
              { value: "all", label: t("dictionary.allCategories") },
              ...categories.map((category) => {
                const key = `wordCategory.${category}` as TranslationKey;
                const label = t(key);
                return { value: category, label: label === key ? category : label };
              }),
            ]}
            align="left"
            className="min-w-0"
            buttonClassName="w-full justify-between"
            menuClassName="w-full min-w-48"
          />

          <DropdownSelect
            label={t("dictionary.cefrFilter")}
            icon={<Filter size={16} />}
            value={selectedCefr}
            onChange={(value) => {
              setSelectedCefr(value === "all" ? "all" : value as CefrLevel);
              resetPage();
            }}
            options={[
              { value: "all", label: t("dictionary.allCefr") },
              ...cefrLevels.map((level) => ({ value: level, label: level })),
            ]}
            align="left"
            className="min-w-0"
            buttonClassName="w-full justify-between"
            menuClassName="w-full min-w-48"
          />

          <DropdownSelect
            label={t("dictionary.radicalFilter")}
            icon={<Filter size={16} />}
            value={selectedRadical}
            onChange={updateRadicalFilter}
            options={[
              { value: "all", label: t("dictionary.allRadicals") },
              ...radicals.map((item) => ({ value: item.radical, label: `${item.radical} (${item.count})` })),
            ]}
            align="left"
            className="min-w-0"
            buttonClassName="w-full justify-between"
            menuClassName="w-full min-w-48"
          />

          <DropdownSelect
            label={t("dictionary.topicFilter")}
            icon={<Filter size={16} />}
            value={selectedTopic}
            onChange={(value) => {
              setSelectedTopic(value);
              resetPage();
            }}
            options={[
              { value: "all", label: t("dictionary.allTopics") },
              ...topics.map((topic) => ({
                value: topic.id,
                label: `${topic.emoji ? `${topic.emoji} ` : ""}${(language === "vi" && topic.nameVi) || topic.nameEn}`,
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
            onChange={(value) => {
              setSort(value);
              resetPage();
            }}
            options={sortOptions}
            align="left"
            className="min-w-0"
            buttonClassName="w-full justify-between"
            menuClassName="w-full min-w-48"
          />
        </div>
      </section>

      {isAuthenticated && (
        <div className="mb-5 grid gap-4 rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-left">
              <p className="text-sm font-bold">{t("dictionary.myLists")}</p>
              <p className="text-xs text-muted-foreground">{t("dictionary.myListsHint")}</p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/my-lists")}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm font-bold transition hover:border-primary active:translate-y-px"
            >
              <ListChecks size={16} className="text-primary" />
              {t("nav.more")}
            </button>
          </div>

          {lists.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {lists.map((list) => (
                <button
                  key={list.id}
                  type="button"
                  onClick={() => setSelectedListDetailId(list.id)}
                  className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm font-bold transition hover:border-primary active:translate-y-px"
                >
                  <span>{list.emoji}</span>
                  <span>{list.name}</span>
                  <span className="text-xs text-muted-foreground">{list.wordIds.length}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <section className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-left text-base font-extrabold">
          {t("dictionary.results", { count: pagination?.total ?? words.length })}
        </h2>
        {(vocabularyQuery.isFetching || listsQuery.isFetching || topicsQuery.isFetching || radicalsQuery.isFetching) && (
          <span className="text-xs font-semibold text-muted-foreground">{t("common.loading")}</span>
        )}
      </section>

      {vocabularyQuery.isLoading ? (
        <LoadingCard label={t("dictionary.loading")} />
      ) : words.length === 0 ? (
        <div className="app-surface px-5 py-10 text-center">
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
              inList={wordIdsInAnyList.has(word.id)}
              onSpeak={() => speakChinese(word.simplified)}
              onFavorite={() => void handleFavorite(word)}
              onEnroll={() => void handleEnroll(word)}
              onAddToList={() => setPickerWord(word)}
              showActions={isAuthenticated}
              busy={favoriteMutation.isPending || enrollMutation.isPending}
            />
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <nav className="app-surface mt-5 flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-semibold text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={!pagination.hasPreviousPage || vocabularyQuery.isFetching}
              className="inline-flex items-center justify-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm font-semibold transition hover:border-primary active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))}
              disabled={!pagination.hasNextPage || vocabularyQuery.isFetching}
              className="inline-flex items-center justify-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm font-semibold transition hover:border-primary active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </nav>
      )}

      <footer className="mt-6 text-xs font-semibold text-muted-foreground">
        Vocabulary data: HSK Official Standards / CC-CEDICT / MIT Licensed
      </footer>

      <ListPickerModal items={pickerWord ? [pickerWord] : null} onClose={() => setPickerWord(null)} />
      <ListDetailModal listId={selectedListDetailId} onClose={() => setSelectedListDetailId(null)} />
    </div>
  );
}
