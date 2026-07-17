import { Camera, FileImage, ImageDown, Lock, LogIn, RefreshCw, Upload, Volume2, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../utils/cn";
import type { TranslateController } from "./useTranslateController";

interface OcrTranslateProps {
  controller: TranslateController;
}

/**
 * Source panel for the OCR tab: live camera / uploaded still with a Capture
 * button. Loading an image no longer auto-translates — the user presses
 * Translate in the result panel afterwards.
 */
export default function OcrTranslate({ controller }: OcrTranslateProps) {
  const {
    t,
    navigate,
    isAuthenticated,
    videoRef,
    fileInputRef,
    cameraActive,
    imagePreview,
    boxes,
    selectedBox,
    setSelectedBox,
    startCamera,
    stopCamera,
    captureFrame,
    handleFileUpload,
    loading,
    currentSourceText,
    speakChinese,
  } = controller;

  return (
    <section className="app-surface-padded text-left">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold">{t("translate.sourceTitle")}</h2>
          <p className="text-xs text-muted-foreground">{t("translate.sourceCameraHint")}</p>
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

      {!isAuthenticated ? (
        <div className="flex min-h-65 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-background p-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Lock size={26} />
          </span>
          <div>
            <h3 className="text-base font-extrabold">{t("loginPrompt.translateTitle")}</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{t("translate.ocrLoginHint")}</p>
          </div>
          <Button type="button" onClick={() => navigate("/auth")}>
            <LogIn size={16} />
            {t("loginPrompt.login")}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="relative flex aspect-[4/3] min-h-65 items-center justify-center overflow-hidden rounded-2xl border bg-[#1e1e24]">
            {loading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/45 text-white">
                <RefreshCw className="recording-pulse" size={36} />
                <span className="text-sm font-bold">{t("translate.ocrRunning")}</span>
              </div>
            )}

            {cameraActive && <video ref={videoRef} autoPlay playsInline className="size-full object-cover" />}

            {imagePreview && !cameraActive && (
              <img src={imagePreview} alt={t("translate.ocrPreviewAlt")} className="size-full object-cover" />
            )}

            {!cameraActive && !imagePreview && (
              <div className="px-6 text-center text-white/50">
                <FileImage size={48} className="mx-auto mb-3" />
                <p className="text-sm font-semibold">{t("translate.cameraPlaceholder")}</p>
              </div>
            )}

            {(cameraActive || imagePreview) && !loading && (
              <div className="pointer-events-none absolute inset-[9%] border border-dashed border-primary/50" />
            )}

            {!loading &&
              boxes.map((box) => (
                <button
                  key={box.id}
                  type="button"
                  onClick={() => setSelectedBox(box)}
                  style={{
                    top: `${box.top}%`,
                    left: `${box.left}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`,
                  }}
                  title={box.text}
                  className={cn(
                    "absolute rounded border-2 transition",
                    box.english ? "border-jade bg-jade/25" : "border-primary bg-primary/20",
                    selectedBox?.id === box.id && "ring-2 ring-white",
                  )}
                />
              ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            {!cameraActive ? (
              <Button type="button" onClick={startCamera} disabled={loading}>
                <Camera size={16} />
                {t("translate.openCamera")}
              </Button>
            ) : (
              <Button type="button" onClick={captureFrame} disabled={loading}>
                <ImageDown size={16} />
                {t("translate.capture")}
              </Button>
            )}
            <Button type="button" variant="outline" onClick={stopCamera} disabled={!cameraActive}>
              <X size={16} />
              {t("translate.stopCamera")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <Upload size={16} />
              {t("translate.uploadImage")}
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </div>
        </div>
      )}
    </section>
  );
}
