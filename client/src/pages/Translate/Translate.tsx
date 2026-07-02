import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  useAddWordToListMutation,
  useCreateListMutation,
  useEnrollWordMutation,
  useListsQuery,
} from "../../api";
import {
  useClearOcrHistoryMutation,
  useDeleteOcrHistoryMutation,
  useOcrHistoryQuery,
  useOcrScanMutation,
  useUpdateOcrHistoryMutation,
} from "../../api/ocr/queries";
import type { OcrBox, OcrHistoryEvent, OcrScanPayload, OcrSegment } from "../../api/ocr";
import { Button } from "../../components/ui/button";
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
  const scanMutation = useOcrScanMutation();
  const [historyKeyword, setHistoryKeyword] = useState("");
  const [historyDate, setHistoryDate] = useState("");
  const [historyFavoritesOnly, setHistoryFavoritesOnly] = useState(false);
  const historyParams = useMemo(
    () => ({
      limit: 20,
      keyword: historyKeyword.trim() || undefined,
      date: historyDate || undefined,
      favorite: historyFavoritesOnly || undefined,
    }),
    [historyDate, historyFavoritesOnly, historyKeyword],
  );
  const ocrHistoryQuery = useOcrHistoryQuery(historyParams);
  const updateOcrHistoryMutation = useUpdateOcrHistoryMutation();
  const deleteOcrHistoryMutation = useDeleteOcrHistoryMutation();
  const clearOcrHistoryMutation = useClearOcrHistoryMutation();
  const listsQuery = useListsQuery();
  const createListMutation = useCreateListMutation();
  const enrollMutation = useEnrollWordMutation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [mode, setMode] = useState<InputMode>("text");
  const [sourceText, setSourceText] = useState("");
  const [detectedText, setDetectedText] = useState("");
  const [segments, setSegments] = useState<OcrSegment[]>([]);
  const [boxes, setBoxes] = useState<OcrBox[]>([]);
  const [selectedSegmentIds, setSelectedSegmentIds] = useState<string[]>([]);
  const [selectedBox, setSelectedBox] = useState<OcrBox | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedOcrListId, setSelectedOcrListId] = useState("");
  const [newOcrListName, setNewOcrListName] = useState("OCR Saved");
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
  const [historyDraft, setHistoryDraft] = useState({ title: "", note: "" });

  const loading = scanMutation.isPending;
  const lists = listsQuery.data?.lists ?? [];
  const historyEvents = ocrHistoryQuery.data?.events ?? [];
  const activeOcrListId = selectedOcrListId || lists[0]?.id || "";
  const addWordMutation = useAddWordToListMutation(activeOcrListId);
  const selectedSegments = useMemo(
    () => segments.filter((segment) => selectedSegmentIds.includes(segment.id)),
    [segments, selectedSegmentIds],
  );
  const activeSegments = selectedSegments.length > 0 ? selectedSegments : segments;
  const translatedText = getCombinedMeaning(activeSegments);
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
    const response = await scanMutation.mutateAsync(payload);
    const nextSegments = response.segments ?? response.boxes;

    setBoxes(response.boxes);
    setSegments(nextSegments);
    setDetectedText(response.detectedText || payload.text || "");

    if (!response.detectedText && response.boxes.length === 0) {
      toast.info("Không nhận diện được chữ trong nội dung này.");
    }
  };

  const translateText = async () => {
    const text = sourceText.trim();

    if (!text) {
      toast.info("Nhập tiếng Trung trước khi dịch.");
      return;
    }

    setImagePreview(null);
    stopCamera();

    try {
      await runScan({ text });
    } catch {
      toast.error("Không thể dịch văn bản này. Hãy thử lại.");
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
      toast.error("Không thể quét OCR ảnh này. Hãy thử ảnh khác.");
    }
  };

  const scanCameraFrame = async () => {
    const image = captureCameraFrame();

    if (!image) {
      toast.error("Camera chưa sẵn sàng. Hãy thử lại hoặc tải ảnh lên.");
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
      toast.error("Không thể mở camera. Bạn có thể tải ảnh lên thay thế.");
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
    toast.success("Đã sao chép bản dịch.");
  };

  const createOcrList = async () => {
    const response = await createListMutation.mutateAsync({
      name: newOcrListName.trim() || "OCR Saved",
      emoji: "OCR",
    });
    setSelectedOcrListId(response.list.id);
    toast.success("Da tao danh sach OCR.");
  };

  const saveSegmentToList = async (segment: OcrSegment) => {
    if (!activeOcrListId) {
      toast.info("Chon hoac tao danh sach truoc.");
      return;
    }

    await addWordMutation.mutateAsync(toLearningPayload(segment));
    toast.success(`Da luu "${segment.text}" vao danh sach.`);
  };

  const saveSegmentToSrs = async (segment: OcrSegment) => {
    const response = await enrollMutation.mutateAsync(toLearningPayload(segment));
    toast.success(response.enrolled ? `Da them "${segment.text}" vao on tap.` : `"${segment.text}" da co trong on tap.`);
  };

  const saveActiveSegmentsToList = async () => {
    if (!activeOcrListId) {
      toast.info("Chon hoac tao danh sach truoc.");
      return;
    }

    for (const segment of activeSegments) {
      await saveSegmentToList(segment);
    }
  };

  const saveActiveSegmentsToSrs = async () => {
    for (const segment of activeSegments) {
      await saveSegmentToSrs(segment);
    }
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
    toast.success("Da luu ghi chu OCR.");
  };

  const toggleHistoryFavorite = async (event: OcrHistoryEvent) => {
    await updateOcrHistoryMutation.mutateAsync({
      eventId: event.id,
      payload: { isFavorite: !event.isFavorite },
    });
  };

  const deleteHistoryEvent = async (event: OcrHistoryEvent) => {
    const confirmed = window.confirm("Xoa muc lich su OCR nay?");

    if (!confirmed) return;

    await deleteOcrHistoryMutation.mutateAsync(event.id);

    if (editingHistoryId === event.id) {
      setEditingHistoryId(null);
    }

    toast.success("Da xoa muc lich su OCR.");
  };

  const clearHistory = async () => {
    const confirmed = window.confirm("Xoa toan bo lich su OCR cua ban?");

    if (!confirmed) return;

    const response = await clearOcrHistoryMutation.mutateAsync();
    setEditingHistoryId(null);
    toast.success(`Da xoa ${response.deletedCount} muc lich su OCR.`);
  };

  useEffect(() => () => stopCamera(), []);

  return (
    <div className="anim-slide pb-8">
      <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="text-left">
          <div className="mb-2 flex items-center gap-2">
            <Languages size={24} className="text-primary" />
            <h1 className="text-2xl font-extrabold">Dịch tiếng Trung</h1>
          </div>
          <p className="max-w-2xl text-[0.9rem] text-muted-foreground">
            Nhập văn bản hoặc quét chữ bằng camera/OCR để lấy pinyin và nghĩa từ vựng.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-lg border bg-card p-1 shadow-sm">
          <Button
            type="button"
            variant={mode === "text" ? "default" : "ghost"}
            onClick={() => setMode("text")}
            className="rounded-md"
          >
            <Languages size={16} />
            Văn bản
          </Button>
          <Button
            type="button"
            variant={mode === "camera" ? "default" : "ghost"}
            onClick={() => setMode("camera")}
            className="rounded-md"
          >
            <Camera size={16} />
            OCR
          </Button>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.92fr)]">
        <section className="rounded-lg border bg-card p-4 text-left shadow-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold">Nguồn tiếng Trung</h2>
              <p className="text-xs text-muted-foreground">
                {mode === "text" ? "Gõ hoặc dán chữ cần dịch." : "Quét trực tiếp hoặc tải ảnh có chữ Trung."}
              </p>
            </div>
            {currentSourceText && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => speakChinese(currentSourceText)}
                aria-label="Nghe tiếng Trung"
                title="Nghe tiếng Trung"
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
                placeholder="Ví dụ: 你好，我想喝茶。"
                className="min-h-55 resize-y rounded-lg border bg-background px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSourceText("");
                    setDetectedText("");
                    setSegments([]);
                    setBoxes([]);
                    setSelectedBox(null);
                  }}
                  disabled={loading}
                >
                  <X size={16} />
                  Xóa
                </Button>
                <Button type="button" onClick={translateText} disabled={loading || !sourceText.trim()}>
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Languages size={16} />}
                  Dịch
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="relative flex aspect-[4/3] min-h-65 items-center justify-center overflow-hidden rounded-lg border bg-[#1e1e24]">
                {loading && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/45 text-white">
                    <RefreshCw className="recording-pulse" size={36} />
                    <span className="text-sm font-bold">Đang chạy OCR...</span>
                  </div>
                )}

                {cameraActive && (
                  <video ref={videoRef} autoPlay playsInline className="size-full object-cover" />
                )}

                {imagePreview && !cameraActive && (
                  <img src={imagePreview} alt="OCR preview" className="size-full object-cover" />
                )}

                {!cameraActive && !imagePreview && (
                  <div className="px-6 text-center text-white/50">
                    <FileImage size={48} className="mx-auto mb-3" />
                    <p className="text-sm font-semibold">Mở camera hoặc tải ảnh để OCR.</p>
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
                    Mở camera
                  </Button>
                ) : (
                  <Button type="button" onClick={scanCameraFrame} disabled={loading}>
                    <ScanLine size={16} />
                    Quét
                  </Button>
                )}
                <Button type="button" variant="outline" onClick={stopCamera} disabled={!cameraActive}>
                  <X size={16} />
                  Tắt
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  <Upload size={16} />
                  Tải ảnh
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

        <section className="rounded-lg border bg-card p-4 text-left shadow-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold">Kết quả dịch</h2>
              <p className="text-xs text-muted-foreground">
                Chọn từng cụm OCR để xem nghĩa riêng hoặc để trống để ghép toàn bộ.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={copyTranslation}
              disabled={!translatedText}
              aria-label="Sao chép bản dịch"
              title="Sao chép bản dịch"
            >
              <Clipboard size={18} />
            </Button>
          </div>

          <div className="mb-4 min-h-37 rounded-lg border bg-background p-4">
            {loading ? (
              <div className="flex h-29 items-center justify-center gap-2 text-sm font-semibold text-muted-foreground">
                <Loader2 className="animate-spin" size={18} />
                Đang xử lý...
              </div>
            ) : translatedText ? (
              <div>
                <p className="text-[1.05rem] font-semibold leading-relaxed">{translatedText}</p>
                {pinyinText && <p className="mt-3 text-sm font-bold text-primary">{pinyinText}</p>}
              </div>
            ) : (
              <div className="flex h-29 items-center justify-center text-center text-sm font-semibold text-muted-foreground">
                Kết quả sẽ xuất hiện sau khi bạn dịch văn bản hoặc quét OCR.
              </div>
            )}
          </div>

          {detectedText && (
            <div className="mb-4 rounded-lg border bg-secondary/60 p-3">
              <h3 className="mb-1 text-xs font-bold uppercase text-muted-foreground">Văn bản nhận diện</h3>
              <p className="break-words font-serif text-2xl font-extrabold">{detectedText}</p>
            </div>
          )}

          {selectedBox && (
            <div className="mb-4 rounded-lg border border-jade/30 bg-jade/10 p-3">
              <h3 className="mb-1 text-xs font-bold uppercase text-jade">Vùng đang chọn</h3>
              <p className="font-serif text-3xl font-extrabold">{selectedBox.text}</p>
              {selectedBox.pinyin && <p className="mt-1 text-sm font-bold text-primary">{selectedBox.pinyin}</p>}
              <p className="mt-2 text-sm font-semibold">
                {selectedBox.english || "Chưa có nghĩa từ điển cho vùng này."}
              </p>
            </div>
          )}

          {segments.length > 0 && (
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="text-xs font-bold uppercase text-muted-foreground">Từ/cụm đã tách</h3>
                {selectedSegmentIds.length > 0 && (
                  <button
                    type="button"
                    className="text-xs font-bold text-primary"
                    onClick={() => setSelectedSegmentIds([])}
                  >
                    Bỏ chọn
                  </button>
                )}
              </div>
              <div className="mb-3 grid gap-2 rounded-lg border bg-background p-3">
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <select
                    value={activeOcrListId}
                    onChange={(event) => setSelectedOcrListId(event.target.value)}
                    className="min-w-0 rounded-lg border bg-card px-3 py-2 text-sm font-semibold outline-none"
                  >
                    <option value="">Chon danh sach</option>
                    {lists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.name} ({list.wordIds.length})
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={createOcrList}
                    disabled={createListMutation.isPending}
                  >
                    <ListPlus size={16} />
                    Tao list
                  </Button>
                </div>
                <input
                  value={newOcrListName}
                  onChange={(event) => setNewOcrListName(event.target.value)}
                  placeholder="Ten list OCR"
                  className="rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void saveActiveSegmentsToList()}
                    disabled={!activeOcrListId || addWordMutation.isPending}
                  >
                    <ListPlus size={16} />
                    Luu list
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => void saveActiveSegmentsToSrs()}
                    disabled={enrollMutation.isPending}
                  >
                    <BookmarkPlus size={16} />
                    Them SRS
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {segments.map((segment) => {
                  const selected = selectedSegmentIds.includes(segment.id);

                  return (
                    <button
                      key={segment.id}
                      type="button"
                      onClick={() => toggleSegment(segment.id)}
                      className={cn(
                        "min-w-18 rounded-lg border px-3 py-2 text-left transition",
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

          <div className="mt-6 border-t pt-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-xs font-bold uppercase text-muted-foreground">Lịch sử OCR</h3>
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
                    Xoa tat ca
                  </Button>
                )}
              </div>
            </div>
            <div className="mb-3 grid gap-2 rounded-lg border bg-background p-3">
              <label className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
                <Search size={15} className="shrink-0 text-muted-foreground" />
                <input
                  value={historyKeyword}
                  onChange={(event) => setHistoryKeyword(event.target.value)}
                  placeholder="Filter scans"
                  className="min-w-0 flex-1 bg-transparent outline-none"
                />
              </label>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <label className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
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
                  Favorites
                </Button>
              </div>
            </div>
            {historyEvents.length === 0 ? (
              <div className="rounded-lg border bg-background p-3 text-sm font-semibold text-muted-foreground">
                Chưa có lịch sử quét.
              </div>
            ) : (
              <div className="grid max-h-65 gap-2 overflow-y-auto pr-1">
                {historyEvents.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => {
                      setMode("text");
                      setSourceText(event.detectedText || "");
                      void runScan({ text: event.detectedText || "" });
                    }}
                    className="rounded-lg border bg-background p-3 text-left transition hover:border-primary/60"
                  >
                    <span className="line-clamp-1 font-serif text-xl font-extrabold">
                      {event.detectedText || "Không có text"}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-muted-foreground">
                      {new Date(event.createdAt).toLocaleString()} - {event.matchedWordIds.length} từ match
                    </span>
                  </button>
                ))}
              </div>
            )}
            {historyEvents.length > 0 && (
              <div className="mt-3 grid gap-2">
                {historyEvents.map((event) => (
                  <div key={`notebook-${event.id}`} className="rounded-lg border bg-background p-3">
                    <div className="flex items-start gap-2">
                      <button
                        type="button"
                        onClick={() => openHistoryEvent(event)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <span className="line-clamp-1 text-sm font-extrabold">
                          {event.title || "Notebook entry"}
                        </span>
                        <span className="mt-0.5 line-clamp-1 font-serif text-lg font-extrabold">
                          {event.detectedText || "No text"}
                        </span>
                      </button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => void toggleHistoryFavorite(event)}
                        disabled={updateOcrHistoryMutation.isPending}
                        aria-label="Toggle favorite"
                        title="Toggle favorite"
                      >
                        <Heart size={17} fill={event.isFavorite ? "currentColor" : "none"} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => void deleteHistoryEvent(event)}
                        disabled={deleteOcrHistoryMutation.isPending || clearOcrHistoryMutation.isPending}
                        aria-label="Delete history"
                        title="Delete history"
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
                          placeholder="Scan title"
                          className="rounded-md border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                        />
                        <textarea
                          value={historyDraft.note}
                          onChange={(inputEvent) =>
                            setHistoryDraft((draft) => ({ ...draft, note: inputEvent.target.value }))
                          }
                          placeholder="Reading note"
                          className="min-h-20 resize-y rounded-md border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                        />
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setEditingHistoryId(null)}>
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            onClick={() => void saveHistoryNotebook(event)}
                            disabled={updateOcrHistoryMutation.isPending}
                          >
                            <Save size={16} />
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEditingHistory(event)}
                        className="mt-2 text-xs font-bold text-primary"
                      >
                        Edit note
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
