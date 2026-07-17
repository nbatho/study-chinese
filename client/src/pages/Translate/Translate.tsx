import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  BookmarkPlus,
  CalendarDays,
  Clipboard,
  FileImage,
  Heart,
  Languages,
  ListPlus,
  Loader2,
  Lock,
  LogIn,
  RefreshCw,
  Save,
  ScanLine,
  Search,
  Trash2,
  Upload,
  Volume2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useEnrollWordMutation } from "../../api";
import {
  useClearOcrHistoryMutation,
  useDeleteOcrHistoryMutation,
  useOcrHistoryQuery,
  useOcrScanMutation,
  usePublicTranslateMutation,
  useUpdateOcrHistoryMutation,
} from "../../api/ocr/queries";
import type { OcrBox, OcrHistoryEvent, OcrScanPayload, OcrSegment, TranslateTargetLang } from "../../api/ocr";
import { Button } from "../../components/ui/button";
import ListPickerModal, { type ListPickerItem } from "../Dictionary/components/ListPickerModal";
import { useI18n } from "../../i18n";
import { useAppSelector } from "../../store/hooks";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { cn } from "../../utils/cn";
import { speakChinese } from "../../utils/tts";

type InputMode = "text" | "camera";

const getSegmentMeaning = (segment: OcrSegment) => segment.english?.trim() || "";

const getCombinedText = (segments: OcrSegment[]) =>
  segments
    .map((segment) => segment.text)
    .join("")
    .trim();

const getCombinedMeaning = (segments: OcrSegment[]) =>
  segments
    .map(getSegmentMeaning)
    .filter(Boolean)
    .join("; ");

export default function Translate() {
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const scanMutation = useOcrScanMutation();
  const publicTranslateMutation = usePublicTranslateMutation();
  const [historyKeyword, setHistoryKeyword] = useState("");
  const [historyDate, setHistoryDate] = useState("");
  const [historyFavoritesOnly, setHistoryFavoritesOnly] = useState(false);
  const debouncedHistoryKeyword = useDebouncedValue(historyKeyword);
  const historyParams = useMemo(
    () => ({
      limit: 20,
      keyword: debouncedHistoryKeyword.trim() || undefined,
      date: historyDate || undefined,
      favorite: historyFavoritesOnly || undefined,
    }),
    [historyDate, historyFavoritesOnly, debouncedHistoryKeyword],
  );
  const ocrHistoryQuery = useOcrHistoryQuery(historyParams);
  const updateOcrHistoryMutation = useUpdateOcrHistoryMutation();
  const deleteOcrHistoryMutation = useDeleteOcrHistoryMutation();
  const clearOcrHistoryMutation = useClearOcrHistoryMutation();
  const enrollMutation = useEnrollWordMutation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [mode, setMode] = useState<InputMode>("text");
  const [targetLang, setTargetLang] = useState<TranslateTargetLang>(language === "en" ? "en" : "vi");
  const [sourceText, setSourceText] = useState("");
  const [detectedText, setDetectedText] = useState("");
  const [combinedMeaning, setCombinedMeaning] = useState("");
  const [segments, setSegments] = useState<OcrSegment[]>([]);
  const [boxes, setBoxes] = useState<OcrBox[]>([]);
  const [selectedSegmentIds, setSelectedSegmentIds] = useState<string[]>([]);
  const [selectedBox, setSelectedBox] = useState<OcrBox | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [pickerItems, setPickerItems] = useState<ListPickerItem[] | null>(null);
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
  const [historyDraft, setHistoryDraft] = useState({ title: "", note: "" });

  const loading = scanMutation.isPending || publicTranslateMutation.isPending;
  const historyEvents = ocrHistoryQuery.data?.events ?? [];
  const selectedSegments = useMemo(
    () => segments.filter((segment) => selectedSegmentIds.includes(segment.id)),
    [segments, selectedSegmentIds],
  );
  const activeSegments = selectedSegments.length > 0 ? selectedSegments : segments;
  const translatedText =
    selectedSegments.length > 0 ? getCombinedMeaning(activeSegments) : combinedMeaning || getCombinedMeaning(activeSegments);
  const pinyinText = activeSegments
    .map((segment) => segment.pinyin)
    .filter(Boolean)
    .join(" ");
  const currentSourceText = getCombinedText(activeSegments) || detectedText || sourceText;

  const toLearningPayload = (segment: OcrSegment) =>
    segment.wordId
      ? { wordId: segment.wordId }
      : {
          simplified: segment.text,
          text: segment.text,
          pinyin: segment.pinyin,
          english: segment.english,
        };

  const runScan = async (payload: OcrScanPayload) => {
    setSelectedBox(null);
    setSelectedSegmentIds([]);
    const scanPayload = { ...payload, targetLang: payload.targetLang ?? targetLang };
    // Text translation works without an account via the public endpoint (no
    // history saved); image OCR and history always use the authenticated scan.
    const response =
      isAuthenticated || scanPayload.image
        ? await scanMutation.mutateAsync(scanPayload)
        : await publicTranslateMutation.mutateAsync({
            text: scanPayload.text ?? "",
            targetLang: scanPayload.targetLang,
          });
    const nextSegments = response.segments ?? response.boxes;

    setBoxes(response.boxes);
    setSegments(nextSegments);
    setCombinedMeaning(response.combinedMeaning || "");
    setDetectedText(response.detectedText || payload.text || "");

    if (!response.detectedText && response.boxes.length === 0) {
      toast.info(t("translate.toastNoDetected"));
    }
  };

  const changeTargetLang = async (lang: TranslateTargetLang) => {
    if (lang === targetLang || loading) {
      setTargetLang(lang);
      return;
    }

    setTargetLang(lang);

    // Re-translate the current content right away so the result follows the
    // newly picked language. Image scans re-run on the stored capture; when
    // only the detected text is left (e.g. live camera), translate that.
    const text = getCombinedText(segments) || detectedText || (mode === "text" ? sourceText.trim() : "");

    try {
      if (mode === "camera" && imagePreview) {
        await runScan({ image: imagePreview, targetLang: lang });
      } else if (text) {
        await runScan({ text, targetLang: lang });
      }
    } catch {
      toast.error(t("translate.toastTranslateError"));
    }
  };

  const translateText = async () => {
    const text = sourceText.trim();

    if (!text) {
      toast.info(t("translate.toastInputRequired"));
      return;
    }

    setImagePreview(null);
    stopCamera();

    try {
      await runScan({ text });
    } catch {
      toast.error(t("translate.toastTranslateError"));
    }
  };

  const captureCameraFrame = () => {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");

    if (!context) {
      return null;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const scanImage = async (image: string) => {
    setMode("camera");
    setImagePreview(image);

    try {
      await runScan({ image });
    } catch {
      toast.error(t("translate.toastScanError"));
    }
  };

  const scanCameraFrame = async () => {
    const image = captureCameraFrame();

    if (!image) {
      toast.error(t("translate.toastCameraNotReady"));
      return;
    }

    await scanImage(image);
  };

  const startCamera = async () => {
    try {
      setMode("camera");
      setImagePreview(null);
      setBoxes([]);
      setSegments([]);
      setSelectedSegmentIds([]);
      setSelectedBox(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch {
      toast.error(t("translate.toastCameraError"));
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    stopCamera();
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = readerEvent.target?.result;

      if (typeof image === "string") {
        void scanImage(image);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleSegment = (segmentId: string) => {
    setSelectedSegmentIds((current) =>
      current.includes(segmentId)
        ? current.filter((id) => id !== segmentId)
        : [...current, segmentId],
    );
  };

  const copyTranslation = async () => {
    if (!translatedText) return;

    await navigator.clipboard.writeText(translatedText);
    toast.success(t("translate.toastCopied"));
  };

  // The list picker saves OCR words into the user's own lists; words that are
  // not in the dictionary yet are created server-side as personal OCR entries.
  const openListPicker = () => {
    if (activeSegments.length === 0) return;
    setPickerItems(
      activeSegments.map((segment) => ({
        id: segment.wordId || undefined,
        simplified: segment.text,
        pinyin: segment.pinyin,
        english: segment.english,
      })),
    );
  };

  const saveSegmentToSrs = async (segment: OcrSegment) => {
    const response = await enrollMutation.mutateAsync(toLearningPayload(segment));
    toast.success(
      response.enrolled
        ? t("translate.toastSrsAdded", { word: segment.text })
        : t("translate.toastSrsExists", { word: segment.text }),
    );
  };

  const saveActiveSegmentsToSrs = async () => {
    // Enrollments are independent — run them in parallel instead of serially.
    await Promise.all(activeSegments.map((segment) => saveSegmentToSrs(segment)));
  };

  const openHistoryEvent = (event: OcrHistoryEvent) => {
    setMode("text");
    setSourceText(event.detectedText || "");
    void runScan({ text: event.detectedText || "" });
  };

  const startEditingHistory = (event: OcrHistoryEvent) => {
    setEditingHistoryId(event.id);
    setHistoryDraft({
      title: event.title || "",
      note: event.note || "",
    });
  };

  const saveHistoryNotebook = async (event: OcrHistoryEvent) => {
    await updateOcrHistoryMutation.mutateAsync({
      eventId: event.id,
      payload: {
        title: historyDraft.title.trim() || null,
        note: historyDraft.note.trim() || null,
      },
    });
    setEditingHistoryId(null);
    toast.success(t("translate.toastNoteSaved"));
  };

  const toggleHistoryFavorite = async (event: OcrHistoryEvent) => {
    await updateOcrHistoryMutation.mutateAsync({
      eventId: event.id,
      payload: { isFavorite: !event.isFavorite },
    });
  };

  const deleteHistoryEvent = async (event: OcrHistoryEvent) => {
    const confirmed = window.confirm(t("translate.toastDeleteConfirm"));

    if (!confirmed) return;

    await deleteOcrHistoryMutation.mutateAsync(event.id);

    if (editingHistoryId === event.id) {
      setEditingHistoryId(null);
    }

    toast.success(t("translate.toastDeleted"));
  };

  const clearHistory = async () => {
    const confirmed = window.confirm(t("translate.toastClearConfirm"));

    if (!confirmed) return;

    const response = await clearOcrHistoryMutation.mutateAsync();
    setEditingHistoryId(null);
    toast.success(t("translate.toastCleared", { count: response.deletedCount }));
  };

  // The result language follows the app language, so switching VI/EN in the
  // navbar re-translates instead of leaving a stale result in the old language.
  // Skipped on mount: targetLang already starts from `language`.
  useEffect(() => {
    void changeTargetLang(language === "en" ? "en" : "vi");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => () => stopCamera(), []);

  return (
    <div className="app-page">
      <header className="app-page-header mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="text-left">
          <div className="mb-2 flex items-center gap-2">
            <Languages size={24} className="text-primary" />
            <h1 className="text-2xl font-extrabold">{t("translate.title")}</h1>
          </div>
          <p className="max-w-2xl text-[0.9rem] text-muted-foreground">
            {t("translate.subtitle")}
          </p>
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
        <section className="app-surface-padded text-left">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold">{t("translate.sourceTitle")}</h2>
              <p className="text-xs text-muted-foreground">
                {mode === "text" ? t("translate.sourceTextHint") : t("translate.sourceCameraHint")}
              </p>
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

          {mode === "text" ? (
            <div className="grid gap-3">
              <textarea
                value={sourceText}
                onChange={(event) => setSourceText(event.target.value)}
                placeholder={t("translate.placeholder")}
                className="min-h-55 resize-y rounded-xl border bg-background px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSourceText("");
                    setDetectedText("");
                    setCombinedMeaning("");
                    setSegments([]);
                    setBoxes([]);
                    setSelectedBox(null);
                  }}
                  disabled={loading}
                >
                  <X size={16} />
                  {t("translate.clear")}
                </Button>
                <Button type="button" onClick={translateText} disabled={loading || !sourceText.trim()}>
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Languages size={16} />}
                  {t("translate.translate")}
                </Button>
              </div>
            </div>
          ) : !isAuthenticated ? (
            <div className="flex min-h-65 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-background p-6 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Lock size={26} />
              </span>
              <div>
                <h3 className="text-base font-extrabold">{t("loginPrompt.translateTitle")}</h3>
                <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                  {t("translate.ocrLoginHint")}
                </p>
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

                {cameraActive && (
                  <video ref={videoRef} autoPlay playsInline className="size-full object-cover" />
                )}

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
                  <Button type="button" onClick={scanCameraFrame} disabled={loading}>
                    <ScanLine size={16} />
                    {t("translate.scan")}
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </section>

        <section className="app-surface-padded text-left">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold">{t("translate.resultTitle")}</h2>
              <p className="text-xs text-muted-foreground">
                {t("translate.resultHint")}
              </p>
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
              <p className="mt-2 text-sm font-semibold">
                {selectedBox.english || t("translate.noBoxMeaning")}
              </p>
            </div>
          )}

          {segments.length > 0 && (
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="text-xs font-bold text-muted-foreground">{t("translate.segments")}</h3>
                {selectedSegmentIds.length > 0 && (
                  <button
                    type="button"
                    className="text-xs font-bold text-primary"
                    onClick={() => setSelectedSegmentIds([])}
                  >
                    {t("translate.clearSegments")}
                  </button>
                )}
              </div>
              {isAuthenticated && (
              <div className="mb-3 grid grid-cols-2 gap-2 rounded-xl border bg-background p-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={openListPicker}
                  disabled={activeSegments.length === 0}
                >
                  <ListPlus size={16} />
                  {t("translate.saveToList")}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void saveActiveSegmentsToSrs()}
                  disabled={enrollMutation.isPending}
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
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "bg-background hover:border-primary/60",
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

          {isAuthenticated && (
          <div className="mt-6 border-t pt-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-xs font-bold text-muted-foreground">{t("translate.historyTitle")}</h3>
              <div className="flex items-center gap-2">
                {ocrHistoryQuery.isFetching && <Loader2 className="animate-spin text-muted-foreground" size={14} />}
                {historyEvents.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void clearHistory()}
                    disabled={clearOcrHistoryMutation.isPending || deleteOcrHistoryMutation.isPending}
                  >
                    <Trash2 size={15} />
                    {t("translate.clearAll")}
                  </Button>
                )}
              </div>
            </div>
            <div className="mb-3 grid gap-2 rounded-xl border bg-background p-3">
              <label className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm">
                <Search size={15} className="shrink-0 text-muted-foreground" />
                <input
                  value={historyKeyword}
                  onChange={(event) => setHistoryKeyword(event.target.value)}
                  placeholder={t("translate.filterScans")}
                  className="min-w-0 flex-1 bg-transparent outline-none"
                />
              </label>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
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
            </div>
            {historyEvents.length === 0 ? (
              <div className="rounded-xl border bg-background p-3 text-sm font-semibold text-muted-foreground">
                {t("translate.noHistory")}
              </div>
            ) : (
              <div className="grid max-h-65 gap-2 overflow-y-auto pr-1">
                {historyEvents.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => openHistoryEvent(event)}
                    className="rounded-xl border bg-background p-3 text-left transition hover:border-primary/60"
                  >
                    <span className="line-clamp-1 font-serif text-xl font-extrabold">
                      {event.detectedText || t("translate.noText")}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-muted-foreground">
                      {new Date(event.createdAt).toLocaleString()} - {t("translate.matchedWords", { count: event.matchedWordIds.length })}
                    </span>
                  </button>
                ))}
              </div>
            )}
            {historyEvents.length > 0 && (
              <div className="mt-3 grid gap-2">
                {historyEvents.map((event) => (
                  <div key={`notebook-${event.id}`} className="rounded-xl border bg-background p-3">
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
                      </button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => void toggleHistoryFavorite(event)}
                        disabled={updateOcrHistoryMutation.isPending}
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
                        disabled={deleteOcrHistoryMutation.isPending || clearOcrHistoryMutation.isPending}
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
                            disabled={updateOcrHistoryMutation.isPending}
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
          </div>
          )}
        </section>
      </div>

      <ListPickerModal items={pickerItems} onClose={() => setPickerItems(null)} />
    </div>
  );
}
