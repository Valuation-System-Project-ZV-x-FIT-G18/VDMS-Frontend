import type { CSSProperties } from "react";
import { useState, useEffect } from "react";
import { bottleneckService } from "../../../services/bottleneckservice";

interface AllProjectsAndBottlenecksProps {
  onNavigate?: (page: string, projectId?: string) => void;
}

const AllProjectsAndBottlenecks = ({
  onNavigate,
}: AllProjectsAndBottlenecksProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [issuesData, setIssuesData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    overdue: 0,
    missingDocs: 0,
    stuckApprovals: 0,
    paymentOverdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [issues, bottleneckStats] = await Promise.all([
          bottleneckService.getAll(),
          bottleneckService.getStats(),
        ]);
        setIssuesData(issues);
        setStats(bottleneckStats);
      } catch (error) {
        console.error("Failed to fetch bottlenecks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(issuesData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIssues = issuesData.slice(startIndex, endIndex);

  const containerStyle: CSSProperties = {
    padding: "32px",
    backgroundColor: "#ffffff",
    minHeight: "100vh",
  };

  const headerStyle: CSSProperties = {
    marginBottom: "32px",
  };

  const titleStyle: CSSProperties = {
    fontSize: "26px",
    fontWeight: 600,
    color: "#1f2937",
    margin: 0,
    marginBottom: "4px",
  };

  const subtitleStyle: CSSProperties = {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  };

  const statsGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "40px",
  };

  const statBoxStyle: CSSProperties = {
    backgroundColor: "#f9fafb",
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  };

  const statLabelStyle: CSSProperties = {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: 500,
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const statValueStyle: CSSProperties = {
    fontSize: "32px",
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: "12px",
  };

  const statBadgeStyle = (color: string): CSSProperties => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 600,
    backgroundColor: color + "20",
    color: color,
    cursor: "pointer",
  });

  const sectionStyle: CSSProperties = {
    marginBottom: "32px",
  };

  const sectionTitleStyle: CSSProperties = {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1f2937",
    marginBottom: "16px",
    margin: "0 0 16px 0",
  };

  const tableStyle: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  };

  const theadStyle: CSSProperties = {
    backgroundColor: "#f3f4f6",
    borderBottom: "1px solid #e5e7eb",
  };

  const thStyle: CSSProperties = {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: 600,
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const tdStyle: CSSProperties = {
    padding: "16px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "13px",
    color: "#374151",
  };

  const projectIdStyle: CSSProperties = {
    color: "#3b82f6",
    fontWeight: 600,
    cursor: "pointer",
  };

  const issueTypeBadgeStyle = (type: string): CSSProperties => {
    let color = "#6b7280";
    if (type === "Overdue") color = "#ef4444";
    if (type === "Missing Docs") color = "#f59e0b";
    if (type === "Stuck Approval") color = "#ec4899";
    if (type === "Payment Overdue") color = "#6366f1";
    return {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: "4px",
      fontSize: "11px",
      fontWeight: 600,
      backgroundColor: color + "20",
      color: color,
    };
  };

  const actionLinkStyle: CSSProperties = {
    color: "#3b82f6",
    cursor: "pointer",
    fontWeight: 600,
    textDecoration: "none",
  };

  const paginationStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
  };

  const paginationInfoStyle: CSSProperties = {
    fontSize: "12px",
    color: "#6b7280",
  };

  const paginationControlsStyle: CSSProperties = {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  };

  const pageButtonStyle = (isActive: boolean): CSSProperties => ({
    width: "32px",
    height: "32px",
    borderRadius: "4px",
    border: isActive ? "none" : "1px solid #e5e7eb",
    backgroundColor: isActive ? "#3b82f6" : "#ffffff",
    color: isActive ? "#ffffff" : "#6b7280",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  const renderPageButtons = () => {
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 3); i++) {
      pages.push(
        <button
          key={i}
          style={pageButtonStyle(currentPage === i)}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>,
      );
    }
    if (totalPages > 3) {
      pages.push(
        <span key="dots" style={{ color: "#9ca3af", fontSize: "12px" }}>
          ...
        </span>,
      );
    }
    return pages;
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
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>All Projects and Bottlenecks</h1>
        <p style={subtitleStyle}>
          Overview of projects experiencing delays, missing documentation, stuck
          approvals, and payment issues
        </p>
      </div>

      <div style={statsGridStyle}>
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Overdue Projects</div>
          <div style={statValueStyle}>{stats.overdue}</div>
          <span style={statBadgeStyle("#ef4444")}>View Details</span>
        </div>
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Missing Documents</div>
          <div style={statValueStyle}>{stats.missingDocs}</div>
          <span style={statBadgeStyle("#f59e0b")}>Request</span>
        </div>
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Stuck Approvals</div>
          <div style={statValueStyle}>{stats.stuckApprovals}</div>
          <span style={statBadgeStyle("#ec4899")}>Follow Up</span>
        </div>
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Payment Overdue</div>
          <div style={statValueStyle}>{stats.paymentOverdue}</div>
          <span style={statBadgeStyle("#6366f1")}>Send Invoice</span>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>All Projects with Issues</h2>
        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th style={thStyle}>Project ID</th>
              <th style={thStyle}>Property Address</th>
              <th style={thStyle}>Issue Type</th>
              <th style={thStyle}>Days Stuck</th>
              <th style={thStyle}>Current Stage</th>
              <th style={thStyle}>Client</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentIssues.map((issue: any) => (
              <tr key={issue.id}>
                <td style={tdStyle}>
                  <span style={projectIdStyle}>{issue.projectId}</span>
                </td>
                <td style={tdStyle}>{issue.propertyAddress}</td>
                <td style={tdStyle}>
                  <span style={issueTypeBadgeStyle(issue.issueType)}>
                    {issue.issueType}
                  </span>
                </td>
                <td style={tdStyle}>{issue.dayStuck}</td>
                <td style={tdStyle}>{issue.stage}</td>
                <td style={tdStyle}>{issue.client}</td>
                <td style={tdStyle}>
                  <span
                    style={actionLinkStyle}
                    onClick={() =>
                      onNavigate?.("draft-review", issue.projectId)
                    }
                  >
                    Review
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {issuesData.length === 0 && (
          <div
            style={{ textAlign: "center", padding: "32px", color: "#9ca3af" }}
          >
            No bottlenecks found
          </div>
        )}

        <div style={paginationStyle}>
          <div style={paginationInfoStyle}>
            Showing {startIndex + 1} to {Math.min(endIndex, issuesData.length)}{" "}
            of {issuesData.length} entries
          </div>
          <div style={paginationControlsStyle}>
            <button
              style={{
                ...pageButtonStyle(false),
                width: "auto",
                padding: "6px 8px",
              }}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ←
            </button>
            {renderPageButtons()}
            <button
              style={{
                ...pageButtonStyle(false),
                width: "auto",
                padding: "6px 8px",
              }}
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProjectsAndBottlenecks;
