import type { CSSProperties } from "react";
import { useState } from "react";

interface DailyMorningReportProps {
  onNavigate?: (page: string) => void;
}

const DailyMorningReport = ({ onNavigate: _ }: DailyMorningReportProps) => {
  const [selectedDate, setSelectedDate] = useState("10/28/2023");

  const containerStyle: CSSProperties = {
    padding: "32px",
    backgroundColor: "#ffffff",
    minHeight: "100vh",
  };

  const headerStyle: CSSProperties = {
    marginBottom: "32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const titleStyle: CSSProperties = {
    fontSize: "26px",
    fontWeight: 600,
    color: "#1f2937",
    margin: 0,
  };

  const datePickerStyle: CSSProperties = {
    padding: "8px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
  };

  const summaryGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "40px",
  };

  const summaryCardStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    textAlign: "center",
  };

  const summaryIconStyle: CSSProperties = {
    fontSize: "32px",
    marginBottom: "12px",
  };

  const summaryLabelStyle: CSSProperties = {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: 500,
    marginBottom: "8px",
  };

  const summaryValueStyle: CSSProperties = {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: "8px",
  };

  const summaryDescStyle: CSSProperties = {
    fontSize: "11px",
    color: "#9ca3af",
    lineHeight: "1.4",
  };

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "24px",
    marginBottom: "40px",
  };

  const cardStyle: CSSProperties = {
    backgroundColor: "#f9fafb",
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  };

  const cardTitleStyle: CSSProperties = {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1f2937",
    marginBottom: "16px",
    margin: "0 0 16px 0",
  };

  const issueCardStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
    marginBottom: "8px",
  };

  const severityBadgeStyle = (
    severity: "High" | "Med" | "Low",
  ): CSSProperties => {
    let bgColor = "#fecaca";
    let textColor = "#991b1b";
    if (severity === "Med") {
      bgColor = "#fed7aa";
      textColor = "#92400e";
    }
    if (severity === "Low") {
      bgColor = "#bbf7d0";
      textColor = "#065f46";
    }

    return {
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: "4px",
      fontSize: "10px",
      fontWeight: 600,
      backgroundColor: bgColor,
      color: textColor,
    };
  };

  const issueTitleStyle: CSSProperties = {
    fontSize: "13px",
    fontWeight: 600,
    color: "#1f2937",
    marginBottom: "4px",
  };

  const issueDescStyle: CSSProperties = {
    fontSize: "11px",
    color: "#6b7280",
    marginBottom: "8px",
  };

  const linkStyle: CSSProperties = {
    color: "#3b82f6",
    fontSize: "11px",
    fontWeight: 600,
    cursor: "pointer",
    marginRight: "12px",
    textDecoration: "none",
  };

  const secureShareSectionStyle: CSSProperties = {
    backgroundColor: "#f0f9ff",
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #bfdbfe",
    marginBottom: "32px",
  };

  const shareTitleStyle: CSSProperties = {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1f2937",
    marginBottom: "12px",
  };

  const shareDescStyle: CSSProperties = {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "16px",
  };

  const buttonStyle: CSSProperties = {
    padding: "8px 16px",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "16px",
  };

  const shareTableStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
  };

  const shareItemStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
  };

  const shareItemRowStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
    fontSize: "12px",
  };

  const shareItemLabelStyle: CSSProperties = {
    color: "#6b7280",
    fontWeight: 500,
  };

  const shareItemValueStyle: CSSProperties = {
    color: "#1f2937",
    fontWeight: 600,
  };

  const actionButtonsStyle: CSSProperties = {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  };

  const smallButtonStyle: CSSProperties = {
    padding: "4px 10px",
    backgroundColor: "#f3f4f6",
    color: "#3b82f6",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 600,
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      {/* Header with Date Picker */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Daily Morning Report & Operations</h1>
        <input
          type="text"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={datePickerStyle}
        />
      </div>

      {/* Yesterday's Workflow Summary - Visual Cards */}
      <div style={summaryGridStyle}>
        {/* Projects Completed */}
        <div style={summaryCardStyle}>
          <div style={summaryIconStyle}>✅</div>
          <div style={summaryLabelStyle}>Projects Completed</div>
          <div style={summaryValueStyle}>2</div>
          <div style={summaryDescStyle}>Successfully finalized</div>
        </div>

        {/* Active Projects */}
        <div style={summaryCardStyle}>
          <div style={summaryIconStyle}>⚡</div>
          <div style={summaryLabelStyle}>Active Projects</div>
          <div style={summaryValueStyle}>4</div>
          <div style={summaryDescStyle}>Advanced to next phase</div>
        </div>

        {/* Issues Found */}
        <div style={{ ...summaryCardStyle, borderLeft: "4px solid #ef4444" }}>
          <div style={summaryIconStyle}>⚠️</div>
          <div style={summaryLabelStyle}>Critical Issues</div>
          <div style={summaryValueStyle}>2</div>
          <div style={summaryDescStyle}>Require attention</div>
        </div>

        {/* Meetings Completed */}
        <div style={summaryCardStyle}>
          <div style={summaryIconStyle}>📅</div>
          <div style={summaryLabelStyle}>Meetings</div>
          <div style={summaryValueStyle}>1</div>
          <div style={summaryDescStyle}>Morning briefing with HR</div>
        </div>
      </div>

      {/* Secure Document Sharing Section */}
      <div style={secureShareSectionStyle}>
        <h2 style={shareTitleStyle}>🔐 Secure Document Sharing</h2>
        <p style={shareDescStyle}>
          Generate and manage secure share links for sensitive project documents
        </p>
        <button
          style={buttonStyle}
          onClick={() => console.log("Generate Secure Share Link")}
        >
          + Generate Secure Share Link
        </button>

        {/* Active Secure Shares */}
        <h3
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#1f2937",
            marginBottom: "12px",
          }}
        >
          Active Secure Share Links
        </h3>
        <div style={shareTableStyle}>
          {/* Share Item 1 */}
          <div style={shareItemStyle}>
            <div style={shareItemRowStyle}>
              <span style={shareItemLabelStyle}>Project ID</span>
              <span style={shareItemValueStyle}>PID-0042</span>
            </div>
            <div style={shareItemRowStyle}>
              <span style={shareItemLabelStyle}>Created Date</span>
              <span style={shareItemValueStyle}>Oct 26, 2023</span>
            </div>
            <div style={shareItemRowStyle}>
              <span style={shareItemLabelStyle}>Expires</span>
              <span style={{ ...shareItemValueStyle, color: "#ef4444" }}>
                In 2 days
              </span>
            </div>
            <div style={shareItemRowStyle}>
              <span style={shareItemLabelStyle}>Access Count</span>
              <span style={shareItemValueStyle}>12</span>
            </div>
            <div style={actionButtonsStyle}>
              <button style={smallButtonStyle}>Regenerate</button>
              <button style={smallButtonStyle}>Revoke</button>
            </div>
          </div>

          {/* Share Item 2 */}
          <div style={shareItemStyle}>
            <div style={shareItemRowStyle}>
              <span style={shareItemLabelStyle}>Project ID</span>
              <span style={shareItemValueStyle}>PID-0089</span>
            </div>
            <div style={shareItemRowStyle}>
              <span style={shareItemLabelStyle}>Created Date</span>
              <span style={shareItemValueStyle}>Oct 27, 2023</span>
            </div>
            <div style={shareItemRowStyle}>
              <span style={shareItemLabelStyle}>Expires</span>
              <span style={{ ...shareItemValueStyle, color: "#ef4444" }}>
                Expires today
              </span>
            </div>
            <div style={shareItemRowStyle}>
              <span style={shareItemLabelStyle}>Access Count</span>
              <span style={shareItemValueStyle}>8</span>
            </div>
            <div style={actionButtonsStyle}>
              <button style={smallButtonStyle}>Regenerate</button>
              <button style={smallButtonStyle}>Revoke</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyMorningReport;
