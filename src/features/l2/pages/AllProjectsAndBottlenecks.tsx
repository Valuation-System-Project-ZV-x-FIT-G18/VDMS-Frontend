import type { CSSProperties } from "react";
import { useState } from "react";

interface AllProjectsAndBottlenecksProps {
  onNavigate?: (page: string, projectId?: string) => void;
}

const AllProjectsAndBottlenecks = ({
  onNavigate,
}: AllProjectsAndBottlenecksProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const issuesData = [
    {
      id: 1,
      projectId: "PRJ-1024",
      propertyAddress: "123 Oak Street, Downtown District",
      issueType: "Overdue",
      dayStuck: 24,
      stage: "Document Collection",
      client: "Apex Global Holdings",
    },
    {
      id: 2,
      projectId: "PRJ-1025",
      propertyAddress: "456 Maple Avenue, Suburban Plaza",
      issueType: "Missing Docs",
      dayStuck: 8,
      stage: "Legal Review",
      client: "Heritage Properties Inc.",
    },
    {
      id: 3,
      projectId: "PRJ-1026",
      propertyAddress: "789 Pine Road, Commercial Zone",
      issueType: "Stuck Approval",
      dayStuck: 15,
      stage: "Final Approval",
      client: "Metro Development Corp.",
    },
    {
      id: 4,
      projectId: "PRJ-1027",
      propertyAddress: "321 Elm Street, Residential Area",
      issueType: "Payment Overdue",
      dayStuck: 12,
      stage: "Report Finalization",
      client: "Urban Real Estate Solutions",
    },
    {
      id: 5,
      projectId: "PRJ-1028",
      propertyAddress: "654 Birch Lane, Waterfront District",
      issueType: "Overdue",
      dayStuck: 18,
      stage: "Technical Review",
      client: "Coastal Properties Ltd.",
    },
  ];

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

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>All Projects and Bottlenecks</h1>
        <p style={subtitleStyle}>
          Overview of projects experiencing delays, missing documentation, stuck
          approvals, and payment issues
        </p>
      </div>

      {/* Stats Cards */}
      <div style={statsGridStyle}>
        {/* Overdue Projects */}
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Overdue Projects</div>
          <div style={statValueStyle}>1</div>
          <span
            style={statBadgeStyle("#ef4444")}
            onClick={() => console.log("View Details")}
          >
            View Details
          </span>
        </div>

        {/* Missing Documents */}
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Missing Documents</div>
          <div style={statValueStyle}>8</div>
          <span
            style={statBadgeStyle("#f59e0b")}
            onClick={() => console.log("Request")}
          >
            Request
          </span>
        </div>

        {/* Stuck Approvals */}
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Stuck Approvals</div>
          <div style={statValueStyle}>5</div>
          <span
            style={statBadgeStyle("#ec4899")}
            onClick={() => console.log("Follow Up")}
          >
            Follow Up
          </span>
        </div>

        {/* Payment Overdue */}
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Payment Overdue</div>
          <div style={statValueStyle}>6</div>
          <span
            style={statBadgeStyle("#6366f1")}
            onClick={() => console.log("Send Invoice")}
          >
            Send Invoice
          </span>
        </div>
      </div>

      {/* Issues Table Section */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>All Projects with Issues</h2>

        {/* Table */}
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
            {currentIssues.map((issue) => (
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

        {/* Pagination */}
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
