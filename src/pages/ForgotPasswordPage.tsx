import { useState } from "react";

interface ForgotPasswordPageProps {
  onBack: () => void;
  onResetSent: (email: string) => void;
}
// This page is shown when the user clicks "Forgot password?" on the login page. It allows them to enter their email to receive a password reset link.
export default function ForgotPasswordPage({ onBack, onResetSent }: ForgotPasswordPageProps) {
  const [email,   setEmail]   = useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (!email.includes("@")) { setError("Please enter a valid email address."); return; }

    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5001/api/auth/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); setLoading(false); return; }
      setSent(true);
      setTimeout(() => onResetSent(email), 2000);
    } catch {
      setError("Cannot connect to server."); setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily:"'DM Sans','Segoe UI',sans-serif",
      minHeight:"100vh", background:"#F0F4FF",
      display:"flex", alignItems:"center", justifyContent:"center", padding:24,
    }}>
      <div style={{ width:"100%", maxWidth:440, background:"#fff", borderRadius:20, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.08)" }}>
        <div style={{ height:4, background:"linear-gradient(90deg,#4F8EF7,#2563EB)" }} />
        <div style={{ padding:"32px 36px 36px" }}>

          <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", color:"#6B7280", fontSize:12, padding:0, marginBottom:28, fontFamily:"inherit" }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to login
          </button>

          <div style={{ width:52, height:52, borderRadius:14, background:"#EFF6FF", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#4F8EF7" strokeWidth="2"/><path d="M22 6l-10 7L2 6" stroke="#4F8EF7" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>

          <h2 style={{ margin:"0 0 6px", fontSize:22, fontWeight:700, color:"#111827" }}>Reset your password</h2>
          <p style={{ margin:"0 0 28px", fontSize:13, color:"#9CA3AF", lineHeight:1.6 }}>
            Enter your registered email and we'll send you a link to reset your password.
          </p>

          {sent && (
            <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:10, padding:"14px 16px", marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:600, color:"#10B981" }}>Reset link sent!</div>
              <div style={{ fontSize:12, color:"#6B7280", marginTop:2 }}>Check your inbox at {email}</div>
            </div>
          )}

          {error && (
            <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:10, padding:"10px 14px", fontSize:12, color:"#EF4444", marginBottom:16 }}>{error}</div>
          )}

          <div style={{ marginBottom:22 }}>
            <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>Email address</label>
            <div style={{ position:"relative" }}>
              <svg style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#9CA3AF" strokeWidth="2"/><path d="M22 6l-10 7L2 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/></svg>
              <input
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                type="email" placeholder="Enter your email address"
                style={{ width:"100%", boxSizing:"border-box" as const, padding:"10px 12px 10px 38px", borderRadius:9, border:"1.5px solid #E5E7EB", fontSize:13, color:"#111827", outline:"none", background:"#fff", fontFamily:"inherit" }}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit} disabled={loading || sent}
            style={{
              width:"100%", padding:"13px", borderRadius:10, border:"none",
              background: sent ? "#10B981" : loading ? "#93C5FD" : "linear-gradient(135deg,#4F8EF7,#2563EB)",
              color:"#fff", fontSize:14, fontWeight:600,
              cursor:(loading||sent) ? "not-allowed" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"inherit",
            }}>
            {loading ? (
              <><div style={{ width:16, height:16, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", animation:"spin .7s linear infinite" }} />Sending…</>
            ) : sent ? "✓ Link Sent!" : "Send Reset Link"}
          </button>

          <p style={{ margin:"18px 0 0", textAlign:"center", fontSize:12, color:"#9CA3AF" }}>
            Remembered it? <span onClick={onBack} style={{ color:"#4F8EF7", fontWeight:600, cursor:"pointer" }}>Back to login</span>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}