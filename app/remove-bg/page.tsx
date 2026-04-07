"use client";
import { useState } from "react";

export default function RemoveBg() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult("");
    }
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

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0d1117 100%)", color: "white", fontFamily: "sans-serif", padding: "40px 20px" }}>
      
      {/* Üst bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "900px", margin: "0 auto 40px auto" }}>
        <a href="/" style={{ color: "#a78bfa", textDecoration: "none", fontSize: "16px" }}>← Ana Sayfa</a>
        <h1 style={{ fontSize: "24px", fontWeight: "800" }}>✨ PixelAI</h1>
        <div style={{ width: "80px" }}/>
      </div>

      {/* İçerik */}
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "800", marginBottom: "12px" }}>🖼️ Arka Plan Kaldır</h2>
          <p style={{ color: "#a78bfa", fontSize: "18px" }}>Fotoğrafını yükle, yapay zeka arka planı saniyeler içinde siler</p>
        </div>

        {/* Yükleme alanı */}
        {!preview && (
          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed #a78bfa", borderRadius: "16px", padding: "60px 20px", cursor: "pointer", background: "rgba(167,139,250,0.05)" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📸</div>
            <p style={{ fontSize: "18px", marginBottom: "8px" }}>Fotoğraf yüklemek için tıkla</p>
            <p style={{ color: "#888", fontSize: "14px" }}>PNG, JPG, WEBP desteklenir</p>
            <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          </label>
        )}

        {/* Önizleme ve Sonuç */}
        {preview && (
          <div>
            <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap", marginBottom: "32px" }}>
              <div style={{ flex: 1, minWidth: "280px", maxWidth: "420px" }}>
                <p style={{ color: "#888", marginBottom: "12px", textAlign: "center", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Orijinal</p>
                <img src={preview} style={{ width: "100%", borderRadius: "12px", border: "1px solid #333" }} />
              </div>
              {result && (
                <div style={{ flex: 1, minWidth: "280px", maxWidth: "420px" }}>
                  <p style={{ color: "#888", marginBottom: "12px", textAlign: "center", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Sonuç</p>
                  <img src={result} style={{ width: "100%", borderRadius: "12px", border: "1px solid #333", background: "repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 0 0 / 20px 20px" }} />
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => { setPreview(""); setResult(""); setImage(null); }}
                style={{ background: "transparent", color: "#a78bfa", border: "1px solid #a78bfa", borderRadius: "10px", padding: "12px 24px", fontSize: "16px", cursor: "pointer" }}>
                🔄 Yeni Fotoğraf
              </button>

              {!result && (
                <button onClick={handleSubmit} disabled={loading}
                  style={{ background: loading ? "#555" : "#7c3aed", color: "white", border: "none", borderRadius: "10px", padding: "12px 32px", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer", minWidth: "200px" }}>
                  {loading ? "⏳ İşleniyor..." : "✨ Arka Planı Kaldır"}
                </button>
              )}

              {result && (
                <a href={result} download="pixelai-result.png"
                  style={{ background: "#059669", color: "white", padding: "12px 32px", borderRadius: "10px", textDecoration: "none", fontSize: "16px" }}>
                  ⬇️ İndir
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}