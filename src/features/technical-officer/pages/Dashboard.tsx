
import type { CSSProperties } from "react";
import {
  UploadOutlined,
  PictureOutlined,
  EnvironmentOutlined,
  UnorderedListOutlined,
  WarningOutlined,
} from "@ant-design/icons";


// ─── Mock Data ────────────────────────────────────────────────────────────────

const stats = [
  { label: "Completed", value: "28", color: "#111827" },
  { label: "In Progress", value: "8", color: "#1890ff" },
  { label: "Pending Review", value: "4", color: "#fa8c16" },
  { label: "Avg Completion", value: "3.2d", color: "#52c41a" },
];

const assignedProjects = [
  { id: "VAL-2024-089", name: "Henderson Properties", deadline: "Dec 28, 2024", progress: 82, color: "#52c41a" },
  { id: "VAL-2024-092", name: "Sarah Mitchell", deadline: "Dec 30, 2024", progress: 45, color: "#1890ff" },
  { id: "VAL-2024-087", name: "Metro Development Corp", deadline: "Dec 26, 2024", progress: 70, color: "#52c41a" },
  { id: "VAL-2024-085", name: "Johnson Family Trust", deadline: "Dec 22, 2024", progress: 30, color: "#ff4d4f" },
];

const recentActivity = [
  { icon: "📷", text: "Uploaded inspection photos – VAL-2024-089", time: "2 hours ago" },
  { icon: "📄", text: "Submitted valuation draft – VAL-2024-087", time: "4 hours ago" },
  { icon: "📁", text: "Received new assignment – VAL-2024-092", time: "Yesterday" },
  { icon: "✏️", text: "Updated property measurements – VAL-2024-085", time: "Yesterday" },
];

const quickActions = [
  { icon: <UploadOutlined style={{ fontSize: 18, color: "#fff" }} />, label: "Upload Datasheet", bg: "#1890ff" },
  { icon: <PictureOutlined style={{ fontSize: 18, color: "#fff" }} />, label: "Add Photos", bg: "#13c2c2" },
  { icon: <EnvironmentOutlined style={{ fontSize: 18, color: "#fff" }} />, label: "Upload Maps", bg: "#722ed1" },
  { icon: <UnorderedListOutlined style={{ fontSize: 18, color: "#fff" }} />, label: "View Checklist", bg: "#fa8c16" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const TechnicalOfficerDashboard = () => {
  const page: CSSProperties = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 32px 40px",
    boxSizing: "border-box",
  };

  const card: CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "20px",
  };

  return (
    <div style={page}>

      {/* ── Page Title ── */}
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: "0 0 24px" }}>
        Technical Officer Dashboard
      </h1>

      {/* ── Welcome Banner ── */}
      <div
        style={{
          ...card,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          background: "linear-gradient(135deg, #f8faff 0%, #ffffff 100%)",
        }}
      >
        <div>
          <p style={{ fontSize: "18px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
            Welcome back, Technical Officer
          </p>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
            Here's what's happening with your valuations today.
          </p>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#fff1f0",
            color: "#dc2626",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            padding: "8px 14px",
            fontSize: "13px",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          <WarningOutlined />
          1 Overdue Project Requires Attention
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {stats.map((s) => (
          <div key={s.label} style={card}>
            <p style={{ fontSize: "36px", fontWeight: 700, color: s.color, margin: "0 0 4px" }}>
              {s.value}
            </p>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Bottom Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px" }}>

        {/* Assigned Projects */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: 0 }}>
              Assigned Projects
            </p>
            <span 
              style={{ fontSize: "13px", color: "#1890ff", cursor: "pointer", fontWeight: 500 }}
            >
              View All
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {assignedProjects.map((proj) => (
              <div key={proj.id}>
                <div style={{ marginBottom: "4px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>{proj.id}</span>
                  <span style={{ fontSize: "14px", color: "#374151" }}> – {proj.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px" }}>🏷️</span>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>Deadline: {proj.deadline}</span>
                </div>
                <div style={{ height: "7px", backgroundColor: "#f3f4f6", borderRadius: "4px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${proj.progress}%`,
                      backgroundColor: proj.color,
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Quick Actions */}
          <div style={card}>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: "0 0 16px" }}>
              Quick Actions
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {quickActions.map((qa, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "14px 8px",
                    borderRadius: "10px",
                    backgroundColor: qa.bg,
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = "0.85")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = "1")}
                >
                  {qa.icon}
                  <span style={{ fontSize: "11px", color: "#fff", fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>
                    {qa.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={card}>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: "0 0 16px" }}>
              Recent Activity
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {recentActivity.map((act, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>{act.icon}</span>
                  <div>
                    <p style={{ fontSize: "13px", color: "#374151", margin: "0 0 2px", lineHeight: 1.4 }}>
                      {act.text}
                    </p>
                    <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TechnicalOfficerDashboard;