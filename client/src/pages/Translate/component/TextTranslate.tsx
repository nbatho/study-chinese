import { Languages, Loader2, Volume2, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import type { TranslateController } from "./useTranslateController";

interface TextTranslateProps {
  controller: TranslateController;
}

/** Source panel for the Text tab: textarea plus clear/translate actions. */
export default function TextTranslate({ controller }: TextTranslateProps) {
  const { t, sourceText, setSourceText, translateText, clearText, loading, currentSourceText, speakChinese } =
    controller;

  return (
    <section className="app-surface-padded text-left">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold">{t("translate.sourceTitle")}</h2>
          <p className="text-xs text-muted-foreground">{t("translate.sourceTextHint")}</p>
        </div>
        {currentSourceText && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => speakChinese(currentSourceText)}
            aria-label={t("translate.listenAria")}
            title={t("translate.listenAria")}
          >
            <Volume2 size={18} />
          </Button>
        )}
      </div>

      <div className="grid gap-3">
        <textarea
          value={sourceText}
          onChange={(event) => setSourceText(event.target.value)}
          placeholder={t("translate.placeholder")}
          className="min-h-55 resize-y rounded-xl border bg-background px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={clearText} disabled={loading}>
            <X size={16} />
            {t("translate.clear")}
          </Button>
          <Button type="button" onClick={translateText} disabled={loading || !sourceText.trim()}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Languages size={16} />}
            {t("translate.translate")}
          </Button>
        </div>
      </div>
    </section>
  );
}
