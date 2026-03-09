import { useState, useRef, type CSSProperties } from "react";
import { SearchOutlined, DownloadOutlined, InboxOutlined } from "@ant-design/icons";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const stats = [
  { label: "Total Documents",    value: "32", color: "#1890ff" },
  { label: "Pending Review",     value: "8",  color: "#1890ff" },
  { label: "Approved",           value: "24", color: "#1890ff" },
  { label: "Uploaded This Month",value: "15", color: "#1890ff" },
];

type DocStatus = "Completed" | "Under Review" | "Pending";

const documents: {
  name: string;
  type: string;
  size: string;
  date: string;
  status: DocStatus;
}[] = [
  { name: "Inspection Photos.zip", type: "ZIP",   size: "15 MB", date: "02 Feb 2026", status: "Completed"   },
  { name: "Property Map.pdf",      type: "PDF",   size: "5 MB",  date: "28 Jan 2026", status: "Under Review" },
  { name: "Checklist.docx",        type: "Word",  size: "1.2 MB",date: "30 Jan 2026", status: "Pending"      },
  { name: "Site Plan.png",         type: "Image", size: "3 MB",  date: "25 Jan 2026", status: "Completed"    },
  { name: "Inspection Photos.zip", type: "ZIP",   size: "15 MB", date: "02 Feb 2026", status: "Completed"    },
  { name: "Property Map.pdf",      type: "PDF",   size: "5 MB",  date: "28 Jan 2026", status: "Under Review" },
  { name: "Checklist.docx",        type: "Word",  size: "1.2 MB",date: "30 Jan 2026", status: "Pending"      },
  { name: "Site Plan.png",         type: "Image", size: "3 MB",  date: "25 Jan 2026", status: "Completed"    },
];

const statusStyle: Record<DocStatus, CSSProperties> = {
  Completed:    { backgroundColor: "#52c41a", color: "#fff" },
  "Under Review": { backgroundColor: "#1890ff", color: "#fff" },
  Pending:      { backgroundColor: "#fa8c16", color: "#fff" },
};

// ─── Main Component ───────────────────────────────────────────────────────────

const Documents = () => {
  const [search, setSearch] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = documents.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
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
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: "0 0 24px" }}>
        Documents
      </h1>

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
            <p style={{ fontSize: "32px", fontWeight: 700, color: s.color, margin: "0 0 4px" }}>
              {s.value}
            </p>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Search Bar ── */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <div
          style={{
            ...card,
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flex: 1,
          }}
        >
          <SearchOutlined style={{ color: "#9ca3af", fontSize: "16px" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
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
        {/* Filter placeholder */}
        <div
          style={{
            ...card,
            padding: "10px 16px",
            width: "160px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9ca3af",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Filter
        </div>
      </div>

      {/* ── Drag & Drop Upload ── */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
        style={{
          border: `2px dashed ${dragOver ? "#096dd9" : "#1890ff"}`,
          borderRadius: "12px",
          backgroundColor: dragOver ? "#e6f4ff" : "#f0f7ff",
          padding: "36px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          cursor: "pointer",
          marginBottom: "20px",
          transition: "background 0.2s",
        }}
      >
        <InboxOutlined style={{ fontSize: "22px", color: "#1890ff" }} />
        <span style={{ fontSize: "15px", color: "#1890ff", fontWeight: 600 }}>
          Drag & Drop files or Click to Upload
        </span>
        <input ref={fileInputRef} type="file" multiple style={{ display: "none" }} />
      </div>

      {/* ── Document Cards Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
        }}
      >
        {filtered.map((doc, i) => (
          <div key={i} style={{ ...card, padding: "16px" }}>

            {/* File Name */}
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", margin: "0 0 4px", lineHeight: 1.4 }}>
              {doc.name}
            </p>

            {/* Meta */}
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 14px" }}>
              {doc.type} • {doc.size} • {doc.date}
            </p>

            {/* Status + Download */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
              <span
                style={{
                  ...statusStyle[doc.status],
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {doc.status}
              </span>
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  backgroundColor: "transparent",
                  color: "#9ca3af",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: "4px 6px",
                  borderRadius: "6px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#1890ff")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#9ca3af")
                }
              >
                <DownloadOutlined />
                Download
              </button>
            </div>
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
            No documents found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;