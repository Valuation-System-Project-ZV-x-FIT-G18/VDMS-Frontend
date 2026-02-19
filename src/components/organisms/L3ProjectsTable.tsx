import { useState, useMemo } from "react";
import type { CSSProperties } from "react";
import type { Project } from "../../features/l3/types";
import { formatDate } from "../../features/l3/utils/helpers";
import { getStatusColor } from "../../features/l3/utils/helpers";
import { theme } from "../../styles/theme";

interface L3ProjectsTableProps {
  projects: Project[];
  showSearch?: boolean;
}

const L3ProjectsTable = ({
  projects,
  showSearch = false,
}: L3ProjectsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Search functionality
  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;

    const query = searchQuery.toLowerCase();
    return projects.filter(
      (project) =>
        project.projectId.toLowerCase().includes(query) ||
        project.propertyAddress.toLowerCase().includes(query) ||
        project.status.toLowerCase().includes(query),
    );
  }, [projects, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Styles
  const containerStyle: CSSProperties = {
    backgroundColor: theme.colors.background.paper,
    borderRadius: "8px",
    padding: "24px",
  };

  const headerStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  };

  const titleStyle: CSSProperties = {
    fontSize: "18px",
    fontWeight: 600,
    color: theme.colors.text.primary,
  };

  const searchInputStyle: CSSProperties = {
    padding: "8px 16px 8px 36px",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: "6px",
    fontSize: "14px",
    width: "300px",
    outline: "none",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238c8c8c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cpath d='m21 21-4.35-4.35'%3E%3C/path%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "12px center",
  };

  const tableStyle: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thStyle: CSSProperties = {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: "13px",
    fontWeight: 600,
    color: theme.colors.text.primary,
    borderBottom: `1px solid ${theme.colors.border}`,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const tdStyle: CSSProperties = {
    padding: "16px",
    borderBottom: `1px solid ${theme.colors.border}`,
    fontSize: "14px",
    color: theme.colors.text.primary,
  };

  const statusBadgeStyle = (status: string): CSSProperties => ({
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 600,
    backgroundColor: getStatusColor(status) + "20",
    color: getStatusColor(status),
  });

  const paginationStyle: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginTop: "20px",
  };

  const pageButtonStyle = (isActive: boolean): CSSProperties => ({
    width: "32px",
    height: "32px",
    borderRadius: "4px",
    border: `1px solid ${isActive ? "#1890ff" : theme.colors.border}`,
    backgroundColor: isActive ? "#1890ff" : "white",
    color: isActive ? "white" : theme.colors.text.primary,
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  const paymentStatusStyle = (status: string): CSSProperties => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "3px",
    fontSize: "12px",
    fontWeight: 600,
    backgroundColor: status === "Paid" ? "#52c41a20" : "#faad1420",
    color: status === "Paid" ? "#52c41a" : "#faad14",
  });

  return (
    <div style={containerStyle}>
      {/* Header */}
      {showSearch && (
        <div style={headerStyle}>
          <h2 style={titleStyle}>Recent Projects</h2>
          <input
            type="text"
            placeholder="Search project..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={searchInputStyle}
          />
        </div>
      )}

      {/* Table */}
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: "#fafafa" }}>
            <th style={thStyle}>Project ID</th>
            <th style={thStyle}>Property Address</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Requested Date</th>
            <th style={thStyle}>Payment Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects.map((project) => (
            <tr key={project.id}>
              <td style={tdStyle}>
                <span style={{ color: "#1890ff", fontWeight: 600 }}>
                  {project.projectId}
                </span>
              </td>
              <td style={tdStyle}>{project.propertyAddress}</td>
              <td style={tdStyle}>
                <span style={statusBadgeStyle(project.status)}>
                  {project.status}
                </span>
              </td>
              <td style={tdStyle}>{formatDate(project.requestedDate)}</td>
              <td style={tdStyle}>
                <span style={paymentStatusStyle(project.paymentStatus)}>
                  {project.paymentStatus}
                </span>
              </td>
              <td style={tdStyle}>
                <button
                  style={{
                    padding: "6px 12px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#1890ff",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={paginationStyle}>
          <button
            style={pageButtonStyle(false)}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              style={pageButtonStyle(currentPage === page)}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            style={pageButtonStyle(false)}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </button>

          <span
            style={{
              marginLeft: "12px",
              fontSize: "12px",
              color: theme.colors.text.secondary,
            }}
          >
            Showing 1 to {endIndex} of {filteredProjects.length} entries
          </span>
        </div>
      )}
    </div>
  );
};

export default L3ProjectsTable;
