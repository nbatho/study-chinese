import { type FormEvent, useEffect, useState } from "react";
import { Check, ListPlus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import {
  useAddWordToAnyListMutation,
  useCreateListMutation,
  useListsQuery,
} from "../../../api";
import { useI18n } from "../../../i18n";
import { cn } from "../../../utils/cn";

/** A word to save: a dictionary word (has `id`) or a raw OCR segment (no `id`). */
export interface ListPickerItem {
  id?: string;
  simplified: string;
  traditional?: string;
  pinyin?: string;
  english?: string;
}

interface ListPickerModalProps {
  items: ListPickerItem[] | null;
  onClose: () => void;
}

/**
 * Popup shown by every "Add to list" button: pick one of the user's lists (or
 * create a new one) and the words are added right away. Accepts dictionary
 * words as well as OCR segments that are not in the dictionary yet.
 */
export default function ListPickerModal({ items, onClose }: ListPickerModalProps) {
  const { t } = useI18n();
  const listsQuery = useListsQuery();
  const addWordMutation = useAddWordToAnyListMutation();
  const createListMutation = useCreateListMutation();
  const [newListName, setNewListName] = useState("");
  const open = Boolean(items && items.length > 0);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!items || items.length === 0) return null;

  const lists = listsQuery.data?.lists ?? [];
  const busy = addWordMutation.isPending || createListMutation.isPending;

  const toPayload = (item: ListPickerItem) =>
    item.id
      ? { wordId: item.id }
      : {
          simplified: item.simplified,
          traditional: item.traditional,
          pinyin: item.pinyin,
          english: item.english,
        };

  const containsAll = (wordIds: string[]) =>
    items.every((item) => item.id && wordIds.includes(item.id));

  const addItemsToList = async (listId: string) => {
    for (const item of items) {
      await addWordMutation.mutateAsync({ listId, ...toPayload(item) });
    }
    toast.success(
      items.length === 1
        ? t("dictionary.addedToList", { word: items[0].simplified })
        : t("dictionary.addedManyToList", { count: items.length }),
    );
    onClose();
  };

  const handleCreateAndAdd = async (event: FormEvent) => {
    event.preventDefault();
    const name = newListName.trim();
    if (!name) return;

    const response = await createListMutation.mutateAsync({ name });
    setNewListName("");
    await addItemsToList(response.list.id);
  };

  return (
    <div
      className="fixed inset-0 z-1200 flex items-end justify-center bg-black/35 px-0 sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="anim-pop flex max-h-[80dvh] w-full max-w-md flex-col rounded-t-2xl border bg-card p-4 text-left shadow-xl sm:rounded-2xl sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-extrabold">{t("dictionary.pickListTitle")}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {items.length === 1
                ? t("dictionary.pickListHint", { word: items[0].simplified })
                : t("dictionary.pickListHintMany", { count: items.length })}
            </p>
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

        {items.length > 1 && (
          <div className="mb-3 flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">
            {items.map((item, index) => (
              <span
                key={`${item.id ?? item.simplified}-${index}`}
                className="rounded-lg bg-secondary px-2 py-1 font-serif text-sm font-bold"
              >
                {item.simplified}
              </span>
            ))}
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {lists.length === 0 ? (
            <p className="rounded-xl border border-dashed px-3 py-4 text-center text-sm font-semibold text-muted-foreground">
              {t("dictionary.pickListEmpty")}
            </p>
          ) : (
            <div className="grid gap-2">
              {lists.map((list) => {
                const contains = containsAll(list.wordIds);
                return (
                  <button
                    key={list.id}
                    type="button"
                    disabled={contains || busy}
                    onClick={() => void addItemsToList(list.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border bg-background px-3 py-2.5 text-left text-sm font-bold transition",
                      contains
                        ? "cursor-default border-jade/40 bg-jade/5"
                        : "hover:border-primary active:translate-y-px disabled:opacity-60",
                    )}
                  >
                    <span className="text-lg">{list.emoji}</span>
                    <span className="min-w-0 flex-1 truncate">{list.name}</span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {t("dictionary.wordsCount", { count: list.wordIds.length })}
                    </span>
                    {contains ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-jade">
                        <Check size={14} />
                        {t("dictionary.inList")}
                      </span>
                    ) : (
                      <ListPlus size={16} className="text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <form onSubmit={handleCreateAndAdd} className="mt-3 flex gap-2 border-t pt-3">
          <input
            value={newListName}
            onChange={(event) => setNewListName(event.target.value)}
            placeholder={t("dictionary.newListPlaceholder")}
            className="app-control min-w-0 flex-1 text-sm"
          />
          <button
            type="submit"
            disabled={!newListName.trim() || busy}
            title={t("dictionary.pickListCreateAndAdd")}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 active:translate-y-px disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          >
            <Plus size={16} />
            {t("dictionary.createList")}
          </button>
        </form>
      </div>
    </div>
  );
}
