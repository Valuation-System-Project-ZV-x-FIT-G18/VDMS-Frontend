import type { CSSProperties } from "react";
import { useState } from "react";

interface DailyMorningReportProps {
  onNavigate?: (page: string) => void;
}

const DailyMorningReport = ({ onNavigate: _ }: DailyMorningReportProps) => {
  const [selectedDate, setSelectedDate] = useState("10/28/2023");
  const [checkedItems, setCheckedItems] = useState({
    item1: true,
    item2: false,
    item3: true,
  });

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

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
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

  const checkboxContainerStyle: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "12px",
    gap: "12px",
  };

  const checkboxStyle: CSSProperties = {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    marginTop: "2px",
    flexShrink: 0,
  };

  const checkboxLabelStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  const labelTextStyle: CSSProperties = {
    fontSize: "13px",
    fontWeight: 500,
    color: "#1f2937",
  };

  const labelSubtitleStyle: CSSProperties = {
    fontSize: "11px",
    color: "#9ca3af",
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

  const kpiGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  };

  const kpiBoxStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
  };

  const kpiLabelStyle: CSSProperties = {
    fontSize: "11px",
    color: "#6b7280",
    marginBottom: "8px",
  };

  const kpiValueStyle: CSSProperties = {
    fontSize: "20px",
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: "6px",
  };

  const kpiTrendStyle: CSSProperties = {
    fontSize: "11px",
    color: "#10b981",
  };

  const progressBarStyle: CSSProperties = {
    height: "4px",
    backgroundColor: "#e5e7eb",
    borderRadius: "2px",
    overflow: "hidden",
    marginTop: "8px",
  };

  const progressFillStyle = (percentage: number): CSSProperties => ({
    height: "100%",
    width: `${percentage}%`,
    backgroundColor: "#3b82f6",
  });

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

      {/* Main Grid: Executive Priorities | Critical Issues | KPIs */}
      <div style={gridStyle}>
        {/* Executive Priorities Card */}
        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>Executive Priorities</h2>

          {/* Item 1 */}
          <div style={checkboxContainerStyle}>
            <input
              type="checkbox"
              checked={checkedItems.item1}
              onChange={(e) =>
                setCheckedItems({ ...checkedItems, item1: e.target.checked })
              }
              style={checkboxStyle}
            />
            <div style={checkboxLabelStyle}>
              <span style={labelTextStyle}>Approve Q3 Financials</span>
              <span style={labelSubtitleStyle}>PM today</span>
            </div>
          </div>

          {/* Item 2 */}
          <div style={checkboxContainerStyle}>
            <input
              type="checkbox"
              checked={checkedItems.item2}
              onChange={(e) =>
                setCheckedItems({ ...checkedItems, item2: e.target.checked })
              }
              style={checkboxStyle}
            />
            <div style={checkboxLabelStyle}>
              <span style={labelTextStyle}>Review Merger Proposal</span>
              <span style={labelSubtitleStyle}>Tomorrow</span>
            </div>
          </div>

          {/* Item 3 */}
          <div style={checkboxContainerStyle}>
            <input
              type="checkbox"
              checked={checkedItems.item3}
              onChange={(e) =>
                setCheckedItems({ ...checkedItems, item3: e.target.checked })
              }
              style={checkboxStyle}
            />
            <div style={checkboxLabelStyle}>
              <span style={labelTextStyle}>Morning Briefing with HR</span>
              <span style={labelSubtitleStyle}>Completed at 9:15 AM</span>
            </div>
          </div>
        </div>

        {/* Critical Issues Card */}
        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>Critical Issues</h2>

          {/* Issue 1 */}
          <div style={issueCardStyle}>
            <div style={issueTitleStyle}>
              Site B Compliance Failure{" "}
              <span style={severityBadgeStyle("High")}>High</span>
            </div>
            <div style={issueDescStyle}>
              Missing documentation for site inspection
            </div>
            <span style={linkStyle}>Review Report</span>
          </div>

          {/* Issue 2 */}
          <div style={issueCardStyle}>
            <div style={issueTitleStyle}>
              Budget Variance: Project X{" "}
              <span style={severityBadgeStyle("Med")}>Med</span>
            </div>
            <div style={issueDescStyle}>40% variance in Q3 allocation</div>
            <span style={linkStyle}>View Details</span>
          </div>
        </div>

        {/* Company-Wide KPIs Card */}
        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>Company-Wide KPIs</h2>

          <div style={kpiGridStyle}>
            {/* KPI 1 */}
            <div style={kpiBoxStyle}>
              <div style={kpiLabelStyle}>Active Projects</div>
              <div style={kpiValueStyle}>4</div>
              <div style={kpiTrendStyle}>↑3 from last week</div>
              <div style={progressBarStyle}>
                <div style={progressFillStyle(80)}></div>
              </div>
            </div>

            {/* KPI 2 */}
            <div style={kpiBoxStyle}>
              <div style={kpiLabelStyle}>Avg Approval Time</div>
              <div style={kpiValueStyle}>1.2d</div>
              <div style={kpiTrendStyle}>↑0.3 from last week</div>
              <div style={progressBarStyle}>
                <div style={progressFillStyle(60)}></div>
              </div>
            </div>

            {/* KPI 3 */}
            <div style={kpiBoxStyle}>
              <div style={kpiLabelStyle}>Total Completed</div>
              <div style={kpiValueStyle}>2</div>
              <div style={kpiTrendStyle}>On track</div>
              <div style={progressBarStyle}>
                <div style={progressFillStyle(50)}></div>
              </div>
            </div>

            {/* KPI 4 */}
            <div style={kpiBoxStyle}>
              <div style={kpiLabelStyle}>Client Satisfaction</div>
              <div style={kpiValueStyle}>4.8/5</div>
              <div style={kpiTrendStyle}>+2% from last quarter</div>
              <div style={progressBarStyle}>
                <div style={progressFillStyle(96)}></div>
              </div>
            </div>
          </div>
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
