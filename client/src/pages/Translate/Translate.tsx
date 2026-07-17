import { Camera, Languages } from "lucide-react";
import { Button } from "../../components/ui/button";
import ListPickerModal from "../Dictionary/components/ListPickerModal";
import OcrTranslate from "./component/OcrTranslate";
import TextTranslate from "./component/TextTranslate";
import TranslationHistory from "./component/TranslationHistory";
import TranslationResult from "./component/TranslationResult";
import { useTranslateController } from "./component/useTranslateController";

export default function Translate() {
  const controller = useTranslateController();
  const { t, mode, setMode, isAuthenticated, pickerItems, setPickerItems } = controller;

  return (
    <div className="app-page">
      <header className="app-page-header mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="text-left">
          <div className="mb-2 flex items-center gap-2">
            <Languages size={24} className="text-primary" />
            <h1 className="text-2xl font-extrabold">{t("translate.title")}</h1>
          </div>
          <p className="max-w-2xl text-[0.9rem] text-muted-foreground">{t("translate.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-xl border bg-background p-1">
          <Button
            type="button"
            variant={mode === "text" ? "default" : "ghost"}
            onClick={() => setMode("text")}
            className="rounded-lg"
          >
            <Languages size={16} />
            {t("translate.textTab")}
          </Button>
          <Button
            type="button"
            variant={mode === "camera" ? "default" : "ghost"}
            onClick={() => setMode("camera")}
            className="rounded-lg"
          >
            <Camera size={16} />
            {t("translate.ocrTab")}
          </Button>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.92fr)]">
        {mode === "text" ? (
          <TextTranslate controller={controller} />
        ) : (
          <OcrTranslate controller={controller} />
        )}
        <TranslationResult controller={controller} />
      </div>

      {isAuthenticated && <TranslationHistory controller={controller} />}

      <ListPickerModal items={pickerItems} onClose={() => setPickerItems(null)} />
    </div>
  );
}
