import type { CSSProperties } from "react";
import { useState, useMemo } from "react";
import { mockProjects } from "../utils/mockData";
import { formatDate, getStatusColor } from "../utils/helpers";

interface PendingReviewsProps {
  onNavigate?: (page: string, projectId?: string) => void;
}

const PendingReviews = ({ onNavigate }: PendingReviewsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter for pending reviews only
  const filteredProjects = useMemo(() => {
    const pendingReviews = mockProjects.filter((p) =>
      ["Needs Review", "Payment Pending"].includes(p.status),
    );

    if (!searchQuery) return pendingReviews;

    const query = searchQuery.toLowerCase();
    return pendingReviews.filter(
      (project) =>
        project.projectId.toLowerCase().includes(query) ||
        project.propertyAddress.toLowerCase().includes(query) ||
        project.status.toLowerCase().includes(query),
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
    margin: 0,
    marginBottom: "4px",
  };

  const subtitleStyle: CSSProperties = {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  };

  const filterBarStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "16px",
  };

  const searchInputStyle: CSSProperties = {
    padding: "8px 16px 8px 36px",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "13px",
    width: "300px",
    outline: "none",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238c8c8c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cpath d='m21 21-4.35-4.35'%3E%3C/path%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "12px center",
  };

  const filterButtonStyle: CSSProperties = {
    padding: "6px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    fontSize: "12px",
    fontWeight: 500,
    color: "#6b7280",
    cursor: "pointer",
    outline: "none",
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

  const statusBadgeStyle = (status: string): CSSProperties => {
    const color = getStatusColor(status);
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

  const reviewButtonStyle: CSSProperties = {
    padding: "6px 16px",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.2s ease",
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
        <h1 style={titleStyle}>Pending Reviews</h1>
        <p style={subtitleStyle}>
          Queue of property valuation reports awaiting final approval.
        </p>
      </div>

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

      {/* Table */}
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thStyle}>Project ID</th>
            <th style={thStyle}>Property Address</th>
            <th style={thStyle}>Technical Officer</th>
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
              <td style={tdStyle}>{project.technicalOfficer || "N/A"}</td>
              <td style={tdStyle}>{formatDate(project.requestedDate)}</td>
              <td style={tdStyle}>
                <span style={statusBadgeStyle(project.status)}>
                  {project.status}
                </span>
              </td>
              <td style={tdStyle}>
                <button
                  style={reviewButtonStyle}
                  onClick={() =>
                    onNavigate?.("draft-review", project.projectId)
                  }
                >
                  Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={paginationStyle}>
        <div style={paginationInfoStyle}>
          Showing {startIndex + 1} to{" "}
          {Math.min(endIndex, filteredProjects.length)} of{" "}
          {filteredProjects.length} entries
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
  );
};

export default PendingReviews;
