import type { CSSProperties } from "react";
import { useState, useMemo } from "react";
import {
  FilterOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationOutlined,
} from "@ant-design/icons";
import L3ProjectsTable from "../../../components/organisms/L3ProjectsTable";
import { mockProjects } from "../utils/mockData";
import { theme } from "../../../styles/theme";

type FilterStatus = "all" | "needs-review" | "in-progress" | "completed";

const AllProjectsPage = () => {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    let result = mockProjects;

    // Filter by status
    if (filterStatus !== "all") {
      const statusMap: { [key in FilterStatus]: string[] } = {
        all: [],
        "needs-review": ["Needs Review", "Payment Pending"],
        "in-progress": ["In Progress", "Awaiting Docs", "Site Inspected"],
        completed: ["Completed", "Report Prepared"],
      };

      const statuses = statusMap[filterStatus];
      result = result.filter((p) => statuses.includes(p.status));
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.projectId.toLowerCase().includes(query) ||
          p.propertyAddress.toLowerCase().includes(query) ||
          p.applicant?.toLowerCase().includes(query),
      );
    }

    return result;
  }, [filterStatus, searchQuery]);

  const statusStats = useMemo(() => {
    return {
      all: mockProjects.length,
      "needs-review": mockProjects.filter((p) =>
        ["Needs Review", "Payment Pending"].includes(p.status),
      ).length,
      "in-progress": mockProjects.filter((p) =>
        ["In Progress", "Awaiting Docs", "Site Inspected"].includes(p.status),
      ).length,
      completed: mockProjects.filter((p) =>
        ["Completed", "Report Prepared"].includes(p.status),
      ).length,
    };
  }, []);

  const containerStyle: CSSProperties = {
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const headerStyle: CSSProperties = {
    marginBottom: "24px",
  };

  const titleStyle: CSSProperties = {
    fontSize: "28px",
    fontWeight: 700,
    color: theme.colors.text.primary,
    marginBottom: "8px",
  };

  const subtitleStyle: CSSProperties = {
    fontSize: "14px",
    color: theme.colors.text.secondary,
    marginBottom: "24px",
  };

  const filterBarStyle: CSSProperties = {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap",
  };

  const filterButtonStyle = (isActive: boolean): CSSProperties => ({
    padding: "8px 16px",
    border: isActive ? "none" : `1px solid ${theme.colors.border}`,
    borderRadius: "6px",
    backgroundColor: isActive ? "#1890ff" : "white",
    color: isActive ? "white" : theme.colors.text.primary,
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  });

  const searchStyle: CSSProperties = {
    flex: 1,
    minWidth: "250px",
  };

  const searchInputStyle: CSSProperties = {
    width: "100%",
    padding: "8px 16px 8px 36px",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238c8c8c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cpath d='m21 21-4.35-4.35'%3E%3C/path%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "12px center",
    backgroundSize: "16px",
  };

  const statsGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  };

  const statBoxStyle = (): CSSProperties => ({
    backgroundColor: theme.colors.background.paper,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: "8px",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  });

  const statIconStyle = (color: string): CSSProperties => ({
    width: "48px",
    height: "48px",
    borderRadius: "8px",
    backgroundColor: color + "33",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: color,
    fontSize: "24px",
  });

  const statContentStyle: CSSProperties = {
    flex: 1,
  };

  const statValueStyle: CSSProperties = {
    fontSize: "24px",
    fontWeight: 700,
    color: theme.colors.text.primary,
  };

  const statLabelStyle: CSSProperties = {
    fontSize: "12px",
    color: theme.colors.text.secondary,
    marginTop: "4px",
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>All Projects</h1>
        <p style={subtitleStyle}>
          Manage and review all ongoing property valuation projects
        </p>
      </div>

      {/* Filter Bar */}
      <div style={filterBarStyle}>
        <button
          style={filterButtonStyle(filterStatus === "all")}
          onClick={() => setFilterStatus("all")}
        >
          <FilterOutlined /> All Projects ({statusStats.all})
        </button>
        <button
          style={filterButtonStyle(filterStatus === "needs-review")}
          onClick={() => setFilterStatus("needs-review")}
        >
          <ExclamationOutlined /> Needs Review ({statusStats["needs-review"]})
        </button>
        <button
          style={filterButtonStyle(filterStatus === "in-progress")}
          onClick={() => setFilterStatus("in-progress")}
        >
          <ClockCircleOutlined /> In Progress ({statusStats["in-progress"]})
        </button>
        <button
          style={filterButtonStyle(filterStatus === "completed")}
          onClick={() => setFilterStatus("completed")}
        >
          <CheckCircleOutlined /> Completed ({statusStats.completed})
        </button>

        {/* Search Box */}
        <div style={searchStyle}>
          <input
            type="text"
            placeholder="Search by Project ID, Address, or Applicant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
          />
        </div>

        {/* Refresh Button */}
        <button
          style={{
            ...filterButtonStyle(false),
            padding: "8px 12px",
          }}
          onClick={() => {
            setFilterStatus("all");
            setSearchQuery("");
          }}
          title="Reset filters"
        >
          <ReloadOutlined />
        </button>
      </div>

      {/* Statistics Cards */}
      <div style={statsGridStyle}>
        <div style={statBoxStyle()}>
          <div style={statIconStyle("#1890ff")}>
            <FilterOutlined />
          </div>
          <div style={statContentStyle}>
            <div style={statValueStyle}>{mockProjects.length}</div>
            <div style={statLabelStyle}>Total Projects</div>
          </div>
        </div>

        <div style={statBoxStyle()}>
          <div style={statIconStyle("#faad14")}>
            <ExclamationOutlined />
          </div>
          <div style={statContentStyle}>
            <div style={statValueStyle}>
              {
                mockProjects.filter((p) =>
                  ["Needs Review", "Payment Pending"].includes(p.status),
                ).length
              }
            </div>
            <div style={statLabelStyle}>Needs Your Review</div>
          </div>
        </div>

        <div style={statBoxStyle()}>
          <div style={statIconStyle("#1890ff")}>
            <ClockCircleOutlined />
          </div>
          <div style={statContentStyle}>
            <div style={statValueStyle}>
              {
                mockProjects.filter((p) =>
                  ["In Progress", "Awaiting Docs", "Site Inspected"].includes(
                    p.status,
                  ),
                ).length
              }
            </div>
            <div style={statLabelStyle}>In Progress</div>
          </div>
        </div>

        <div style={statBoxStyle()}>
          <div style={statIconStyle("#52c41a")}>
            <CheckCircleOutlined />
          </div>
          <div style={statContentStyle}>
            <div style={statValueStyle}>
              {
                mockProjects.filter((p) =>
                  ["Completed", "Report Prepared"].includes(p.status),
                ).length
              }
            </div>
            <div style={statLabelStyle}>Completed</div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <L3ProjectsTable projects={filteredProjects as any} showSearch={false} />

      {/* No Results Message */}
      {filteredProjects.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            color: theme.colors.text.secondary,
          }}
        >
          <p>No projects found matching your filters</p>
        </div>
      )}
    </div>
  );
};

export default AllProjectsPage;
