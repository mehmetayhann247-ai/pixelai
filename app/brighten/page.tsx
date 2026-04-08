"use client";
import { useState } from "react";

export default function Brighten() {
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
    const res = await fetch("/api/brighten", { method: "POST", body: formData });
    const data = await res.json();
    if (data.image) setResult(data.image);
    else setError("❌ " + (data.error || "Bir hata oluştu"));
    setLoading(false);
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0d1117 100%)", color: "white", fontFamily: "sans-serif", padding: "0 0 60px" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", borderBottom: "1px solid rgba(167,139,250,0.15)", background: "rgba(15,15,26,0.8)" }}>
        <a href="/" style={{ fontSize: "20px", fontWeight: "800", color: "white", textDecoration: "none" }}>✨ PixelAI</a>
        <a href="/" style={{ color: "#a78bfa", textDecoration: "none", fontSize: "14px" }}>← Ana Sayfaya Dön</a>
      </nav>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-block", background: "rgba(234,179,8,0.2)", border: "1px solid #eab308", borderRadius: "999px", padding: "6px 18px", fontSize: "13px", color: "#fbbf24", marginBottom: "16px" }}>🌙 AI Destekli</div>
          <h1 style={{ fontSize: "40px", fontWeight: "900", marginBottom: "12px" }}>Gece Fotoğrafı Aydınlat</h1>
          <p style={{ color: "#9ca3af", fontSize: "17px" }}>Karanlık ve gece fotoğraflarını AI ile aydınlat</p>
        </div>
        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: "16px", padding: "16px", marginBottom: "24px", textAlign: "center", color: "#f87171" }}>{error}</div>}
        {!preview && (
          <div onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }} onDragOver={e => e.preventDefault()}
            style={{ border: "2px dashed #444", borderRadius: "20px", padding: "80px 20px", textAlign: "center", background: "rgba(255,255,255,0.02)", cursor: "pointer" }}>
            <div style={{ fontSize: "56px", marginBottom: "20px" }}>🌙</div>
            <p style={{ fontSize: "20px", fontWeight: "600", marginBottom: "24px" }}>Karanlık fotoğrafı sürükle bırak veya seç</p>
            <label style={{ background: "#eab308", color: "black", padding: "12px 32px", borderRadius: "10px", cursor: "pointer", fontSize: "16px" }}>
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
                  <p style={{ color: "#fbbf24", marginBottom: "8px", fontSize: "13px" }}>AYDINLATILMIŞ</p>
                  <img src={result} style={{ width: "100%", borderRadius: "12px", border: "1px solid #eab308" }} />
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => { setPreview(""); setImage(null); setResult(""); }} style={{ background: "transparent", color: "#fbbf24", border: "1px solid #fbbf24", borderRadius: "10px", padding: "12px 24px", fontSize: "16px", cursor: "pointer" }}>🔄 Yeni Fotoğraf</button>
              {!result && <button onClick={handleSubmit} disabled={loading} style={{ background: loading ? "#555" : "linear-gradient(135deg, #eab308, #fbbf24)", color: "black", border: "none", borderRadius: "10px", padding: "12px 40px", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer" }}>{loading ? "⏳ Aydınlatılıyor..." : "🌙 Aydınlat"}</button>}
              {result && <a href={result} download="pixelai-brightened.png" style={{ background: "linear-gradient(135deg, #059669, #10b981)", color: "white", padding: "12px 32px", borderRadius: "10px", textDecoration: "none", fontSize: "16px" }}>⬇️ İndir</a>}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}