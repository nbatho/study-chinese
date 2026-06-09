import { useState, useRef, useEffect } from "react";
import { useStore } from "../store/store";
import { VOCAB } from "../resources/vocab";
import type { Word } from "../resources/vocab";
import { ArrowLeft, Camera, Upload, RefreshCw } from "lucide-react";

interface CameraTranslatorProps {
  onClose: () => void;
}

interface BoundingBox {
  id: string;
  wordId: string;
  text: string;
  pinyin: string;
  english: string;
  top: number; // percent
  left: number; // percent
  width: number; // percent
  height: number; // percent
}

export default function CameraTranslator({ onClose }: CameraTranslatorProps) {
  const store = useStore();
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [boxes, setBoxes] = useState<BoundingBox[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const samples = [
    {
      id: "sign",
      label: "Street Sign",
      emoji: "🧭",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80",
      boxes: [
        { id: "b1", wordId: "wd_china", text: "中国", pinyin: "zhōng guó", english: "China", top: 35, left: 30, width: 20, height: 12 },
        { id: "b2", wordId: "wd_station", text: "站", pinyin: "zhàn", english: "Station / Stop", top: 35, left: 52, width: 12, height: 12 }
      ]
    },
    {
      id: "menu",
      label: "Restaurant Menu",
      emoji: "🍜",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
      boxes: [
        { id: "b3", wordId: "wd_beef", text: "牛肉", pinyin: "niú ròu", english: "Beef", top: 20, left: 25, width: 18, height: 8 },
        { id: "b4", wordId: "wd_tea", text: "茶", pinyin: "chá", english: "Tea", top: 45, left: 25, width: 10, height: 8 }
      ]
    },
    {
      id: "book",
      label: "Library Book",
      emoji: "📚",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80",
      boxes: [
        { id: "b5", wordId: "wd_book", text: "书", pinyin: "shū", english: "Book", top: 30, left: 40, width: 12, height: 10 },
        { id: "b6", wordId: "wd_learn", text: "学习", pinyin: "xué xí", english: "To study / Learn", top: 55, left: 35, width: 20, height: 10 }
      ]
    }
  ];

  // Camera stream activation
  const startCamera = async () => {
    try {
      setUploadedImage(null);
      setBoxes([]);
      setSelectedWord(null);
      setLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setLoading(false);
      
      // Simulate real-time scanning overlay boxes showing up after 1.5 seconds
      setTimeout(() => {
        setBoxes([
          { id: "c1", wordId: "wd_hello", text: "你好", pinyin: "nǐ hǎo", english: "hello", top: 40, left: 35, width: 30, height: 15 }
        ]);
      }, 1500);

    } catch (e) {
      alert("Could not access camera. Please try a sample sign below or upload an image instead.");
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const selectSample = (sample: typeof samples[0]) => {
    stopCamera();
    setUploadedImage(sample.image);
    setLoading(true);
    setSelectedWord(null);
    
    // Simulate OCR delay
    setTimeout(() => {
      setBoxes(sample.boxes);
      setLoading(false);
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopCamera();
    setSelectedWord(null);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
      
      // Simulate reading image, matching words in local vocab dictionary
      setTimeout(() => {
        setBoxes([
          { id: "u1", wordId: "wd_water", text: "水", pinyin: "shuǐ", english: "water", top: 30, left: 20, width: 15, height: 12 },
          { id: "u2", wordId: "wd_delicious", text: "好吃", pinyin: "hǎo chī", english: "delicious", top: 60, left: 50, width: 20, height: 12 }
        ]);
        setLoading(false);
      }, 1000);
    };
    reader.readAsDataURL(file);
  };

  const enrollSRS = (wordId: string) => {
    store.enrollSRS(wordId);
    alert("Word enrolled in SRS review list!");
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
      {/* Top Header */}
      <header className="glass-panel" style={{
        padding: "16px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid var(--border-color)",
        gap: "16px"
      }}>
        <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-muted)" }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Camera Scan OCR Translator</h3>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Scan Hanzi characters on items to check standard pinyin meanings
          </p>
        </div>
      </header>

      {/* Interactive Scan Frame */}
      <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        {/* Main Scanner Container */}
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
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Running OCR Scanner...</span>
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
                Camera Offline. Activate camera, upload a photo, or choose a sample below.
              </p>
            </div>
          )}

          {/* Scanner Grid Lines overlay */}
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

          {/* Render OCR bounding boxes overlay */}
          {!loading && boxes.map((box) => (
            <button
              key={box.id}
              onClick={() => {
                const wObj = VOCAB.find(w => w.id === box.wordId);
                if (wObj) setSelectedWord(wObj);
              }}
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

        {/* Action Controls */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "32px", width: "100%", maxWidth: "400px" }}>
          {!cameraActive ? (
            <button className="btn btn-primary" onClick={startCamera} style={{ flex: 1 }}>
              <Camera size={18} /> Use Live Camera
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={stopCamera} style={{ flex: 1 }}>
              Stop Camera
            </button>
          )}

          <label className="btn btn-secondary" style={{ flex: 1, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            <Upload size={18} /> Upload Image
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
          </label>
        </div>

        {/* Vocabulary Detail Display Card */}
        {selectedWord && (
          <div className="card anim-pop" style={{ width: "100%", maxWidth: "400px", textAlign: "left", marginBottom: "32px", border: "2px solid var(--jade)" }}>
            <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--jade)", fontWeight: 700, marginBottom: "4px" }}>
              Matched Chinese Term
            </h4>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="hanzi-text" style={{ fontSize: "2.2rem", fontWeight: 800 }}>
                {selectedWord.simplified}
              </h2>
              <button
                className="btn btn-secondary"
                onClick={() => enrollSRS(selectedWord.id)}
                style={{ padding: "6px 12px", fontSize: "0.75rem" }}
              >
                + Study Word (SRS)
              </button>
            </div>
            <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--primary-red)", marginTop: "4px" }}>
              {selectedWord.pinyin}
            </div>
            <p style={{ fontSize: "0.95rem", color: "var(--text-main)", fontWeight: 500, marginTop: "8px" }}>
              Meaning: <strong>{selectedWord.english}</strong>
            </p>
          </div>
        )}

        {/* Samples library selector */}
        <div style={{ width: "100%", maxWidth: "400px", textAlign: "left" }}>
          <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "12px" }}>
            Or Select Demo Samples
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            {samples.map((samp) => (
              <button
                key={samp.id}
                onClick={() => selectSample(samp)}
                className="btn btn-secondary"
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
                <span style={{ fontSize: "1.8rem" }}>{samp.emoji}</span>
                <span>{samp.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
