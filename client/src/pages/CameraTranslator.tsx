import { useEffect, useRef, useState } from "react";
import { useOcrScanMutation } from "../api/ocr/queries";
import { useEnrollWordMutation } from "../api/srs/queries";
import type { OcrBox, OcrScanPayload, OcrSegment } from "../api/ocr";
import { ArrowLeft, Camera, RefreshCw, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useI18n } from "../i18n";

const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";
const secondaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition hover:bg-accent disabled:opacity-60";

interface CameraTranslatorProps {
  onClose?: () => void;
}

export default function CameraTranslator({ onClose }: CameraTranslatorProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const handleClose = onClose || (() => navigate("/home"));
  const scanMutation = useOcrScanMutation();
  const enrollWordMutation = useEnrollWordMutation();
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedBox, setSelectedBox] = useState<OcrBox | null>(null);
  const [boxes, setBoxes] = useState<OcrBox[]>([]);
  const [segments, setSegments] = useState<OcrSegment[]>([]);
  const [selectedSegmentIds, setSelectedSegmentIds] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const loading = scanMutation.isPending;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const runScan = async (payload: OcrScanPayload) => {
    setSelectedBox(null);
    setSelectedSegmentIds([]);
    const response = await scanMutation.mutateAsync(payload);
    setBoxes(response.boxes);
    setSegments(response.segments ?? response.boxes);
    if (response.boxes.length === 0) {
      toast.info(t("camera.noText"));
    }
  };

  const toggleSegment = (segmentId: string) => {
    setSelectedSegmentIds((current) =>
      current.includes(segmentId)
        ? current.filter((id) => id !== segmentId)
        : [...current, segmentId]
    );
  };

  const selectedSegments = segments.filter((segment) => selectedSegmentIds.includes(segment.id));
  const combinedText = selectedSegments.map((segment) => segment.text).join("");
  const combinedPinyin = selectedSegments
    .map((segment) => segment.pinyin)
    .filter(Boolean)
    .join(" ");
  const combinedMeaning = selectedSegments
    .map((segment) => segment.english)
    .filter(Boolean)
    .join("; ");

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

  const scanCameraFrame = async () => {
    const image = captureCameraFrame();

    if (!image) {
      toast.error(t("camera.accessError"));
      return;
    }

    setUploadedImage(image);
    try {
      await runScan({ image });
    } catch {
      toast.error(t("camera.scanError"));
    }
  };

  const startCamera = async () => {
    try {
      setUploadedImage(null);
      setBoxes([]);
      setSegments([]);
      setSelectedSegmentIds([]);
      setSelectedBox(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch {
      toast.error(t("camera.accessError"));
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopCamera();
    setBoxes([]);
    setSegments([]);
    setSelectedSegmentIds([]);
    setSelectedBox(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const image = event.target?.result as string;
      setUploadedImage(image);
      try {
        await runScan({ image });
      } catch {
        toast.error(t("camera.scanError"));
      }
    };
    reader.readAsDataURL(file);
  };

  const enrollSRS = async (wordId: string) => {
    await enrollWordMutation.mutateAsync({ wordId });
    toast.success(t("camera.enrolled"));
  };

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col overflow-y-auto bg-background">
      <header className="flex items-center gap-4 border-b bg-card/90 p-4 shadow-sm backdrop-blur-xl">
        <button onClick={handleClose} className="text-muted-foreground">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h3 className="text-[1.1rem] font-extrabold">{t("camera.title")}</h3>
          <p className="text-xs text-muted-foreground">
            {t("camera.subtitle")}
          </p>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center p-4 sm:p-5">
        <div className="relative mb-6 flex h-[260px] w-full max-w-[400px] items-center justify-center overflow-hidden rounded-[20px] border-2 bg-[#1e1e24] shadow-[0_8px_30px_rgba(0,0,0,0.1)] sm:h-[300px]">
          {loading && (
            <div className="z-10 flex flex-col items-center gap-3 text-white">
              <RefreshCw className="recording-pulse" size={36} />
              <span className="text-[0.85rem] font-semibold">{t("camera.running")}</span>
            </div>
          )}

          {cameraActive && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="size-full object-cover"
            />
          )}

          {uploadedImage && (
            <img
              src={uploadedImage}
              alt="Scan"
              className="size-full object-cover"
            />
          )}

          {!cameraActive && !uploadedImage && !loading && (
            <div className="p-6 text-center text-white/40">
              <Camera size={48} className="mb-3 inline-block" />
              <p className="text-[0.85rem]">
                {t("camera.offline")}
              </p>
            </div>
          )}

          {(cameraActive || uploadedImage) && !loading && (
            <div className="pointer-events-none absolute inset-[10%] border-[1.5px] border-dashed border-primary/40" />
          )}

          {!loading && boxes.map((box) => (
            <button
              key={box.id}
              onClick={() => setSelectedBox(box)}
              style={{
                top: `${box.top}%`,
                left: `${box.left}%`,
                width: `${box.width}%`,
                height: `${box.height}%`,
                padding: 0,
              }}
              title={box.text}
              className={`absolute cursor-pointer rounded border-2 transition ${
                box.english ? "border-jade bg-jade/25" : "border-primary bg-primary/20"
              }`}
            />
          ))}
        </div>

        <div className="mb-8 flex w-full max-w-[400px] flex-col gap-3 min-[420px]:flex-row">
          {!cameraActive ? (
            <button className={`${primaryButtonClass} flex-1`} onClick={startCamera} disabled={loading}>
              <Camera size={18} /> {t("camera.useLive")}
            </button>
          ) : (
            <>
              <button className={`${primaryButtonClass} flex-1`} onClick={scanCameraFrame} disabled={loading}>
                <Camera size={18} /> {t("camera.scan")}
              </button>
              <button className={`${secondaryButtonClass} flex-1`} onClick={stopCamera}>
                {t("camera.stop")}
              </button>
            </>
          )}

          <label className={`${secondaryButtonClass} flex-1`}>
            <Upload size={18} /> {t("camera.upload")}
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {selectedBox && (
          <div className="anim-pop mb-8 w-full max-w-[400px] rounded-lg border-2 border-jade bg-card p-5 text-left shadow-sm">
            <h4 className="mb-1 text-xs font-bold uppercase text-jade">
              {selectedBox.english ? t("camera.matched") : t("camera.detected")}
            </h4>
            <div className="flex items-center justify-between gap-4">
              <h2 className="break-words font-serif text-[2.2rem] font-extrabold">
                {selectedBox.text}
              </h2>
              {selectedBox.wordId && (
                <button
                  className={`${secondaryButtonClass} px-3 py-1.5 text-xs`}
                  onClick={() => enrollSRS(selectedBox.wordId!)}
                  disabled={enrollWordMutation.isPending}
                >
                  {t("camera.studyWord")}
                </button>
              )}
            </div>
            {selectedBox.pinyin && (
              <div className="mt-1 text-[1.05rem] font-bold text-primary">
                {selectedBox.pinyin}
              </div>
            )}
            {selectedBox.english ? (
              <p className="mt-2 text-[0.95rem] font-medium">
                {t("camera.meaning")} <strong>{selectedBox.english}</strong>
              </p>
            ) : (
              <p className="mt-2 text-[0.95rem] font-medium text-muted-foreground">
                {t("camera.noMatch")}
              </p>
            )}
            {typeof selectedBox.confidence === "number" && (
              <p className="mt-2 text-xs text-muted-foreground">
                {t("camera.confidence", { value: Math.round(selectedBox.confidence * 100) })}
              </p>
            )}
            {selectedBox.source === "cc-cedict" && (
              <p className="mt-2 text-xs text-muted-foreground">
                {t("camera.dictionarySource")}
              </p>
            )}
          </div>
        )}

        {segments.length > 0 && (
          <section className="mb-8 w-full max-w-[400px] text-left">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="text-[0.85rem] font-bold uppercase text-muted-foreground">
                {t("camera.wordSegments")}
              </h4>
              {selectedSegmentIds.length > 0 && (
                <button
                  type="button"
                  className="text-xs font-semibold text-primary"
                  onClick={() => setSelectedSegmentIds([])}
                >
                  {t("camera.clearSelection")}
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {segments.map((segment) => {
                const selected = selectedSegmentIds.includes(segment.id);

                return (
                  <button
                    key={segment.id}
                    type="button"
                    onClick={() => toggleSegment(segment.id)}
                    className={`rounded-lg border px-3 py-2 text-left transition ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "bg-card hover:border-primary/60"
                    }`}
                  >
                    <span className="block text-base font-bold">{segment.text}</span>
                    {segment.pinyin && (
                      <span className={`block text-xs ${selected ? "text-primary-foreground/80" : "text-primary"}`}>
                        {segment.pinyin}
                      </span>
                    )}
                    {segment.english && (
                      <span className={`block max-w-[160px] truncate text-xs ${selected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {segment.english}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedSegments.length > 0 && (
              <div className="mt-4 rounded-lg border bg-card p-4">
                <h4 className="mb-2 text-xs font-bold uppercase text-muted-foreground">
                  {t("camera.combinedMeaning")}
                </h4>
                <div className="text-2xl font-extrabold">{combinedText}</div>
                {combinedPinyin && (
                  <div className="mt-1 font-bold text-primary">{combinedPinyin}</div>
                )}
                <p className="mt-2 text-sm text-foreground">
                  {combinedMeaning || t("camera.noCombinedMeaning")}
                </p>
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
}
