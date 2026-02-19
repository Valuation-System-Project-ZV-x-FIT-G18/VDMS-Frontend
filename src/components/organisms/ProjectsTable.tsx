import { useState, useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { Project } from '../../features/bank-credit-officer/types';
import StatusBadge from '../atoms/StatusBadge';
import PaymentStatus from '../atoms/PaymentStatus';
import { formatDate } from '../../features/bank-credit-officer/utils/helpers';
import { theme } from '../../styles/theme';

interface ProjectsTableProps {
  projects: Project[];
  showSearch?: boolean;
  onProjectClick?: (projectId: string) => void;
}

const ProjectsTable = ({ projects, showSearch = false, onProjectClick }: ProjectsTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;

    const query = searchQuery.toLowerCase();
    return projects.filter(
      (project) =>
        project.projectId.toLowerCase().includes(query) ||
        project.propertyAddress.toLowerCase().includes(query) ||
        project.status.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Header OUTSIDE border
  const headerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const titleStyle: CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: theme.colors.text.primary,
  };

  const searchInputStyle: CSSProperties = {
    padding: '8px 16px 8px 36px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    fontSize: '14px',
    width: '300px',
    outline: 'none',
    backgroundImage:
      'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%238c8c8c\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Ccircle cx=\'11\' cy=\'11\' r=\'8\'%3E%3C/circle%3E%3Cpath d=\'m21 21-4.35-4.35\'%3E%3C/path%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '12px center',
  };

  // Table wrapper WITH border
  const tableWrapperStyle: CSSProperties = {
    backgroundColor: 'white',
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
    overflow: 'hidden',
  };

  const tableStyle: CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  // ✅ Header background like Payment table
  const thStyle: CSSProperties = {
    textAlign: 'left',
    padding: '16px 24px',
    fontSize: '13px',
    fontWeight: 600,
    color: theme.colors.text.primary,
    borderBottom: `1px solid ${theme.colors.border}`,
    backgroundColor: '#fafafa',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const tdStyle: CSSProperties = {
    padding: '20px 24px',
    fontSize: '14px',
    color: theme.colors.text.primary,
    borderBottom: '1px solid #f0f0f0',
  };

  const projectIdStyle: CSSProperties = {
    color: theme.colors.primary.main,
    fontWeight: 600,
    cursor: 'pointer',
  };

  const paginationStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    fontSize: '14px',
    color: theme.colors.text.secondary,
  };

  const pageButtonsStyle: CSSProperties = {
    display: 'flex',
    gap: '8px',
  };

  const getPageButtonStyle = (isActive: boolean): CSSProperties => ({
    padding: '6px 12px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '4px',
    backgroundColor: isActive ? theme.colors.primary.main : 'white',
    color: isActive ? 'white' : theme.colors.text.primary,
    cursor: 'pointer',
    fontSize: '14px',
    minWidth: '36px',
    textAlign: 'center',
  });

  const noResultsStyle: CSSProperties = {
    textAlign: 'center',
    padding: '40px',
    color: theme.colors.text.secondary,
    fontSize: '14px',
  };

  return (
    <div>
      {/* Header OUTSIDE border */}
      <div style={headerStyle}>
        <h3 style={titleStyle}>Recent project</h3>
        {showSearch && (
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={searchInputStyle}
          />
        )}
      </div>

      {/* Table INSIDE border */}
      <div style={tableWrapperStyle}>
        {currentProjects.length > 0 ? (
          <>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Valuation Job ID</th>
                  <th style={thStyle}>Property Address</th>
                  <th style={thStyle}>Applicant</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Requested Date</th>
                  <th style={thStyle}>Exp. Completion</th>
                  <th style={thStyle}>Payment</th>
                </tr>
              </thead>

              <tbody>
                {currentProjects.map((project) => (
                  <tr
                    key={project.id}
                    // ✅ Row hover highlight (whole row)
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fafafa';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <td style={tdStyle}>
                      <span
                        style={projectIdStyle}
                        onClick={() => onProjectClick && onProjectClick(project.projectId)}
                      >
                        {project.projectId}
                      </span>
                    </td>

                    <td style={tdStyle}>{project.propertyAddress}</td>

                    <td style={tdStyle}>
                      {project.applicants && project.applicants.length > 0 ? (
                        project.applicants.map((name, index) => <div key={index}>{name}</div>)
                      ) : (
                        '-'
                      )}
                    </td>

                    <td style={tdStyle}>
                      <StatusBadge status={project.status} />
                    </td>

                    <td style={tdStyle}>{formatDate(project.requestedDate)}</td>
                    <td style={tdStyle}>{formatDate(project.expectedCompletion)}</td>

                    <td style={tdStyle}>
                      <PaymentStatus status={project.paymentStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={paginationStyle}>
              <span>
                Showing {startIndex + 1} to {Math.min(endIndex, filteredProjects.length)} of{' '}
                {filteredProjects.length} projects
              </span>

              <div style={pageButtonsStyle}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    ...getPageButtonStyle(false),
                    opacity: currentPage === 1 ? 0.5 : 1,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  ‹
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) pageNumber = i + 1;
                  else if (currentPage <= 3) pageNumber = i + 1;
                  else if (currentPage >= totalPages - 2) pageNumber = totalPages - 4 + i;
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
                  <span style={{ padding: '6px 12px', color: theme.colors.text.secondary }}>
                    ...
                  </span>
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    ...getPageButtonStyle(false),
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  }}
                >
                  ›
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={noResultsStyle}>No projects found matching "{searchQuery}"</div>
        )}
      </div>
    </div>
  );
};

export default ProjectsTable;
