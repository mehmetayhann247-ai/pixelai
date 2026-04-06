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
    <main style={{ minHeight: "100vh", background: "#0f0f1a", color: "white", fontFamily: "sans-serif", padding: "40px 20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "40px", marginBottom: "8px" }}>🖼️ Arka Plan Kaldır</h1>
      <p style={{ color: "#a78bfa", marginBottom: "32px" }}>Fotoğrafını yükle, AI arka planı siler</p>

      <input type="file" accept="image/*" onChange={handleFile}
        style={{ marginBottom: "24px", color: "white" }} />

      {preview && (
        <div style={{ display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap", marginBottom: "24px" }}>
          <div>
            <p style={{ color: "#888", marginBottom: "8px" }}>Orijinal</p>
            <img src={preview} style={{ maxWidth: "300px", borderRadius: "12px" }} />
          </div>
          {result && (
            <div>
              <p style={{ color: "#888", marginBottom: "8px" }}>Sonuç</p>
              <img src={result} style={{ maxWidth: "300px", borderRadius: "12px", background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 0 0 / 20px 20px" }} />
            </div>
          )}
        </div>
      )}

      {preview && (
        <button onClick={handleSubmit} disabled={loading}
          style={{ background: loading ? "#555" : "#7c3aed", color: "white", border: "none", borderRadius: "12px", padding: "14px 36px", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "⏳ İşleniyor..." : "✨ Arka Planı Kaldır"}
        </button>
      )}

      {result && (
        <div style={{ marginTop: "24px" }}>
          <a href={result} download="pixelai-result.png"
            style={{ background: "#059669", color: "white", padding: "12px 28px", borderRadius: "12px", textDecoration: "none" }}>
            ⬇️ İndir
          </a>
        </div>
      )}
    </main>
  );
}