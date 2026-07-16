import { useEffect, useState } from "react";
import { Trash2, Volume2, X } from "lucide-react";
import { toast } from "sonner";
import {
  useDeleteListMutation,
  useListDetailQuery,
  useRemoveWordFromListMutation,
} from "../../../api";
import ConfirmDialog from "../../../components/ConfirmDialog";
import LoadingCard from "../../../components/LoadingCard";
import { useI18n } from "../../../i18n";
import { speakChinese } from "../../../utils/tts";

interface ListDetailModalProps {
  listId: string | null;
  onClose: () => void;
}

/** Shows every word saved in one custom list, with remove and delete-list actions. */
export default function ListDetailModal({ listId, onClose }: ListDetailModalProps) {
  const { t } = useI18n();
  const open = Boolean(listId);
  const detailQuery = useListDetailQuery(listId ?? "", open);
  const removeWordMutation = useRemoveWordFromListMutation(listId ?? "");
  const deleteListMutation = useDeleteListMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!listId) return null;

  const list = detailQuery.data?.list;
  const words = list?.words ?? [];

  const handleRemoveWord = async (wordId: string, simplified: string) => {
    await removeWordMutation.mutateAsync(wordId);
    toast.success(t("dictionary.removedFromList", { word: simplified }));
  };

  const handleDeleteList = async () => {
    setConfirmDelete(false);
    await deleteListMutation.mutateAsync(listId);
    toast.success(t("dictionary.listDeleted"));
    onClose();
  };

  return (
    <>
    <div
      className="fixed inset-0 z-1200 flex items-end justify-center bg-black/35 px-0 sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="anim-pop flex max-h-[85dvh] w-full max-w-lg flex-col rounded-t-2xl border bg-card p-4 text-left shadow-xl sm:rounded-2xl sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="flex items-center gap-2 font-extrabold">
              <span className="text-xl">{list?.emoji}</span>
              <span className="truncate">{list?.name}</span>
              <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-xs font-bold text-muted-foreground">
                {t("dictionary.wordsCount", { count: words.length })}
              </span>
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{t("dictionary.listDetailHint")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary"
            aria-label={t("common.close")}
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {detailQuery.isLoading ? (
            <LoadingCard label={t("common.loading")} />
          ) : words.length === 0 ? (
            <p className="rounded-xl border border-dashed px-3 py-6 text-center text-sm font-semibold text-muted-foreground">
              {t("dictionary.listDetailEmpty")}
            </p>
          ) : (
            <div className="grid gap-2">
              {words.map((word) => (
                <div key={word.id} className="flex items-center gap-3 rounded-xl border bg-background px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-serif text-xl font-extrabold">{word.simplified}</span>
                      <span className="text-sm font-bold text-primary">{word.pinyin}</span>
                      {word.hskLevel > 0 && (
                        <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[0.65rem] font-bold text-primary">
                          HSK {word.hskLevel}
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
                    onClick={() => void handleRemoveWord(word.id, word.simplified)}
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
        </div>

        <div className="mt-3 flex justify-end border-t pt-3">
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            disabled={deleteListMutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold text-tone-4 transition hover:border-tone-4 active:translate-y-px disabled:opacity-60"
          >
            <Trash2 size={15} />
            {t("dictionary.deleteList")}
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      open={confirmDelete}
      title={t("dictionary.deleteListConfirmTitle")}
      description={t("dictionary.deleteListConfirmBody", { name: list?.name ?? "" })}
      confirmLabel={t("dictionary.deleteList")}
      onConfirm={() => void handleDeleteList()}
      onCancel={() => setConfirmDelete(false)}
    />
    </>
  );
}
