"use client";
import { useState } from "react";

export default function Sketch() {
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
    formData.append("style", "sketch");
    const res = await fetch("/api/stylize", { method: "POST", body: formData });
    const data = await res.json();
    if (data.image) setResult(data.image);
    else setError(data.error || "Bir hata oluştu");
    setLoading(false);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#080b14", color: "white", fontFamily: "'Segoe UI', sans-serif", paddingBottom: "60px" }}>
      <style>{`.tool-nav{padding:18px 48px}.tool-container{max-width:900px;margin:0 auto;padding:40px 24px}.tool-title{font-size:48px}.tool-drop{padding:80px 20px}.tool-grid{display:flex;gap:24px;justify-content:center;flex-wrap:wrap;margin-bottom:24px}.tool-col{flex:1;min-width:280px;max-width:420px}@media(max-width:768px){.tool-nav{padding:14px 16px!important}.tool-container{padding:24px 16px!important}.tool-title{font-size:30px!important}.tool-drop{padding:48px 16px!important}.tool-col{min-width:100%!important}.tool-btns{flex-direction:column!important}.tool-btns a,.tool-btns button{text-align:center!important}}`}</style>
      <nav className="tool-nav" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(8,11,20,0.9)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>✨</div>
          <a href="/" style={{ fontSize: "20px", fontWeight: "800", color: "white", textDecoration: "none" }}>PixelAI</a>
        </div>
        <a href="/" style={{ color: "#a78bfa", textDecoration: "none", fontSize: "14px", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "8px", padding: "7px 14px" }}>← Geri Dön</a>
      </nav>
      <div className="tool-container">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(156,163,175,0.15)", border: "1px solid rgba(156,163,175,0.3)", borderRadius: "999px", padding: "6px 16px", fontSize: "12px", color: "#d1d5db", marginBottom: "20px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#d1d5db", display: "inline-block" }}></span>
            AI Destekli — Karakalem Stili
          </div>
          <h1 className="tool-title" style={{ fontWeight: "900", marginBottom: "12px", letterSpacing: "-1.5px", background: "linear-gradient(135deg, #fff 0%, #e2e8f0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Karakalem Çizim</h1>
          <p style={{ color: "#6b7280", fontSize: "17px" }}>Fotoğrafını sanatsal karakalem çizimine dönüştür</p>
        </div>
        {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "16px", padding: "16px 24px", marginBottom: "24px", textAlign: "center", color: "#f87171", fontSize: "14px" }}>❌ {error}</div>}
        {!preview && (
          <div onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }} onDragOver={e => e.preventDefault()} className="tool-drop"
            style={{ border: "2px dashed rgba(255,255,255,0.1)", borderRadius: "24px", textAlign: "center", background: "rgba(255,255,255,0.02)", cursor: "pointer" }}>
            <div style={{ fontSize: "56px", marginBottom: "20px" }}>🖋️</div>
            <p style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Fotoğrafı sürükle bırak</p>
            <p style={{ color: "#4b5563", marginBottom: "28px" }}>veya bilgisayarından seç</p>
            <label style={{ background: "linear-gradient(135deg, #4b5563, #9ca3af)", color: "white", padding: "13px 36px", borderRadius: "12px", cursor: "pointer", fontSize: "16px", fontWeight: "700", boxShadow: "0 0 30px rgba(75,85,99,0.3)" }}>
              Fotoğraf Seç
              <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} style={{ display: "none" }} />
            </label>
          </div>
        )}
        {preview && (
          <div>
            <div className="tool-grid">
              <div className="tool-col">
                <p style={{ color: "#6b7280", marginBottom: "10px", textAlign: "center", fontSize: "12px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>Orijinal</p>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "8px" }}>
                  <img src={preview} style={{ width: "100%", borderRadius: "10px", display: "block" }} />
                </div>
              </div>
              {result && (
                <div className="tool-col">
                  <p style={{ color: "#d1d5db", marginBottom: "10px", textAlign: "center", fontSize: "12px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>Karakalem ✨</p>
                  <div style={{ background: "rgba(156,163,175,0.08)", border: "1px solid rgba(156,163,175,0.3)", borderRadius: "16px", padding: "8px" }}>
                    <img src={result} style={{ width: "100%", borderRadius: "10px", display: "block" }} />
                  </div>
                </div>
              )}
            </div>
            <div className="tool-btns" style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => { setPreview(""); setImage(null); setResult(""); }} style={{ background: "rgba(255,255,255,0.05)", color: "#d1d5db", border: "1px solid rgba(156,163,175,0.3)", borderRadius: "12px", padding: "13px 28px", fontSize: "15px", cursor: "pointer", fontWeight: "600" }}>🔄 Yeni Fotoğraf</button>
              {!result && <button onClick={handleSubmit} disabled={loading} style={{ background: loading ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #4b5563, #9ca3af)", color: loading ? "#6b7280" : "white", border: "none", borderRadius: "12px", padding: "13px 40px", fontSize: "15px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "700" }}>{loading ? "⏳ Dönüştürülüyor..." : "🖋️ Karakaleme Dönüştür"}</button>}
              {result && <a href={result} download="pixelai-sketch.png" style={{ background: "linear-gradient(135deg, #059669, #10b981)", color: "white", padding: "13px 36px", borderRadius: "12px", textDecoration: "none", fontSize: "15px", fontWeight: "700" }}>⬇️ İndir</a>}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}