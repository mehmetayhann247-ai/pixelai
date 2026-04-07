"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0d1117 100%)", color: "white", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px" }}>
      
      {/* Sağ üst köşe */}
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ color: "#a78bfa", fontSize: "14px" }}>{user.email}</span>
            <button onClick={handleLogout} style={{ background: "#dc2626", color: "white", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontSize: "14px" }}>
              Çıkış Yap
            </button>
          </div>
        ) : (
          <button onClick={() => router.push("/auth")} style={{ background: "#7c3aed", color: "white", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontSize: "14px" }}>
            Giriş Yap
          </button>
        )}
      </div>

      <h1 style={{ fontSize: "64px", fontWeight: "800", marginBottom: "16px" }}>✨ PixelAI</h1>
      <p style={{ fontSize: "22px", color: "#a78bfa", marginBottom: "40px" }}>Fotoğraf ve videolarını yapay zeka ile güçlendir</p>
      
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        {["🎨 AI Filtreler", "🖼️ Arka Plan Kaldır", "📸 Fotoğraf Netleştir", "🎬 Video Upscale"].map((f) => (
          <div key={f} style={{ background: "rgba(167,139,250,0.1)", border: "1px solid #a78bfa", borderRadius: "12px", padding: "16px 24px", fontSize: "16px" }}>{f}</div>
        ))}
      </div>

      <button onClick={() => router.push("/auth")} style={{ marginTop: "48px", background: "#7c3aed", color: "white", border: "none", borderRadius: "12px", padding: "16px 40px", fontSize: "18px", cursor: "pointer" }}>
        Ücretsiz Başla →
      </button>
    </main>
  );
}