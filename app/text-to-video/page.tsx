"use client";
import { useState } from "react";

export default function TextToVideo() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");

  const checkPrediction = async (id: string) => {
    const res = await fetch(`/api/check-prediction?id=${id}`);
    const data = await res.json();
    if (data.status === "succeeded") {
      setVideoUrl(data.output?.[0] || data.output);
      setLoading(false);
    } else if (data.status === "failed") {
      setError("Video oluşturulamadı, tekrar dene.");
      setLoading(false);
    } else {
      setTimeout(() => checkPrediction(id), 3000);
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setVideoUrl("");

    const res = await fetch("/api/text-to-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();

    if (data.video) {
      setVideoUrl(data.video);
      setLoading(false);
    } else if (data.predictionId) {
      checkPrediction(data.predictionId);
    } else {
      setError(data.error || "Bir hata oluştu");
      setLoading(false);
    }
  };

  const examples = [
    "Güneş batımında sahilde yürüyen bir kadın, sinematik",
    "Uzayda yavaşça dönen bir gezegen, yıldızlar arka planda",
    "Yağmurda parlayan şehir sokakları, gece, neon ışıklar",
    "Ormanda akan bir şelale, doğal ışık, sinematik"
  ];

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0d1117 100%)",
      color: "white", fontFamily: "'Segoe UI', sans-serif", padding: "0 0 60px"
    }}>
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 40px", borderBottom: "1px solid rgba(167,139,250,0.15)",
        background: "rgba(15,15,26,0.8)", backdropFilter: "blur(10px)"
      }}>
        <a href="/" style={{ fontSize: "20px", fontWeight: "800", color: "white", textDecoration: "none" }}>✨ PixelAI</a>
        <a href="/" style={{ color: "#a78bfa", textDecoration: "none", fontSize: "14px" }}>← Ana Sayfaya Dön</a>
      </nav>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{
            display: "inline-block", background: "rgba(124,58,237,0.2)",
            border: "1px solid #7c3aed", borderRadius: "999px",
            padding: "6px 18px", fontSize: "13px", color: "#a78bfa", marginBottom: "16px"
          }}>✍️ AI Destekli</div>
          <h1 style={{ fontSize: "40px", fontWeight: "900", marginBottom: "12px" }}>Yazıdan Video Yap</h1>
          <p style={{ color: "#9ca3af", fontSize: "17px" }}>Ne istediğini yaz, yapay zeka videoyu oluştursun</p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444",
            borderRadius: "16px", padding: "16px 24px", marginBottom: "24px", textAlign: "center", color: "#f87171"
          }}>{error}</div>
        )}

        {!videoUrl && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Örnek: Güneş batımında sahilde yürüyen bir kadın, sinematik çekim..."
                rows={4}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid #444",
                  borderRadius: "16px", padding: "16px", color: "white", fontSize: "16px",
                  resize: "none", boxSizing: "border-box", fontFamily: "'Segoe UI', sans-serif"
                }}
              />
            </div>

            <div style={{ marginBottom: "32px" }}>
              <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "12px" }}>💡 Örnek promptlar:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {examples.map(ex => (
                  <button key={ex} onClick={() => setPrompt(ex)} style={{
                    background: "rgba(255,255,255,0.06)", border: "1px solid #333",
                    borderRadius: "8px", padding: "8px 14px", color: "#9ca3af",
                    fontSize: "13px", cursor: "pointer", textAlign: "left"
                  }}>{ex}</button>
                ))}
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button onClick={handleSubmit} disabled={loading || !prompt.trim()} style={{
                background: loading ? "#555" : "linear-gradient(135deg, #7c3aed, #a855f7)",
                color: "white", border: "none", borderRadius: "12px",
                padding: "16px 48px", fontSize: "18px", cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 0 30px rgba(124,58,237,0.4)"
              }}>
                {loading ? "⏳ Video oluşturuluyor... (1-3 dk)" : "🎬 Video Oluştur"}
              </button>
            </div>
          </div>
        )}

        {videoUrl && (
          <div style={{ textAlign: "center" }}>
            <video src={videoUrl} controls autoPlay loop style={{
              maxWidth: "100%", borderRadius: "16px", border: "1px solid #333", marginBottom: "24px"
            }} />
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => setVideoUrl("")} style={{
                background: "transparent", color: "#a78bfa", border: "1px solid #a78bfa",
                borderRadius: "10px", padding: "12px 24px", fontSize: "16px", cursor: "pointer"
              }}>🔄 Yeni Video</button>
              <a href={videoUrl} download="pixelai-video.mp4" style={{
                background: "linear-gradient(135deg, #059669, #10b981)",
                color: "white", padding: "12px 32px", borderRadius: "10px",
                textDecoration: "none", fontSize: "16px"
              }}>⬇️ İndir</a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}