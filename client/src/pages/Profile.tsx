import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../api/auth/queries";
import { useUpdateProfileMutation, useUserProfileQuery, useUserStatsQuery } from "../api/users/queries";
import { LogOut, ToggleLeft, ToggleRight } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const profileQuery = useUserProfileQuery();
  const statsQuery = useUserStatsQuery(7);
  const updateProfileMutation = useUpdateProfileMutation();
  const logoutMutation = useLogoutMutation();
  const profile = profileQuery.data?.profile;
  const streak = profileQuery.data?.streak;
  const stats = useMemo(() => statsQuery.data?.stats ?? [], [statsQuery.data?.stats]);

  const [draftProfile, setDraftProfile] = useState<{
    name?: string;
    dailyMinutes?: number;
    showPinyin?: boolean;
    audioAutoPlay?: boolean;
  }>({});
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const name = draftProfile.name ?? profile?.name ?? "";
  const dailyMinutes = draftProfile.dailyMinutes ?? profile?.dailyMinutes ?? 15;
  const showPinyin = draftProfile.showPinyin ?? profile?.showPinyin ?? true;
  const audioAutoPlay = draftProfile.audioAutoPlay ?? profile?.audioAutoPlay ?? true;

  const saveProfileSettings = async () => {
    await updateProfileMutation.mutateAsync({
      name: name.trim() || "Learner",
      dailyMinutes: Number(dailyMinutes) || 15,
      showPinyin,
      audioAutoPlay,
    });
    alert("Profile settings saved successfully!");
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate("/auth", { replace: true });
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 30;
    const graphWidth = canvas.width - padding * 2;
    const graphHeight = canvas.height - padding * 2;
    ctx.strokeStyle = document.body.classList.contains("dark") ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i += 1) {
      const y = padding + (graphHeight * i) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    const xps = stats.map((stat) => stat.xp);
    const maxXp = Math.max(...xps, 50);
    const barGap = 10;
    const totalGapsWidth = barGap * Math.max(stats.length - 1, 0);
    const barWidth = stats.length ? (graphWidth - totalGapsWidth) / stats.length : graphWidth;
    const compStyle = window.getComputedStyle(canvas);
    const primaryRed = compStyle.getPropertyValue("--primary-red").trim() || "rgb(217, 63, 71)";
    const accentRed = compStyle.getPropertyValue("--accent-red").trim() || "rgb(240, 75, 66)";
    const textMain = compStyle.getPropertyValue("--text-main").trim() || "#2c2c35";
    const textMuted = compStyle.getPropertyValue("--text-muted").trim() || "#6e6e82";

    stats.forEach((stat, idx) => {
      const barHeight = (stat.xp / maxXp) * graphHeight;
      const x = padding + idx * (barWidth + barGap);
      const y = canvas.height - padding - barHeight;
      const grad = ctx.createLinearGradient(x, y, x, canvas.height - padding);
      grad.addColorStop(0, primaryRed);
      grad.addColorStop(1, accentRed);
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barWidth, barHeight);
      ctx.fillStyle = textMain;
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      if (stat.xp > 0) ctx.fillText(String(stat.xp), x + barWidth / 2, y - 4);
      ctx.fillStyle = textMuted;
      ctx.font = "8px sans-serif";
      ctx.fillText(stat.dateKey.split("-").slice(1).join("/"), x + barWidth / 2, canvas.height - padding + 14);
    });
  }, [stats]);

  const today = stats[stats.length - 1] ?? {
    xp: 0,
    minutesStudied: 0,
    wordsReviewed: 0,
    exercisesCorrect: 0,
    exercisesTotal: 0,
  };
  const accuracy = today.exercisesTotal
    ? Math.round((today.exercisesCorrect / today.exercisesTotal) * 100)
    : 0;

  return (
    <div className="anim-slide" style={{ paddingBottom: "40px" }}>
      <section className="card" style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "20px", textAlign: "left" }}>
        <div style={{ fontSize: "3.2rem" }}>{profile?.avatar || "学"}</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>{profile?.name || "Learner"}</h2>
          <span style={{ fontSize: "0.8rem", color: "var(--primary-red)", fontWeight: 700 }}>
            Member since {profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString() : "today"}
          </span>
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <span style={{ fontSize: "0.75rem", backgroundColor: "var(--bg-card-hover)", padding: "4px 8px", borderRadius: "6px", fontWeight: 700, color: "var(--text-muted)" }}>
              Streak: {streak?.current ?? 0} days
            </span>
            <span style={{ fontSize: "0.75rem", backgroundColor: "var(--bg-card-hover)", padding: "4px 8px", borderRadius: "6px", fontWeight: 700, color: "var(--text-muted)" }}>
              Level: {(profile?.startLevel || "beginner").toUpperCase()}
            </span>
          </div>
        </div>
      </section>

      <section className="card" style={{ marginBottom: "20px", textAlign: "left" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "4px" }}>Weekly XP Analytics</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "16px" }}>XP points returned by the server for the last 7 days.</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <canvas ref={canvasRef} width={340} height={180} style={{ width: "100%", maxWidth: "340px", height: "180px" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", textAlign: "center", marginTop: "16px", borderTop: "1px dashed var(--border-color)", paddingTop: "16px" }}>
          <div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, display: "block" }}>STUDY TIME</span>
            <strong style={{ fontSize: "1.1rem", color: "var(--primary-red)" }}>{today.minutesStudied} min</strong>
          </div>
          <div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, display: "block" }}>ACCURACY</span>
            <strong style={{ fontSize: "1.1rem", color: "var(--jade)" }}>{accuracy}%</strong>
          </div>
          <div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, display: "block" }}>REVIEWS</span>
            <strong style={{ fontSize: "1.1rem", color: "var(--tone-3)" }}>{today.wordsReviewed}</strong>
          </div>
        </div>
      </section>

      <section className="card" style={{ textAlign: "left", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>App Settings</h3>
        <div style={{ display: "grid", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>Display Name</label>
            <input type="text" value={name} onChange={(e) => setDraftProfile((draft) => ({ ...draft, name: e.target.value }))} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-app)", color: "var(--text-main)", outline: "none" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>Daily Goal Minutes</label>
            <select value={dailyMinutes} onChange={(e) => setDraftProfile((draft) => ({ ...draft, dailyMinutes: Number(e.target.value) }))} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-app)", color: "var(--text-main)", outline: "none" }}>
              <option value="5">5 Minutes (Casual)</option>
              <option value="15">15 Minutes (Regular)</option>
              <option value="30">30 Minutes (Scholar)</option>
              <option value="60">60 Minutes (Intensive)</option>
            </select>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px" }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Show Pinyin by Default</span>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Display pinyin above characters during lessons</p>
            </div>
            <button onClick={() => setDraftProfile((draft) => ({ ...draft, showPinyin: !showPinyin }))} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--primary-red)" }}>
              {showPinyin ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px" }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Audio Autoplay</span>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Automatically read characters aloud during reviews</p>
            </div>
            <button onClick={() => setDraftProfile((draft) => ({ ...draft, audioAutoPlay: !audioAutoPlay }))} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--primary-red)" }}>
              {audioAutoPlay ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>
        </div>
        <button className="btn btn-primary" onClick={saveProfileSettings} disabled={updateProfileMutation.isPending} style={{ width: "100%", marginTop: "24px" }}>
          {updateProfileMutation.isPending ? "Saving..." : "Save Preferences"}
        </button>
      </section>

      <section className="card" style={{ textAlign: "left" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "6px" }}>Account</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "16px" }}>
          Sign out on this device. Your learning data remains saved on the server.
        </p>
        <button
          className="btn btn-secondary"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          style={{ width: "100%", color: "var(--tone-4)" }}
        >
          <LogOut size={18} />
          {logoutMutation.isPending ? "Signing out..." : "Logout"}
        </button>
      </section>
    </div>
  );
}
