import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  technicalOfficerProjectsApi,
  type TechnicalOfficerProject,
} from "../../../services/technicalOfficerProjectsApi";

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<TechnicalOfficerProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setError("Project id is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await technicalOfficerProjectsApi.findOne(decodeURIComponent(projectId));
        setProject(data);
      } catch (apiError) {
        setError(apiError instanceof Error ? apiError.message : "Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    void loadProject();
  }, [projectId]);

  const page: CSSProperties = {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 32px 40px",
    boxSizing: "border-box",
  };

  const card: CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    padding: "24px",
  };

  // Practice: shared Project Details button style. It controls size/shape; most buttons below set their own colors.
  const buttonStyle: CSSProperties = {
    border: "none",
    borderRadius: "6px",
    padding: "10px 16px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  };

  if (loading) {
    return (
      <div style={page}>
        <div style={card}>Loading project details...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={page}>
        <div style={card}>
          <h1 style={{ fontSize: "22px", color: "#111827", margin: "0 0 8px" }}>Project not found</h1>
          <p style={{ color: "#6b7280", margin: "0 0 16px" }}>
            {error || "No assigned Technical Officer project matches this project id."}
          </p>
          {/* Practice: Back to Projects button color is controlled by this backgroundColor and color */}
          <button
            style={{ ...buttonStyle, backgroundColor: "#1890ff", color: "#ffffff" }}
            onClick={() => navigate("/technical-officer/projects")}
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const goToDocuments = (mode: "upload" | "ocr") => {
    navigate("/technical-officer/documents", { state: { selectedProjectId: project.id, mode } });
  };

  return (
    <div style={page}>
      {/* Practice: Back to Assigned Projects button color is controlled by this backgroundColor and color */}
      <button
        style={{ ...buttonStyle, backgroundColor: "transparent", color: "#1890ff", paddingLeft: 0, marginBottom: "12px" }}
        onClick={() => navigate("/technical-officer/projects")}
      >
        Back to Assigned Projects
      </button>

      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
              Project Details
            </h1>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>{project.projectCode}</p>
          </div>
          <span
            style={{
              alignSelf: "flex-start",
              backgroundColor: project.status === "Overdue" ? "#fff1f0" : "#e6f4ff",
              color: project.status === "Overdue" ? "#dc2626" : "#096dd9",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            {project.status}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
          {[
            ["Project ID", project.id],
            ["Project Code", project.projectCode],
            ["Client Name", project.clientName],
            ["Location", project.location],
            ["Deadline", project.deadline],
            ["Status", project.status],
            ["Progress", `${project.progress}%`],
            ["Assigned Officer", project.assignedOfficerName],
          ].map(([label, value]) => (
            <div key={label} style={{ backgroundColor: "#f9fafb", borderRadius: "8px", padding: "14px" }}>
              <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: 700, margin: "0 0 6px" }}>{label}</p>
              <p style={{ color: "#111827", fontSize: "15px", fontWeight: 700, margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: "8px", padding: "14px", marginBottom: "20px" }}>
          <p style={{ color: "#111827", fontSize: "13px", fontWeight: 700, margin: "0 0 6px" }}>Workflow steps</p>
          <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
            Upload project documents, run English OCR, review extracted data, edit the draft report, then submit it for Manager Review.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {/* Practice: Upload Document button color is controlled by this backgroundColor */}
          <button style={{ ...buttonStyle, backgroundColor: "#1890ff", color: "#ffffff" }} onClick={() => goToDocuments("upload")}>
            Upload Document
          </button>
          {/* Practice: Start OCR button color is controlled by this backgroundColor */}
          <button style={{ ...buttonStyle, backgroundColor: "#13c2c2", color: "#ffffff" }} onClick={() => goToDocuments("ocr")}>
            Start OCR
          </button>
          {/* Practice: Edit Report button color is controlled by this backgroundColor */}
          <button
            style={{ ...buttonStyle, backgroundColor: "#fa8c16", color: "#ffffff" }}
            onClick={() => navigate("/technical-officer/reports", { state: { selectedProjectId: project.id } })}
          >
            Edit Report
          </button>
          {/* Practice: Submit Report button color is controlled by this backgroundColor */}
          <button
            style={{ ...buttonStyle, backgroundColor: "#52c41a", color: "#ffffff" }}
            onClick={() => navigate("/technical-officer/reports", { state: { selectedProjectId: project.id, submit: true } })}
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
