import { useEffect, useRef, useState } from "react";
import { useOcrSamplesQuery, useOcrScanMutation } from "../api/ocr/queries";
import { useEnrollWordMutation } from "../api/srs/queries";
import type { OcrBox, OcrSample, OcrScanPayload } from "../api/ocr";
import { ArrowLeft, Camera, RefreshCw, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

interface CameraTranslatorProps {
  onClose?: () => void;
}

export default function CameraTranslator({ onClose }: CameraTranslatorProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const handleClose = onClose || (() => navigate("/home"));
  const scanMutation = useOcrScanMutation();
  const samplesQuery = useOcrSamplesQuery();
  const enrollWordMutation = useEnrollWordMutation();
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedBox, setSelectedBox] = useState<OcrBox | null>(null);
  const [boxes, setBoxes] = useState<OcrBox[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const loading = scanMutation.isPending;
  const samples = samplesQuery.data?.samples ?? [];

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const runScan = async (payload: OcrScanPayload) => {
    setSelectedBox(null);
    const response = await scanMutation.mutateAsync(payload);
    setBoxes(response.boxes);
  };

  const startCamera = async () => {
    try {
      setUploadedImage(null);
      setBoxes([]);
      setSelectedBox(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      await runScan({});
    } catch {
      alert(t("camera.accessError"));
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

  const selectSample = async (sample: OcrSample) => {
    stopCamera();
    setUploadedImage(sample.image);
    setBoxes([]);
    await runScan({ sampleId: sample.id });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopCamera();
    setBoxes([]);
    setSelectedBox(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const image = event.target?.result as string;
      setUploadedImage(image);
      await runScan({ image });
    };
    reader.readAsDataURL(file);
  };

  const enrollSRS = async (wordId: string) => {
    await enrollWordMutation.mutateAsync({ wordId });
    alert(t("camera.enrolled"));
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "var(--bg-app)",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      overflowY: "auto"
    }}>
      <header className="glass-panel" style={{
        padding: "16px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid var(--border-color)",
        gap: "16px"
      }}>
        <button onClick={handleClose} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-muted)" }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{t("camera.title")}</h3>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {t("camera.subtitle")}
          </p>
        </div>
      </header>

      <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          position: "relative",
          width: "100%",
          maxWidth: "400px",
          height: "300px",
          backgroundColor: "#1e1e24",
          borderRadius: "20px",
          border: "2px solid var(--border-color)",
          overflow: "hidden",
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px"
        }}>
          {loading && (
            <div style={{ zIndex: 10, color: "white", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <RefreshCw className="recording-pulse" size={36} />
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{t("camera.running")}</span>
            </div>
          )}

          {cameraActive && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}

          {uploadedImage && (
            <img
              src={uploadedImage}
              alt="Scan"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}

          {!cameraActive && !uploadedImage && !loading && (
            <div style={{ padding: "24px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
              <Camera size={48} style={{ marginBottom: "12px", display: "inline-block" }} />
              <p style={{ fontSize: "0.85rem" }}>
                {t("camera.offline")}
              </p>
            </div>
          )}

          {(cameraActive || uploadedImage) && !loading && (
            <div style={{
              position: "absolute",
              top: "10%",
              left: "10%",
              right: "10%",
              bottom: "10%",
              border: "1.5px dashed rgba(217, 63, 71, 0.4)",
              pointerEvents: "none"
            }} />
          )}

          {!loading && boxes.map((box) => (
            <button
              key={box.id}
              onClick={() => setSelectedBox(box)}
              style={{
                position: "absolute",
                top: `${box.top}%`,
                left: `${box.left}%`,
                width: `${box.width}%`,
                height: `${box.height}%`,
                border: "2px solid var(--jade)",
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                borderRadius: "4px",
                cursor: "pointer",
                padding: 0,
                transition: "var(--transition-smooth)"
              }}
              className="ocr-box-btn"
            />
          ))}
        </div>

        <div style={{ display: "flex", gap: "12px", marginBottom: "32px", width: "100%", maxWidth: "400px" }}>
          {!cameraActive ? (
            <button className="btn btn-primary" onClick={startCamera} style={{ flex: 1 }} disabled={loading}>
              <Camera size={18} /> {t("camera.useLive")}
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={stopCamera} style={{ flex: 1 }}>
              {t("camera.stop")}
            </button>
          )}

          <label className="btn btn-secondary" style={{ flex: 1, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            <Upload size={18} /> {t("camera.upload")}
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
          </label>
        </div>

        {selectedBox && (
          <div className="card anim-pop" style={{ width: "100%", maxWidth: "400px", textAlign: "left", marginBottom: "32px", border: "2px solid var(--jade)" }}>
            <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--jade)", fontWeight: 700, marginBottom: "4px" }}>
              {t("camera.matched")}
            </h4>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="hanzi-text" style={{ fontSize: "2.2rem", fontWeight: 800 }}>
                {selectedBox.text}
              </h2>
              <button
                className="btn btn-secondary"
                onClick={() => enrollSRS(selectedBox.wordId)}
                disabled={enrollWordMutation.isPending}
                style={{ padding: "6px 12px", fontSize: "0.75rem" }}
              >
                {t("camera.studyWord")}
              </button>
            </div>
            <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--primary-red)", marginTop: "4px" }}>
              {selectedBox.pinyin}
            </div>
            <p style={{ fontSize: "0.95rem", color: "var(--text-main)", fontWeight: 500, marginTop: "8px" }}>
              {t("camera.meaning")} <strong>{selectedBox.english}</strong>
            </p>
          </div>
        )}

        <div style={{ width: "100%", maxWidth: "400px", textAlign: "left" }}>
          <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "12px" }}>
            {t("camera.samples")}
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            {samples.map((sample) => (
              <button
                key={sample.id}
                onClick={() => selectSample(sample)}
                className="btn btn-secondary"
                disabled={loading}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "16px 8px",
                  borderRadius: "14px",
                  gap: "6px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  alignItems: "center"
                }}
              >
                <span style={{ fontSize: "1.8rem" }}>{sample.marker}</span>
                <span>{sample.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
