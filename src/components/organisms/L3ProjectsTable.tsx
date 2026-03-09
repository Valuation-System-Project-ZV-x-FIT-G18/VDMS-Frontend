import { useState, useMemo, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const itemsPerPage = 5;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    fontSize: isMobile ? "16px" : "18px",
    fontWeight: 600,
    color: theme.colors.text.primary,
  };

  const searchInputStyle: CSSProperties = {
    padding: isMobile ? "8px 12px 8px 28px" : "8px 16px 8px 36px",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: "6px",
    fontSize: isMobile ? "13px" : "14px",
    width: isMobile ? "100%" : "300px",
    outline: "none",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238c8c8c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cpath d='m21 21-4.35-4.35'%3E%3C/path%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: isMobile ? "8px center" : "12px center",
  };

  const tableWrapperStyle: CSSProperties = {
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
  };

  const tableStyle: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: isMobile ? "500px" : "auto",
  };

  const thStyle: CSSProperties = {
    textAlign: "left",
    padding: isMobile ? "10px 12px" : "12px 16px",
    fontSize: isMobile ? "11px" : "13px",
    fontWeight: 600,
    color: theme.colors.text.primary,
    borderBottom: `1px solid ${theme.colors.border}`,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const tdStyle: CSSProperties = {
    padding: isMobile ? "12px" : "16px",
    borderBottom: `1px solid ${theme.colors.border}`,
    fontSize: isMobile ? "13px" : "14px",
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
    flexDirection: isMobile ? "column" : "row",
    justifyContent: "center",
    alignItems: "center",
    gap: isMobile ? "12px" : "8px",
    marginTop: "20px",
    fontSize: isMobile ? "12px" : "14px",
  };

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
      <div style={tableWrapperStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: "#fafafa" }}>
              <th style={thStyle}>Project ID</th>
              {!isMobile && <th style={thStyle}>Property Address</th>}
              <th style={thStyle}>Status</th>
              {!isMobile && <th style={thStyle}>Requested Date</th>}
              {!isMobile && <th style={thStyle}>Payment Status</th>}
              {!isMobile && <th style={thStyle}>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {currentProjects.map((project) => (
              <tr key={project.id}>
                <td style={tdStyle}>
                  <span style={{ color: "#1890ff", fontWeight: 600 }}>
                    {project.projectId}
                  </span>
                  {isMobile && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: theme.colors.text.secondary,
                        marginTop: "4px",
                      }}
                    >
                      {project.propertyAddress}
                    </div>
                  )}
                </td>
                {!isMobile && (
                  <td style={tdStyle}>{project.propertyAddress}</td>
                )}
                <td style={tdStyle}>
                  <span style={statusBadgeStyle(project.status)}>
                    {project.status}
                  </span>
                </td>
                {!isMobile && (
                  <td style={tdStyle}>{formatDate(project.requestedDate)}</td>
                )}
                {!isMobile && (
                  <td style={tdStyle}>
                    <span style={paymentStatusStyle(project.paymentStatus)}>
                      {project.paymentStatus}
                    </span>
                  </td>
                )}
                {!isMobile && (
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
                      }}
                    >
                      Review
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={paginationStyle}>
          <div
            style={{
              display: "flex",
              gap: "4px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              style={{
                width: isMobile ? "28px" : "32px",
                height: isMobile ? "28px" : "32px",
                borderRadius: "4px",
                border: `1px solid ${theme.colors.border}`,
                backgroundColor: "white",
                color: theme.colors.text.primary,
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: 500,
                cursor: "pointer",
              }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                style={{
                  width: isMobile ? "28px" : "32px",
                  height: isMobile ? "28px" : "32px",
                  borderRadius: "4px",
                  border: `1px solid ${currentPage === page ? "#1890ff" : theme.colors.border}`,
                  backgroundColor: currentPage === page ? "#1890ff" : "white",
                  color:
                    currentPage === page ? "white" : theme.colors.text.primary,
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

            <button
              style={{
                width: isMobile ? "28px" : "32px",
                height: isMobile ? "28px" : "32px",
                borderRadius: "4px",
                border: `1px solid ${theme.colors.border}`,
                backgroundColor: "white",
                color: theme.colors.text.primary,
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: 500,
                cursor: "pointer",
              }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>

          {!isMobile && (
            <span
              style={{
                marginLeft: "12px",
                fontSize: "12px",
                color: theme.colors.text.secondary,
              }}
            >
              Showing 1 to {endIndex} of {filteredProjects.length} entries
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default L3ProjectsTable;
