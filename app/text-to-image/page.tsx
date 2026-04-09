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
    else setError(data.error || "Bir hata oluştu");
    setLoading(false);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#080b14", color: "white", fontFamily: "'Segoe UI', sans-serif", paddingBottom: "60px" }}>
      <style>{`
        .tti-nav { padding: 18px 48px; }
        .tti-container { max-width: 800px; margin: 0 auto; padding: 40px 24px; }
        .tti-title { font-size: 48px; }
        .tti-textarea { font-size: 16px; padding: 16px; }
        @media (max-width: 768px) {
          .tti-nav { padding: 14px 16px !important; }
          .tti-container { padding: 24px 16px !important; }
          .tti-title { font-size: 30px !important; }
          .tti-examples { gap: 6px !important; }
          .tti-btns { flex-direction: column !important; }
          .tti-btns a, .tti-btns button { text-align: center !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav className="tti-nav" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(8,11,20,0.9)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>✨</div>
          <a href="/" style={{ fontSize: "20px", fontWeight: "800", color: "white", textDecoration: "none" }}>PixelAI</a>
        </div>
        <a href="/" style={{ color: "#a78bfa", textDecoration: "none", fontSize: "14px", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "8px", padding: "7px 14px" }}>← Geri Dön</a>
      </nav>

      <div className="tti-container">

        {/* Başlık */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(5,150,105,0.15)", border: "1px solid rgba(5,150,105,0.3)", borderRadius: "999px", padding: "6px 16px", fontSize: "12px", color: "#10b981", marginBottom: "20px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
            AI Destekli — Görsel Oluşturma
          </div>
          <h1 className="tti-title" style={{ fontWeight: "900", marginBottom: "12px", letterSpacing: "-1.5px", background: "linear-gradient(135deg, #fff 0%, #e2e8f0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI Resim Oluştur</h1>
          <p style={{ color: "#6b7280", fontSize: "17px" }}>Ne hayal ediyorsan yaz, yapay zeka resme dönüştürsün</p>
        </div>

        {/* Hata */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "16px", padding: "16px 24px", marginBottom: "24px", textAlign: "center", color: "#f87171", fontSize: "14px" }}>
            ❌ {error}
          </div>
        )}

        {/* Form */}
        {!result && (
          <div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px", marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#9ca3af", marginBottom: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>Prompt</label>
              <textarea
                className="tti-textarea"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Hayal ettiğin sahneyi detaylıca yaz..."
                rows={4}
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", resize: "none", boxSizing: "border-box", fontFamily: "'Segoe UI', sans-serif", outline: "none" }}
              />
            </div>

            {/* Örnek Promptlar */}
            <div style={{ marginBottom: "28px" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: "#6b7280", marginBottom: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>💡 Örnek Promptlar</p>
              <div className="tti-examples" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {examples.map(ex => (
                  <button key={ex} onClick={() => setPrompt(ex)}
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 14px", color: "#9ca3af", fontSize: "12px", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(16,185,129,0.1)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(16,185,129,0.3)"; (e.currentTarget as HTMLButtonElement).style.color = "#10b981"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af"; }}
                  >{ex}</button>
                ))}
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button onClick={handleSubmit} disabled={loading || !prompt.trim()}
                style={{ background: loading || !prompt.trim() ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #059669, #10b981)", color: loading || !prompt.trim() ? "#6b7280" : "white", border: "none", borderRadius: "12px", padding: "15px 48px", fontSize: "16px", fontWeight: "700", cursor: loading || !prompt.trim() ? "not-allowed" : "pointer", boxShadow: loading || !prompt.trim() ? "none" : "0 0 30px rgba(5,150,105,0.3)" }}>
                {loading ? "⏳ Oluşturuluyor... (30-60 sn)" : "🖼️ Resim Oluştur"}
              </button>
            </div>
          </div>
        )}

        {/* Sonuç */}
        {result && (
          <div style={{ textAlign: "center" }}>
            <div style={{ background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.3)", borderRadius: "20px", padding: "12px", marginBottom: "24px", display: "inline-block", maxWidth: "100%" }}>
              <img src={result} style={{ maxWidth: "100%", borderRadius: "12px", display: "block" }} />
            </div>
            <div style={{ marginBottom: "16px", color: "#6b7280", fontSize: "13px" }}>
              💬 Prompt: <span style={{ color: "#9ca3af", fontStyle: "italic" }}>"{prompt}"</span>
            </div>
            <div className="tti-btns" style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => { setResult(""); setPrompt(""); }}
                style={{ background: "rgba(255,255,255,0.05)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)", borderRadius: "12px", padding: "13px 28px", fontSize: "15px", cursor: "pointer", fontWeight: "600" }}>
                🔄 Yeni Resim
              </button>
              <button onClick={() => { setResult(""); }}
                style={{ background: "rgba(255,255,255,0.05)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px", padding: "13px 28px", fontSize: "15px", cursor: "pointer", fontWeight: "600" }}>
                ✏️ Prompt Düzenle
              </button>
              <a href={result} download="pixelai-image.png"
                style={{ background: "linear-gradient(135deg, #059669, #10b981)", color: "white", padding: "13px 36px", borderRadius: "12px", textDecoration: "none", fontSize: "15px", fontWeight: "700", boxShadow: "0 0 24px rgba(5,150,105,0.3)" }}>
                ⬇️ İndir
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}