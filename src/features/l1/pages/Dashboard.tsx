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
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Scroll to pending reviews only when shouldScrollToPending is true
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

  // Filter for pending reviews only
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
    color: color,
  });

  const sectionStyle: CSSProperties = {
    marginBottom: "32px",
  };

  const sectionTitleStyle: CSSProperties = {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1f2937",
    marginBottom: "8px",
    margin: "0 0 8px 0",
  };

  const sectionDescStyle: CSSProperties = {
    fontSize: "13px",
    color: "#9ca3af",
    marginBottom: "16px",
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
        <h1 style={titleStyle}>Dashboard Overview</h1>
        <p style={subtitleStyle}>
          welcome back, here's what's happening with your valuation request
          today
        </p>
      </div>

      {/* Stats Cards */}
      <div style={statsGridStyle}>
        {/* Total Pending */}
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Total Pending</div>
          <div style={statValueStyle}>24</div>
          <span style={statBadgeStyle("#faad14")}>Needs Review</span>
        </div>

        {/* Approved Today */}
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Approved Today</div>
          <div style={statValueStyle}>12</div>
          <span style={statBadgeStyle("#52c41a")}>+15%</span>
        </div>

        {/* Avg TAT */}
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Avg. TAT</div>
          <div style={statValueStyle}>4.2h</div>
          <span style={statBadgeStyle("#13c2c2")}>On Track</span>
        </div>

        {/* Rejected */}
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Rejected</div>
          <div style={statValueStyle}>03</div>
          <span style={statBadgeStyle("#8c8c8c")}>Weekly</span>
        </div>
      </div>

      {/* Executive Navigation Cards */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          marginBottom: "40px",
        }}
      >
        {/* Bottlenecks Button */}
        <button
          type="button"
          onClick={() => onNavigate?.("bottlenecks")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "18px",
            padding: "22px 28px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "17px",
            boxShadow: "0 2px 12px rgba(59,130,246,0.08)",
            cursor: "pointer",
            transition: "box-shadow 0.2s, transform 0.2s",
            outline: "none",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 6px 24px rgba(59,130,246,0.18)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0 2px 12px rgba(59,130,246,0.08)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              boxShadow: "0 2px 8px rgba(59,130,246,0.12)",
              marginRight: "2px",
            }}
          >
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M8 6v12M16 6v12" />
            </svg>
          </span>
          <span style={{ flex: 1, textAlign: "left" }}>
            All Projects & Bottlenecks
            <br />
            <span style={{ fontWeight: 400, fontSize: "13px", opacity: 0.85 }}>
              View overdue projects and critical dependencies
            </span>
          </span>
        </button>

        {/* Morning Report Button */}
        <button
          type="button"
          onClick={() => onNavigate?.("morning-report")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "18px",
            padding: "22px 28px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "17px",
            boxShadow: "0 2px 12px rgba(16,185,129,0.08)",
            cursor: "pointer",
            transition: "box-shadow 0.2s, transform 0.2s",
            outline: "none",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 6px 24px rgba(16,185,129,0.18)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0 2px 12px rgba(16,185,129,0.08)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              boxShadow: "0 2px 8px rgba(16,185,129,0.12)",
              marginRight: "2px",
            }}
          >
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path d="M8 8h8M8 12h8M8 16h4" />
            </svg>
          </span>
          <span style={{ flex: 1, textAlign: "left" }}>
            Daily Morning Report
            <br />
            <span style={{ fontWeight: 400, fontSize: "13px", opacity: 0.85 }}>
              Check priorities, KPIs and critical issues
            </span>
          </span>
        </button>
      </div>

      {/* Pending Reviews Section */}
      <div style={sectionStyle} ref={pendingReviewsRef}>
        <h2 style={sectionTitleStyle}>Pending Reviews</h2>
        <p style={sectionDescStyle}>
          Queue of property valuation reports awaiting final approval.
        </p>

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
    </div>
  );
};

export default L3Dashboard;