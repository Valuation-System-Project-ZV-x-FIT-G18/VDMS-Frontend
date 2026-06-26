import type { CSSProperties } from "react";
import { useState, useEffect, useMemo } from "react";
import { projectService } from "../../../services/projectService";
import { formatDate } from "../utils/helpers";

interface L3RejectedReportsProps {
  onNavigate?: (page: string, projectId?: string) => void;
}

const L3RejectedReports = ({ onNavigate }: L3RejectedReportsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await projectService.getRejected();
        setAllProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch rejected reports:", error);
        setAllProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return allProjects;
    const query = searchQuery.toLowerCase();
    return allProjects.filter(
      (project) =>
        project.projectId?.toLowerCase().includes(query) ||
        project.propertyAddress?.toLowerCase().includes(query),
    );
  }, [searchQuery, allProjects]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  const containerStyle: CSSProperties = { padding: "32px", backgroundColor: "#ffffff", minHeight: "100vh" };
  const headerStyle: CSSProperties = { marginBottom: "32px" };
  const titleStyle: CSSProperties = { fontSize: "26px", fontWeight: 600, color: "#1f2937", margin: "0 0 8px 0" };
  const descriptionStyle: CSSProperties = { fontSize: "14px", color: "#6b7280", margin: 0 };
  const sectionStyle: CSSProperties = { backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden" };
  const filterBarStyle: CSSProperties = { display: "flex", gap: "12px", padding: "16px 20px", borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb" };
  const searchInputStyle: CSSProperties = { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", outline: "none" };
  const filterButtonStyle: CSSProperties = { padding: "10px 16px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: "pointer" };
  const tableStyle: CSSProperties = { width: "100%", borderCollapse: "collapse" };
  const theadStyle: CSSProperties = { backgroundColor: "#f9fafb", borderBottom: "2px solid #e5e7eb" };
  const thStyle: CSSProperties = { padding: "12px 20px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" };
  const tdStyle: CSSProperties = { padding: "16px 20px", borderBottom: "1px solid #e5e7eb", fontSize: "13px" };
  const projectIdStyle: CSSProperties = { fontWeight: 600, color: "#3b82f6", cursor: "pointer" };
  const statusBadgeStyle: CSSProperties = { display: "inline-block", padding: "6px 12px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "6px", fontSize: "11px", fontWeight: 600 };
  const actionButtonStyle: CSSProperties = { padding: "8px 16px", backgroundColor: "#ef4444", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" };
  const paginationStyle: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderTop: "1px solid #e5e7eb", backgroundColor: "#f9fafb" };
  const paginationInfoStyle: CSSProperties = { fontSize: "12px", color: "#6b7280" };
  const pageButtonStyle = (isActive: boolean): CSSProperties => ({ padding: "6px 10px", marginLeft: "4px", backgroundColor: isActive ? "#3b82f6" : "#ffffff", color: isActive ? "#ffffff" : "#1f2937", border: `1px solid ${isActive ? "#3b82f6" : "#d1d5db"}`, borderRadius: "4px", fontSize: "12px", fontWeight: 500, cursor: "pointer" });
  const emptyStateStyle: CSSProperties = { padding: "40px 20px", textAlign: "center", color: "#9ca3af" };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p>Loading rejected reports...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Rejected Reports</h1>
        <p style={descriptionStyle}>Property valuation reports that have been rejected and require corrections.</p>
      </div>

      <div style={sectionStyle}>
        <div style={filterBarStyle}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Search project..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={searchInputStyle}
            />
          </div>
          <button style={filterButtonStyle}>Filter ⚙</button>
        </div>

        {filteredProjects.length === 0 ? (
          <div style={emptyStateStyle}>
            <p style={{ margin: 0, fontSize: "14px" }}>No rejected reports found</p>
          </div>
        ) : (
          <>
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
                {currentProjects.map((project: any) => (
                  <tr key={project.id}>
                    <td style={tdStyle}><span style={projectIdStyle}>{project.projectId}</span></td>
                    <td style={tdStyle}>{project.propertyAddress}</td>
                    <td style={tdStyle}>{formatDate(project.requestedDate)}</td>
                    <td style={tdStyle}><span style={statusBadgeStyle}>{project.status}</span></td>
                    <td style={tdStyle}>
                      <button style={actionButtonStyle} onClick={() => onNavigate?.("reject-report", project.projectId)}>
                        Review Rejection
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div style={paginationStyle}>
                <div style={paginationInfoStyle}>
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredProjects.length)} of {filteredProjects.length}
                </div>
                <div>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button key={page} style={pageButtonStyle(currentPage === page)} onClick={() => setCurrentPage(page)}>
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default L3RejectedReports;