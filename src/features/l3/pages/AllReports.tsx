import type { CSSProperties } from "react";
import { useState, useMemo, useEffect } from "react";
import { formatDate } from "../utils/helpers";
import { projectService } from "../../../services/projectService";

const AllReports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getAll();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.projectId.toLowerCase().includes(query) ||
          project.propertyAddress.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [searchQuery, statusFilter, projects]);

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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  };

  const titleStyle: CSSProperties = {
    fontSize: "26px",
    fontWeight: 700,
    color: "#1f2937",
  };

  const headerButtonsStyle: CSSProperties = {
    display: "flex",
    gap: "12px",
  };

  const buttonStyle: CSSProperties = {
    padding: "10px 16px",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const statsGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
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

  const filterBarStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "1px solid #e5e7eb",
  };

  const filterGroupStyle: CSSProperties = {
    display: "flex",
    gap: "12px",
  };

  const searchInputStyle: CSSProperties = {
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
    width: "250px",
  };

  const selectStyle: CSSProperties = {
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    width: "160px",
  };

  const clearFilterStyle: CSSProperties = {
    color: "#3b82f6",
    fontSize: "12px",
    cursor: "pointer",
    textDecoration: "underline",
    background: "none",
    border: "none",
    padding: 0,
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
  };

  const getStatusBadgeStyle = (status: string): CSSProperties => {
    let bgColor = "#f3f4f6";
    let textColor = "#6b7280";

    if (status === "Completed") {
      bgColor = "#dcfce7";
      textColor = "#166534";
    } else if (status === "Pending") {
      bgColor = "#fef3c7";
      textColor = "#92400e";
    } else if (status === "Rejected") {
      bgColor = "#fee2e2";
      textColor = "#991b1b";
    } else if (status === "In Progress") {
      bgColor = "#dbeafe";
      textColor = "#1e40af";
    }

    return {
      display: "inline-block",
      padding: "6px 12px",
      backgroundColor: bgColor,
      color: textColor,
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: 600,
    };
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
        <h1 style={titleStyle}>All Reports</h1>
        <div style={headerButtonsStyle}>
          <button style={buttonStyle}>Export</button>
          <button style={buttonStyle}>New Report</button>
        </div>
      </div>

      {/* Stats */}
      <div style={statsGridStyle}>
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Total Reports</div>
          <div style={statValueStyle}>1,284</div>
          <div style={{ ...statSubtextStyle, color: "#10b981" }}>
            +12% from last month
          </div>
        </div>
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Approved</div>
          <div style={statValueStyle}>842</div>
          <div style={statSubtextStyle}>65% of total</div>
        </div>
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Pending Review</div>
          <div style={statValueStyle}>156</div>
          <div style={{ ...statSubtextStyle, color: "#f59e0b" }}>
            Attention needed
          </div>
        </div>
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Rejected</div>
          <div style={statValueStyle}>48</div>
          <div style={{ ...statSubtextStyle, color: "#ef4444" }}>
            -3% from last month
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={filterBarStyle}>
        <div style={filterGroupStyle}>
          <input
            type="text"
            placeholder="Search Project ID or Address..."
            style={searchInputStyle}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            style={selectStyle}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <button
          style={clearFilterStyle}
          onClick={() => {
            setSearchQuery("");
            setStatusFilter("all");
            setCurrentPage(1);
          }}
        >
          Clear filters
        </button>
      </div>

      {/* Table */}
      <div style={sectionStyle}>
        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th style={thStyle}>Project ID</th>
              <th style={thStyle}>Property Address</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Last Updated</th>
              <th style={thStyle}>Assigned To</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((project) => (
              <tr key={project.id}>
                <td style={tdStyle}>
                  <span style={projectIdStyle}>{project.projectId}</span>
                </td>
                <td style={tdStyle}>{project.propertyAddress}</td>
                <td style={tdStyle}>
                  <span style={getStatusBadgeStyle(project.status)}>
                    {project.status}
                  </span>
                </td>
                <td style={tdStyle}>{formatDate(project.requestedDate)}</td>
                <td style={tdStyle}>{project.applicant}</td>
                <td style={tdStyle}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "16px",
                      color: "#6b7280",
                    }}
                  >
                    ⋮
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={paginationStyle}>
          <div style={paginationInfoStyle}>
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredProjects.length)} of{" "}
            {filteredProjects.length} reports
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

export default AllReports;
