"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  const [operations, setOperations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user;
      if (!u) { window.location.href = "/auth"; return; }
      setUser(u);
      const { data: profile } = await supabase.from("profiles").select("is_pro").eq("id", u.id).single();
      setIsPro(profile?.is_pro ?? false);
      const { data: ops } = await supabase
        .from("operations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      setOperations(ops ?? []);
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const typeLabel = (type: string) => {
    const map: Record<string, string> = {
      "remove-bg": "🖼️ Arka Plan Kaldırma",
      "enhance": "📸 Fotoğraf Netleştirme",
      "anime": "🎌 Anime Dönüştürme",
      "cartoon": "🎨 Cartoon Dönüştürme",
      "text-to-image": "🖼️ AI Resim Oluşturma",
      "text-to-video": "✍️ Yazıdan Video",
      "image-to-video": "🎬 Resimden Video",
      "restore": "🕰️ Fotoğraf Restore",
      "brighten": "🌙 Gece Fotoğrafı Aydınlatma",
      "oil-paint": "🎭 Yağlı Boya Efekti",
      "watercolor": "🌊 Suluboya Efekti",
      "sketch": "🖋️ Karakalem Çizim",
      "midnight": "🌃 Gece Yarısı Sanat",
      "popart": "🎪 Pop Art Efekti",
    };
    return map[type] ?? type;
  };

  const allTools = [
    { title: "Fotoğraf Araçları", color: "#7c3aed", border: "rgba(124,58,237,0.3)", tools: [
      { icon: "🖼️", label: "Arka Plan Kaldır", href: "/remove-bg", badge: "Ücretsiz" },
      { icon: "📸", label: "Fotoğraf Netleştir", href: "/enhance", badge: null },
      { icon: "🕰️", label: "Fotoğraf Restore", href: "/restore", badge: null },
      { icon: "🌙", label: "Gece Fotoğrafı Aydınlat", href: "/brighten", badge: null },
    ]},
    { title: "Stil & Sanat", color: "#ec4899", border: "rgba(236,72,153,0.3)", tools: [
      { icon: "🎌", label: "Anime'ye Dönüştür", href: "/anime", badge: "Popüler" },
      { icon: "🎨", label: "Cartoon'a Dönüştür", href: "/cartoon", badge: null },
      { icon: "🖼️", label: "AI Resim Oluştur", href: "/text-to-image", badge: "Yeni" },
      { icon: "🎭", label: "Yağlı Boya", href: "/oil-paint", badge: null },
      { icon: "🌊", label: "Suluboya", href: "/watercolor", badge: null },
      { icon: "🖋️", label: "Karakalem", href: "/sketch", badge: null },
      { icon: "🌃", label: "Gece Yarısı Sanat", href: "/midnight", badge: null },
      { icon: "🎪", label: "Pop Art", href: "/popart", badge: null },
    ]},
    { title: "Video Araçları", color: "#dc2626", border: "rgba(220,38,38,0.3)", tools: [
      { icon: "🎬", label: "Resimden Video", href: "/image-to-video", badge: "Pro" },
      { icon: "✍️", label: "Yazıdan Video", href: "/text-to-video", badge: "Pro" },
    ]},
  ];

  const totalOps = operations.length;
  const todayOps = operations.filter(o => {
    const d = new Date(o.created_at);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;
  const limit = isPro ? "∞" : "3";

  if (loading) return (
    <main style={{ minHeight: "100vh", background: "#080b14", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "20px" }}>
      ⏳ Yükleniyor...
    </main>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#080b14", color: "white", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 48px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,11,20,0.9)", backdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>✨</div>
          <a href="/" style={{ fontSize: "20px", fontWeight: "800", color: "white", textDecoration: "none", letterSpacing: "-0.5px" }}>PixelAI</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isPro ? (
            <span style={{ color: "#fbbf24", fontSize: "13px", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: "8px", padding: "7px 14px" }}>⭐ Pro Üye</span>
          ) : (
            <a href="/pricing" style={{ color: "white", textDecoration: "none", fontSize: "13px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "8px", padding: "7px 14px", fontWeight: "600" }}>💎 Pro'ya Geç</a>
          )}
          <span style={{ color: "#6b7280", fontSize: "13px" }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ background: "transparent", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "7px 14px", cursor: "pointer", fontSize: "13px" }}>Çıkış</button>
        </div>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Başlık */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "900", letterSpacing: "-1px", marginBottom: "6px" }}>
            👋 Hoş geldin{isPro ? <span style={{ color: "#fbbf24" }}> ⭐</span> : ""}
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>{user?.email}</p>
        </div>

        {/* Pro Banner */}
        {!isPro && (
          <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.1))", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "16px", padding: "20px 28px", marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ fontWeight: "700", marginBottom: "4px", fontSize: "16px" }}>💎 Pro'ya geç — Sınırsız işlem yap!</div>
              <div style={{ color: "#9ca3af", fontSize: "13px" }}>Aylık sadece $9.99 ile 14 AI araca sınırsız erişim</div>
            </div>
            <a href="/pricing" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white", padding: "10px 24px", borderRadius: "10px", textDecoration: "none", fontSize: "14px", fontWeight: "700" }}>Pro'ya Geç →</a>
          </div>
        )}

        {/* İstatistik Kartları */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "40px" }}>
          {[
            { label: "Toplam İşlem", value: totalOps, icon: "📊", color: "#7c3aed" },
            { label: "Bugün", value: todayOps, icon: "📅", color: "#2563eb" },
            { label: "Günlük Limit", value: limit, icon: "⚡", color: isPro ? "#f59e0b" : "#059669" },
            { label: "AI Araç", value: "14", icon: "🛠️", color: "#ec4899" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${stat.color}33`, borderRadius: "16px", padding: "24px", textAlign: "center" }}>
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>{stat.icon}</div>
              <div style={{ fontSize: "30px", fontWeight: "900", background: `linear-gradient(135deg, ${stat.color}, ${stat.color}aa)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{stat.value}</div>
              <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Araçlar */}
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.5px", marginBottom: "20px" }}>🚀 Tüm Araçlar</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {allTools.map((cat) => (
              <div key={cat.title} style={{ background: `linear-gradient(135deg, ${cat.color}11, transparent)`, border: `1px solid ${cat.border}`, borderRadius: "18px", padding: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "#e2e8f0" }}>{cat.title}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "10px" }}>
                  {cat.tools.map((tool) => (
                    <a key={tool.href} href={tool.href} style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "14px 16px", textDecoration: "none", color: "white", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "600", transition: "all 0.2s", position: "relative" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = cat.border; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,0,0,0.3)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
                    >
                      <span style={{ fontSize: "20px" }}>{tool.icon}</span>
                      <span style={{ lineHeight: 1.3 }}>{tool.label}</span>
                      {tool.badge && (
                        <span style={{ position: "absolute", top: "8px", right: "8px", fontSize: "9px", fontWeight: "700", padding: "2px 6px", borderRadius: "999px", background: tool.badge === "Ücretsiz" ? "rgba(16,185,129,0.2)" : tool.badge === "Yeni" ? "rgba(59,130,246,0.2)" : tool.badge === "Popüler" ? "rgba(236,72,153,0.2)" : "rgba(124,58,237,0.2)", color: tool.badge === "Ücretsiz" ? "#10b981" : tool.badge === "Yeni" ? "#60a5fa" : tool.badge === "Popüler" ? "#f472b6" : "#a78bfa" }}>{tool.badge}</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Son İşlemler */}
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.5px", marginBottom: "20px" }}>🕐 Son İşlemler</h2>
          {operations.length === 0 ? (
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "48px", textAlign: "center", color: "#4b5563" }}>
              Henüz işlem yapmadın. <a href="/remove-bg" style={{ color: "#a78bfa", textDecoration: "none" }}>İlk işlemini yap →</a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {operations.map((op) => (
                <div key={op.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>{typeLabel(op.type)}</span>
                  <span style={{ color: "#4b5563", fontSize: "12px" }}>{new Date(op.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}