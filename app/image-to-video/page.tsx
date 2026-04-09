"use client";
import { useState } from "react";

export default function ImageToVideo() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [prompt, setPrompt] = useState("cinematic motion, smooth animation");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");

  const handleFile = (file: File) => { setImage(file); setPreview(URL.createObjectURL(file)); setVideoUrl(""); setError(""); };

  const checkPrediction = async (id: string) => {
    const res = await fetch(`/api/check-prediction?id=${id}`);
    const data = await res.json();
    if (data.status === "succeeded") { setVideoUrl(data.output?.[0] || data.output); setLoading(false); }
    else if (data.status === "failed") { setError("Video oluşturulamadı, tekrar dene."); setLoading(false); }
    else { setTimeout(() => checkPrediction(id), 3000); }
  };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true); setError(""); setVideoUrl("");
    const formData = new FormData();
    formData.append("image", image);
    formData.append("prompt", prompt);
    const res = await fetch("/api/image-to-video", { method: "POST", body: formData });
    const data = await res.json();
    if (data.video) { setVideoUrl(data.video); setLoading(false); }
    else if (data.predictionId) { checkPrediction(data.predictionId); }
    else { setError(data.error || "Bir hata oluştu"); setLoading(false); }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#080b14", color: "white", fontFamily: "'Segoe UI', sans-serif", paddingBottom: "60px" }}>
      <style>{`
        .itv-nav { padding: 18px 48px; }
        .itv-container { max-width: 800px; margin: 0 auto; padding: 40px 24px; }
        .itv-title { font-size: 48px; }
        .itv-drop { padding: 80px 20px; }
        @media (max-width: 768px) {
          .itv-nav { padding: 14px 16px !important; }
          .itv-container { padding: 24px 16px !important; }
          .itv-title { font-size: 30px !important; }
          .itv-drop { padding: 48px 16px !important; }
          .itv-btns { flex-direction: column !important; }
          .itv-btns a, .itv-btns button { text-align: center !important; }
        }
      `}</style>

      <nav className="itv-nav" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(8,11,20,0.9)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>✨</div>
          <a href="/" style={{ fontSize: "20px", fontWeight: "800", color: "white", textDecoration: "none" }}>PixelAI</a>
        </div>
        <a href="/" style={{ color: "#a78bfa", textDecoration: "none", fontSize: "14px", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "8px", padding: "7px 14px" }}>← Geri Dön</a>
      </nav>

      <div className="itv-container">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "999px", padding: "6px 16px", fontSize: "12px", color: "#f87171", marginBottom: "20px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f87171", display: "inline-block" }}></span>
            AI Destekli — Resimden Video
          </div>
          <h1 className="itv-title" style={{ fontWeight: "900", marginBottom: "12px", letterSpacing: "-1.5px", background: "linear-gradient(135deg, #fff 0%, #e2e8f0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Resimden Video Yap</h1>
          <p style={{ color: "#6b7280", fontSize: "17px" }}>Fotoğrafını yükle, yapay zeka onu videoya dönüştürsün</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)", borderRadius: "10px", padding: "8px 16px", fontSize: "13px", color: "#fbbf24", marginTop: "16px" }}>
            ⏱️ Video oluşturma 1-3 dakika sürebilir
          </div>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "16px", padding: "16px 24px", marginBottom: "24px", textAlign: "center", color: "#f87171", fontSize: "14px" }}>❌ {error}</div>}

        {!preview && (
          <div onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }} onDragOver={e => e.preventDefault()} className="itv-drop"
            style={{ border: "2px dashed rgba(255,255,255,0.1)", borderRadius: "24px", textAlign: "center", background: "rgba(255,255,255,0.02)", cursor: "pointer" }}>
            <div style={{ fontSize: "56px", marginBottom: "20px" }}>🎬</div>
            <p style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Resmi sürükle bırak</p>
            <p style={{ color: "#4b5563", marginBottom: "28px" }}>veya bilgisayarından seç</p>
            <label style={{ background: "linear-gradient(135deg, #dc2626, #ef4444)", color: "white", padding: "13px 36px", borderRadius: "12px", cursor: "pointer", fontSize: "16px", fontWeight: "700", boxShadow: "0 0 30px rgba(220,38,38,0.3)" }}>
              Resim Seç
              <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} style={{ display: "none" }} />
            </label>
          </div>
        )}

        {preview && !videoUrl && (
          <div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "12px", marginBottom: "20px", textAlign: "center" }}>
              <img src={preview} style={{ maxWidth: "100%", maxHeight: "350px", borderRadius: "12px", display: "inline-block" }} />
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#9ca3af", marginBottom: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>🎯 Hareket Açıklaması</label>
              <input value={prompt} onChange={e => setPrompt(e.target.value)}
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px 16px", color: "white", fontSize: "15px", boxSizing: "border-box", outline: "none", fontFamily: "'Segoe UI', sans-serif" }}
                placeholder="cinematic motion, smooth animation" />
            </div>
            <div className="itv-btns" style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => { setPreview(""); setImage(null); }} style={{ background: "rgba(255,255,255,0.05)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)", borderRadius: "12px", padding: "13px 28px", fontSize: "15px", cursor: "pointer", fontWeight: "600" }}>🔄 Değiştir</button>
              <button onClick={handleSubmit} disabled={loading} style={{ background: loading ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #dc2626, #ef4444)", color: loading ? "#6b7280" : "white", border: "none", borderRadius: "12px", padding: "13px 40px", fontSize: "15px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "700", boxShadow: loading ? "none" : "0 0 30px rgba(220,38,38,0.3)" }}>
                {loading ? "⏳ Video oluşturuluyor... (1-3 dk)" : "🎬 Videoya Dönüştür"}
              </button>
            </div>
          </div>
        )}

        {videoUrl && (
          <div style={{ textAlign: "center" }}>
            <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "20px", padding: "12px", marginBottom: "24px" }}>
              <video src={videoUrl} controls autoPlay loop style={{ maxWidth: "100%", borderRadius: "12px", display: "block" }} />
            </div>
            <div className="itv-btns" style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => { setPreview(""); setImage(null); setVideoUrl(""); }} style={{ background: "rgba(255,255,255,0.05)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)", borderRadius: "12px", padding: "13px 28px", fontSize: "15px", cursor: "pointer", fontWeight: "600" }}>🔄 Yeni Video</button>
              <a href={videoUrl} download="pixelai-video.mp4" style={{ background: "linear-gradient(135deg, #059669, #10b981)", color: "white", padding: "13px 36px", borderRadius: "12px", textDecoration: "none", fontSize: "15px", fontWeight: "700" }}>⬇️ İndir</a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}