"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Pricing() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
  }, []);

  const handleSubscribe = async () => {
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    setLoading(true);
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, userEmail: user.email }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(false);
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0d1117 100%)",
      color: "white", fontFamily: "'Segoe UI', sans-serif"
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

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>

        {/* Başlık */}
        <h1 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "16px" }}>Fiyatlandırma</h1>
        <p style={{ color: "#9ca3af", fontSize: "18px", marginBottom: "60px" }}>
          İhtiyacına uygun planı seç
        </p>

        {/* Plan Kartları */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>

          {/* Ücretsiz Plan */}
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid #333",
            borderRadius: "20px", padding: "40px 32px"
          }}>
            <div style={{ fontSize: "16px", color: "#9ca3af", marginBottom: "8px" }}>Ücretsiz</div>
            <div style={{ fontSize: "48px", fontWeight: "900", marginBottom: "8px" }}>$0</div>
            <div style={{ color: "#555", marginBottom: "32px" }}>/ ay</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px", textAlign: "left" }}>
              {["Günde 3 işlem", "Arka plan kaldırma", "Standart hız", "Topluluk desteği"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "#10b981" }}>✓</span>
                  <span style={{ color: "#9ca3af", fontSize: "15px" }}>{f}</span>
                </div>
              ))}
            </div>
            <button style={{
              width: "100%", background: "transparent", color: "#9ca3af",
              border: "1px solid #444", borderRadius: "12px",
              padding: "14px", fontSize: "16px", cursor: "default"
            }}>Mevcut Plan</button>
          </div>

          {/* Pro Plan */}
          <div style={{
            background: "rgba(124,58,237,0.15)", border: "2px solid #7c3aed",
            borderRadius: "20px", padding: "40px 32px", position: "relative"
          }}>
            <div style={{
              position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
              background: "#7c3aed", borderRadius: "999px", padding: "4px 16px",
              fontSize: "13px", fontWeight: "700"
            }}>⭐ EN POPÜLER</div>
            <div style={{ fontSize: "16px", color: "#a78bfa", marginBottom: "8px" }}>Pro</div>
            <div style={{ fontSize: "48px", fontWeight: "900", marginBottom: "8px" }}>$9.99</div>
            <div style={{ color: "#a78bfa", marginBottom: "32px" }}>/ ay</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px", textAlign: "left" }}>
              {["Sınırsız işlem", "Arka plan kaldırma", "Fotoğraf netleştirme", "Öncelikli hız", "7/24 destek"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "#10b981" }}>✓</span>
                  <span style={{ fontSize: "15px" }}>{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleSubscribe}
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "#555" : "linear-gradient(135deg, #7c3aed, #a855f7)",
                color: "white", border: "none", borderRadius: "12px",
                padding: "14px", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 0 20px rgba(124,58,237,0.4)"
              }}>
              {loading ? "⏳ Yönlendiriliyor..." : "🚀 Pro'ya Geç"}
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}