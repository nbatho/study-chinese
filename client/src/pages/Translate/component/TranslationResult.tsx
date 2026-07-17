import { BookmarkPlus, Clipboard, Languages, ListPlus, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../utils/cn";
import type { TranslateController } from "./useTranslateController";

interface TranslationResultProps {
  controller: TranslateController;
}

/** Translation result panel shared by the Text and OCR tabs. */
export default function TranslationResult({ controller }: TranslationResultProps) {
  const {
    t,
    isAuthenticated,
    loading,
    targetLang,
    changeTargetLang,
    translatedText,
    pinyinText,
    detectedText,
    segments,
    activeSegments,
    selectedSegmentIds,
    toggleSegment,
    clearSegments,
    selectedBox,
    copyTranslation,
    openListPicker,
    saveActiveSegmentsToSrs,
    enrollPending,
    canTranslateImage,
    translateImage,
  } = controller;

  return (
    <section className="app-surface-padded text-left">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold">{t("translate.resultTitle")}</h2>
          <p className="text-xs text-muted-foreground">{t("translate.resultHint")}</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="grid grid-cols-2 gap-1 rounded-xl border bg-background p-1"
            role="group"
            aria-label={t("translate.targetLabel")}
          >
            <Button
              type="button"
              size="sm"
              variant={targetLang === "vi" ? "default" : "ghost"}
              onClick={() => void changeTargetLang("vi")}
              disabled={loading}
              className="rounded-lg px-2.5"
              title={t("translate.targetVi")}
            >
              VI
            </Button>
            <Button
              type="button"
              size="sm"
              variant={targetLang === "en" ? "default" : "ghost"}
              onClick={() => void changeTargetLang("en")}
              disabled={loading}
              className="rounded-lg px-2.5"
              title={t("translate.targetEn")}
            >
              EN
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={copyTranslation}
            disabled={!translatedText}
            aria-label={t("translate.copyAria")}
            title={t("translate.copyAria")}
          >
            <Clipboard size={18} />
          </Button>
        </div>
      </div>

      {canTranslateImage && (
        <Button type="button" className="mb-4 w-full" onClick={() => void translateImage()} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Languages size={16} />}
          {t("translate.translate")}
        </Button>
      )}

      <div className="mb-4 min-h-37 rounded-xl border bg-background p-4">
        {loading ? (
          <div className="flex h-29 items-center justify-center gap-2 text-sm font-semibold text-muted-foreground">
            <Loader2 className="animate-spin" size={18} />
            {t("translate.processing")}
          </div>
        ) : translatedText ? (
          <div>
            <p className="text-[1.05rem] font-semibold leading-relaxed">{translatedText}</p>
            {pinyinText && <p className="mt-3 text-sm font-bold text-primary">{pinyinText}</p>}
          </div>
        ) : (
          <div className="flex h-29 items-center justify-center text-center text-sm font-semibold text-muted-foreground">
            {t("translate.resultEmpty")}
          </div>
        )}
      </div>

      {detectedText && (
        <div className="mb-4 rounded-xl border bg-secondary/60 p-3">
          <h3 className="mb-1 text-xs font-bold text-muted-foreground">{t("translate.detectedText")}</h3>
          <p className="break-words font-serif text-2xl font-extrabold">{detectedText}</p>
        </div>
      )}

      {selectedBox && (
        <div className="mb-4 rounded-xl border border-jade/30 bg-jade/10 p-3">
          <h3 className="mb-1 text-xs font-bold text-jade">{t("translate.selectedBox")}</h3>
          <p className="font-serif text-3xl font-extrabold">{selectedBox.text}</p>
          {selectedBox.pinyin && <p className="mt-1 text-sm font-bold text-primary">{selectedBox.pinyin}</p>}
          <p className="mt-2 text-sm font-semibold">{selectedBox.english || t("translate.noBoxMeaning")}</p>
        </div>
      )}

      {segments.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="text-xs font-bold text-muted-foreground">{t("translate.segments")}</h3>
            {selectedSegmentIds.length > 0 && (
              <button type="button" className="text-xs font-bold text-primary" onClick={clearSegments}>
                {t("translate.clearSegments")}
              </button>
            )}
          </div>
          {isAuthenticated && (
            <div className="mb-3 grid grid-cols-2 gap-2 rounded-xl border bg-background p-3">
              <Button type="button" variant="outline" onClick={openListPicker} disabled={activeSegments.length === 0}>
                <ListPlus size={16} />
                {t("translate.saveToList")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => void saveActiveSegmentsToSrs()}
                disabled={enrollPending}
              >
                <BookmarkPlus size={16} />
                {t("translate.addSrs")}
              </Button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {segments.map((segment) => {
              const selected = selectedSegmentIds.includes(segment.id);

              return (
                <button
                  key={segment.id}
                  type="button"
                  onClick={() => toggleSegment(segment.id)}
                  className={cn(
                    "min-w-18 rounded-xl border px-3 py-2 text-left transition",
                    selected ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:border-primary/60",
                  )}
                >
                  <span className="block font-serif text-xl font-extrabold">{segment.text}</span>
                  {segment.pinyin && (
                    <span className={cn("block text-xs font-bold", selected ? "text-white/80" : "text-primary")}>
                      {segment.pinyin}
                    </span>
                  )}
                  {segment.english && (
                    <span
                      className={cn(
                        "block max-w-40 truncate text-xs",
                        selected ? "text-white/75" : "text-muted-foreground",
                      )}
                    >
                      {segment.english}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
