import { CalendarDays, Heart, Loader2, Save, Search, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import type { TranslateController } from "./useTranslateController";

interface TranslationHistoryProps {
  controller: TranslateController;
}

/**
 * Translation history, rendered full-width below the source/result columns.
 * Each event is a single card: tap to reopen, plus favorite/delete/notes.
 */
export default function TranslationHistory({ controller }: TranslationHistoryProps) {
  const {
    t,
    historyKeyword,
    setHistoryKeyword,
    historyDate,
    setHistoryDate,
    historyFavoritesOnly,
    setHistoryFavoritesOnly,
    historyEvents,
    historyFetching,
    editingHistoryId,
    historyDraft,
    setHistoryDraft,
    openHistoryEvent,
    startEditingHistory,
    setEditingHistoryId,
    saveHistoryNotebook,
    toggleHistoryFavorite,
    deleteHistoryEvent,
    clearHistory,
    updatePending,
    deletePending,
    clearPending,
  } = controller;

  return (
    <section className="app-surface-padded mt-4 text-left">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-extrabold">{t("translate.historyTitle")}</h3>
        <div className="flex items-center gap-2">
          {historyFetching && <Loader2 className="animate-spin text-muted-foreground" size={14} />}
          {historyEvents.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void clearHistory()}
              disabled={clearPending || deletePending}
            >
              <Trash2 size={15} />
              {t("translate.clearAll")}
            </Button>
          )}
        </div>
      </div>

      <div className="mb-3 grid gap-2 rounded-xl border bg-background p-3 sm:grid-cols-[1fr_auto_auto]">
        <label className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm">
          <Search size={15} className="shrink-0 text-muted-foreground" />
          <input
            value={historyKeyword}
            onChange={(event) => setHistoryKeyword(event.target.value)}
            placeholder={t("translate.filterScans")}
            className="min-w-0 flex-1 bg-transparent outline-none"
          />
        </label>
        <label className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm">
          <CalendarDays size={15} className="shrink-0 text-muted-foreground" />
          <input
            type="date"
            value={historyDate}
            onChange={(event) => setHistoryDate(event.target.value)}
            className="min-w-0 flex-1 bg-transparent outline-none"
          />
        </label>
        <Button
          type="button"
          variant={historyFavoritesOnly ? "default" : "outline"}
          onClick={() => setHistoryFavoritesOnly((value) => !value)}
        >
          <Heart size={16} fill={historyFavoritesOnly ? "currentColor" : "none"} />
          {t("translate.favorites")}
        </Button>
      </div>

      {historyEvents.length === 0 ? (
        <div className="rounded-xl border bg-background p-3 text-sm font-semibold text-muted-foreground">
          {t("translate.noHistory")}
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {historyEvents.map((event) => (
            <div key={event.id} className="rounded-xl border bg-background p-3">
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() => openHistoryEvent(event)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="line-clamp-1 text-sm font-extrabold">
                    {event.title || t("translate.noteLabel")}
                  </span>
                  <span className="mt-0.5 line-clamp-1 font-serif text-lg font-extrabold">
                    {event.detectedText || t("translate.noText")}
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-muted-foreground">
                    {new Date(event.createdAt).toLocaleString()} -{" "}
                    {t("translate.matchedWords", { count: event.matchedWordIds.length })}
                  </span>
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => void toggleHistoryFavorite(event)}
                  disabled={updatePending}
                  aria-label={t("translate.favorites")}
                  title={t("translate.favorites")}
                >
                  <Heart size={17} fill={event.isFavorite ? "currentColor" : "none"} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => void deleteHistoryEvent(event)}
                  disabled={deletePending || clearPending}
                  aria-label={t("translate.clearAll")}
                  title={t("translate.clearAll")}
                >
                  <Trash2 size={17} />
                </Button>
              </div>

              {event.note && editingHistoryId !== event.id && (
                <p className="mt-2 line-clamp-2 text-xs font-medium text-muted-foreground">{event.note}</p>
              )}

              {editingHistoryId === event.id ? (
                <div className="mt-3 grid gap-2">
                  <input
                    value={historyDraft.title}
                    onChange={(inputEvent) =>
                      setHistoryDraft((draft) => ({ ...draft, title: inputEvent.target.value }))
                    }
                    placeholder={t("translate.noteTitle")}
                    className="rounded-md border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <textarea
                    value={historyDraft.note}
                    onChange={(inputEvent) =>
                      setHistoryDraft((draft) => ({ ...draft, note: inputEvent.target.value }))
                    }
                    placeholder={t("translate.notePlaceholder")}
                    className="min-h-20 resize-y rounded-md border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setEditingHistoryId(null)}>
                      {t("translate.cancel")}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => void saveHistoryNotebook(event)}
                      disabled={updatePending}
                    >
                      <Save size={16} />
                      {t("translate.save")}
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => startEditingHistory(event)}
                  className="mt-2 text-xs font-bold text-primary"
                >
                  {t("translate.editNote")}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
