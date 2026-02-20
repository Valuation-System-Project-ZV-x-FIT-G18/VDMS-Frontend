import type { CSSProperties } from "react";
import { useState, useMemo } from "react";
import { mockProjects } from "../utils/mockData";
import { formatDate } from "../utils/helpers";

interface L3RejectedReportsProps {
  onNavigate?: (page: string, projectId?: string) => void;
}

const L3RejectedReports = ({ onNavigate }: L3RejectedReportsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter for rejected reports only
  const filteredProjects = useMemo(() => {
    const rejected = mockProjects.filter((p) => p.status === "Rejected");

    if (!searchQuery) return rejected;

    const query = searchQuery.toLowerCase();
    return rejected.filter(
      (project) =>
        project.projectId.toLowerCase().includes(query) ||
        project.propertyAddress.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

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
    margin: "0 0 8px 0",
  };

  const descriptionStyle: CSSProperties = {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  };

  const sectionStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  };

  const filterBarStyle: CSSProperties = {
    display: "flex",
    gap: "12px",
    padding: "16px 20px",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
  };

  const searchInputStyle: CSSProperties = {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
  };

  const filterButtonStyle: CSSProperties = {
    padding: "10px 16px",
    backgroundColor: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const tableStyle: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const theadStyle: CSSProperties = {
    backgroundColor: "#f9fafb",
    borderBottom: "2px solid #e5e7eb",
  };

  const thStyle: CSSProperties = {
    padding: "12px 20px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const tdStyle: CSSProperties = {
    padding: "16px 20px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "13px",
  };

  const projectIdStyle: CSSProperties = {
    fontWeight: 600,
    color: "#3b82f6",
    cursor: "pointer",
  };

  const statusBadgeStyle = (status: string): CSSProperties => {
    const colors: Record<string, { bg: string; text: string }> = {
      Rejected: { bg: "#fee2e2", text: "#991b1b" },
      Approved: { bg: "#dcfce7", text: "#166534" },
      Pending: { bg: "#fef3c7", text: "#92400e" },
      "Needs Review": { bg: "#fef3c7", text: "#92400e" },
    };

    const style = colors[status] || { bg: "#f3f4f6", text: "#6b7280" };
    return {
      display: "inline-block",
      padding: "6px 12px",
      backgroundColor: style.bg,
      color: style.text,
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: 600,
    };
  };

  const actionButtonStyle: CSSProperties = {
    padding: "8px 16px",
    backgroundColor: "#ef4444",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const paginationStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
  };

  const paginationInfoStyle: CSSProperties = {
    fontSize: "12px",
    color: "#6b7280",
  };

  const pageButtonStyle = (isActive: boolean): CSSProperties => ({
    padding: "6px 10px",
    marginLeft: "4px",
    backgroundColor: isActive ? "#3b82f6" : "#ffffff",
    color: isActive ? "#ffffff" : "#1f2937",
    border: `1px solid ${isActive ? "#3b82f6" : "#d1d5db"}`,
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          style={pageButtonStyle(currentPage === i)}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>,
      );
    }
    return buttons;
  };

  const emptyStateStyle: CSSProperties = {
    padding: "40px 20px",
    textAlign: "center",
    color: "#9ca3af",
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Rejected Reports</h1>
        <p style={descriptionStyle}>
          Property valuation reports that have been rejected and require
          corrections from the appraiser.
        </p>
      </div>

      {/* Rejected Reports Section */}
      <div style={sectionStyle}>
        {/* Filter Bar */}
        <div style={filterBarStyle}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Search project..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={searchInputStyle}
            />
          </div>
          <button style={filterButtonStyle}>
            Filter <span style={{ marginLeft: "4px" }}>⚙</span>
          </button>
        </div>

        {/* Table or Empty State */}
        {filteredProjects.length === 0 ? (
          <div style={emptyStateStyle}>
            <p style={{ margin: 0, fontSize: "14px" }}>
              No rejected reports found
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <table style={tableStyle}>
              <thead style={theadStyle}>
                <tr>
                  <th style={thStyle}>Project ID</th>
                  <th style={thStyle}>Property Address</th>
                  <th style={thStyle}>Submitted Date</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProjects.map((project) => (
                  <tr key={project.id}>
                    <td style={tdStyle}>
                      <span style={projectIdStyle}>{project.projectId}</span>
                    </td>
                    <td style={tdStyle}>{project.propertyAddress}</td>
                    <td style={tdStyle}>{formatDate(project.requestedDate)}</td>
                    <td style={tdStyle}>
                      <span style={statusBadgeStyle(project.status)}>
                        {project.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        style={actionButtonStyle}
                        onClick={() =>
                          onNavigate?.("reject-report", project.projectId)
                        }
                      >
                        Review Rejection
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={paginationStyle}>
                <div style={paginationInfoStyle}>
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredProjects.length)} of{" "}
                  {filteredProjects.length}
                </div>
                <div>{renderPageButtons()}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default L3RejectedReports;
