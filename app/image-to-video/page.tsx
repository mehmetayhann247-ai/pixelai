"use client";
import { useState, useRef } from "react";

export default function ImageToVideo() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [prompt, setPrompt] = useState("cinematic motion, smooth animation");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [predictionId, setPredictionId] = useState("");

  const handleFile = (file: File) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setVideoUrl("");
    setError("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const checkPrediction = async (id: string) => {
    const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { "Authorization": `Bearer ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}` }
    });
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
    if (!image) return;
    setLoading(true);
    setError("");
    setVideoUrl("");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("prompt", prompt);

    const res = await fetch("/api/image-to-video", { method: "POST", body: formData });
    const data = await res.json();

    if (data.video) {
      setVideoUrl(data.video);
      setLoading(false);
    } else if (data.predictionId) {
      setPredictionId(data.predictionId);
      checkPrediction(data.predictionId);
    } else {
      setError(data.error || "Bir hata oluştu");
      setLoading(false);
    }
  };

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
            display: "inline-block", background: "rgba(220,38,38,0.2)",
            border: "1px solid #dc2626", borderRadius: "999px",
            padding: "6px 18px", fontSize: "13px", color: "#f87171", marginBottom: "16px"
          }}>🎬 AI Destekli</div>
          <h1 style={{ fontSize: "40px", fontWeight: "900", marginBottom: "12px" }}>Resimden Video Yap</h1>
          <p style={{ color: "#9ca3af", fontSize: "17px" }}>Fotoğrafını yükle, yapay zeka onu videoya dönüştürsün</p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444",
            borderRadius: "16px", padding: "16px 24px", marginBottom: "24px", textAlign: "center", color: "#f87171"
          }}>{error}</div>
        )}

        {!preview && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{
              border: "2px dashed #444", borderRadius: "20px", padding: "80px 20px",
              textAlign: "center", background: "rgba(255,255,255,0.02)", cursor: "pointer"
            }}
          >
            <div style={{ fontSize: "56px", marginBottom: "20px" }}>🖼️</div>
            <p style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>Resmi sürükle bırak</p>
            <p style={{ color: "#666", marginBottom: "24px" }}>veya</p>
            <label style={{
              background: "#dc2626", color: "white", padding: "12px 32px",
              borderRadius: "10px", cursor: "pointer", fontSize: "16px"
            }}>
              Bilgisayardan Seç
              <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} style={{ display: "none" }} />
            </label>
          </div>
        )}

        {preview && !videoUrl && (
          <div style={{ textAlign: "center" }}>
            <img src={preview} style={{ maxWidth: "100%", maxHeight: "350px", borderRadius: "16px", border: "1px solid #333", marginBottom: "24px" }} />
            <div style={{ marginBottom: "24px", textAlign: "left" }}>
              <label style={{ fontSize: "14px", color: "#9ca3af", display: "block", marginBottom: "8px" }}>🎯 Hareket açıklaması (isteğe bağlı):</label>
              <input
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid #444",
                  borderRadius: "10px", padding: "12px 16px", color: "white", fontSize: "15px",
                  boxSizing: "border-box"
                }}
                placeholder="cinematic motion, smooth animation"
              />
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => { setPreview(""); setImage(null); }} style={{
                background: "transparent", color: "#a78bfa", border: "1px solid #a78bfa",
                borderRadius: "10px", padding: "12px 24px", fontSize: "16px", cursor: "pointer"
              }}>🔄 Değiştir</button>
              <button onClick={handleSubmit} disabled={loading} style={{
                background: loading ? "#555" : "linear-gradient(135deg, #dc2626, #ef4444)",
                color: "white", border: "none", borderRadius: "10px",
                padding: "12px 40px", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 0 20px rgba(220,38,38,0.4)"
              }}>
                {loading ? "⏳ Video oluşturuluyor... (1-3 dk)" : "🎬 Videoya Dönüştür"}
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
              <button onClick={() => { setPreview(""); setImage(null); setVideoUrl(""); }} style={{
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