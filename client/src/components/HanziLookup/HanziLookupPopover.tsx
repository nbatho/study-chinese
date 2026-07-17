import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BookmarkPlus, Check, Loader2, Volume2, X } from "lucide-react";
import { toast } from "sonner";
import { useWordLookupQuery } from "../../api/vocabulary/queries";
import { useEnrollWordMutation } from "../../api/srs/queries";
import { useI18n } from "../../i18n";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";
import { speakChinese } from "../../utils/tts";

const POPOVER_WIDTH = 288;
const POPOVER_MARGIN = 8;

interface HanziLookupPopoverProps {
  text: string;
  anchor: DOMRect;
  onClose: () => void;
}

export default function HanziLookupPopover({ text, anchor, onClose }: HanziLookupPopoverProps) {
  const { t } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const lookupQuery = useWordLookupQuery(text);
  const enrollMutation = useEnrollWordMutation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [saved, setSaved] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>(() => ({
    top: anchor.bottom + POPOVER_MARGIN,
    left: anchor.left,
  }));

  const entry = lookupQuery.data?.entry;

  // Position the popover near the tapped character, clamped to the viewport.
  useLayoutEffect(() => {
    const height = containerRef.current?.offsetHeight ?? 200;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    let left = anchor.left + anchor.width / 2 - POPOVER_WIDTH / 2;
    left = Math.max(POPOVER_MARGIN, Math.min(left, viewportW - POPOVER_WIDTH - POPOVER_MARGIN));

    let top = anchor.bottom + POPOVER_MARGIN;
    if (top + height > viewportH - POPOVER_MARGIN) {
      // Not enough room below — flip above the character.
      top = Math.max(POPOVER_MARGIN, anchor.top - height - POPOVER_MARGIN);
    }

    setPosition({ top, left });
  }, [anchor, entry]);

  // Dismiss on outside click, Escape, or scroll.
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) onClose();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const handleScroll = () => onClose();

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [onClose]);

  const handleSave = async () => {
    if (!entry) return;
    try {
      await enrollMutation.mutateAsync({
        wordId: entry.wordId ?? undefined,
        simplified: entry.simplified,
        traditional: entry.traditional,
        pinyin: entry.pinyin ?? undefined,
        english: entry.english ?? undefined,
      });
      setSaved(true);
      toast.success(t("lookup.saved"));
    } catch {
      toast.error(t("lookup.saveError"));
    }
  };

  const notFound = entry?.source === "none" || (entry && !entry.pinyin && !entry.english);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-label={t("lookup.title")}
      className="anim-pop fixed z-1300 rounded-2xl border bg-popover text-popover-foreground shadow-2xl"
      style={{ top: position.top, left: position.left, width: POPOVER_WIDTH }}
    >
      <div className="flex items-start justify-between gap-2 border-b p-3">
        <div className="min-w-0">
          <div className="font-serif text-3xl font-extrabold leading-none">{entry?.simplified ?? text}</div>
          {entry?.pinyin && <div className="mt-1 text-sm font-bold text-primary">{entry.pinyin}</div>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary"
          aria-label={t("lookup.close")}
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-3">
        {lookupQuery.isLoading ? (
          <div className="flex items-center gap-2 py-3 text-sm font-semibold text-muted-foreground">
            <Loader2 size={16} className="animate-spin" />
            {t("lookup.loading")}
          </div>
        ) : (
          <div className="grid gap-2 text-sm">
            {entry?.gloss && (
              <div className="px-1">
                <span className="mr-2 text-[0.65rem] font-extrabold uppercase tracking-wide text-muted-foreground">
                  {t("lookup.meaning")}
                </span>
                <span className="font-medium text-foreground">{entry.gloss}</span>
              </div>
            )}
            {typeof entry?.hskLevel === "number" && entry.hskLevel > 0 && (
              <div className="px-1 text-xs font-bold text-muted-foreground">HSK {entry.hskLevel}</div>
            )}
            {notFound && (
              <p className="px-1 py-1 text-sm text-muted-foreground">{t("lookup.notFound")}</p>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => speakChinese(entry?.simplified ?? text)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground transition hover:bg-accent"
          >
            <Volume2 size={15} />
            {t("lookup.listen")}
          </button>
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleSave}
              disabled={enrollMutation.isPending || saved}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-primary-foreground transition disabled:opacity-70",
                saved ? "bg-jade" : "bg-primary hover:bg-primary/90",
              )}
            >
              {saved ? <Check size={15} /> : <BookmarkPlus size={15} />}
              {saved ? t("lookup.savedShort") : t("lookup.save")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
