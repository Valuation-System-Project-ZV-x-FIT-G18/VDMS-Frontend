import type { CSSProperties } from "react";
import { useState, useMemo } from "react";
import { mockProjects } from "../utils/mockData";
import { formatDate } from "../utils/helpers";

const ApprovedReports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const approvedProjects = useMemo(() => {
    const approved = mockProjects.filter((p) => p.status === "Completed");

    if (!searchQuery) return approved;

    const query = searchQuery.toLowerCase();
    return approved.filter(
      (project) =>
        project.projectId.toLowerCase().includes(query) ||
        project.propertyAddress.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(approvedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = approvedProjects.slice(startIndex, endIndex);

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
    fontWeight: 700,
    color: "#1f2937",
    margin: "0 0 8px 0",
  };

  const descriptionStyle: CSSProperties = {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  };

  const statsGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "32px",
  };

  const statBoxStyle: CSSProperties = {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "20px",
  };

  const statLabelStyle: CSSProperties = {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: 600,
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const statValueStyle: CSSProperties = {
    fontSize: "32px",
    fontWeight: 700,
    color: "#1f2937",
  };

  const statSubtextStyle: CSSProperties = {
    fontSize: "11px",
    color: "#6b7280",
    marginTop: "4px",
  };

  const searchBarStyle: CSSProperties = {
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
    width: "100%",
    maxWidth: "400px",
  };

  const sectionStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
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
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const tdStyle: CSSProperties = {
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "13px",
  };

  const projectIdStyle: CSSProperties = {
    color: "#3b82f6",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
  };

  const statusBadgeStyle: CSSProperties = {
    display: "inline-block",
    padding: "6px 12px",
    backgroundColor: "#dcfce7",
    color: "#166534",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 600,
  };

  const buttonStyle: CSSProperties = {
    padding: "8px 16px",
    backgroundColor: "#3b82f6",
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
    padding: "16px",
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
  });

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Approved Reports Archive</h1>
        <p style={descriptionStyle}>
          View and manage historical valuation reports.
        </p>
      </div>

      {/* Stats */}
      <div style={statsGridStyle}>
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Total Archived</div>
          <div style={statValueStyle}>1,284</div>
        </div>
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Approvals This Month</div>
          <div style={statValueStyle}>42</div>
        </div>
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Average Turnaround</div>
          <div style={statValueStyle}>4.2</div>
          <div style={statSubtextStyle}>days</div>
        </div>
      </div>

      {/* Search and Table */}
      <div style={sectionStyle}>
        <div style={{ padding: "16px" }}>
          <input
            type="text"
            placeholder="Search by Project ID or Address..."
            style={searchBarStyle}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th style={thStyle}>Project ID</th>
              <th style={thStyle}>Property Address</th>
              <th style={thStyle}>Client Bank</th>
              <th style={thStyle}>Approval Date</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((project) => (
              <tr key={project.id}>
                <td style={tdStyle}>
                  <a style={projectIdStyle}>{project.projectId}</a>
                </td>
                <td style={tdStyle}>{project.propertyAddress}</td>
                <td style={tdStyle}>{project.applicant}</td>
                <td style={tdStyle}>{formatDate(project.requestedDate)}</td>
                <td style={tdStyle}>
                  <span style={statusBadgeStyle}>Completed</span>
                </td>
                <td style={tdStyle}>
                  <button style={buttonStyle}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={paginationStyle}>
          <div style={paginationInfoStyle}>
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, approvedProjects.length)} of{" "}
            {approvedProjects.length} reports
          </div>
          <div>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                style={pageButtonStyle(currentPage === page)}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovedReports;
