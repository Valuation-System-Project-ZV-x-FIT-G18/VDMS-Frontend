import type { CSSProperties } from "react";
import {
  BarChartOutlined,
  LineChartOutlined,
  DownloadOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { theme } from "../../../styles/theme";

const ReportsPage = () => {
  const containerStyle: CSSProperties = {
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const headerStyle: CSSProperties = {
    marginBottom: "24px",
  };

  const titleStyle: CSSProperties = {
    fontSize: "28px",
    fontWeight: 700,
    color: theme.colors.text.primary,
    marginBottom: "8px",
  };

  const subtitleStyle: CSSProperties = {
    fontSize: "14px",
    color: theme.colors.text.secondary,
    marginBottom: "24px",
  };

  const filterBarStyle: CSSProperties = {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    alignItems: "center",
  };

  const selectStyle: CSSProperties = {
    padding: "8px 12px",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: "6px",
    fontSize: "14px",
  };

  const buttonStyle: CSSProperties = {
    padding: "8px 16px",
    backgroundColor: "#1890ff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const contentGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    marginBottom: "24px",
  };

  const cardStyle: CSSProperties = {
    backgroundColor: theme.colors.background.paper,
    borderRadius: "8px",
    padding: "24px",
    border: `1px solid ${theme.colors.border}`,
  };

  const cardTitleStyle: CSSProperties = {
    fontSize: "16px",
    fontWeight: 600,
    color: theme.colors.text.primary,
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const chartContainerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "300px",
    backgroundColor: "#f9f9f9",
    borderRadius: "6px",
    fontSize: "14px",
    color: theme.colors.text.secondary,
  };

  const metricsGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  };

  const metricBoxStyle: CSSProperties = {
    backgroundColor: "#f9f9f9",
    padding: "16px",
    borderRadius: "6px",
    textAlign: "center",
  };

  const metricValueStyle: CSSProperties = {
    fontSize: "24px",
    fontWeight: 700,
    color: "#1890ff",
    marginBottom: "8px",
  };

  const metricLabelStyle: CSSProperties = {
    fontSize: "12px",
    color: theme.colors.text.secondary,
  };

  const tableStyle: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse" as const,
  };

  const cellStyle: CSSProperties = {
    padding: "12px",
    borderBottom: `1px solid ${theme.colors.border}`,
    textAlign: "left",
    fontSize: "14px",
  };

  const rowHeaderStyle: CSSProperties = {
    ...cellStyle,
    backgroundColor: "#f9f9f9",
    fontWeight: 600,
    color: theme.colors.text.primary,
  };

  const fullWidthCardStyle: CSSProperties = {
    ...cardStyle,
    gridColumn: "1 / -1",
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Analytics & Reports</h1>
        <p style={subtitleStyle}>
          Track project performance, team productivity, and revenue metrics
        </p>
      </div>

      {/* Filter Bar */}
      <div style={filterBarStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CalendarOutlined />
          <span
            style={{ fontSize: "14px", color: theme.colors.text.secondary }}
          >
            Date Range:
          </span>
        </div>
        <select style={selectStyle} defaultValue="month">
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
        <div style={{ flex: 1 }} />
        <button style={buttonStyle}>
          <DownloadOutlined /> Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div style={fullWidthCardStyle}>
        <h3 style={cardTitleStyle}>
          <BarChartOutlined /> Key Performance Indicators
        </h3>
        <div style={metricsGridStyle}>
          <div style={metricBoxStyle}>
            <div style={metricValueStyle}>156</div>
            <div style={metricLabelStyle}>Total Projects</div>
          </div>
          <div style={metricBoxStyle}>
            <div style={metricValueStyle}>88%</div>
            <div style={metricLabelStyle}>Completion Rate</div>
          </div>
          <div style={metricBoxStyle}>
            <div style={metricValueStyle}>12</div>
            <div style={metricLabelStyle}>Pending Approvals</div>
          </div>
          <div style={metricBoxStyle}>
            <div style={metricValueStyle}>$2.45M</div>
            <div style={metricLabelStyle}>Total Revenue</div>
          </div>
          <div style={metricBoxStyle}>
            <div style={metricValueStyle}>4.2</div>
            <div style={metricLabelStyle}>Avg. Completion Days</div>
          </div>
          <div style={metricBoxStyle}>
            <div style={metricValueStyle}>18</div>
            <div style={metricLabelStyle}>Active Team Members</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={contentGridStyle}>
        {/* Project Completion Trend */}
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>
            <LineChartOutlined /> Project Completion Trend
          </h3>
          <div style={chartContainerStyle}>
            📈 Chart visualization will render here
          </div>
        </div>

        {/* Revenue by Month */}
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>
            <BarChartOutlined /> Revenue by Month
          </h3>
          <div style={chartContainerStyle}>
            💰 Revenue chart will render here
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div style={fullWidthCardStyle}>
        <h3 style={cardTitleStyle}>Project Status Breakdown</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <td style={rowHeaderStyle}>Status</td>
              <td style={rowHeaderStyle}>Count</td>
              <td style={rowHeaderStyle}>Percentage</td>
              <td style={rowHeaderStyle}>Avg. Days to Completion</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={cellStyle}>Completed</td>
              <td style={cellStyle}>98</td>
              <td style={cellStyle}>62.8%</td>
              <td style={cellStyle}>4.2 days</td>
            </tr>
            <tr>
              <td style={cellStyle}>In Progress</td>
              <td style={cellStyle}>35</td>
              <td style={cellStyle}>22.4%</td>
              <td style={cellStyle}>3.8 days remaining</td>
            </tr>
            <tr>
              <td style={cellStyle}>Needs Review</td>
              <td style={cellStyle}>15</td>
              <td style={cellStyle}>9.6%</td>
              <td style={cellStyle}>Pending</td>
            </tr>
            <tr>
              <td style={cellStyle}>Payment Pending</td>
              <td style={cellStyle}>8</td>
              <td style={cellStyle}>5.1%</td>
              <td style={cellStyle}>Pending</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Team Performance */}
      <div style={fullWidthCardStyle}>
        <h3 style={cardTitleStyle}>Team Performance Summary</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <td style={rowHeaderStyle}>Team Member</td>
              <td style={rowHeaderStyle}>Role</td>
              <td style={rowHeaderStyle}>Active Projects</td>
              <td style={rowHeaderStyle}>Completed Projects</td>
              <td style={rowHeaderStyle}>Completion Rate</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={cellStyle}>Alice Stevens</td>
              <td style={cellStyle}>Technical Officer</td>
              <td style={cellStyle}>8</td>
              <td style={cellStyle}>28</td>
              <td style={cellStyle}>77.8%</td>
            </tr>
            <tr>
              <td style={cellStyle}>Mark Kendrick</td>
              <td style={cellStyle}>Technical Officer</td>
              <td style={cellStyle}>6</td>
              <td style={cellStyle}>31</td>
              <td style={cellStyle}>83.8%</td>
            </tr>
            <tr>
              <td style={cellStyle}>Sarah Lee</td>
              <td style={cellStyle}>Technical Officer</td>
              <td style={cellStyle}>10</td>
              <td style={cellStyle}>25</td>
              <td style={cellStyle}>71.4%</td>
            </tr>
            <tr>
              <td style={cellStyle}>Mike Johnson</td>
              <td style={cellStyle}>Coordinator</td>
              <td style={cellStyle}>12</td>
              <td style={cellStyle}>42</td>
              <td style={cellStyle}>77.8%</td>
            </tr>
            <tr>
              <td style={cellStyle}>Emma Davis</td>
              <td style={cellStyle}>Coordinator</td>
              <td style={cellStyle}>9</td>
              <td style={cellStyle}>38</td>
              <td style={cellStyle}>80.9%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;
