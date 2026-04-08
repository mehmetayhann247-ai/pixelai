"use client";
import { useState } from "react";

export default function TextToImage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const examples = ["Uzayda yüzen bir astronot, dijital sanat", "Orman içinde gizli bir şato, fantastik", "Neon ışıklı siber punk şehir, gece", "Okyanus altında balık ve mercanlar"];

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true); setError(""); setResult("");
    const res = await fetch("/api/text-to-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
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
          <div style={{ display: "inline-block", background: "rgba(5,150,105,0.2)", border: "1px solid #059669", borderRadius: "999px", padding: "6px 18px", fontSize: "13px", color: "#10b981", marginBottom: "16px" }}>🖼️ AI Destekli</div>
          <h1 style={{ fontSize: "40px", fontWeight: "900", marginBottom: "12px" }}>AI Resim Oluştur</h1>
          <p style={{ color: "#9ca3af", fontSize: "17px" }}>Ne hayal ediyorsan yaz, AI resme dönüştürsün</p>
        </div>
        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: "16px", padding: "16px", marginBottom: "24px", textAlign: "center", color: "#f87171" }}>{error}</div>}
        {!result && (
          <div>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Hayal ettiğin sahneyi yaz..." rows={4}
              style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid #444", borderRadius: "16px", padding: "16px", color: "white", fontSize: "16px", resize: "none", boxSizing: "border-box", fontFamily: "sans-serif", marginBottom: "16px" }} />
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "12px" }}>💡 Örnek promptlar:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {examples.map(ex => (
                  <button key={ex} onClick={() => setPrompt(ex)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #333", borderRadius: "8px", padding: "8px 14px", color: "#9ca3af", fontSize: "13px", cursor: "pointer" }}>{ex}</button>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <button onClick={handleSubmit} disabled={loading || !prompt.trim()} style={{ background: loading ? "#555" : "linear-gradient(135deg, #059669, #10b981)", color: "white", border: "none", borderRadius: "12px", padding: "16px 48px", fontSize: "18px", cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "⏳ Oluşturuluyor... (30-60 sn)" : "🖼️ Resim Oluştur"}
              </button>
            </div>
          </div>
        )}
        {result && (
          <div style={{ textAlign: "center" }}>
            <img src={result} style={{ maxWidth: "100%", borderRadius: "16px", border: "1px solid #333", marginBottom: "24px" }} />
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => setResult("")} style={{ background: "transparent", color: "#a78bfa", border: "1px solid #a78bfa", borderRadius: "10px", padding: "12px 24px", fontSize: "16px", cursor: "pointer" }}>🔄 Yeni Resim</button>
              <a href={result} download="pixelai-image.png" style={{ background: "linear-gradient(135deg, #059669, #10b981)", color: "white", padding: "12px 32px", borderRadius: "10px", textDecoration: "none", fontSize: "16px" }}>⬇️ İndir</a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}