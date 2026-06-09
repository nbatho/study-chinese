import { useState, useEffect, useRef } from "react";
import { useStore } from "../store/store";
import { ShieldCheck, ToggleLeft, ToggleRight, Sparkles } from "lucide-react";

export default function Profile() {
  const store = useStore();
  const profile = store.profile;
  const stats = store.getRecentStats(7);

  const [name, setName] = useState(profile.name);
  const [dailyMinutes, setDailyMinutes] = useState(profile.dailyMinutes);
  const [showPinyin, setShowPinyin] = useState(profile.showPinyin);
  const [audioAutoPlay, setAudioAutoPlay] = useState(profile.audioAutoPlay);
  const [isUpgraded, setIsUpgraded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trigger profile save updates
  const saveProfileSettings = () => {
    store.updateProfile({
      name: name.trim() || "Learner",
      dailyMinutes: Number(dailyMinutes) || 15,
      showPinyin,
      audioAutoPlay
    });
    alert("Profile settings saved successfully!");
  };

  // Render SVG/Canvas XP Chart
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const padding = 30;
      const graphWidth = canvas.width - padding * 2;
      const graphHeight = canvas.height - padding * 2;

      // Draw grid
      ctx.strokeStyle = "rgba(0,0,0,0.05)";
      if (document.body.classList.contains("dark")) {
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
      }
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padding + (graphHeight * i) / 4;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
      }

      // Extract values
      const xps = stats.map(s => s.xp);
      const maxXp = Math.max(...xps, 50);

      // Plot bars
      const barGap = 10;
      const totalGapsWidth = barGap * (stats.length - 1);
      const barWidth = (graphWidth - totalGapsWidth) / stats.length;

      stats.forEach((s, idx) => {
        const barHeight = (s.xp / maxXp) * graphHeight;
        const x = padding + idx * (barWidth + barGap);
        const y = canvas.height - padding - barHeight;

        // Fill bar gradient
        const grad = ctx.createLinearGradient(x, y, x, canvas.height - padding);
        grad.addColorStop(0, "var(--primary-red)");
        grad.addColorStop(1, "var(--accent-red)");
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Value text
        ctx.fillStyle = "var(--text-main)";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        if (s.xp > 0) {
          ctx.fillText(String(s.xp), x + barWidth / 2, y - 4);
        }

        // Label day text
        ctx.fillStyle = "var(--text-muted)";
        ctx.font = "8px sans-serif";
        const dateStr = s.dateKey.split("-").slice(1).join("/");
        ctx.fillText(dateStr, x + barWidth / 2, canvas.height - padding + 14);
      });
    }
  }, [stats]);

  const handleUpgrade = () => {
    setIsUpgraded(true);
    store.addXP(100);
    alert("Congratulations! You are now a StudyChinese Pro Member. Enjoy offline features, camera translator, and AI tutors!");
  };

  return (
    <div className="anim-slide" style={{ paddingBottom: "40px" }}>
      {/* Profile summary header */}
      <section className="card" style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "20px", textAlign: "left" }}>
        <div style={{ fontSize: "3.2rem" }}>{profile.avatar}</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>{profile.name}</h2>
          <span style={{ fontSize: "0.8rem", color: "var(--primary-red)", fontWeight: 700 }}>
            Member since {new Date(profile.joinDate).toLocaleDateString()}
          </span>
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <span style={{ fontSize: "0.75rem", backgroundColor: "var(--bg-card-hover)", padding: "4px 8px", borderRadius: "6px", fontWeight: 700, color: "var(--text-muted)" }}>
              Streak: {store.getCurrentStreak()} days
            </span>
            <span style={{ fontSize: "0.75rem", backgroundColor: "var(--bg-card-hover)", padding: "4px 8px", borderRadius: "6px", fontWeight: 700, color: "var(--text-muted)" }}>
              Level: {profile.startLevel.toUpperCase()}
            </span>
          </div>
        </div>
      </section>

      {/* Analytics Chart dashboard */}
      <section className="card" style={{ marginBottom: "20px", textAlign: "left" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "4px" }}>Weekly XP Analytics</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "16px" }}>XP points earned over the last 7 study days.</p>
        
        <div style={{ display: "flex", justifyContent: "center" }}>
          <canvas ref={canvasRef} width={340} height={180} style={{ width: "100%", maxWidth: "340px", height: "180px" }} />
        </div>
        
        {/* General Stats summary */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "10px",
          textAlign: "center",
          marginTop: "16px",
          borderTop: "1px dashed var(--border-color)",
          paddingTop: "16px"
        }}>
          <div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, display: "block" }}>STUDY TIME</span>
            <strong style={{ fontSize: "1.1rem", color: "var(--primary-red)" }}>{store.getTodayStat().minutesStudied} min</strong>
          </div>
          <div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, display: "block" }}>ACCURACY</span>
            <strong style={{ fontSize: "1.1rem", color: "var(--jade)" }}>92%</strong>
          </div>
          <div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, display: "block" }}>WORDS</span>
            <strong style={{ fontSize: "1.1rem", color: "var(--tone-3)" }}>{store.getTotalStudiedWordsCount()} learned</strong>
          </div>
        </div>
      </section>

      {/* Upgrade Premium billing simulator */}
      <section className="card card-gradient-gold" style={{ marginBottom: "20px", textAlign: "left" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={18} style={{ color: "var(--gold)" }} />
          Upgrade to Premium Pro
        </h3>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
          Unlock unlimited AI Tutor scenarios, real-time Camera Scanners, detailed analytics, and tone contours review feedback.
        </p>

        {isUpgraded ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--jade)",
            fontWeight: 700,
            fontSize: "0.9rem",
            marginTop: "12px",
            backgroundColor: "rgba(16, 185, 129, 0.08)",
            padding: "8px 12px",
            borderRadius: "8px"
          }}>
            <ShieldCheck size={18} /> Pro Account Active
          </div>
        ) : (
          <button className="btn btn-primary" onClick={handleUpgrade} style={{ marginTop: "14px", padding: "10px 18px", fontSize: "0.85rem" }}>
            Unlock Pro Access ($9.99/mo)
          </button>
        )}
      </section>

      {/* General Settings */}
      <section className="card" style={{ textAlign: "left", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>App Settings</h3>
        
        <div style={{ display: "grid", gap: "16px" }}>
          
          {/* Edit name */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-app)",
                color: "var(--text-main)",
                outline: "none"
              }}
            />
          </div>

          {/* Daily study goal */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>Daily Goal Minutes</label>
            <select
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-app)",
                color: "var(--text-main)",
                outline: "none"
              }}
            >
              <option value="5">5 Minutes (Casual)</option>
              <option value="15">15 Minutes (Regular)</option>
              <option value="30">30 Minutes (Scholar)</option>
              <option value="60">60 Minutes (Intensive)</option>
            </select>
          </div>

          {/* Pinyin Toggle */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px" }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Show Pinyin by Default</span>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Display pinyin above characters during lessons</p>
            </div>
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              style={{ border: "none", background: "none", cursor: "pointer", color: "var(--primary-red)" }}
            >
              {showPinyin ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>

          {/* Audio Autoplay Toggle */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px" }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Audio Autoplay</span>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Automatically read characters aloud during reviews</p>
            </div>
            <button
              onClick={() => setAudioAutoPlay(!audioAutoPlay)}
              style={{ border: "none", background: "none", cursor: "pointer", color: "var(--primary-red)" }}
            >
              {audioAutoPlay ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>

        </div>

        <button className="btn btn-primary" onClick={saveProfileSettings} style={{ width: "100%", marginTop: "24px" }}>
          Save Preferences
        </button>
      </section>
    </div>
  );
}
