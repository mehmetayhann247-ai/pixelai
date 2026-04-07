"use client";
import { useState, useRef } from "react";

export default function RemoveBg() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleFile = (file: File) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    const res = await fetch("/api/remove-bg", { method: "POST", body: formData });
    const data = await res.json();
    if (data.image) setResult(`data:image/png;base64,${data.image}`);
    setLoading(false);
  };

  const handleSliderMove = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pos = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(pos, 0), 100));
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0d1117 100%)",
      color: "white", fontFamily: "'Segoe UI', sans-serif", padding: "0 0 60px"
    }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 40px", borderBottom: "1px solid rgba(167,139,250,0.15)",
        background: "rgba(15,15,26,0.8)", backdropFilter: "blur(10px)"
      }}>
        <a href="/" style={{ fontSize: "20px", fontWeight: "800", color: "white", textDecoration: "none" }}>✨ PixelAI</a>
        <a href="/" style={{ color: "#a78bfa", textDecoration: "none", fontSize: "14px" }}>← Ana Sayfaya Dön</a>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>

        {/* Başlık */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{
            display: "inline-block", background: "rgba(124,58,237,0.2)",
            border: "1px solid #7c3aed", borderRadius: "999px",
            padding: "6px 18px", fontSize: "13px", color: "#a78bfa", marginBottom: "16px"
          }}>🖼️ AI Destekli</div>
          <h1 style={{ fontSize: "40px", fontWeight: "900", marginBottom: "12px" }}>Arka Plan Kaldır</h1>
          <p style={{ color: "#9ca3af", fontSize: "17px" }}>Fotoğrafını yükle, yapay zeka arka planı saniyeler içinde siler</p>
        </div>

        {/* Yükleme alanı */}
        {!preview && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            style={{
              border: `2px dashed ${dragOver ? "#a78bfa" : "#444"}`,
              borderRadius: "20px", padding: "80px 20px", textAlign: "center",
              background: dragOver ? "rgba(167,139,250,0.08)" : "rgba(255,255,255,0.02)",
              transition: "all 0.2s", cursor: "pointer"
            }}
          >
            <div style={{ fontSize: "56px", marginBottom: "20px" }}>📸</div>
            <p style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>Fotoğrafı sürükle bırak</p>
            <p style={{ color: "#666", marginBottom: "24px" }}>veya</p>
            <label style={{
              background: "#7c3aed", color: "white", padding: "12px 32px",
              borderRadius: "10px", cursor: "pointer", fontSize: "16px"
            }}>
              Bilgisayardan Seç
              <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} style={{ display: "none" }} />
            </label>
            <p style={{ color: "#555", fontSize: "13px", marginTop: "16px" }}>PNG, JPG, WEBP — Maks 10MB</p>
          </div>
        )}

        {/* Önizleme */}
        {preview && !result && (
          <div style={{ textAlign: "center" }}>
            <img src={preview} style={{ maxWidth: "100%", maxHeight: "400px", borderRadius: "16px", border: "1px solid #333", marginBottom: "32px" }} />
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => { setPreview(""); setImage(null); }} style={{
                background: "transparent", color: "#a78bfa", border: "1px solid #a78bfa",
                borderRadius: "10px", padding: "12px 24px", fontSize: "16px", cursor: "pointer"
              }}>🔄 Değiştir</button>
              <button onClick={handleSubmit} disabled={loading} style={{
                background: loading ? "#555" : "linear-gradient(135deg, #7c3aed, #a855f7)",
                color: "white", border: "none", borderRadius: "10px",
                padding: "12px 40px", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 0 20px rgba(124,58,237,0.4)"
              }}>
                {loading ? "⏳ İşleniyor..." : "✨ Arka Planı Kaldır"}
              </button>
            </div>
          </div>
        )}

        {/* Önce / Sonra Karşılaştırma */}
        {result && (
          <div>
            <p style={{ textAlign: "center", color: "#a78bfa", marginBottom: "16px", fontSize: "14px" }}>
              🖱️ Kaydırıcıyı sürükle — önce/sonra karşılaştır
            </p>
            <div
              ref={sliderRef}
              onMouseMove={handleSliderMove}
              style={{ position: "relative", borderRadius: "16px", overflow: "hidden", cursor: "ew-resize", userSelect: "none", maxHeight: "500px" }}
            >
              {/* Sonuç (arka plan kaldırılmış) */}
              <img src={result} style={{ width: "100%", maxHeight: "500px", objectFit: "contain", display: "block", background: "repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 0 0 / 20px 20px" }} />

              {/* Orijinal — üstüne clip ile */}
              <div style={{ position: "absolute", top: 0, left: 0, width: `${sliderPos}%`, height: "100%", overflow: "hidden", background: "#111" }}>
  <img src={preview} style={{ width: sliderRef.current?.offsetWidth + "px", maxHeight: "500px", objectFit: "contain", maxWidth: "none", display: "block" }} />
</div>

              {/* Kaydırıcı çizgi */}
              <div style={{
                position: "absolute", top: 0, left: `${sliderPos}%`, transform: "translateX(-50%)",
                width: "3px", height: "100%", background: "white", boxShadow: "0 0 10px rgba(0,0,0,0.5)"
              }}>
                <div style={{
                  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                  width: "36px", height: "36px", background: "white", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.4)"
                }}>↔️</div>
              </div>

              {/* Etiketler */}
              <div style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(0,0,0,0.6)", borderRadius: "6px", padding: "4px 10px", fontSize: "12px" }}>Orijinal</div>
              <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(124,58,237,0.8)", borderRadius: "6px", padding: "4px 10px", fontSize: "12px" }}>Sonuç</div>
            </div>

            {/* Butonlar */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "24px", flexWrap: "wrap" }}>
              <button onClick={() => { setPreview(""); setResult(""); setImage(null); }} style={{
                background: "transparent", color: "#a78bfa", border: "1px solid #a78bfa",
                borderRadius: "10px", padding: "12px 24px", fontSize: "16px", cursor: "pointer"
              }}>🔄 Yeni Fotoğraf</button>
              <a href={result} download="pixelai-nobg.png" style={{
                background: "linear-gradient(135deg, #059669, #10b981)",
                color: "white", padding: "12px 32px", borderRadius: "10px",
                textDecoration: "none", fontSize: "16px",
                boxShadow: "0 0 20px rgba(5,150,105,0.3)"
              }}>⬇️ İndir</a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}