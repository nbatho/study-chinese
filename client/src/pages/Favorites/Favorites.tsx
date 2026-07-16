import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BookOpen, Heart } from "lucide-react";
import {
  useEnrollWordMutation,
  useFavoriteWordsQuery,
  useListsQuery,
  useToggleFavoriteMutation,
} from "../../api";
import type { Word } from "../../api/vocabulary";
import LoadingCard from "../../components/LoadingCard";
import LoginPromptCard from "../../components/LoginPromptCard";
import { useAuthGate } from "../../hooks/useAuthGate";
import { useI18n } from "../../i18n";
import { speakChinese } from "../../utils/tts";
import WordCard from "../Dictionary/components/WordCard";
import ListPickerModal from "../Dictionary/components/ListPickerModal";

export default function Favorites() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { isResolving, isAuthenticated } = useAuthGate();
  const favoritesQuery = useFavoriteWordsQuery(isAuthenticated);
  const listsQuery = useListsQuery();
  const favoriteMutation = useToggleFavoriteMutation();
  const enrollMutation = useEnrollWordMutation();
  const [pickerWord, setPickerWord] = useState<Word | null>(null);

  const words = favoritesQuery.data?.words ?? [];
  const wordIdsInAnyList = useMemo(
    () => new Set((listsQuery.data?.lists ?? []).flatMap((list) => list.wordIds)),
    [listsQuery.data?.lists],
  );

  const handleUnfavorite = async (word: Word) => {
    const response = await favoriteMutation.mutateAsync({ wordId: word.id });
    toast.success(response.isFavorite ? t("dictionary.favoriteSaved") : t("dictionary.favoriteRemoved"));
  };

  const handleEnroll = async (word: Word) => {
    const response = await enrollMutation.mutateAsync({ wordId: word.id });
    toast.success(response.enrolled ? t("dictionary.enrolled") : t("dictionary.alreadyEnrolled"));
  };

  if (isResolving) {
    return <LoadingCard label={t("common.loading")} />;
  }

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={Heart}
        title={t("dictionary.favoritesTitle")}
        description={t("dictionary.favoritesEmptyBody")}
      />
    );
  }

  return (
    <div className="app-page">
      <header className="app-page-header mb-5">
        <div className="mb-2 flex items-center gap-2">
          <Heart size={24} className="fill-primary text-primary" />
          <h1 className="text-2xl font-extrabold">{t("dictionary.favoritesTitle")}</h1>
        </div>
        <p className="text-[0.9rem] text-muted-foreground">{t("dictionary.favoritesSubtitle")}</p>
      </header>

      <section className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-left text-base font-extrabold">
          {t("dictionary.results", { count: words.length })}
        </h2>
        {favoritesQuery.isFetching && (
          <span className="text-xs font-semibold text-muted-foreground">{t("common.loading")}</span>
        )}
      </section>

      {favoritesQuery.isLoading ? (
        <LoadingCard label={t("common.loading")} />
      ) : words.length === 0 ? (
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
          {words.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              favorite
              inList={wordIdsInAnyList.has(word.id)}
              onSpeak={() => speakChinese(word.simplified)}
              onFavorite={() => void handleUnfavorite(word)}
              onEnroll={() => void handleEnroll(word)}
              onAddToList={() => setPickerWord(word)}
              busy={favoriteMutation.isPending || enrollMutation.isPending}
            />
          ))}
        </div>
      )}

      <ListPickerModal items={pickerWord ? [pickerWord] : null} onClose={() => setPickerWord(null)} />
    </div>
  );
}
