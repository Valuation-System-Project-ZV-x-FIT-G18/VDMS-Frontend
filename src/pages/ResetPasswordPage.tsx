import { useState } from "react";

interface ResetPasswordPageProps {
  token: string;
  onBack: () => void;
  onSuccess: () => void;
}

function StrengthBar({ password }: { password: string }) {
  const checks = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)];
  const score  = checks.filter(Boolean).length;
  const colors = ["#E5E7EB","#EF4444","#F59E0B","#10B981","#2563EB"];
  const labels = ["","Weak","Fair","Good","Strong"];
  if (!password) return null;
  return (
    <div style={{ marginTop:8 }}>
      <div style={{ display:"flex", gap:4, marginBottom:5 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex:1, height:3, borderRadius:4, background: i <= score ? colors[score] : "#E5E7EB", transition:"background 0.3s" }} />
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", gap:10 }}>
          {["8+ chars","A-Z","0-9","Symbol"].map((req,i) => (
            <span key={i} style={{ fontSize:10, color: checks[i] ? "#10B981" : "#9CA3AF", display:"flex", alignItems:"center", gap:3 }}>
              {checks[i] ? "✓" : "○"} {req}
            </span>
          ))}
        </div>
        <span style={{ fontSize:11, fontWeight:600, color:colors[score] }}>{labels[score]}</span>
      </div>
    </div>
  );
}

export default function ResetPasswordPage({ token, onBack, onSuccess }: ResetPasswordPageProps) {
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [showCf,    setShowCf]    = useState(false);
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);

  const handleReset = async () => {
    setError("");
    if (!password || !confirm) { setError("Please fill in all fields."); return; }
    if (password.length < 8)   { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm)  { setError("Passwords do not match."); return; }

    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5001/api/auth/reset-password", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); setLoading(false); return; }
      setSuccess(true);
      setTimeout(() => onSuccess(), 2000);
    } catch {
      setError("Cannot connect to server."); setLoading(false);
    }
  };

  const pwInput = (value: string, onChange: (v:string)=>void, placeholder: string, show: boolean, onToggle: ()=>void) => (
    <div style={{ position:"relative" }}>
      <svg style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} width="15" height="15" fill="none" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#9CA3AF" strokeWidth="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/></svg>
      <input value={value} onChange={e => onChange(e.target.value)} type={show ? "text" : "password"} placeholder={placeholder}
        style={{ width:"100%", boxSizing:"border-box" as const, padding:"10px 40px 10px 38px", borderRadius:9, border:"1.5px solid #E5E7EB", fontSize:13, color:"#111827", outline:"none", background:"#fff", fontFamily:"inherit" }} />
      <button onClick={onToggle} style={{ position:"absolute", right:11, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", padding:0, lineHeight:0 }}>
        {show
          ? <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          : <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
        }
      </button>
    </div>
  );

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", minHeight:"100vh", background:"#F0F4FF", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:440, background:"#fff", borderRadius:20, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.08)" }}>
        <div style={{ height:4, background:"linear-gradient(90deg,#4F8EF7,#2563EB)" }} />
        <div style={{ padding:"32px 36px 36px" }}>

          <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", color:"#6B7280", fontSize:12, padding:0, marginBottom:28, fontFamily:"inherit" }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to login
          </button>

          <div style={{ width:52, height:52, borderRadius:14, background:"#EFF6FF", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#4F8EF7" strokeWidth="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#4F8EF7" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>

          <h2 style={{ margin:"0 0 6px", fontSize:22, fontWeight:700, color:"#111827" }}>Create new password</h2>
          <p style={{ margin:"0 0 28px", fontSize:13, color:"#9CA3AF", lineHeight:1.6 }}>Your new password must be different from your previous one.</p>

          {success && (
            <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:10, padding:"14px 16px", marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:600, color:"#10B981" }}>Password reset successfully!</div>
              <div style={{ fontSize:12, color:"#6B7280", marginTop:2 }}>Redirecting to login…</div>
            </div>
          )}

          {error && (
            <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:10, padding:"10px 14px", fontSize:12, color:"#EF4444", marginBottom:16 }}>{error}</div>
          )}

          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>New password</label>
            {pwInput(password, setPassword, "Enter new password", showPw, () => setShowPw(!showPw))}
            <StrengthBar password={password} />
          </div>

          <div style={{ marginBottom:28 }}>
            <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>Confirm new password</label>
            {pwInput(confirm, setConfirm, "Confirm new password", showCf, () => setShowCf(!showCf))}
            {confirm && (
              <div style={{ marginTop:6, fontSize:11, color: password === confirm ? "#10B981" : "#EF4444" }}>
                {password === confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
              </div>
            )}
          </div>

          <button
            onClick={handleReset} disabled={loading || success}
            style={{
              width:"100%", padding:"13px", borderRadius:10, border:"none",
              background: success ? "#10B981" : loading ? "#93C5FD" : "linear-gradient(135deg,#4F8EF7,#2563EB)",
              color:"#fff", fontSize:14, fontWeight:600,
              cursor:(loading||success) ? "not-allowed" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"inherit",
            }}>
            {loading ? (
              <><div style={{ width:16, height:16, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", animation:"spin .7s linear infinite" }} />Resetting…</>
            ) : success ? "✓ Password Reset!" : "Reset Password"}
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