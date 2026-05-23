import { useState, useEffect } from "react";
import { useGoogleLogin } from '@react-oauth/google';

type Role = "bank" | "owner" | "admin" | "coordinator" | "technical-officer" | "l3-manager" | "l2-manager" | "l1-manager" | "senior-valuator";

interface LoginPageProps {
  onSelectRole: (role: Role) => void;
  onForgotPassword: () => void;
}
// The login page allows users to enter their email and password to authenticate. It also has a "Forgot password?" link that opens the ForgotPasswordPage component. For demo purposes, it includes a "Quick Access Portals" section with pre-filled credentials for different roles.
const MOCK_USERS: Record<string, { role: Role; label: string }> = {
  "admin@zavolt.com":             { role: "admin",             label: "Admin" },
  "bank@zavolt.com":              { role: "bank",              label: "Bank" },
  "coordinator@zavolt.com":       { role: "coordinator",       label: "Coordinator" },
  "technical-officer@zavolt.com": { role: "technical-officer", label: "Field Tech" },
  "senior-valuator@zavolt.com":   { role: "senior-valuator",   label: "Valuator" },
  "l3-manager@zavolt.com":        { role: "l3-manager",        label: "L3 Manager" },
  "l2-manager@zavolt.com":        { role: "l2-manager",        label: "L2 Manager" },
  "l1-manager@zavolt.com":        { role: "l1-manager",        label: "L1 Manager" },
  "owner@zavolt.com":             { role: "owner",             label: "Owner" },
};

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  "admin":             { bg: "#EFF6FF", color: "#2563EB" },
  "bank":              { bg: "#F0FDF4", color: "#10B981" },
  "coordinator":       { bg: "#FFFBEB", color: "#F59E0B" },
  "technical-officer": { bg: "#FEF2F2", color: "#EF4444" },
  "senior-valuator":   { bg: "#F5F3FF", color: "#8B5CF6" },
  "l3-manager":        { bg: "#FDF2F8", color: "#EC4899" },
  "l2-manager":        { bg: "#FFF1F2", color: "#E11D48" },
  "l1-manager":        { bg: "#FEF2F2", color: "#991B1B" },
  "owner":             { bg: "#ECFEFF", color: "#06B6D4" },
};

export default function LoginPage({ onSelectRole }: LoginPageProps) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: () => handleQuickLogin("admin@zavolt.com"),
    onError: () => setError("Google authentication failed.")
  });

  const [dynamicUsers, setDynamicUsers] = useState<{ email: string; role: Role; label: string; password?: string }[]>([]);

  useEffect(() => {
    const dynamicMockUsersJson = localStorage.getItem("vdms_mock_users");
    if (dynamicMockUsersJson) {
      try {
        const parsed = JSON.parse(dynamicMockUsersJson);
        if (Array.isArray(parsed)) {
          const formatted = parsed
            .filter((u: any) => u.email && u.role && !MOCK_USERS[u.email.toLowerCase()])
            .map((u: any) => ({
              email: u.email.toLowerCase(),
              role: u.role as Role,
              label: `${u.firstName} (${u.role === 'technical-officer' ? 'TO' : u.role.split('-')[0].toUpperCase()})`,
              password: u.password || "password123"
            }));
          setDynamicUsers(formatted);
        }
      } catch (err) {
        console.error("Error loading dynamic mock users", err);
      }
    }
  }, []);

  const handleForgotSubmit = async () => {
    if (!forgotEmail) return alert("Please enter email");
    setForgotLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      alert(data.message || "Reset link sent!");
      setShowForgot(false);
    } catch (err) {
      alert("Error.");
    } finally {
      setForgotLoading(false);
    }
  };

  const doLogin = async (e: string, p: string) => {
    if (!e || !p) return;
    setError("");
    setLoading(true);

    // 1. Check for Mock User Bypass first
    if (MOCK_USERS[e] && p === "password123") {
      const mockUser = MOCK_USERS[e];
      const mockToken = `mock-jwt-${mockUser.role}-${Date.now()}`;
      if (remember) localStorage.setItem("token", mockToken);
      else sessionStorage.setItem("token", mockToken);
      
      // Artificial delay for "feel"
      setTimeout(() => {
        onSelectRole(mockUser.role);
        setLoading(false);
      }, 800);
      return;
    }

    // 1b. Check for dynamic mock users
    const dynamicMockUsersJson = localStorage.getItem("vdms_mock_users");
    if (dynamicMockUsersJson) {
      try {
        const parsed = JSON.parse(dynamicMockUsersJson);
        if (Array.isArray(parsed)) {
          const match = parsed.find(
            (u: any) => u.email.toLowerCase() === e.toLowerCase() && (u.password === p || p === "password123")
          );
          if (match) {
            const mockToken = `mock-jwt-${match.role}-${Date.now()}`;
            if (remember) localStorage.setItem("token", mockToken);
            else sessionStorage.setItem("token", mockToken);
            
            setTimeout(() => {
              onSelectRole(match.role as Role);
              setLoading(false);
            }, 800);
            return;
          }
        }
      } catch (err) {
        console.error("Error authenticating dynamic mock user", err);
      }
    }

    // 2. Otherwise try real backend
    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e, password: p }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        if (remember) localStorage.setItem("token", data.token);
        else sessionStorage.setItem("token", data.token);
        onSelectRole((data.user?.role || data.role) as Role);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginBtn   = () => doLogin(email, password);
  const handleQuickLogin = (mockEmail: string, mockPassword = "password123") => {
    setEmail(mockEmail);
    setPassword(mockPassword);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "#fff",
      fontFamily: "'Inter', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Left Branding Side (Architectural Visual) */}
      <div style={{
        flex: "1.3",
        position: "relative",
        background: "url('/Users/chathuhewage/.gemini/antigravity/brain/5c9585dc-a255-42a6-9743-c5eff6488405/login_bg_premium_1777228999362.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 100px",
        overflow: "hidden"
      }}>
        {/* Deep Blue Overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(37, 99, 235, 0.5) 100%)",
          zIndex: 1
        }} />

        <div style={{ position: "relative", zIndex: 2, color: "#fff", maxWidth: "600px" }}>
          <div style={{ 
            width: 60, height: 60, background: "#fff", borderRadius: 18, marginBottom: 40,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 15px 30px rgba(0, 0, 0, 0.25)"
          }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 700, margin: "0 0 24px", lineHeight: 1.1, letterSpacing: "-1px" }}>
            Precision Valuations. <br /> Total Control.
          </h1>
          <p style={{ fontSize: 19, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, margin: "0 0 48px" }}>
            The enterprise-ready platform for data-driven asset management and real-time reporting.
          </p>
          
          <div style={{ display: "flex", gap: 32 }}>
            {[
              { val: "99.9%", label: "Reliability" },
              { val: "Bank-Level", label: "Security" },
              { val: "Unlimited", label: "Storage" }
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ position: "absolute", bottom: 40, left: 100, zIndex: 2, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 12px #10B981" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>System Live • Secure Connection</span>
        </div>
      </div>

      {/* Right Form Side (Clean Blue Theme) */}
      <div style={{
        flex: "1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
        background: "#F0F7FF"
      }}>
        <div style={{ width: "100%", maxWidth: "420px", animation: "fadeIn 0.6s ease-out" }}>
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: "#1E3A8A", margin: "0 0 10px" }}>Secure Portal Login</h2>
            <p style={{ fontSize: 15, color: "#64748B" }}>Welcome back! Please enter your credentials to continue.</p>
          </div>

          {error && (
            <div style={{ background: "#FEF2F2", color: "#DC2626", padding: "14px", borderRadius: "14px", fontSize: 14, fontWeight: 600, marginBottom: 24, border: "1px solid #FEE2E2", display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#1E3A8A", marginBottom: 10, textTransform: "uppercase", letterSpacing: "1px" }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@company.com"
              style={{ width: "100%", padding: "15px 18px", borderRadius: "14px", border: "1.5px solid #DBEAFE", fontSize: 16, outline: "none", boxSizing: "border-box", background: "#fff", transition: "all 0.2s" }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#1E3A8A", textTransform: "uppercase", letterSpacing: "1px" }}>Password</label>
              <span onClick={() => setShowForgot(true)} style={{ fontSize: 12, color: "#2563EB", fontWeight: 700, cursor: "pointer" }}>Forgot Password?</span>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: "100%", padding: "15px 50px 15px 18px", borderRadius: "14px", border: "1.5px solid #DBEAFE", fontSize: 16, outline: "none", boxSizing: "border-box", background: "#fff", transition: "all 0.2s" }}
              />
              <div 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#94A3B8", display: "flex", alignItems: "center" }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              style={{ width: 18, height: 18, borderRadius: 6, cursor: "pointer" }}
            />
            <label htmlFor="remember" style={{ fontSize: 15, color: "#64748B", cursor: "pointer", userSelect: "none" }}>Keep me logged in</label>
          </div>

          <button
            onClick={handleLoginBtn}
            disabled={loading}
            style={{
              width: "100%", padding: "16px", borderRadius: "14px", border: "none",
              background: loading ? "#93C5FD" : "linear-gradient(135deg, #2563EB, #1E40AF)",
              color: "#fff", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)", transition: "all 0.2s", marginBottom: 24
            }}
          >
            {loading ? <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin .7s linear infinite", margin: "0 auto" }} /> : "Sign In →"}
          </button>

          <button
            onClick={() => googleLogin()}
            style={{
              width: "100%", padding: "15px", borderRadius: "14px", border: "1.5px solid #DBEAFE",
              background: "#fff", color: "#475569", fontSize: 16, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              transition: "all 0.2s", marginBottom: 40
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Styled Quick Access */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #DBEAFE", boxShadow: "0 4px 15px rgba(30, 58, 138, 0.04)" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 16, textAlign: "center" }}>
              Quick Access Portals
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {/* Default Mock Users */}
              {Object.entries(MOCK_USERS).map(([em, { role, label }]) => {
                const rc = ROLE_COLORS[role] || { bg: "#F3F4F6", color: "#374151" };
                return (
                  <span
                    key={em}
                    onClick={() => handleQuickLogin(em)}
                    style={{ fontSize: 11, fontWeight: 700, color: rc.color, background: rc.bg, padding: "6px 14px", borderRadius: 25, cursor: "pointer", border: `1.5px solid ${rc.color}22`, transition: "all 0.2s" }}
                  >
                    {label}
                  </span>
                );
              })}

              {/* Dynamic Mock Users (Added via Admin Users & Roles Page) */}
              {dynamicUsers.map((du) => {
                const rc = ROLE_COLORS[du.role] || { bg: "#F3F4F6", color: "#374151" };
                return (
                  <span
                    key={du.email}
                    onClick={() => handleQuickLogin(du.email, du.password)}
                    style={{ fontSize: 11, fontWeight: 700, color: rc.color, background: rc.bg, padding: "6px 14px", borderRadius: 25, cursor: "pointer", border: `1.5px dashed ${rc.color}66`, transition: "all 0.2s" }}
                    title={`Dynamic Mock User: ${du.email} (Password: ${du.password})`}
                  >
                    {du.label} ✦
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal (Premium Blue) */}
      {showForgot && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(30, 58, 138, 0.45)", backdropFilter: "blur(10px)" }}>
          <div style={{ background: "#fff", padding: 40, borderRadius: 32, width: "100%", maxWidth: 420, boxShadow: "0 30px 70px rgba(0,0,0,0.25)", animation: "fadeIn 0.3s ease-out" }}>
            <h2 style={{ margin: "0 0 12px", fontSize: 24, fontWeight: 700, color: "#1E3A8A" }}>Reset Password</h2>
            <p style={{ margin: "0 0 28px", fontSize: 15, color: "#64748B" }}>Enter your email to receive a secure reset link.</p>
            <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="name@company.com" style={{ width: "100%", padding: "15px", borderRadius: "14px", border: "1.5px solid #DBEAFE", marginBottom: 24, fontSize: 16 }} />
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowForgot(false)} style={{ flex: 1, padding: "14px", borderRadius: "14px", border: "1.5px solid #DBEAFE", background: "#fff", fontWeight: 700, color: "#1E3A8A", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleForgotSubmit} disabled={forgotLoading} style={{ flex: 2, padding: "14px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg,#2563EB,#1E40AF)", color: "#fff", fontWeight: 700, cursor: forgotLoading ? "not-allowed" : "pointer" }}>{forgotLoading ? "Sending..." : "Send Reset Link"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}