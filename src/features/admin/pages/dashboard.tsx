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
      </div>


      {/* ── Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, marginBottom: 24 }}>
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


    </div>
  );
}