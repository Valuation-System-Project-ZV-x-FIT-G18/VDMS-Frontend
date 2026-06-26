import { useState } from "react";
import { authService } from "../services/authService";

interface LoginPageProps {
  onLoginSuccess: (role: string) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("l3.manager@vdms.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authService.login(email, password);
      console.log("✅ Login successful:", result);
      onLoginSuccess(result.user.role);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMsg);
      console.error("❌ Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    width: 420,
    padding: 32,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
    fontFamily: "inherit",
    boxSizing: "border-box",
    marginBottom: 12,
  };

  const btnStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    marginTop: 12,
  };

  const testAccountStyle: React.CSSProperties = {
    background: "#f0fdf4",
    border: "1px solid #86efac",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 12,
    color: "#166534",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#f9fafb",
      }}
    >
      <div style={cardStyle}>
        <h1 style={{ margin: "0 0 8px 0", fontSize: 24, color: "#1f2937" }}>
          VDMS Login
        </h1>
        <p style={{ margin: "0 0 24px 0", color: "#6b7280", fontSize: 14 }}>
          Manager Portal - Secure Access
        </p>

        {/* Test Account Info */}
        <div style={testAccountStyle}>
          <strong>Test Accounts:</strong>
          <div>📧 l3.manager@vdms.com (L3)</div>
          <div>📧 l2.manager@vdms.com (L2)</div>
          <div>📧 l1.manager@vdms.com (L1)</div>
          <div>🔑 Password: password123</div>
        </div>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 13,
            }}
          >
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 13,
              fontWeight: 500,
              color: "#374151",
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="manager@vdms.com"
            style={inputStyle}
            required
          />

          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 13,
              fontWeight: 500,
              color: "#374151",
            }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={inputStyle}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...btnStyle,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "🔄 Logging in..." : "✨ Login"}
          </button>
        </form>

        <p style={{ margin: "16px 0 0 0", fontSize: 12, color: "#6b7280" }}>
          🔒 Secure authentication with JWT tokens
        </p>
      </div>
    </div>
  );
}
