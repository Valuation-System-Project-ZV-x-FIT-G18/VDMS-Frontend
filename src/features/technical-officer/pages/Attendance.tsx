import { useState, type CSSProperties } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const summaryCards = [
  { label: "Today",      value: "9:02 AM – 5:10 PM", color: "#1890ff" },
  { label: "This Week",  value: "40 Hours",            color: "#1890ff" },
  { label: "This Month", value: "168 Hours",           color: "#1890ff" },
  { label: "Total",      value: "960 Hours",           color: "#1890ff" },
];

type AttStatus = "On Time" | "Late" | "Missed";

const attendance: {
  date: string;
  day: string;
  checkIn: string;
  checkOut: string;
  totalHours: string;
  status: AttStatus;
}[] = [
  { date: "08 Feb 2026", day: "Monday",   checkIn: "9:02 AM", checkOut: "5:10 PM", totalHours: "8h 8m",  status: "On Time" },
  { date: "07 Feb 2026", day: "Sunday",   checkIn: "9:15 AM", checkOut: "5:05 PM", totalHours: "7h 50m", status: "Late"    },
  { date: "06 Feb 2026", day: "Saturday", checkIn: "–",       checkOut: "–",       totalHours: "0h",     status: "Missed"  },
  { date: "05 Feb 2026", day: "Friday",   checkIn: "9:05 AM", checkOut: "5:10 PM", totalHours: "8h 5m",  status: "On Time" },
  { date: "04 Feb 2026", day: "Thursday", checkIn: "9:20 AM", checkOut: "5:00 PM", totalHours: "7h 40m", status: "Late"    },
];

const statusStyle: Record<AttStatus, CSSProperties> = {
  "On Time": { backgroundColor: "#52c41a", color: "#fff" },
  Late:      { backgroundColor: "#fa8c16", color: "#fff" },
  Missed:    { backgroundColor: "#ff4d4f", color: "#fff" },
};

// ─── Main Component ───────────────────────────────────────────────────────────

const Attendance = () => {
  const [checkedIn, setCheckedIn] = useState(false);

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
        Attendance Dashboard
      </h1>

      {/* ── Check In / Check Out Buttons ── */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button
          onClick={() => setCheckedIn(true)}
          style={{
            backgroundColor: checkedIn ? "#b7eb8f" : "#52c41a",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 28px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: checkedIn ? "default" : "pointer",
            transition: "background 0.2s",
            minWidth: "110px",
          }}
          onMouseEnter={(e) => {
            if (!checkedIn)
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#389e0d";
          }}
          onMouseLeave={(e) => {
            if (!checkedIn)
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#52c41a";
          }}
        >
          Check In
        </button>
        <button
          onClick={() => setCheckedIn(false)}
          style={{
            backgroundColor: "#ff4d4f",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 28px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "background 0.2s",
            minWidth: "110px",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#cf1322")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ff4d4f")
          }
        >
          Check Out
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {summaryCards.map((s) => (
          <div key={s.label} style={{ ...card, padding: "24px 20px" }}>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 8px", fontWeight: 500 }}>
              {s.label}
            </p>
            <p style={{ fontSize: "22px", fontWeight: 700, color: s.color, margin: 0, lineHeight: 1.2 }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Attendance Table ── */}
      <div style={card}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb" }}>
              {["Date", "Day", "Check-In", "Check-Out", "Total Hours", "Status"].map((col) => (
                <th
                  key={col}
                  style={{
                    textAlign: "left",
                    padding: "12px 16px",
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
            {attendance.map((row, i) => (
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
                <td style={{ padding: "16px", fontSize: "14px", color: "#374151" }}>{row.date}</td>
                <td style={{ padding: "16px", fontSize: "14px", color: "#374151" }}>{row.day}</td>
                <td style={{ padding: "16px", fontSize: "14px", color: "#374151" }}>{row.checkIn}</td>
                <td style={{ padding: "16px", fontSize: "14px", color: "#374151" }}>{row.checkOut}</td>
                <td style={{ padding: "16px", fontSize: "14px", color: "#374151" }}>{row.totalHours}</td>
                <td style={{ padding: "16px" }}>
                  <span
                    style={{
                      ...statusStyle[row.status],
                      padding: "4px 14px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 600,
                      display: "inline-block",
                    }}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Attendance;