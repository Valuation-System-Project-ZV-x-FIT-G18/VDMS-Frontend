import { useState, type CSSProperties } from "react";
import { SearchOutlined } from "@ant-design/icons";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const stats = [
  { label: "Total Projects", value: "12", color: "#1890ff" },
  { label: "In Progress",    value: "6",  color: "#1890ff" },
  { label: "Completed",      value: "4",  color: "#1890ff" },
  { label: "Overdue",        value: "2",  color: "#1890ff" },
];

const projects = [
  {
    id: "VAL-2024-089",
    name: "Henderson Properties",
    deadline: "Dec 28",
    progress: 60,
    overdue: false,
    progressColor: "#1890ff",
  },
  {
    id: "VAL-2024-092",
    name: "Sarah Mitchell",
    deadline: "Dec 30",
    progress: 40,
    overdue: false,
    progressColor: "#1890ff",
  },
  {
    id: "VAL-2024-087",
    name: "Metro Development",
    deadline: "Dec 26",
    progress: 35,
    overdue: false,
    progressColor: "#1890ff",
  },
  {
    id: "VAL-2024-085",
    name: "Johnson Trust",
    deadline: "Dec 22",
    progress: 30,
    overdue: true,
    progressColor: "#ff4d4f",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const AssignedProjects = () => {
  const [search, setSearch] = useState("");

  const filtered = projects.filter(
    (p) =>
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
  );

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
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>
        Assigned Projects
      </h1>

      {/* ── Search Bar ── */}
      <div
        style={{
          ...card,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <SearchOutlined style={{ color: "#9ca3af", fontSize: "16px" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          style={{
            border: "none",
            outline: "none",
            fontSize: "14px",
            color: "#374151",
            width: "100%",
            background: "transparent",
          }}
        />
      </div>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {stats.map((s) => (
          <div key={s.label} style={card}>
            <p style={{ fontSize: "28px", fontWeight: 700, color: s.color, margin: "0 0 4px" }}>
              {s.value}
            </p>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Project Cards Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        {filtered.map((proj) => (
          <div key={proj.id} style={card}>
            {/* Header */}
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
              {proj.id} – {proj.name}
            </p>

            {/* Deadline */}
            <p
              style={{
                fontSize: "13px",
                color: proj.overdue ? "#dc2626" : "#6b7280",
                margin: "0 0 12px",
              }}
            >
              Deadline: {proj.deadline}
              {proj.overdue && (
                <span style={{ fontWeight: 600 }}> (Overdue)</span>
              )}
            </p>

            {/* Progress Bar */}
            <div
              style={{
                height: "7px",
                backgroundColor: "#f3f4f6",
                borderRadius: "4px",
                overflow: "hidden",
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${proj.progress}%`,
                  backgroundColor: proj.progressColor,
                  borderRadius: "4px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>

            {/* Open Project Button */}
            <button
              style={{
                backgroundColor: "#1890ff",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "7px 18px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#096dd9")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1890ff")
              }
            >
              Open Project
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "60px 0",
              color: "#9ca3af",
              fontSize: "14px",
            }}
          >
            No projects found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedProjects;