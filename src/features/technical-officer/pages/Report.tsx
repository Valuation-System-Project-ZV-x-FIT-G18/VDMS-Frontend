import type { CSSProperties } from "react";
import { DownloadOutlined } from "@ant-design/icons";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const stats = [
  { label: "Total Reports",  value: "32",  color: "#1890ff" },
  { label: "Pending Review", value: "6",   color: "#1890ff" },
  { label: "Accuracy Rate",  value: "94%", color: "#1890ff" },
];

type StatusType = "Completed" | "Pending" | "Review";

const reports: {
  id: string;
  title: string;
  date: string;
  status: StatusType;
}[] = [
  { id: "VAL-089", title: "Valuation Report",    date: "06 Feb 2026", status: "Completed" },
  { id: "VAL-087", title: "Inspection Summary",  date: "05 Feb 2026", status: "Pending"   },
  { id: "VAL-085", title: "Final Approval",      date: "04 Feb 2026", status: "Review"    },
  { id: "VAL-90",  title: "Valuation Report",    date: "06 Feb 2026", status: "Completed" },
];

const statusStyle: Record<StatusType, CSSProperties> = {
  Completed: { backgroundColor: "#52c41a", color: "#fff" },
  Pending:   { backgroundColor: "#fa8c16", color: "#fff" },
  Review:    { backgroundColor: "#1890ff", color: "#fff" },
};

const reportCategories = [
  { label: "Valuation Reports",  count: "12/32", progress: 38, color: "#52c41a" },
  { label: "Inspection Reports", count: "10/32", progress: 31, color: "#fa8c16" },
  { label: "Approval Reports",   count: "10/32", progress: 31, color: "#1890ff" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const Reports = () => {
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
        Reports & Analytics
      </h1>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {stats.map((s) => (
          <div key={s.label} style={card}>
            <p style={{ fontSize: "32px", fontWeight: 700, color: s.color, margin: "0 0 4px" }}>
              {s.value}
            </p>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Recent Reports Table ── */}
      <div style={{ ...card, marginBottom: "20px" }}>
        <p style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>
          Recent Reports
        </p>

        {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb" }}>
              {["Report ID", "Title", "Date", "Status", "Download"].map((col) => (
                <th
                  key={col}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#374151",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <tr
                key={i}
                style={{ borderBottom: "1px solid #f3f4f6" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = "#f9fafb")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = "transparent")
                }
              >
                <td style={{ padding: "14px", fontSize: "14px", color: "#111827", fontWeight: 500 }}>
                  {r.id}
                </td>
                <td style={{ padding: "14px", fontSize: "14px", color: "#374151" }}>
                  {r.title}
                </td>
                <td style={{ padding: "14px", fontSize: "14px", color: "#6b7280" }}>
                  {r.date}
                </td>
                <td style={{ padding: "14px" }}>
                  <span
                    style={{
                      ...statusStyle[r.status],
                      padding: "4px 14px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 600,
                      display: "inline-block",
                    }}
                  >
                    {r.status}
                  </span>
                </td>
                <td style={{ padding: "14px" }}>
                  <button
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "#1890ff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 16px",
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
                    <DownloadOutlined />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Report Category Progress Bars ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        {reportCategories.map((cat) => (
          <div key={cat.label} style={{ ...card, padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <p style={{ fontSize: "13px", color: "#374151", fontWeight: 500, margin: 0 }}>
                {cat.label}
              </p>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, fontWeight: 500 }}>
                {cat.count}
              </p>
            </div>
            <div
              style={{
                height: "8px",
                backgroundColor: "#f3f4f6",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${cat.progress}%`,
                  backgroundColor: cat.color,
                  borderRadius: "4px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Reports;