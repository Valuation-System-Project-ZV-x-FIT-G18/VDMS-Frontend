import type { CSSProperties } from "react";
import { useState, useEffect } from "react";
import { dashboardService } from "../../../services/dashboardService";

interface DailyMorningReportProps {
  onNavigate?: (page: string) => void;
}

const DailyMorningReport = ({ onNavigate: _ }: DailyMorningReportProps) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-US"),
  );
  const [report, setReport] = useState<any>({
    completedProjects: 0,
    activeProjects: 0,
    criticalIssues: 0,
    meetings: 0,
  });
  const [shareLinks, setShareLinks] = useState<any[]>([
    {
      projectId: "PID-0042",
      createdDate: "Oct 26, 2023",
      expires: "In 2 days",
      accessCount: 12,
    },
    {
      projectId: "PID-0089",
      createdDate: "Oct 27, 2023",
      expires: "Expires today",
      accessCount: 8,
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getMorningReport();
        setReport(data);
      } catch (error) {
        console.error("Failed to fetch morning report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

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

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <p>Loading morning report...</p>
      </div>
    );
  }

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

      {/* Summary Cards — now from backend */}
      <div style={summaryGridStyle}>
        <div style={summaryCardStyle}>
          <div style={summaryIconStyle}>✅</div>
          <div style={summaryLabelStyle}>Projects Completed</div>
          <div style={summaryValueStyle}>{report.completedProjects}</div>
          <div style={summaryDescStyle}>Successfully finalized</div>
        </div>

        <div style={summaryCardStyle}>
          <div style={summaryIconStyle}>⚡</div>
          <div style={summaryLabelStyle}>Active Projects</div>
          <div style={summaryValueStyle}>{report.activeProjects}</div>
          <div style={summaryDescStyle}>Advanced to next phase</div>
        </div>

        <div
          style={{ ...summaryCardStyle, borderLeft: "4px solid #ef4444" }}
        >
          <div style={summaryIconStyle}>⚠️</div>
          <div style={summaryLabelStyle}>Critical Issues</div>
          <div style={summaryValueStyle}>{report.criticalIssues}</div>
          <div style={summaryDescStyle}>Require attention</div>
        </div>

        <div style={summaryCardStyle}>
          <div style={summaryIconStyle}>📅</div>
          <div style={summaryLabelStyle}>Meetings</div>
          <div style={summaryValueStyle}>{report.meetings}</div>
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
          {shareLinks.map((link, index) => (
            <div key={index} style={shareItemStyle}>
              <div style={shareItemRowStyle}>
                <span style={shareItemLabelStyle}>Project ID</span>
                <span style={shareItemValueStyle}>{link.projectId}</span>
              </div>
              <div style={shareItemRowStyle}>
                <span style={shareItemLabelStyle}>Created Date</span>
                <span style={shareItemValueStyle}>{link.createdDate}</span>
              </div>
              <div style={shareItemRowStyle}>
                <span style={shareItemLabelStyle}>Expires</span>
                <span style={{ ...shareItemValueStyle, color: "#ef4444" }}>
                  {link.expires}
                </span>
              </div>
              <div style={shareItemRowStyle}>
                <span style={shareItemLabelStyle}>Access Count</span>
                <span style={shareItemValueStyle}>{link.accessCount}</span>
              </div>
              <div style={actionButtonsStyle}>
                <button style={smallButtonStyle}>Regenerate</button>
                <button style={smallButtonStyle}>Revoke</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyMorningReport;