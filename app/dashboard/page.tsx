"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [operations, setOperations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user;
      if (!u) { window.location.href = "/auth"; return; }
      setUser(u);
      const { data: ops } = await supabase
        .from("operations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      setOperations(ops ?? []);
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const typeLabel = (type: string) => {
    if (type === "remove-bg") return "🖼️ Arka Plan Kaldırma";
    if (type === "enhance") return "📸 Fotoğraf Netleştirme";
    return type;
  };

  if (loading) return (
    <main style={{ minHeight: "100vh", background: "#0f0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "20px" }}>
      ⏳ Yükleniyor...
    </main>
  );

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
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#a78bfa", fontSize: "14px" }}>{user?.email}</span>
          <button onClick={handleLogout} style={{
            background: "transparent", color: "#ef4444", border: "1px solid #ef4444",
            borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontSize: "14px"
          }}>Çıkış Yap</button>
        </div>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>

        {/* Hoşgeldin */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "900", marginBottom: "8px" }}>
            👋 Hoş geldin!
          </h1>
          <p style={{ color: "#9ca3af" }}>{user?.email}</p>
        </div>

        {/* İstatistik Kartları */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "40px" }}>
          {[
            { label: "Toplam İşlem", value: operations.length, icon: "📊", color: "#7c3aed" },
            { label: "Arka Plan Kaldırma", value: operations.filter(o => o.type === "remove-bg").length, icon: "🖼️", color: "#2563eb" },
            { label: "Fotoğraf Netleştirme", value: operations.filter(o => o.type === "enhance").length, icon: "📸", color: "#059669" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "rgba(255,255,255,0.04)", border: `1px solid ${stat.color}44`,
              borderRadius: "16px", padding: "24px", textAlign: "center"
            }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>{stat.icon}</div>
              <div style={{ fontSize: "32px", fontWeight: "900", color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "#9ca3af", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Hızlı Erişim */}
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>🚀 Hızlı Erişim</h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a href="/remove-bg" style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              color: "white", padding: "12px 24px", borderRadius: "10px",
              textDecoration: "none", fontSize: "15px", fontWeight: "600"
            }}>🖼️ Arka Plan Kaldır</a>
            <a href="/enhance" style={{
              background: "rgba(255,255,255,0.08)", color: "#9ca3af",
              padding: "12px 24px", borderRadius: "10px",
              textDecoration: "none", fontSize: "15px", fontWeight: "600",
              border: "1px solid #333", cursor: "not-allowed"
            }}>📸 Netleştir (Yakında)</a>
          </div>
        </div>

        {/* Son İşlemler */}
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>🕐 Son İşlemler</h2>
          {operations.length === 0 ? (
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid #333",
              borderRadius: "16px", padding: "40px", textAlign: "center", color: "#555"
            }}>
              Henüz işlem yapmadın. <a href="/remove-bg" style={{ color: "#a78bfa" }}>İlk işlemini yap →</a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {operations.map((op) => (
                <div key={op.id} style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid #333",
                  borderRadius: "12px", padding: "16px 20px",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <span style={{ fontSize: "15px" }}>{typeLabel(op.type)}</span>
                  <span style={{ color: "#555", fontSize: "13px" }}>
                    {new Date(op.created_at).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}