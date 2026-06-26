import type { CSSProperties } from "react";
import { useState, useMemo, useRef, useEffect } from "react";
import { formatDate, getStatusColor } from "../utils/helpers";
import { projectService } from "../../../services/projectService";

interface L3DashboardProps {
  onNavigate?: (page: string, projectId?: string) => void;
  shouldScrollToPending?: boolean;
}

const L3Dashboard = ({
  onNavigate,
  shouldScrollToPending = false,
}: L3DashboardProps) => {
  const pendingReviewsRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getPending();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (shouldScrollToPending) {
      const timer = setTimeout(() => {
        pendingReviewsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [shouldScrollToPending]);

  const filteredProjects = useMemo(() => {
    const pendingReviews = projects.filter((p) =>
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
  }, [searchQuery, projects]);

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

  const statsGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "40px",
  };

  const statBoxStyle: CSSProperties = {
    backgroundColor: "#f9fafb",
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  };

  const statLabelStyle: CSSProperties = {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: 500,
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const statValueStyle: CSSProperties = {
    fontSize: "32px",
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: "12px",
  };

  const statBadgeStyle = (color: string): CSSProperties => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 600,
    backgroundColor: color + "20",
    color,
  });

  const sectionStyle: CSSProperties = {
    marginBottom: "32px",
  };

  const sectionTitleStyle: CSSProperties = {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1f2937",
    margin: "0 0 8px 0",
  };

  const sectionDescStyle: CSSProperties = {
    fontSize: "13px",
    color: "#9ca3af",
    margin: "0 0 16px 0",
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
      color,
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
  };

  const paginationStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
  };

  const paginationControlsStyle: CSSProperties = {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  };

  const pageButtonStyle = (active: boolean): CSSProperties => ({
    width: "32px",
    height: "32px",
    borderRadius: "4px",
    border: active ? "none" : "1px solid #e5e7eb",
    backgroundColor: active ? "#3b82f6" : "#ffffff",
    color: active ? "#ffffff" : "#6b7280",
    cursor: "pointer",
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

    return pages;
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Dashboard Overview</h1>
        <p style={subtitleStyle}>
          Welcome back, here's what's happening today.
        </p>
      </div>

      {/* Stats */}
      <div style={statsGridStyle}>
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Total Pending</div>
          <div style={statValueStyle}>24</div>
          <span style={statBadgeStyle("#faad14")}>Needs Review</span>
        </div>

        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Approved Today</div>
          <div style={statValueStyle}>12</div>
          <span style={statBadgeStyle("#52c41a")}>+15%</span>
        </div>

        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Avg. TAT</div>
          <div style={statValueStyle}>4.2h</div>
          <span style={statBadgeStyle("#13c2c2")}>On Track</span>
        </div>

        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Rejected</div>
          <div style={statValueStyle}>03</div>
          <span style={statBadgeStyle("#8c8c8c")}>Weekly</span>
        </div>
      </div>

      {/* Pending Reviews */}
      <div style={sectionStyle} ref={pendingReviewsRef}>
        <h2 style={sectionTitleStyle}>Pending Reviews</h2>
        <p style={sectionDescStyle}>
          Queue of property valuation reports awaiting final approval.
        </p>

        <div style={filterBarStyle}>
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

          <button style={filterButtonStyle}>Filter</button>
        </div>

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

        <div style={paginationStyle}>
          <div>
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredProjects.length)} of{" "}
            {filteredProjects.length}
          </div>

          <div style={paginationControlsStyle}>{renderPageButtons()}</div>
        </div>
      </div>
    </div>
  );
};

export default L3Dashboard;
