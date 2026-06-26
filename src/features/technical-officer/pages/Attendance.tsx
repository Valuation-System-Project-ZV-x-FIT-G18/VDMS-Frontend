import { useCallback, useEffect, useState, type CSSProperties } from "react";

type AttendanceStatus = "Not Checked In" | "Checked In" | "Completed" | "Late" | "Missed";
type MessageType = "success" | "error";

interface AttendanceApiRecord {
  id?: string;
  officerName: string;
  attendanceDate: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  totalHours: string | number | null;
  status: AttendanceStatus;
  createdAt?: string;
  updatedAt?: string;
}

interface AttendanceRow {
  date: string;
  day: string;
  checkIn: string;
  checkOut: string;
  totalHours: string;
  status: AttendanceStatus;
  sortDate: string;
  id?: string;
}

interface AttendanceMessage {
  type: MessageType;
  text: string;
}

const API_BASE_URL = "http://localhost:3000/technical-officer/attendance";
const OFFICER_NAME = "John Doe";

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatDay = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
  });

const parseDateValue = (dateValue: string) => {
  const date = new Date(`${dateValue}T00:00:00`);
  return Number.isNaN(date.getTime()) ? new Date(dateValue) : date;
};

const formatTotalHours = (totalHours: string | number | null) => {
  if (totalHours === null || totalHours === undefined) {
    return "-";
  }

  const numericTotalHours = Number(totalHours);

  if (Number.isNaN(numericTotalHours)) {
    return "-";
  }

  const totalMinutes = Math.round(numericTotalHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};

// Note: extract a readable error message from failed backend responses.
const getErrorMessage = async (response: Response) => {
  const fallbackMessage = `Request failed with status ${response.status}`;

  try {
    const data = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(data.message)) {
      return data.message.join(" ");
    }

    return data.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

const mapRecordToRow = (record: AttendanceApiRecord): AttendanceRow => {
  const attendanceDate = parseDateValue(record.attendanceDate);

  return {
    id: record.id,
    date: formatDate(attendanceDate),
    day: formatDay(attendanceDate),
    checkIn: record.checkInTime ? formatTime(new Date(record.checkInTime)) : "-",
    checkOut: record.checkOutTime ? formatTime(new Date(record.checkOutTime)) : "-",
    totalHours: formatTotalHours(record.totalHours),
    status: record.status,
    sortDate: record.attendanceDate,
  };
};

const rowStatusStyle: Record<AttendanceStatus, CSSProperties> = {
  "Not Checked In": { backgroundColor: "#f9fafb", color: "#374151" },
  "Checked In": { backgroundColor: "#f6ffed", color: "#389e0d" },
  Late: { backgroundColor: "#fff7e6", color: "#d46b08" },
  Missed: { backgroundColor: "#fff1f0", color: "#dc2626" },
  Completed: { backgroundColor: "#e6f4ff", color: "#096dd9" },
};

const Attendance = () => {
  const [todayAttendance, setTodayAttendance] = useState<AttendanceApiRecord | null>(null);
  const [history, setHistory] = useState<AttendanceApiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingAction, setSubmittingAction] = useState<"check-in" | "check-out" | null>(null);
  const [message, setMessage] = useState<AttendanceMessage | null>(null);

  const loadAttendance = useCallback(async () => {
    // Note: error handling for loading today's attendance and attendance history.
    try {
      setLoading(true);
      const todayUrl = `${API_BASE_URL}/today?officerName=${encodeURIComponent(OFFICER_NAME)}`;
      const [todayResponse, historyResponse] = await Promise.all([fetch(todayUrl), fetch(API_BASE_URL)]);

      if (!todayResponse.ok) {
        throw new Error(await getErrorMessage(todayResponse));
      }

      if (!historyResponse.ok) {
        throw new Error(await getErrorMessage(historyResponse));
      }

      const todayData = (await todayResponse.json()) as AttendanceApiRecord;
      const historyData = (await historyResponse.json()) as AttendanceApiRecord[];

      setTodayAttendance(todayData);
      setHistory(historyData);
    } catch (error) {
      console.error("Error loading attendance:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to load attendance.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAttendance();
  }, [loadAttendance]);

  const todayRow = todayAttendance ? mapRecordToRow(todayAttendance) : null;
  const todayHasPersistedRecord = Boolean(todayAttendance?.id);
  const attendanceRows = history
    .map(mapRecordToRow)
    .sort((firstRow, secondRow) => secondRow.sortDate.localeCompare(firstRow.sortDate));
  const attendanceStatus = todayAttendance?.status ?? "Not Checked In";

  const page: CSSProperties = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 32px 40px",
    boxSizing: "border-box",
  };

  const card: CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    padding: "20px",
    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
  };

  const buttonStyle: CSSProperties = {
    border: "none",
    borderRadius: "6px",
    padding: "10px 18px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  };

  const submitAttendanceAction = async (action: "check-in" | "check-out") => {
    // Note: error handling for Check In and Check Out backend requests.
    try {
      setSubmittingAction(action);
      setMessage(null);
      const response = await fetch(`${API_BASE_URL}/${action}`, {
        method: action === "check-in" ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ officerName: OFFICER_NAME }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      setMessage({
        type: "success",
        text: action === "check-in" ? "Checked in successfully." : "Checked out successfully.",
      });
      await loadAttendance();
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : action === "check-in"
              ? "Failed to check in."
              : "Failed to check out.",
      });
    } finally {
      setSubmittingAction(null);
    }
  };

  return (
    <div style={page}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
            Attendance
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
            Record daily field attendance with backend check-in and check-out records.
          </p>
        </div>
        <span
          style={{
            alignSelf: "flex-start",
            ...rowStatusStyle[attendanceStatus],
            borderRadius: "6px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          {attendanceStatus}
        </span>
      </div>

      <section style={{ ...card, marginBottom: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "20px", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "16px", color: "#111827", fontWeight: 700, margin: "0 0 10px" }}>
              Today's Attendance
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "18px" }}>
              <div>
                <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: 700, margin: "0 0 4px" }}>Check In</p>
                <p style={{ color: "#111827", fontSize: "18px", fontWeight: 700, margin: 0 }}>
                  {todayRow?.checkIn ?? "-"}
                </p>
              </div>
              <div>
                <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: 700, margin: "0 0 4px" }}>Check Out</p>
                <p style={{ color: "#111827", fontSize: "18px", fontWeight: 700, margin: 0 }}>
                  {todayRow?.checkOut ?? "-"}
                </p>
              </div>
              <div>
                <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: 700, margin: "0 0 4px" }}>Total</p>
                <p style={{ color: "#111827", fontSize: "18px", fontWeight: 700, margin: 0 }}>
                  {todayRow?.totalHours ?? "-"}
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              style={{
                ...buttonStyle,
                backgroundColor: "#7ca668",
                color: "#ffffff",
                opacity: loading || submittingAction !== null || todayHasPersistedRecord ? 0.65 : 1,
              }}
              onClick={() => void submitAttendanceAction("check-in")}
              disabled={loading || submittingAction !== null || todayHasPersistedRecord}
            >
              {submittingAction === "check-in" ? "Checking In..." : "Check In"}
            </button>
            <button
              style={{
                ...buttonStyle,
                backgroundColor: "#e23f41",
                color: "#ffffff",
                opacity: loading || submittingAction !== null || !todayAttendance?.checkInTime || Boolean(todayAttendance?.checkOutTime) ? 0.65 : 1,
              }}
              onClick={() => void submitAttendanceAction("check-out")}
              disabled={loading || submittingAction !== null || !todayAttendance?.checkInTime || Boolean(todayAttendance?.checkOutTime)}
            >
              {submittingAction === "check-out" ? "Checking Out..." : "Check Out"}
            </button>
          </div>
        </div>

        {message && (
          <p
            style={{
              color: message.type === "success" ? "#15803d" : "#dc2626",
              fontSize: "13px",
              fontWeight: 700,
              margin: "14px 0 0",
            }}
          >
            {message.text}
          </p>
        )}
      </section>

      <section style={card}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>
          Attendance History
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#21bb36" }}>
              {["Date", "Day", "Check In", "Check Out", "Total Hours", "Status"].map((column) => (
                <th
                  key={column}
                  style={{
                    textAlign: "left",
                    padding: "12px 14px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#374151",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} style={{ padding: "18px 14px", fontSize: "14px", color: "#6b7280", textAlign: "center" }}>
                  Loading attendance...
                </td>
              </tr>
            )}
            {!loading && attendanceRows.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "18px 14px", fontSize: "14px", color: "#6b7280", textAlign: "center" }}>
                  No attendance records found.
                </td>
              </tr>
            )}
            {!loading && attendanceRows.map((row, index) => (
              <tr key={row.id ?? `${row.date}-${row.checkIn}-${index}`} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "14px", fontSize: "14px", color: "#374151" }}>{row.date}</td>
                <td style={{ padding: "14px", fontSize: "14px", color: "#374151" }}>{row.day}</td>
                <td style={{ padding: "14px", fontSize: "14px", color: "#374151" }}>{row.checkIn}</td>
                <td style={{ padding: "14px", fontSize: "14px", color: "#374151" }}>{row.checkOut}</td>
                <td style={{ padding: "14px", fontSize: "14px", color: "#374151" }}>{row.totalHours}</td>
                <td style={{ padding: "14px" }}>
                  <span
                    style={{
                      ...rowStatusStyle[row.status],
                      borderRadius: "6px",
                      padding: "4px 10px",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Attendance;
