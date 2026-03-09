import type { CSSProperties } from "react";
import { useState } from "react";

interface VersionItem {
  id: string;
  version: string;
  status: "Active" | "Revised" | "Initial";
  date: string;
  time: string;
  author: string;
}

const VersionHistory = () => {
  const [selectedVersion, setSelectedVersion] = useState("V3");
  const [comparingVersion, setComparingVersion] = useState("V1");
  const [viewMode, setViewMode] = useState<"split" | "unified">("split");

  const versions: VersionItem[] = [
    {
      id: "1",
      version: "V3",
      status: "Active",
      date: "Oct 24, 2023",
      time: "10:45 AM",
      author: "Alex Rivera",
    },
    {
      id: "2",
      version: "V2",
      status: "Revised",
      date: "Oct 23, 2023",
      time: "02:15 PM",
      author: "Sarah Chen",
    },
    {
      id: "3",
      version: "V1",
      status: "Initial",
      date: "Oct 18, 2023",
      time: "09:00 AM",
      author: "Michael Scott",
    },
  ];

  const containerStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "200px 1fr",
    gap: "24px",
    padding: "32px",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
  };

  const sidebarStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const versionCardStyle = (isSelected: boolean): CSSProperties => ({
    padding: "16px",
    borderRadius: "8px",
    border: isSelected ? "2px solid #3b82f6" : "2px solid #e5e7eb",
    backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  const versionHeaderStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
  };

  const versionCheckmarkStyle: CSSProperties = {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "bold",
  };

  const versionNumberStyle: CSSProperties = {
    fontSize: "14px",
    fontWeight: 700,
    color: "#1f2937",
  };

  const statusBadgeStyle: CSSProperties = {
    padding: "4px 8px",
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: 600,
    marginLeft: "auto",
  };

  const versionMetaStyle: CSSProperties = {
    fontSize: "11px",
    color: "#9ca3af",
    marginBottom: "4px",
  };

  const versionAuthorStyle: CSSProperties = {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: 500,
  };

  const mainContentStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  };

  const controlsStyle: CSSProperties = {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "16px 20px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  };

  const selectStyle: CSSProperties = {
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "13px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  };

  const buttonStyle = (variant: "primary" | "secondary"): CSSProperties => ({
    padding: "10px 16px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    transition: "all 0.2s ease",
    ...(variant === "primary"
      ? {
          backgroundColor: "#3b82f6",
          color: "#ffffff",
        }
      : {
          backgroundColor: "#ffffff",
          color: "#6b7280",
          border: "1px solid #d1d5db",
        }),
  });

  const viewModeButtonStyle = (isActive: boolean): CSSProperties => ({
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    border: "1px solid #d1d5db",
    backgroundColor: isActive ? "#f3f4f6" : "#ffffff",
    color: isActive ? "#1f2937" : "#9ca3af",
    transition: "all 0.2s ease",
  });

  const comparisonContainerStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: viewMode === "split" ? "1fr 1fr" : "1fr",
    gap: viewMode === "split" ? "24px" : "0",
  };

  const versionContentStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    padding: "24px",
  };

  const versionTitleStyle: CSSProperties = {
    fontSize: "14px",
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: "4px",
  };

  const versionSubtitleStyle: CSSProperties = {
    fontSize: "11px",
    color: "#9ca3af",
    marginBottom: "20px",
  };

  const sectionTitleStyle: CSSProperties = {
    fontSize: "13px",
    fontWeight: 700,
    color: "#1f2937",
    marginTop: "20px",
    marginBottom: "12px",
  };

  const contentTextStyle: CSSProperties = {
    fontSize: "12px",
    color: "#6b7280",
    lineHeight: "1.6",
    marginBottom: "12px",
  };

  const highlightedTextStyle: CSSProperties = {
    ...contentTextStyle,
    backgroundColor: "#fef08a",
    padding: "2px 4px",
    borderRadius: "2px",
  };

  const metricsTableStyle: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "16px",
  };

  const metricsHeaderStyle: CSSProperties = {
    fontSize: "11px",
    fontWeight: 600,
    color: "#6b7280",
    borderBottom: "1px solid #e5e7eb",
    padding: "8px 0",
    textAlign: "left",
  };

  const metricsCellStyle: CSSProperties = {
    fontSize: "12px",
    color: "#1f2937",
    padding: "8px 0",
    borderBottom: "1px solid #e5e7eb",
  };

  const highlightedValueStyle: CSSProperties = {
    backgroundColor: "#fef08a",
    padding: "2px 4px",
    borderRadius: "2px",
    fontWeight: 600,
  };

  const footerStyle: CSSProperties = {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  };

  const changeIndicatorStyle: CSSProperties = {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "16px",
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar - Version List */}
      <div style={sidebarStyle}>
        {versions.map((v) => (
          <div
            key={v.id}
            style={versionCardStyle(selectedVersion === v.version)}
            onClick={() => setSelectedVersion(v.version)}
          >
            <div style={versionHeaderStyle}>
              {selectedVersion === v.version && (
                <div style={versionCheckmarkStyle}>✓</div>
              )}
              <div style={versionNumberStyle}>{v.version} - Current</div>
              <div style={statusBadgeStyle}>{v.status}</div>
            </div>
            <div style={versionMetaStyle}>
              {v.date} • {v.time}
            </div>
            <div style={versionAuthorStyle}>{v.author}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        {/* Controls */}
        <div style={controlsStyle}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280" }}>
            Comparing Version
          </span>
          <select
            style={selectStyle}
            value={comparingVersion}
            onChange={(e) => setComparingVersion(e.target.value)}
          >
            <option>V1 - Initial Draft</option>
            <option>V2 - Revised</option>
            <option>V3 - Current</option>
          </select>

          <span
            style={{
              marginLeft: "24px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#6b7280",
            }}
          >
            With Version
          </span>
          <select style={selectStyle} value={selectedVersion}>
            <option>V1 - Initial Draft</option>
            <option>V2 - Revised</option>
            <option>V3 - Current</option>
          </select>

          <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
            <button
              style={viewModeButtonStyle(viewMode === "split")}
              onClick={() => setViewMode("split")}
            >
              Split View
            </button>
            <button
              style={viewModeButtonStyle(viewMode === "unified")}
              onClick={() => setViewMode("unified")}
            >
              Unified
            </button>
          </div>

          <button style={buttonStyle("primary")}>
            👁 View Selected Version
          </button>
        </div>

        {/* Comparison Content */}
        <div style={comparisonContainerStyle}>
          {/* Left Column - Initial Draft */}
          <div style={versionContentStyle}>
            <div style={versionTitleStyle}>Initial Draft</div>
            <div style={versionSubtitleStyle}>Oct 18, 2023</div>
            <div style={versionSubtitleStyle}>(V1)</div>

            <div style={sectionTitleStyle}>1. Executive Summary</div>
            <div style={contentTextStyle}>
              The purpose of this report is to provide a comprehensive valuation
              of Acme Corp as at September 30, 2023. This analysis incorporates
              historical financial data from the past three fiscal years and
              projected performance for the next five years.
            </div>

            <div style={sectionTitleStyle}>2. Valuation Methodology</div>
            <div style={contentTextStyle}>
              We have utilized a Discounted Cash Flow (DCF) approach as our
              primary valuation method. The Weighted Average Cost of Capital
              (WACC) has been calculated at 8.5%, reflecting current market
              risks and the company's capital structure.
            </div>

            <table style={metricsTableStyle}>
              <thead>
                <tr>
                  <th style={metricsHeaderStyle}>Metric</th>
                  <th style={metricsHeaderStyle}>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={metricsCellStyle}>Risk-Free Rate</td>
                  <td style={metricsCellStyle}>3.5%</td>
                </tr>
                <tr>
                  <td style={metricsCellStyle}>Equity Beta</td>
                  <td style={metricsCellStyle}>1.15</td>
                </tr>
                <tr>
                  <td style={metricsCellStyle}>Equity Risk Premium</td>
                  <td style={metricsCellStyle}>5.0%</td>
                </tr>
              </tbody>
            </table>

            <div style={sectionTitleStyle}>3. Projections</div>
            <div style={contentTextStyle}>
              Revenue is expected to grow at a CAGR of 12% over the forecast
              period. Operating margins are anticipated to remain steady at 15%
              as the company optimizes its global supply chain.
            </div>
          </div>

          {/* Right Column - Current Version */}
          <div style={versionContentStyle}>
            <div style={versionTitleStyle}>Current Version</div>
            <div style={versionSubtitleStyle}>Oct 24, 2023</div>
            <div style={versionSubtitleStyle}>(V3)</div>

            <div style={sectionTitleStyle}>1. Executive Summary</div>
            <div style={contentTextStyle}>
              The purpose of this report is to provide a comprehensive valuation
              of Acme Corp as at October 24, 2023.{" "}
              <span style={highlightedTextStyle}>
                This analysis incorporates historical financial data from the
                past three fiscal years and projected performance for the next
                five years including the most recent quarterly earnings and
                projected performance for the next five years.
              </span>
            </div>

            <div style={sectionTitleStyle}>2. Valuation Methodology</div>
            <div style={contentTextStyle}>
              We have utilized a Discounted Cash Flow (DCF) approach as our
              primary valuation method. The Weighted Average Cost of Capital
              (WACC) has been calculated at 8.5%, reflecting current market
              risks and the company's capital structure.
            </div>

            <table style={metricsTableStyle}>
              <thead>
                <tr>
                  <th style={metricsHeaderStyle}>Metric</th>
                  <th style={metricsHeaderStyle}>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={metricsCellStyle}>Risk-Free Rate</td>
                  <td style={metricsCellStyle}>
                    <span style={highlightedValueStyle}>4.1%</span>
                  </td>
                </tr>
                <tr>
                  <td style={metricsCellStyle}>Equity Beta</td>
                  <td style={metricsCellStyle}>1.15</td>
                </tr>
                <tr>
                  <td style={metricsCellStyle}>Equity Risk Premium</td>
                  <td style={metricsCellStyle}>
                    <span style={highlightedValueStyle}>5.5%</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={sectionTitleStyle}>3. Projections</div>
            <div style={contentTextStyle}>
              Revenue is expected to grow at a CAGR of{" "}
              <span style={highlightedValueStyle}>14.5%</span> over the forecast
              period. Operating margins are anticipated to expand to{" "}
              <span style={highlightedValueStyle}>18.2% by Year 3</span> as the
              company optimizes its global supply chain.
            </div>

            <div style={footerStyle}>
              <button style={buttonStyle("secondary")}>Discard changes</button>
              <button style={buttonStyle("primary")}>
                Export Comparison (PDF)
              </button>
            </div>
          </div>
        </div>

        <div style={changeIndicatorStyle}>12 Modifications detected</div>
      </div>
    </div>
  );
};

export default VersionHistory;
