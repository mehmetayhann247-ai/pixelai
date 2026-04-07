"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setMessage("");
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage("❌ " + error.message);
      else window.location.href = "/";
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage("❌ " + error.message);
      else setMessage("✅ Kayıt başarılı! E-postanı kontrol et.");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "https://pixelai-eta.vercel.app" }
    });
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0f0f1a", color: "white", fontFamily: "sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #a78bfa", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "400px" }}>
        <h1 style={{ textAlign: "center", fontSize: "28px", marginBottom: "8px" }}>✨ PixelAI</h1>
        <p style={{ textAlign: "center", color: "#a78bfa", marginBottom: "32px" }}>
          {isLogin ? "Hesabına giriş yap" : "Yeni hesap oluştur"}
        </p>

        <button onClick={handleGoogle}
          style={{ width: "100%", padding: "14px", background: "white", color: "#333", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: "600" }}>
          <img src="https://www.google.com/favicon.ico" width="20" height="20" />
          Google ile Devam Et
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div style={{ flex: 1, height: "1px", background: "#444" }}/>
          <span style={{ color: "#888", fontSize: "14px" }}>veya</span>
          <div style={{ flex: 1, height: "1px", background: "#444" }}/>
        </div>

        <input type="email" placeholder="E-posta" value={email} onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #444", background: "#1a1a2e", color: "white", marginBottom: "12px", boxSizing: "border-box" }} />

        <input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #444", background: "#1a1a2e", color: "white", marginBottom: "20px", boxSizing: "border-box" }} />

        <button onClick={handleAuth} disabled={loading}
          style={{ width: "100%", padding: "14px", background: "#7c3aed", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", marginBottom: "16px" }}>
          {loading ? "⏳ Bekle..." : isLogin ? "Giriş Yap" : "Kayıt Ol"}
        </button>

        {message && <p style={{ textAlign: "center", color: message.includes("✅") ? "#10b981" : "#ef4444" }}>{message}</p>}

        <p style={{ textAlign: "center", color: "#888", marginTop: "16px" }}>
          {isLogin ? "Hesabın yok mu? " : "Zaten hesabın var mı? "}
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: "#a78bfa", cursor: "pointer" }}>
            {isLogin ? "Kayıt ol" : "Giriş yap"}
          </span>
        </p>
      </div>
    </main>
  );
}