import type { CSSProperties } from "react";
import { useState, useEffect, useMemo } from "react";
import { draftReportService } from "../../../services/draftReportService";
import { formatDate } from "../utils/helpers";

const FinalizedReports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await draftReportService.getFinalized();
        setAllProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch finalized reports:", error);
        setAllProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const finalizedProjects = useMemo(() => {
    if (!searchQuery) return allProjects;
    const query = searchQuery.toLowerCase();
    return allProjects.filter(
      (project) =>
        project.projectId?.toLowerCase().includes(query) ||
        project.propertyAddress?.toLowerCase().includes(query),
    );
  }, [searchQuery, allProjects]);

  const totalPages = Math.ceil(finalizedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = finalizedProjects.slice(startIndex, endIndex);

  const containerStyle: CSSProperties = { padding: "32px", backgroundColor: "#ffffff", minHeight: "100vh" };
  const headerStyle: CSSProperties = { marginBottom: "32px" };
  const titleStyle: CSSProperties = { fontSize: "26px", fontWeight: 700, color: "#1f2937", margin: "0 0 8px 0" };
  const descriptionStyle: CSSProperties = { fontSize: "14px", color: "#6b7280", margin: 0 };
  const statsGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" };
  const statBoxStyle: CSSProperties = { backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "20px" };
  const statLabelStyle: CSSProperties = { fontSize: "12px", color: "#9ca3af", fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" };
  const statValueStyle: CSSProperties = { fontSize: "32px", fontWeight: 700, color: "#1f2937" };
  const statSubtextStyle: CSSProperties = { fontSize: "11px", color: "#6b7280", marginTop: "4px" };
  const filterBarStyle: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #e5e7eb" };
  const filterLeftStyle: CSSProperties = { display: "flex", gap: "12px" };
  const dateRangeStyle: CSSProperties = { padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", outline: "none", backgroundColor: "#ffffff", cursor: "pointer" };
  const searchInputStyle: CSSProperties = { padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", outline: "none", width: "250px" };
  const filterButtonStyle: CSSProperties = { padding: "8px 16px", backgroundColor: "#ffffff", color: "#6b7280", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" };
  const exportButtonStyle: CSSProperties = { padding: "8px 16px", backgroundColor: "#3b82f6", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" };
  const sectionStyle: CSSProperties = { backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden" };
  const tableStyle: CSSProperties = { width: "100%", borderCollapse: "collapse" };
  const theadStyle: CSSProperties = { backgroundColor: "#f9fafb", borderBottom: "2px solid #e5e7eb" };
  const thStyle: CSSProperties = { padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" };
  const tdStyle: CSSProperties = { padding: "12px 16px", borderBottom: "1px solid #e5e7eb", fontSize: "13px" };
  const projectIdStyle: CSSProperties = { color: "#3b82f6", fontWeight: 600, cursor: "pointer" };
  const statusBadgeStyle: CSSProperties = { display: "inline-block", padding: "6px 12px", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "6px", fontSize: "11px", fontWeight: 600 };
  const linkButtonStyle: CSSProperties = { color: "#3b82f6", cursor: "pointer", fontSize: "12px", fontWeight: 600, background: "none", border: "none", padding: 0 };
  const paginationStyle: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderTop: "1px solid #e5e7eb", backgroundColor: "#f9fafb" };
  const paginationInfoStyle: CSSProperties = { fontSize: "12px", color: "#6b7280" };
  const pageButtonStyle = (isActive: boolean): CSSProperties => ({ padding: "6px 10px", marginLeft: "4px", backgroundColor: isActive ? "#3b82f6" : "#ffffff", color: isActive ? "#ffffff" : "#1f2937", border: `1px solid ${isActive ? "#3b82f6" : "#d1d5db"}`, borderRadius: "4px", fontSize: "12px", fontWeight: 500, cursor: "pointer" });

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p>Loading finalized reports...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Finalized Reports</h1>
        <p style={descriptionStyle}>View completed and finalized property valuations.</p>
      </div>

      <div style={statsGridStyle}>
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Total Finalized</div>
          <div style={statValueStyle}>{allProjects.length}</div>
          <div style={{ ...statSubtextStyle, color: "#10b981" }}>From database</div>
        </div>
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>This Month</div>
          <div style={statValueStyle}>{allProjects.length}</div>
        </div>
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Avg Completion Time</div>
          <div style={statValueStyle}>4.2</div>
          <div style={{ ...statSubtextStyle, color: "#10b981" }}>Days</div>
        </div>
      </div>

      <div style={filterBarStyle}>
        <div style={filterLeftStyle}>
          <select style={dateRangeStyle}>
            <option>01 Oct 2023 - 31 Oct 2023</option>
            <option>01 Sep 2023 - 30 Sep 2023</option>
          </select>
          <input
            type="text"
            placeholder="Search Project ID or Address..."
            style={searchInputStyle}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={filterButtonStyle}>Filter</button>
          <button style={exportButtonStyle}>Export Report</button>
        </div>
      </div>

      <div style={sectionStyle}>
        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th style={thStyle}>Project ID</th>
              <th style={thStyle}>Property Address</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Final Value</th>
              <th style={thStyle}>Finalized Date</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((project: any) => (
              <tr key={project.id}>
                <td style={tdStyle}><span style={projectIdStyle}>{project.projectId || project.title}</span></td>
                <td style={tdStyle}>{project.propertyAddress || "N/A"}</td>
                <td style={tdStyle}>Commercial</td>
                <td style={tdStyle}>
                  {project.estimatedValue
                    ? `${project.currency || "USD"} ${Number(project.estimatedValue).toLocaleString()}`
                    : "N/A"}
                </td>
                <td style={tdStyle}>{formatDate(project.created_at)}</td>
                <td style={tdStyle}><span style={statusBadgeStyle}>Finalized</span></td>
                <td style={tdStyle}><button style={linkButtonStyle}>View Report</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        {finalizedProjects.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px", color: "#9ca3af" }}>
            No finalized reports found
          </div>
        )}

        <div style={paginationStyle}>
          <div style={paginationInfoStyle}>
            Showing {startIndex + 1} to {Math.min(endIndex, finalizedProjects.length)} of {finalizedProjects.length} reports
          </div>
          <div>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} style={pageButtonStyle(currentPage === page)} onClick={() => setCurrentPage(page)}>
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalizedReports;