"use client";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (u) {
        const { data: profile } = await supabase.from("profiles").select("is_pro").eq("id", u.id).single();
        setIsPro(profile?.is_pro ?? false);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const categories = [
    {
      title: "🖼️ Fotoğraf Araçları",
      desc: "Fotoğraflarını yapay zeka ile dönüştür",
      color: "#7c3aed",
      gradient: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.05))",
      border: "rgba(124,58,237,0.3)",
      tools: [
        { icon: "🖼️", title: "Arka Plan Kaldır", desc: "Saniyeler içinde arka planı sil", href: "/remove-bg", badge: "Ücretsiz" },
        { icon: "📸", title: "Fotoğraf Netleştir", desc: "Bulanık fotoğrafları 4x netleştir", href: "/enhance", badge: null },
        { icon: "🕰️", title: "Eski Fotoğraf Restore", desc: "Hasarlı fotoğrafları yenile", href: "/restore", badge: null },
        { icon: "🌙", title: "Gece Fotoğrafı Aydınlat", desc: "Karanlık kareleri aydınlat", href: "/brighten", badge: null },
      ]
    },
    {
      title: "🎨 Stil & Sanat",
      desc: "Fotoğrafını sanatsal stillere dönüştür",
      color: "#ec4899",
      gradient: "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(168,85,247,0.05))",
      border: "rgba(236,72,153,0.3)",
      tools: [
        { icon: "🎌", title: "Anime'ye Dönüştür", desc: "Japon anime stiline çevir", href: "/anime", badge: "Popüler" },
        { icon: "🎨", title: "Cartoon'a Dönüştür", desc: "Çizgi film efekti uygula", href: "/cartoon", badge: null },
        { icon: "🖼️", title: "AI Resim Oluştur", desc: "Yazıdan görsel oluştur", href: "/text-to-image", badge: "Yeni" },
        { icon: "🎭", title: "Yağlı Boya Efekti", desc: "Ünlü ressam stiline dönüştür", href: "/oil-paint", badge: "Yeni" },
        { icon: "🌊", title: "Suluboya Efekti", desc: "Suluboya sanat stiline çevir", href: "/watercolor", badge: null },
        { icon: "🖋️", title: "Karakalem Çizim", desc: "Fotoğrafını çizime dönüştür", href: "/sketch", badge: null },
        { icon: "🌃", title: "Gece Yarısı Sanat", desc: "Karanlık sanatsal efekt", href: "/midnight", badge: null },
        { icon: "🎪", title: "Pop Art Efekti", desc: "Andy Warhol tarzı efekt", href: "/popart", badge: null },
      ]
    },
    {
      title: "🎬 Video Araçları",
      desc: "Yapay zeka ile video oluştur",
      color: "#dc2626",
      gradient: "linear-gradient(135deg, rgba(220,38,38,0.15), rgba(251,146,60,0.05))",
      border: "rgba(220,38,38,0.3)",
      tools: [
        { icon: "🎬", title: "Resimden Video", desc: "Fotoğrafını videoya dönüştür", href: "/image-to-video", badge: "Pro" },
        { icon: "✍️", title: "Yazıdan Video", desc: "Hayal et, AI videonu yapsın", href: "/text-to-video", badge: "Pro" },
      ]
    },
  ];

  const stats = [
    { value: "14+", label: "AI Araç" },
    { value: "3", label: "Kategori" },
    { value: "∞", label: "Pro ile Sınırsız" },
    { value: "$9.99", label: "Aylık Pro" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#080b14", color: "white", fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        .px-nav { padding: 18px 48px; }
        .px-nav-email { display: inline; }
        .px-hero { padding: 100px 20px 80px; }
        .px-hero-title { font-size: clamp(40px, 6vw, 76px); }
        .px-hero-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 80px; }
        .px-hero-btn-main { padding: 16px 40px; font-size: 16px; width: auto; }
        .px-stats { display: flex; justify-content: center; max-width: 600px; margin: 0 auto; }
        .px-stats-item { flex: 1; padding: 20px 16px; border-right-width: 1px; border-bottom-width: 0; }
        .px-features { padding: 60px 40px 80px; }
        .px-tool-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
        .px-cta-section { padding: 0 40px 80px; }
        .px-cta-inner { padding: 48px; }
        .px-cta-title { font-size: 36px; }
        .px-cta-features { display: flex; gap: 32px; justify-content: center; margin-bottom: 32px; flex-wrap: wrap; }
        .px-footer { padding: 32px 40px; flex-direction: row; text-align: left; }
        .px-nav-links { display: flex; align-items: center; gap: 12px; }

        @media (max-width: 768px) {
          .px-nav { padding: 14px 16px !important; }
          .px-nav-email { display: none !important; }
          .px-nav-links { gap: 6px !important; }
          .px-nav-link-text { font-size: 11px !important; padding: 5px 8px !important; }
          .px-hero { padding: 60px 16px 40px !important; }
          .px-hero-title { letter-spacing: -1px !important; }
          .px-hero-btns { flex-direction: column !important; align-items: stretch !important; margin-bottom: 40px !important; }
          .px-hero-btn-main { width: 100% !important; box-sizing: border-box !important; }
          .px-hero-btn-sec { width: 100% !important; box-sizing: border-box !important; }
          .px-stats { flex-direction: column !important; }
          .px-stats-item { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.07) !important; padding: 14px 16px !important; }
          .px-features { padding: 32px 16px 48px !important; }
          .px-tool-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          .px-cat-padding { padding: 20px 16px !important; }
          .px-cta-section { padding: 0 16px 48px !important; }
          .px-cta-inner { padding: 28px 20px !important; }
          .px-cta-title { font-size: 22px !important; }
          .px-cta-features { gap: 14px !important; flex-direction: column !important; align-items: center !important; }
          .px-footer { padding: 24px 16px !important; flex-direction: column !important; text-align: center !important; align-items: center !important; }
        }

        @media (max-width: 480px) {
          .px-tool-grid { grid-template-columns: 1fr 1fr !important; }
          .px-tool-card { padding: 14px 10px !important; }
          .px-tool-icon { font-size: 22px !important; }
          .px-tool-title { font-size: 12px !important; }
          .px-tool-desc { display: none !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav className="px-nav" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 100, background: "rgba(8,11,20,0.9)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>✨</div>
          <span style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "-0.5px" }}>PixelAI</span>
        </div>
        <div className="px-nav-links">
          {user ? (
            <>
              <a href="/dashboard" className="px-nav-link-text" style={{ color: "#a78bfa", textDecoration: "none", fontSize: "13px", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "8px", padding: "7px 14px" }}>📊 Dashboard</a>
              {isPro ? (
                <span className="px-nav-link-text" style={{ color: "#fbbf24", fontSize: "13px", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: "8px", padding: "7px 14px" }}>⭐ Pro</span>
              ) : (
                <a href="/pricing" className="px-nav-link-text" style={{ color: "white", textDecoration: "none", fontSize: "13px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "8px", padding: "7px 14px", fontWeight: "600" }}>💎 Pro</a>
              )}
              <span className="px-nav-email" style={{ color: "#6b7280", fontSize: "13px" }}>{user.email}</span>
              <button onClick={handleLogout} className="px-nav-link-text" style={{ background: "transparent", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "7px 14px", cursor: "pointer", fontSize: "13px" }}>Çıkış</button>
            </>
          ) : (
            <button onClick={() => window.location.href = "/auth"} style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white", border: "none", borderRadius: "8px", padding: "8px 20px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>Giriş Yap</button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="px-hero" style={{ textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50px", left: "20%", width: "300px", height: "300px", background: "radial-gradient(ellipse, rgba(236,72,153,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50px", right: "20%", width: "300px", height: "300px", background: "radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "999px", padding: "6px 16px", fontSize: "12px", color: "#a78bfa", marginBottom: "28px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#a78bfa", display: "inline-block" }}></span>
          Yapay Zeka Destekli Görsel Platform
        </div>

        <h1 className="px-hero-title" style={{ fontWeight: "900", lineHeight: 1.05, marginBottom: "24px", letterSpacing: "-2px" }}>
          <span style={{ background: "linear-gradient(135deg, #fff 0%, #e2e8f0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Görsellerini</span>
          <br />
          <span style={{ background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #f472b6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI ile Güçlendir</span>
        </h1>

        <p style={{ fontSize: "18px", color: "#6b7280", maxWidth: "480px", margin: "0 auto 40px", lineHeight: 1.7 }}>
          14 farklı AI aracıyla fotoğraf ve videolarını saniyeler içinde dönüştür.
        </p>

        <div className="px-hero-btns">
          <button className="px-hero-btn-main" onClick={() => window.location.href = user ? "/remove-bg" : "/auth"} style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 0 40px rgba(124,58,237,0.35)" }}>
            Ücretsiz Başla →
          </button>
          <button className="px-hero-btn-sec" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "16px 40px", fontSize: "16px", cursor: "pointer" }}>
            Araçları Gör
          </button>
        </div>

        {/* Stats */}
        <div className="px-stats" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
          {stats.map((s, i) => (
            <div key={s.label} className="px-stats-item" style={{ textAlign: "center", borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
              <div style={{ fontSize: "22px", fontWeight: "900", background: "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Categories */}
      <section id="features" className="px-features" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "900", letterSpacing: "-1px", marginBottom: "12px" }}>Tüm AI Araçları</h2>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>Kategorilere göre ihtiyacını bul</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {categories.map((cat) => (
            <div key={cat.title} className="px-cat-padding" style={{ background: cat.gradient, border: `1px solid ${cat.border}`, borderRadius: "24px", padding: "32px", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(ellipse, ${cat.color}22, transparent 70%)`, pointerEvents: "none" }} />
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "4px", letterSpacing: "-0.5px" }}>{cat.title}</h3>
                <p style={{ color: "#9ca3af", fontSize: "13px" }}>{cat.desc}</p>
              </div>
              <div className="px-tool-grid">
                {cat.tools.map((tool) => (
                  <div key={tool.title} className="px-tool-card" onClick={() => window.location.href = tool.href}
                    style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px", cursor: "pointer", transition: "all 0.2s", position: "relative" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLDivElement).style.borderColor = cat.border; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0.3)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
                  >
                    {tool.badge && (
                      <div style={{ position: "absolute", top: "10px", right: "10px", background: tool.badge === "Ücretsiz" ? "rgba(16,185,129,0.2)" : tool.badge === "Yeni" ? "rgba(59,130,246,0.2)" : tool.badge === "Popüler" ? "rgba(236,72,153,0.2)" : "rgba(124,58,237,0.2)", color: tool.badge === "Ücretsiz" ? "#10b981" : tool.badge === "Yeni" ? "#60a5fa" : tool.badge === "Popüler" ? "#f472b6" : "#a78bfa", fontSize: "9px", fontWeight: "700", padding: "2px 7px", borderRadius: "999px" }}>{tool.badge}</div>
                    )}
                    <div className="px-tool-icon" style={{ fontSize: "28px", marginBottom: "10px" }}>{tool.icon}</div>
                    <div className="px-tool-title" style={{ fontSize: "14px", fontWeight: "700", marginBottom: "5px" }}>{tool.title}</div>
                    <div className="px-tool-desc" style={{ fontSize: "12px", color: "#9ca3af", lineHeight: 1.5 }}>{tool.desc}</div>
                    <div style={{ marginTop: "12px", fontSize: "11px", color: cat.color, fontWeight: "600" }}>Kullan →</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!isPro && (
        <section className="px-cta-section" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="px-cta-inner" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.2))", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)", width: "400px", height: "200px", background: "radial-gradient(ellipse, rgba(124,58,237,0.3), transparent 70%)", pointerEvents: "none" }} />
            <h2 className="px-cta-title" style={{ fontWeight: "900", marginBottom: "12px", letterSpacing: "-1px" }}>Pro'ya Geç — Sınırsız Kullan</h2>
            <p style={{ color: "#9ca3af", fontSize: "15px", marginBottom: "28px" }}>Tüm AI araçlarına sınırsız erişim, aylık sadece $9.99</p>
            <div className="px-cta-features">
              {["Sınırsız işlem", "14 AI araç", "Öncelikli hız", "7/24 destek"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#e2e8f0" }}>
                  <span style={{ color: "#10b981", fontSize: "16px" }}>✓</span> {f}
                </div>
              ))}
            </div>
            <a href="/pricing" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white", textDecoration: "none", borderRadius: "12px", padding: "14px 40px", fontSize: "15px", fontWeight: "700", boxShadow: "0 0 40px rgba(124,58,237,0.4)" }}>
              💎 Pro'ya Geç — $9.99/ay
            </a>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-footer" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>✨</div>
          <span style={{ fontWeight: "700", fontSize: "14px" }}>PixelAI</span>
        </div>
        <div style={{ color: "#4b5563", fontSize: "13px" }}>© 2025 PixelAI — Tüm hakları saklıdır.</div>
        <div style={{ display: "flex", gap: "20px" }}>
          <a href="/pricing" style={{ color: "#6b7280", textDecoration: "none", fontSize: "13px" }}>Fiyatlandırma</a>
          <a href="/dashboard" style={{ color: "#6b7280", textDecoration: "none", fontSize: "13px" }}>Dashboard</a>
        </div>
      </footer>
    </main>
  );
}