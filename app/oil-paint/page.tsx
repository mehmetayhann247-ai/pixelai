"use client";
import { useState } from "react";

export default function OilPaint() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (file: File) => { setImage(file); setPreview(URL.createObjectURL(file)); setResult(""); setError(""); };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true); setError("");
    const formData = new FormData();
    formData.append("image", image);
    formData.append("style", "oil-paint");
    const res = await fetch("/api/stylize", { method: "POST", body: formData });
    const data = await res.json();
    if (data.image) setResult(data.image);
    else setError("❌ " + (data.error || "Bir hata oluştu"));
    setLoading(false);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#080b14", color: "white", fontFamily: "sans-serif", padding: "0 0 60px" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(8,11,20,0.9)" }}>
        <a href="/" style={{ fontSize: "20px", fontWeight: "800", color: "white", textDecoration: "none" }}>✨ PixelAI</a>
        <a href="/" style={{ color: "#a78bfa", textDecoration: "none", fontSize: "14px" }}>← Ana Sayfaya Dön</a>
      </nav>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-block", background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: "999px", padding: "6px 18px", fontSize: "13px", color: "#f472b6", marginBottom: "16px" }}>🎭 AI Destekli</div>
          <h1 style={{ fontSize: "40px", fontWeight: "900", marginBottom: "12px" }}>Yağlı Boya Efekti</h1>
          <p style={{ color: "#9ca3af", fontSize: "17px" }}>Fotoğrafını ünlü ressam stiline dönüştür</p>
        </div>
        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: "16px", padding: "16px", marginBottom: "24px", textAlign: "center", color: "#f87171" }}>{error}</div>}
        {!preview && (
          <div onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }} onDragOver={e => e.preventDefault()}
            style={{ border: "2px dashed #333", borderRadius: "20px", padding: "80px 20px", textAlign: "center", background: "rgba(255,255,255,0.02)", cursor: "pointer" }}>
            <div style={{ fontSize: "56px", marginBottom: "20px" }}>🎭</div>
            <p style={{ fontSize: "20px", fontWeight: "600", marginBottom: "24px" }}>Fotoğrafı sürükle bırak veya seç</p>
            <label style={{ background: "#ec4899", color: "white", padding: "12px 32px", borderRadius: "10px", cursor: "pointer", fontSize: "16px" }}>
              Fotoğraf Seç
              <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} style={{ display: "none" }} />
            </label>
          </div>
        )}
        {preview && (
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap", marginBottom: "24px" }}>
              <div style={{ flex: 1, minWidth: "250px" }}>
                <p style={{ color: "#9ca3af", marginBottom: "8px", fontSize: "13px" }}>ORİJİNAL</p>
                <img src={preview} style={{ width: "100%", borderRadius: "12px", border: "1px solid #333" }} />
              </div>
              {result && (
                <div style={{ flex: 1, minWidth: "250px" }}>
                  <p style={{ color: "#f472b6", marginBottom: "8px", fontSize: "13px" }}>YAĞLI BOYA</p>
                  <img src={result} style={{ width: "100%", borderRadius: "12px", border: "1px solid #ec4899" }} />
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => { setPreview(""); setImage(null); setResult(""); }} style={{ background: "transparent", color: "#f472b6", border: "1px solid #ec4899", borderRadius: "10px", padding: "12px 24px", fontSize: "16px", cursor: "pointer" }}>🔄 Yeni Fotoğraf</button>
              {!result && <button onClick={handleSubmit} disabled={loading} style={{ background: loading ? "#555" : "linear-gradient(135deg, #ec4899, #f472b6)", color: "white", border: "none", borderRadius: "10px", padding: "12px 40px", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer" }}>{loading ? "⏳ Dönüştürülüyor..." : "🎭 Yağlı Boya Yap"}</button>}
              {result && <a href={result} download="pixelai-oilpaint.png" style={{ background: "linear-gradient(135deg, #059669, #10b981)", color: "white", padding: "12px 32px", borderRadius: "10px", textDecoration: "none", fontSize: "16px" }}>⬇️ İndir</a>}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}