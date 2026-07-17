import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEnrollWordMutation } from "../../../api";
import {
  useClearOcrHistoryMutation,
  useDeleteOcrHistoryMutation,
  useOcrHistoryQuery,
  useOcrScanMutation,
  usePublicTranslateMutation,
  useUpdateOcrHistoryMutation,
} from "../../../api/ocr/queries";
import type {
  OcrBox,
  OcrHistoryEvent,
  OcrScanPayload,
  OcrSegment,
  TranslateTargetLang,
} from "../../../api/ocr";
import type { ListPickerItem } from "../../Dictionary/components/ListPickerModal";
import { useI18n } from "../../../i18n";
import { useAppSelector } from "../../../store/hooks";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { speakChinese } from "../../../utils/tts";

export type InputMode = "text" | "camera";

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

/**
 * Owns all Translate-page state and side effects. The page's text panel, OCR
 * panel, result panel and history panel share this single controller so the
 * JSX can stay split into focused components without duplicating logic.
 */
export function useTranslateController() {
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
  // An image is loaded (camera capture or upload) but has not been OCR'd yet.
  const canTranslateImage = mode === "camera" && Boolean(imagePreview) && !loading;

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
    // newly picked language. Only re-run an image scan when it has already been
    // translated, so a freshly loaded image still waits for a manual translate.
    const text = getCombinedText(segments) || detectedText || (mode === "text" ? sourceText.trim() : "");

    try {
      if (mode === "camera" && imagePreview && segments.length > 0) {
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

  const clearText = () => {
    setSourceText("");
    setDetectedText("");
    setCombinedMeaning("");
    setSegments([]);
    setBoxes([]);
    setSelectedBox(null);
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

  // Freeze the current camera frame into a still image. Translation is manual:
  // the user reviews the capture and then presses Translate in the result panel.
  const captureFrame = () => {
    const image = captureCameraFrame();

    if (!image) {
      toast.error(t("translate.toastCameraNotReady"));
      return;
    }

    stopCamera();
    setImagePreview(image);
    setBoxes([]);
    setSegments([]);
    setSelectedSegmentIds([]);
    setSelectedBox(null);
    setDetectedText("");
    setCombinedMeaning("");
  };

  // Run OCR on the loaded still image. Triggered from the result panel button.
  const translateImage = async () => {
    if (!imagePreview) return;

    try {
      await runScan({ image: imagePreview });
    } catch {
      toast.error(t("translate.toastScanError"));
    }
  };

  const startCamera = async () => {
    try {
      setMode("camera");
      setImagePreview(null);
      setBoxes([]);
      setSegments([]);
      setSelectedSegmentIds([]);
      setSelectedBox(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        toast.error(t("translate.toastCameraError"));
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });

      streamRef.current = stream;
      // Don't assign srcObject here: the <video> is only rendered once
      // cameraActive is true, so videoRef.current is still null at this point.
      // A dedicated effect attaches the stream after the element mounts.
      setCameraActive(true);
    } catch (error) {
      console.error("Camera access error:", error);
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

  // Load an uploaded image into the preview without translating; the user
  // presses Translate afterwards, matching the camera capture flow.
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    stopCamera();
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = readerEvent.target?.result;

      if (typeof image === "string") {
        setMode("camera");
        setImagePreview(image);
        setBoxes([]);
        setSegments([]);
        setSelectedSegmentIds([]);
        setSelectedBox(null);
        setDetectedText("");
        setCombinedMeaning("");
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

  const clearSegments = () => setSelectedSegmentIds([]);

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
    // Re-translating on language change legitimately syncs targetLang to the app
    // language; the synchronous setState here is intentional, not a cascade.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void changeTargetLang(language === "en" ? "en" : "vi");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Attach the stream once the <video> element is actually mounted. Assigning
  // srcObject inside startCamera is too early — the element only exists after
  // cameraActive flips to true and React re-renders.
  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive]);

  useEffect(() => () => stopCamera(), []);

  return {
    t,
    navigate,
    isAuthenticated,
    // input mode
    mode,
    setMode,
    // text panel
    sourceText,
    setSourceText,
    translateText,
    clearText,
    // camera / ocr panel
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
    translateImage,
    canTranslateImage,
    // result panel
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
    currentSourceText,
    copyTranslation,
    openListPicker,
    saveActiveSegmentsToSrs,
    enrollPending: enrollMutation.isPending,
    speakChinese,
    // history panel
    historyKeyword,
    setHistoryKeyword,
    historyDate,
    setHistoryDate,
    historyFavoritesOnly,
    setHistoryFavoritesOnly,
    historyEvents,
    historyFetching: ocrHistoryQuery.isFetching,
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
    updatePending: updateOcrHistoryMutation.isPending,
    deletePending: deleteOcrHistoryMutation.isPending,
    clearPending: clearOcrHistoryMutation.isPending,
    // list picker modal
    pickerItems,
    setPickerItems,
  };
}

export type TranslateController = ReturnType<typeof useTranslateController>;
