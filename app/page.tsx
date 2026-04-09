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

  const features = [
    { icon: "🖼️", title: "Arka Plan Kaldır", desc: "Fotoğrafından arka planı saniyeler içinde sil", color: "#7c3aed", href: "/remove-bg", ready: true },
    { icon: "🎬", title: "Resimden Video", desc: "Fotoğrafını yapay zeka ile videoya dönüştür", color: "#dc2626", href: "/image-to-video", ready: true },
    { icon: "✍️", title: "Yazıdan Video", desc: "Ne istediğini yaz, AI videoyu oluştursun", color: "#a855f7", href: "/text-to-video", ready: true },
    { icon: "📸", title: "Fotoğraf Netleştir", desc: "Bulanık fotoğrafları 4 kat netleştir", color: "#2563eb", href: "/enhance", ready: true },
    { icon: "🎌", title: "Anime'ye Dönüştür", desc: "Fotoğrafını anime stiline dönüştür", color: "#7c3aed", href: "/anime", ready: true },
    { icon: "🎨", title: "Cartoon'a Dönüştür", desc: "Fotoğrafını çizgi film stiline dönüştür", color: "#eab308", href: "/cartoon", ready: true },
    { icon: "🖼️", title: "AI Resim Oluştur", desc: "Ne hayal ediyorsan yaz, AI resme dönüştürsün", color: "#059669", href: "/text-to-image", ready: true },
    { icon: "🕰️", title: "Eski Fotoğraf Restore", desc: "Eski ve hasarlı fotoğraflarını AI ile restore et", color: "#eab308", href: "/restore", ready: true },
    { icon: "🌙", title: "Gece Fotoğrafı Aydınlat", desc: "Karanlık fotoğraflarını AI ile aydınlat", color: "#f59e0b", href: "/brighten", ready: true },
  ];
  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0d1117 100%)",
      color: "white",
      fontFamily: "'Segoe UI', sans-serif",
    }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 40px", borderBottom: "1px solid rgba(167,139,250,0.15)",
        backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 100,
        background: "rgba(15,15,26,0.8)"
      }}>
        <div style={{ fontSize: "22px", fontWeight: "800" }}>✨ PixelAI</div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {user ? (
            <>
              <a href="/dashboard" style={{
                color: "#a78bfa", textDecoration: "none", fontSize: "14px",
                border: "1px solid rgba(167,139,250,0.3)", borderRadius: "8px",
                padding: "8px 16px"
              }}>📊 Dashboard</a>
              {isPro ? (
                <span style={{
                  color: "#fbbf24", fontSize: "14px",
                  border: "1px solid rgba(251,191,36,0.3)", borderRadius: "8px",
                  padding: "8px 16px", background: "rgba(251,191,36,0.1)"
                }}>⭐ Pro Üye</span>
              ) : (
                <a href="/pricing" style={{
                  color: "#10b981", textDecoration: "none", fontSize: "14px",
                  border: "1px solid rgba(16,185,129,0.3)", borderRadius: "8px",
                  padding: "8px 16px"
                }}>💎 Pro'ya Geç</a>
              )}
              <span style={{ color: "#a78bfa", fontSize: "14px" }}>{user.email}</span>
              <button onClick={handleLogout} style={{
                background: "transparent", color: "#ef4444", border: "1px solid #ef4444",
                borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontSize: "14px"
              }}>Çıkış Yap</button>
            </>
          ) : (
            <button onClick={() => window.location.href = "/auth"} style={{
              background: "#7c3aed", color: "white", border: "none",
              borderRadius: "8px", padding: "8px 20px", cursor: "pointer", fontSize: "14px"
            }}>Giriş Yap</button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "80px 20px 60px" }}>
        <div style={{
          display: "inline-block", background: "rgba(124,58,237,0.2)",
          border: "1px solid #7c3aed", borderRadius: "999px",
          padding: "6px 18px", fontSize: "13px", color: "#a78bfa", marginBottom: "24px"
        }}>
          🚀 Yapay Zeka Destekli Görsel Platform
        </div>
        <h1 style={{
          fontSize: "clamp(36px, 6vw, 72px)", fontWeight: "900",
          lineHeight: 1.1, marginBottom: "24px",
          background: "linear-gradient(135deg, #fff 0%, #a78bfa 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          Fotoğraf ve Videolarını<br />AI ile Güçlendir
        </h1>
        <p style={{ fontSize: "18px", color: "#9ca3af", marginBottom: "40px", maxWidth: "500px", margin: "0 auto 40px" }}>
          Arka plan kaldır, videoya dönüştür, filtrele — saniyeler içinde, ücretsiz başla.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => window.location.href = user ? "/remove-bg" : "/auth"} style={{
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            color: "white", border: "none", borderRadius: "12px",
            padding: "16px 40px", fontSize: "18px", cursor: "pointer",
            boxShadow: "0 0 30px rgba(124,58,237,0.4)"
          }}>
            Ücretsiz Başla →
          </button>
          <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} style={{
            background: "transparent", color: "white",
            border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px",
            padding: "16px 40px", fontSize: "18px", cursor: "pointer"
          }}>
            Özellikleri Gör
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "60px 20px", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "32px", fontWeight: "800", marginBottom: "48px" }}>
          Neler Yapabilirsin?
        </h2>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px"
        }}>
          {features.map((f) => (
            <div key={f.title}
              onClick={() => f.ready && (window.location.href = f.href)}
              style={{
                background: "rgba(255,255,255,0.04)", border: `1px solid ${f.ready ? f.color : "#333"}`,
                borderRadius: "16px", padding: "28px 24px", cursor: f.ready ? "pointer" : "default",
                transition: "transform 0.2s, box-shadow 0.2s",
                position: "relative", overflow: "hidden"
              }}
              onMouseEnter={e => { if (f.ready) (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
            >
              {!f.ready && (
                <div style={{
                  position: "absolute", top: "12px", right: "12px",
                  background: "#333", borderRadius: "999px",
                  padding: "2px 10px", fontSize: "11px", color: "#888"
                }}>Yakında</div>
              )}
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: "center", padding: "40px 20px",
        borderTop: "1px solid rgba(255,255,255,0.08)", color: "#555", fontSize: "14px", marginTop: "40px"
      }}>
        © 2025 PixelAI — Tüm hakları saklıdır.
      </footer>
    </main>
  );
}