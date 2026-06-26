import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import {
  AuditOutlined,
  FileDoneOutlined,
  FolderOpenOutlined,
  RightOutlined,
  SyncOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  technicalOfficerProjectsApi,
  type TechnicalOfficerProject,
  type TechnicalOfficerProjectStatus,
} from "../../../services/technicalOfficerProjectsApi";

const getTodayDateValue = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const isProjectOverdue = (project: TechnicalOfficerProject) =>
  project.status !== "Completed" &&
  project.status !== "Pending Review" &&
  project.deadline < getTodayDateValue();

const getDisplayStatus = (project: TechnicalOfficerProject): TechnicalOfficerProjectStatus =>
  isProjectOverdue(project) ? "Overdue" : project.status;

const TechnicalOfficerDashboard = () => {
  const [projects, setProjects] = useState<TechnicalOfficerProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      // Note: error handling for dashboard project loading.
      try {
        setLoading(true);
        setError("");
        const data = await technicalOfficerProjectsApi.findAll();
        setProjects(data);
      } catch (apiError) {
        setError(apiError instanceof Error ? apiError.message : "Failed to load assigned projects.");
      } finally {
        setLoading(false);
      }
    };

    void loadProjects();
  }, []);

  const stats = useMemo(() => {
    return [
      {
        label: "Total Projects",
        value: projects.length.toString(),
        description: "Assigned valuations",
        color: "#2563eb",
        backgroundColor: "#eff6ff",
        icon: FolderOpenOutlined,
      },
      {
        label: "In Progress",
        value: projects.filter((project) => project.status === "In Progress").length.toString(),
        description: "Currently being processed",
        color: "#0ea5e9",
        backgroundColor: "#f0f9ff",
        icon: SyncOutlined,
      },
      {
        label: "Pending Review",
        value: projects.filter((project) => project.status === "Pending Review").length.toString(),
        description: "Waiting for review",
        color: "#f59e0b",
        backgroundColor: "#fffbeb",
        icon: AuditOutlined,
      },
      {
        label: "Completed",
        value: projects.filter((project) => project.status === "Completed").length.toString(),
        description: "Finished valuations",
        color: "#22c55e",
        backgroundColor: "#f0fdf4",
        icon: FileDoneOutlined,
      },
    ];
  }, [projects]);

  const nextDeadline = [...projects]
    .filter((project) => project.status !== "Completed" && !isProjectOverdue(project))
    .sort((firstProject, secondProject) => firstProject.deadline.localeCompare(secondProject.deadline))[0];
  const pendingReviewCount = projects.filter((project) => project.status === "Pending Review").length;
  const overdueProjectCount = projects.filter(isProjectOverdue).length;

  const page: CSSProperties = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 32px 40px",
    boxSizing: "border-box",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  };

  const card: CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    padding: "20px",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
  };

  const badgeStyle = (backgroundColor: string, color: string, borderColor = "transparent"): CSSProperties => ({
    backgroundColor,
    color,
    border: `1px solid ${borderColor}`,
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  });

  const statusColorMap: Record<TechnicalOfficerProjectStatus, { bg: string; color: string; border: string }> = {
    Assigned: { bg: "#f9fafb", color: "#374151", border: "#e5e7eb" },
    "In Progress": { bg: "#e6f4ff", color: "#096dd9", border: "#bfdbfe" },
    "Site Inspection": { bg: "#ecfeff", color: "#0e7490", border: "#a5f3fc" },
    "Document Upload": { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
    "OCR Review": { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
    "Report Submission": { bg: "#f5f3ff", color: "#6d28d9", border: "#ddd6fe" },
    "Pending Review": { bg: "#fff7e6", color: "#d46b08", border: "#fde68a" },
    Completed: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
    Overdue: { bg: "#fff1f0", color: "#dc2626", border: "#fecaca" },
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(`${deadline}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return deadline;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div style={page}>
      <div style={{ marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
            Technical Officer Dashboard
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.5, margin: 0, maxWidth: "760px" }}>
            Overview of assigned valuation projects, document readiness, OCR review, and report submissions.
          </p>
        </div>
      </div>

      {error && <p style={{ color: "#dc2626", fontSize: "13px", fontWeight: 700, margin: "0 0 14px" }}>{error}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "16px", marginBottom: "20px" }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ ...card, padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start", marginBottom: "14px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  display: "grid",
                  placeItems: "center",
                  backgroundColor: stat.backgroundColor,
                  color: stat.color,
                  fontSize: "18px",
                }}
              >
                <stat.icon />
              </div>
            </div>
            <p style={{ fontSize: "30px", fontWeight: 700, color: "#111827", margin: "0 0 4px", lineHeight: 1 }}>{stat.value}</p>
            <p style={{ fontSize: "14px", color: "#111827", fontWeight: 700, margin: "0 0 4px" }}>{stat.label}</p>
            <p style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.5, margin: 0 }}>{stat.description}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: "20px", alignItems: "start" }}>
        <section style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Assigned Projects</h2>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>Current valuation projects assigned to the Technical Officer.</p>
            </div>
            <span style={badgeStyle("#f9fafb", "#374151", "#e5e7eb")}>{projects.length} Projects</span>
          </div>

          {loading ? (
            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>Loading assigned projects...</p>
          ) : projects.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>No assigned projects yet. Create one to begin.</p>
          ) : (
            <div style={{ overflowX: "auto", paddingBottom: "4px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.15fr 1.25fr 1fr 120px 132px 120px",
                  gap: "12px",
                  minWidth: "780px",
                  padding: "10px 14px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  color: "#64748b",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                <span>Project Code</span>
                <span>Client Name</span>
                <span>Location</span>
                <span>Deadline</span>
                <span>Status</span>
                <span></span>
              </div>
              <div style={{ display: "grid", gap: "10px", marginTop: "10px" }}>
                {projects.map((project) => {
                  const displayStatus = getDisplayStatus(project);

                  return (
                    <div
                      key={project.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.15fr 1.25fr 1fr 120px 132px 120px",
                        gap: "12px",
                        minWidth: "780px",
                        alignItems: "center",
                        padding: "14px",
                        border: "1px solid #edf2f7",
                        borderRadius: "10px",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 3px 10px rgba(15, 23, 42, 0.04)",
                      }}
                    >
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", margin: 0 }}>{project.projectCode}</p>
                      <p style={{ fontSize: "13px", color: "#374151", fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {project.clientName}
                      </p>
                      <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {project.location}
                      </p>
                      <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>{formatDeadline(project.deadline)}</p>
                      <span style={badgeStyle(statusColorMap[displayStatus].bg, statusColorMap[displayStatus].color, statusColorMap[displayStatus].border)}>
                        {displayStatus}
                      </span>
                      {/* Practice: Open Project button color is controlled by backgroundColor and color here */}
                      <button
                        style={{
                          border: "1px solid #bfdbfe",
                          backgroundColor: "#679add",
                          color: "#dfedfc",
                          borderRadius: "8px",
                          padding: "8px 10px",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                        onClick={() => navigate(`/technical-officer/projects/${encodeURIComponent(project.id)}`)}
                      >
                        Open Project <RightOutlined />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section style={card}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Today's Priority</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ padding: "14px", borderRadius: "10px", backgroundColor: "#f8fbff", border: "1px solid #dbeafe" }}>
              <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: 700, margin: "0 0 4px" }}>Next Deadline Project</p>
              <p style={{ color: "#111827", fontSize: "14px", fontWeight: 700, margin: "0 0 3px" }}>
                {nextDeadline ? nextDeadline.projectCode : "No active deadline"}
              </p>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>
                {nextDeadline ? `${nextDeadline.clientName} - ${formatDeadline(nextDeadline.deadline)}` : "All active work is clear."}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ padding: "14px", borderRadius: "10px", backgroundColor: "#fff7e6", border: "1px solid #fed7aa" }}>
                <p style={{ color: "#d46b08", fontSize: "24px", fontWeight: 700, margin: "0 0 4px" }}>{pendingReviewCount}</p>
                <p style={{ color: "#374151", fontSize: "12px", fontWeight: 700, margin: 0 }}>Pending Review</p>
              </div>
              <div style={{ padding: "14px", borderRadius: "10px", backgroundColor: "#fff1f0", border: "1px solid #fecaca" }}>
                <p style={{ color: "#dc2626", fontSize: "24px", fontWeight: 700, margin: "0 0 4px" }}>{overdueProjectCount}</p>
                <p style={{ color: "#374151", fontSize: "12px", fontWeight: 700, margin: 0 }}>
                  <WarningOutlined /> Overdue
                </p>
              </div>
            </div>

            <div style={{ padding: "14px", borderRadius: "10px", backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}>
              <p style={{ color: "#111827", fontSize: "13px", fontWeight: 700, margin: "0 0 4px" }}>Daily focus</p>
              <p style={{ color: "#6b7280", fontSize: "12px", lineHeight: 1.5, margin: 0 }}>
                Review deadlines first, complete pending document checks, then prepare reports for submission.
              </p>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
};

export default TechnicalOfficerDashboard;
