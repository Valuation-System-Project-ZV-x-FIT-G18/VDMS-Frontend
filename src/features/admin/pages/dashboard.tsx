import { useState, useEffect } from "react";
import userService from "../../../services/userService";
import type { User } from "../../../services/userService";

interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  badge?: string;
  badgeColor?: string;
  color?: string;
  bg: string;
  icon: React.ReactNode;
}

//Quick access items with image,title,description,color and icon
const QUICK_ACCESS = [
  {
    title: "Users & Roles",
    desc: "Control system roles and permission levels",
    color: "#4F8EF7", bg: "#EFF6FF", page: "users",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <circle cx="9" cy="7" r="4" stroke="#fff" strokeWidth="2"/>
        <path d="M2 21c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="19" cy="8" r="3" stroke="#fff" strokeWidth="2"/>
        <path d="M22 21c0-2.761-1.343-5-3-5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Valuation Types",
    desc: "Manage different types of property valuations",
    color: "#10B981", bg: "#F0FDF4", page: "valuation-types",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="#fff" strokeWidth="2"/>
        <path d="M8 12h8M8 8h5M8 16h3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Templates",
    desc: "Edit document templates and valuation forms",
    color: "#8B5CF6", bg: "#F5F3FF", page: "templates",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#fff" strokeWidth="2"/>
        <path d="M14 2v6h6M8 13h8M8 17h5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const ENVIRONMENTS = ["Production", "Staging", "Development", "QA Testing"];
const SERVICES     = ["Core API", "Valuation Engine", "Reporting Module", "Auth Service", "Data Pipeline"];

const EMPTY_DEPLOY = {
  deployName: "", version: "",
  environment: ENVIRONMENTS[0], service: SERVICES[0],
  description: "", notify: true,
};

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", padding: "9px 12px",
  borderRadius: 9, border: "1.5px solid #D1D5DB",
  fontSize: 13, color: "#111827", outline: "none", background: "#fff",
};
const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: "#6B7280",
  textTransform: "uppercase", display: "block", marginBottom: 5,
};

interface DashboardProps {
  onNavigate: (page: string) => void;
}
 // Main dashboard component for admin panel, showing stats, recent users and quick access cards
export default function DashboardContent({ onNavigate }: DashboardProps) {
  const now = new Date();
  const dateStr =
    now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " – " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const [users,         setUsers]         = useState<User[]>([]);
  const [stats,         setStats]         = useState({ total: 0, active: 0 });
  const [loading,       setLoading]       = useState(true);
  const [showAll,       setShowAll]       = useState(false);
  const [showPanel,     setShowPanel]     = useState(false);
  const [deployForm,    setDeployForm]    = useState(EMPTY_DEPLOY);
  const [deployError,   setDeployError]   = useState("");
  const [deploySuccess, setDeploySuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, statData] = await Promise.all([
          userService.getUsers(),
          userService.getStats(),
        ]);
        setUsers(userData);
        setStats(statData);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayed = showAll ? users : users.slice(0, 5);

  const set = (key: string, val: string | boolean) =>
    setDeployForm(f => ({ ...f, [key]: val }));

  const closePanel = () => {
    setShowPanel(false);
    setDeployError("");
    setDeploySuccess(false);
    setDeployForm(EMPTY_DEPLOY);
  };

  const handleLaunch = () => {
    if (!deployForm.deployName.trim() || !deployForm.version.trim()) {
      setDeployError("Deployment name and version are required.");
      return;
    }
    setDeploySuccess(true);
    setTimeout(() => closePanel(), 1800);
  };

  //Stat cards data with label,value,change,badge and icon
  const statCards: StatCard[] = [
    {
      label: "Total Users", value: stats.total, change: "+3", color: "#4F8EF7", bg: "#EFF6FF",
      icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="9" cy="7" r="4" fill="#4F8EF7"/><path d="M2 21c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#4F8EF7" strokeWidth="2" strokeLinecap="round"/><circle cx="19" cy="8" r="3" fill="#93C5FD"/><path d="M22 21c0-2.761-1.343-5-3-5" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round"/></svg>,
    },
    {
      label: "Active Users", value: stats.active, badge: "Live", badgeColor: "#10B981", bg: "#F0FDF4",
      icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    },
    {
      label: "System Health", value: "Excellent", badge: "99.9%", badgeColor: "#6366F1", bg: "#F5F3FF",
      icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    },
    {
      label: "Pending Actions", value: "2", badge: "New", badgeColor: "#F59E0B", bg: "#FFFBEB",
      icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/></svg>,
    },
  ];

  const getInitials = (firstName: string, lastName: string) => {
    return (firstName[0] || "") + (lastName[0] || "");
  };

  const getAvatarColor = (index: number) => {
    const colors = ["#4F8EF7", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#14B8A6"];
    return colors[index % colors.length];
  };

  if (loading) return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#F0F4FF" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #E5E7EB", borderTopColor: "#4F8EF7", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F0F4FF", minHeight: "100vh", padding: 24, position: "relative" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>System Administration Dashboard</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9CA3AF" }}>{dateStr}</p>
        </div>
        <button
          onClick={() => { setShowPanel(true); setDeployError(""); setDeploySuccess(false); }}
          style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#4F8EF7,#2563EB)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(79,142,247,0.35)" }}>
          + New Deployment
        </button>
      </div>


      {/* ── Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {statCards.map(card => (
          <div key={card.label} style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", border: "1px solid #E8EDF5", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{card.icon}</div>
              {card.change && <span style={{ fontSize: 11, fontWeight: 600, color: "#10B981", background: "#F0FDF4", padding: "3px 8px", borderRadius: 20 }}>{card.change}</span>}
              {card.badge  && <span style={{ fontSize: 11, fontWeight: 600, color: card.badgeColor, background: card.bg, padding: "3px 8px", borderRadius: 20 }}>{card.badge}</span>}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}>{card.value}</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 5 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* ── Quick Access ── */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", border: "1px solid #E8EDF5", marginBottom: 24 }}>
        <h2 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700, color: "#111827" }}>Quick Access</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {QUICK_ACCESS.map(item => (
            <div key={item.title} style={{ borderRadius: 16, border: "1.5px solid #E8EDF5", overflow: "hidden", cursor: "pointer", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "transform 0.15s, box-shadow 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}>

              {/* Image with gradient overlay */}
              <div style={{ position: "relative", height: 130, overflow: "hidden" }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {/* Gradient overlay */}
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${item.color}CC, ${item.color}88)` }} />
                {/* Icon on top */}
                <div style={{ position: "absolute", top: 14, left: 14, width: 40, height: 40, borderRadius: 11, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.3)" }}>
                  {item.icon}
                </div>
                {/* Title on image */}
                <div style={{ position: "absolute", bottom: 14, left: 14, right: 14 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}>{item.title}</div>
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: "14px 16px 16px" }}>
                <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5, marginBottom: 12 }}>{item.desc}</div>
                <div
                  onClick={() => onNavigate(item.page)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    color: item.color, fontSize: 12, fontWeight: 700,
                    cursor: "pointer",
                    background: item.bg, padding: "5px 12px", borderRadius: 20,
                  }}
                >
                  Manage
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Users ── */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", border: "1px solid #E8EDF5" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Recent Users</h2>
          <button onClick={() => setShowAll(!showAll)} style={{ fontSize: 12, color: "#4F8EF7", background: "transparent", border: "none", cursor: "pointer", fontWeight: 600 }}>
            {showAll ? "Show Less ↑" : "View All →"}
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
              {["Name", "Email", "Role"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" as const }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.map((user, i) => (
              <tr key={user.id} style={{ borderBottom: i < displayed.length - 1 ? "1px solid #F9FAFB" : "none" }}>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: `${getAvatarColor(i)}22`, color: getAvatarColor(i), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{user.firstName} {user.lastName}</span>
                  </div>
                </td>
                <td style={{ padding: "12px", fontSize: 13, color: "#6B7280" }}>{user.email}</td>
                <td style={{ padding: "12px", fontSize: 13, color: "#374151", fontWeight: 500 }}>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!showAll && users.length > 5 && (
          <p style={{ margin: "12px 0 0", fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>
            +{users.length - 5} more —{" "}
            <span onClick={() => setShowAll(true)} style={{ color: "#4F8EF7", cursor: "pointer", fontWeight: 600 }}>View All</span>
          </p>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#D1D5DB" }}>
        <span>ZaVolt Admin v2.4.0 • Uptime: 99.98% • DB Latency: 12ms</span>
        <span>© 2026 ZaVolt Valuation Management Systems. All rights reserved.</span>
      </div>

      {/* ── Deployment Side Panel ── */}
      {showPanel && (
        <>
          <div onClick={closePanel} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 200 }} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 420, background: "#fff", zIndex: 201, boxShadow: "-8px 0 40px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>New Deployment</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 3 }}>Configure and launch a system deployment</div>
                </div>
                <button onClick={closePanel} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #E8EDF5", background: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#6B7280" }}>✕</button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
              {deployError && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#EF4444" }}>{deployError}</div>
              )}
              {deploySuccess && (
                <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "20px", textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🚀</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#10B981" }}>Deployment Launched!</div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Your deployment is being processed…</div>
                </div>
              )}
              <div>
                <label style={labelStyle}>Deployment Name</label>
                <input value={deployForm.deployName} onChange={e => set("deployName", e.target.value)} placeholder="e.g. Release v3.2.1" style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Version Tag</label>
                  <input value={deployForm.version} onChange={e => set("version", e.target.value)} placeholder="e.g. v3.2.1" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Environment</label>
                  <select value={deployForm.environment} onChange={e => set("environment", e.target.value)} style={inputStyle}>
                    {ENVIRONMENTS.map(env => <option key={env}>{env}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Target Service</label>
                <select value={deployForm.service} onChange={e => set("service", e.target.value)} style={inputStyle}>
                  {SERVICES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Release Notes</label>
                <textarea value={deployForm.description} onChange={e => set("description", e.target.value)} placeholder="Describe what's changing in this deployment…" rows={4} style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.6 }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F8FAFF", borderRadius: 10, padding: "12px 16px", border: "1px solid #E8EDF5" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Notify Team</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>Send deployment alert to all active users</div>
                </div>
                <div onClick={() => set("notify", !deployForm.notify)} style={{ width: 44, height: 24, borderRadius: 12, cursor: "pointer", background: deployForm.notify ? "#4F8EF7" : "#D1D5DB", position: "relative", transition: "background 0.2s" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: deployForm.notify ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
                </div>
              </div>
            </div>
            <div style={{ padding: "16px 24px", borderTop: "1px solid #F3F4F6", display: "flex", gap: 10 }}>
              <button onClick={closePanel} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid #D1D5DB", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleLaunch} style={{ flex: 2, padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#4F8EF7,#2563EB)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(79,142,247,0.35)" }}>
                🚀 Launch Deployment
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}