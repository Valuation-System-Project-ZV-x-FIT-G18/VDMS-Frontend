import { useState, useMemo, useEffect } from "react";
import type { CSSProperties } from "react";
import type { Project } from "../../features/bank-credit-officer/types";
import StatusBadge from "../atoms/StatusBadge";
import PaymentStatus from "../atoms/PaymentStatus";
import { formatDate } from "../../features/bank-credit-officer/utils/helpers";
import { theme } from "../../styles/theme";

interface ProjectsTableProps {
  projects: Project[];
  showSearch?: boolean;
  onProjectClick?: (projectId: string) => void;
  title?: string;
  idLabel?: string;
  searchPlaceholder?: string;
}

const ProjectsTable = ({
  projects,
  showSearch = false,
  onProjectClick,
  title = 'Recent project',
  idLabel = 'Job ID',
  searchPlaceholder = 'Search projects...',
}: ProjectsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024);
  const itemsPerPage = 5;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    const query = searchQuery.toLowerCase();
    return projects.filter(
      (project) =>
        (project.valuationJobId ?? project.projectId).toLowerCase().includes(query) ||
        project.propertyAddress.toLowerCase().includes(query) ||
        project.status.toLowerCase().includes(query),
    );
  }, [projects, searchQuery]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const headerStyle: CSSProperties = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    justifyContent: "space-between",
    alignItems: isMobile ? "stretch" : "center",
    marginBottom: "20px",
    gap: isMobile ? "12px" : "0",
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
    backgroundColor: "white",
    border: "1px solid #f0f0f0",
    borderRadius: "8px",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
  };

  const tableStyle: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: isMobile ? "550px" : "auto",
  };

  const thStyle: CSSProperties = {
    textAlign: "left",
    padding: isMobile ? "10px 12px" : "12px 16px",
    fontSize: isMobile ? "11px" : "13px",
    fontWeight: 600,
    color: theme.colors.text.primary,
    borderBottom: `1px solid ${theme.colors.border}`,
    backgroundColor: "#fafafa",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const tdStyle: CSSProperties = {
    padding: isMobile ? "12px" : "12px 16px",
    fontSize: isMobile ? "13px" : "14px",
    color: theme.colors.text.primary,
    borderBottom: "1px solid #f0f0f0",
  };

  const projectIdStyle: CSSProperties = {
    color: theme.colors.primary.main,
    fontWeight: 600,
    cursor: "pointer",
  };

  const paginationStyle: CSSProperties = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: isMobile ? "12px" : "16px 24px",
    fontSize: isMobile ? "12px" : "14px",
    color: theme.colors.text.secondary,
    gap: isMobile ? "12px" : "0",
  };

  const pageButtonsStyle: CSSProperties = {
    display: "flex",
    gap: "4px",
    flexWrap: "wrap",
    justifyContent: "center",
  };

  const getPageButtonStyle = (isActive: boolean): CSSProperties => ({
    padding: isMobile ? "6px 10px" : "6px 12px",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: "4px",
    backgroundColor: isActive ? theme.colors.primary.main : "white",
    color: isActive ? "white" : theme.colors.text.primary,
    cursor: "pointer",
    fontSize: isMobile ? "12px" : "14px",
    minWidth: isMobile ? "28px" : "36px",
    height: isMobile ? "28px" : "32px",
    textAlign: "center",
  });

  const noResultsStyle: CSSProperties = {
    textAlign: "center",
    padding: "40px",
    color: theme.colors.text.secondary,
    fontSize: "14px",
  };

  return (
    <div>
      <div style={headerStyle}>
        <h3 style={titleStyle}>{title}</h3>
        {showSearch && (
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={searchInputStyle}
          />
        )}
      </div>

      <div style={tableWrapperStyle}>
        {currentProjects.length > 0 ? (
          <>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>{idLabel}</th>
                  <th style={thStyle}>Address</th>
                  {!isMobile && <th style={thStyle}>Applicant</th>}
                  <th style={thStyle}>Status</th>
                  {!isTablet && <th style={thStyle}>Requested</th>}
                  {!isMobile && <th style={thStyle}>Expected</th>}
                  <th style={thStyle}>Payment</th>
                </tr>
              </thead>

              <tbody>
                {currentProjects.map((project) => (
                  <tr
                    key={project.id}
                    onMouseEnter={(e) => {
                      if (!isMobile)
                        e.currentTarget.style.backgroundColor = "#fafafa";
                    }}
                    onMouseLeave={(e) => {
                      if (!isMobile)
                        e.currentTarget.style.backgroundColor = "white";
                    }}
                  >
                    <td style={tdStyle}>
                      <span
                        style={projectIdStyle}
                        onClick={() => {
                          const selectedId = project.id || project.valuationJobId || project.projectId;
                          if (onProjectClick) {
                            onProjectClick(selectedId);
                          }
                        }}
                      >
                        {project.valuationJobId ?? project.projectId}
                      </span>
                      {isMobile && (
                        <div
                          style={{
                            fontSize: "11px",
                            color: theme.colors.text.secondary,
                            marginTop: "4px",
                          }}
                        >
                          {project.propertyAddress.substring(0, 25)}
                          {project.propertyAddress.length > 25 ? "..." : ""}
                        </div>
                      )}
                    </td>

                    <td style={tdStyle}>
                      {!isMobile && project.propertyAddress}
                      {isMobile &&
                        project.propertyAddress.substring(0, 15) +
                          (project.propertyAddress.length > 15 ? "..." : "")}
                    </td>

                    {!isMobile && (
                      <td style={tdStyle}>
                        {project.applicants && project.applicants.length > 0
                          ? project.applicants[0]
                          : "-"}
                      </td>
                    )}

                    <td style={tdStyle}>
                      <StatusBadge status={project.status} />
                    </td>

                    {!isTablet && (
                      <td style={tdStyle}>
                        {formatDate(project.requestedDate)}
                      </td>
                    )}
                    {!isMobile && (
                      <td style={tdStyle}>
                        {formatDate(project.expectedCompletion)}
                      </td>
                    )}

                    <td style={tdStyle}>
                      <PaymentStatus status={project.paymentStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={paginationStyle}>
              {!isMobile && (
                <span>
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredProjects.length)} of{" "}
                  {filteredProjects.length} projects
                </span>
              )}

              <div style={pageButtonsStyle}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    ...getPageButtonStyle(false),
                    opacity: currentPage === 1 ? 0.5 : 1,
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  ←
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) pageNumber = i + 1;
                  else if (currentPage <= 3) pageNumber = i + 1;
                  else if (currentPage >= totalPages - 2)
                    pageNumber = totalPages - 4 + i;
                  else pageNumber = currentPage - 2 + i;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      style={getPageButtonStyle(currentPage === pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span
                    style={{
                      padding: isMobile ? "6px 4px" : "6px 12px",
                      color: theme.colors.text.secondary,
                      fontSize: isMobile ? "10px" : "14px",
                    }}
                  >
                    ...
                  </span>
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    ...getPageButtonStyle(false),
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  →
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={noResultsStyle}>
            No projects found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsTable;