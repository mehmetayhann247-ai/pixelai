"use client";
import { useState, useRef } from "react";
import { supabase } from "../lib/supabase";

export default function RemoveBg() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [limitError, setLimitError] = useState("");
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleFile = (file: File) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult("");
    setLimitError("");
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
    setLimitError("");

    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    const formData = new FormData();
    formData.append("image", image);
    if (userId) formData.append("userId", userId);

    const res = await fetch("/api/remove-bg", { method: "POST", body: formData });
    const data = await res.json();

    if (data.limitReached) {
      setLimitError(data.error);
      setLoading(false);
      return;
    }

    if (data.image) {
      setResult(`data:image/png;base64,${data.image}`);
      if (userId) {
        await supabase.from("operations").insert({ user_id: userId, type: "remove-bg" });
      }
    }
    setLoading(false);
  };

  const handleSliderMove = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pos = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(pos, 0), 100));
  };

  return (
    <main style={{ minHeight: "100vh", background: "#080b14", color: "white", fontFamily: "'Segoe UI', sans-serif", paddingBottom: "60px" }}>
      <style>{`
        .rb-nav { padding: 18px 48px; }
        .rb-container { max-width: 900px; margin: 0 auto; padding: 40px 24px; }
        .rb-title { font-size: 48px; }
        .rb-drop { padding: 80px 20px; }
        @media (max-width: 768px) {
          .rb-nav { padding: 14px 16px !important; }
          .rb-nav-back { font-size: 12px !important; }
          .rb-container { padding: 24px 16px !important; }
          .rb-title { font-size: 30px !important; }
          .rb-subtitle { font-size: 14px !important; }
          .rb-drop { padding: 48px 16px !important; }
          .rb-drop-icon { font-size: 40px !important; }
          .rb-btn-group { flex-direction: column !important; }
          .rb-btn-group a, .rb-btn-group button { text-align: center !important; justify-content: center !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav className="rb-nav" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,11,20,0.9)", backdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>✨</div>
          <a href="/" style={{ fontSize: "20px", fontWeight: "800", color: "white", textDecoration: "none", letterSpacing: "-0.5px" }}>PixelAI</a>
        </div>
        <a href="/" className="rb-nav-back" style={{ color: "#a78bfa", textDecoration: "none", fontSize: "14px", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "8px", padding: "7px 14px" }}>← Geri Dön</a>
      </nav>

      <div className="rb-container">

        {/* Başlık */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "999px", padding: "6px 16px", fontSize: "12px", color: "#a78bfa", marginBottom: "20px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#a78bfa", display: "inline-block" }}></span>
            AI Destekli — Ücretsiz
          </div>
          <h1 className="rb-title" style={{ fontWeight: "900", marginBottom: "12px", letterSpacing: "-1.5px", background: "linear-gradient(135deg, #fff 0%, #e2e8f0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Arka Plan Kaldır
          </h1>
          <p className="rb-subtitle" style={{ color: "#6b7280", fontSize: "17px", marginBottom: "16px" }}>
            Fotoğrafını yükle, yapay zeka arka planı saniyeler içinde siler
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)", borderRadius: "10px", padding: "8px 16px", fontSize: "13px", color: "#fbbf24" }}>
            💡 En iyi sonuç için tek kişi, hayvan veya ürün fotoğrafı kullanın
          </div>
        </div>

        {/* Limit Hatası */}
        {limitError && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "16px", padding: "24px", marginBottom: "24px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>🚫</div>
            <div style={{ fontWeight: "700", marginBottom: "12px", fontSize: "16px" }}>{limitError}</div>
            <a href="/pricing" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white", padding: "10px 28px", borderRadius: "10px", textDecoration: "none", fontSize: "14px", fontWeight: "700", display: "inline-block" }}>💎 Pro'ya Geç →</a>
          </div>
        )}

        {/* Yükleme Alanı */}
        {!preview && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            className="rb-drop"
            style={{
              border: `2px dashed ${dragOver ? "#7c3aed" : "rgba(255,255,255,0.1)"}`,
              borderRadius: "24px", textAlign: "center",
              background: dragOver ? "rgba(124,58,237,0.08)" : "rgba(255,255,255,0.02)",
              transition: "all 0.2s", cursor: "pointer"
            }}
          >
            <div className="rb-drop-icon" style={{ fontSize: "56px", marginBottom: "20px" }}>📸</div>
            <p style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Fotoğrafı sürükle bırak</p>
            <p style={{ color: "#4b5563", marginBottom: "28px", fontSize: "15px" }}>veya bilgisayarından seç</p>
            <label style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white", padding: "13px 36px", borderRadius: "12px", cursor: "pointer", fontSize: "16px", fontWeight: "700", boxShadow: "0 0 30px rgba(124,58,237,0.3)" }}>
              Fotoğraf Seç
              <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} style={{ display: "none" }} />
            </label>
            <p style={{ color: "#374151", fontSize: "12px", marginTop: "20px" }}>PNG, JPG, WEBP — Maks 10MB</p>
          </div>
        )}

        {/* Önizleme */}
        {preview && !result && (
          <div style={{ textAlign: "center" }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "20px", marginBottom: "24px", display: "inline-block", maxWidth: "100%" }}>
              <img src={preview} style={{ maxWidth: "100%", maxHeight: "400px", borderRadius: "12px", display: "block" }} />
            </div>
            <div className="rb-btn-group" style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => { setPreview(""); setImage(null); }} style={{ background: "rgba(255,255,255,0.05)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)", borderRadius: "12px", padding: "13px 28px", fontSize: "15px", cursor: "pointer", fontWeight: "600" }}>
                🔄 Değiştir
              </button>
              <button onClick={handleSubmit} disabled={loading} style={{ background: loading ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #7c3aed, #4f46e5)", color: loading ? "#6b7280" : "white", border: "none", borderRadius: "12px", padding: "13px 40px", fontSize: "15px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "700", boxShadow: loading ? "none" : "0 0 30px rgba(124,58,237,0.35)" }}>
                {loading ? "⏳ İşleniyor..." : "✨ Arka Planı Kaldır"}
              </button>
            </div>
          </div>
        )}

        {/* Sonuç — Önce/Sonra Karşılaştırma */}
        {result && (
          <div>
            <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "16px", fontSize: "13px" }}>
              🖱️ Kaydırıcıyı sürükle — önce/sonra karşılaştır
            </p>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "4px", marginBottom: "20px" }}>
              <div
                ref={sliderRef}
                onMouseMove={handleSliderMove}
                style={{ position: "relative", borderRadius: "16px", overflow: "hidden", cursor: "ew-resize", userSelect: "none" }}
              >
                <img src={result} style={{ width: "100%", maxHeight: "500px", objectFit: "contain", display: "block", background: "repeating-conic-gradient(#1a1a2e 0% 25%, #0d0d1a 0% 50%) 0 0 / 20px 20px" }} />
                <div style={{ position: "absolute", top: 0, left: 0, width: `${sliderPos}%`, height: "100%", overflow: "hidden" }}>
                  <img src={preview} style={{ width: sliderRef.current?.offsetWidth + "px", maxHeight: "500px", objectFit: "contain", maxWidth: "none", display: "block" }} />
                </div>
                <div style={{ position: "absolute", top: 0, left: `${sliderPos}%`, transform: "translateX(-50%)", width: "2px", height: "100%", background: "rgba(255,255,255,0.8)", boxShadow: "0 0 12px rgba(0,0,0,0.5)" }}>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "36px", height: "36px", background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", boxShadow: "0 2px 16px rgba(0,0,0,0.4)" }}>↔️</div>
                </div>
                <div style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(0,0,0,0.7)", borderRadius: "6px", padding: "4px 10px", fontSize: "11px", fontWeight: "600" }}>Orijinal</div>
                <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(124,58,237,0.9)", borderRadius: "6px", padding: "4px 10px", fontSize: "11px", fontWeight: "600" }}>Sonuç</div>
              </div>
            </div>
            <div className="rb-btn-group" style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => { setPreview(""); setResult(""); setImage(null); }} style={{ background: "rgba(255,255,255,0.05)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)", borderRadius: "12px", padding: "13px 28px", fontSize: "15px", cursor: "pointer", fontWeight: "600" }}>
                🔄 Yeni Fotoğraf
              </button>
              <a href={result} download="pixelai-nobg.png" style={{ background: "linear-gradient(135deg, #059669, #10b981)", color: "white", padding: "13px 36px", borderRadius: "12px", textDecoration: "none", fontSize: "15px", fontWeight: "700", boxShadow: "0 0 24px rgba(5,150,105,0.3)" }}>
                ⬇️ İndir
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}