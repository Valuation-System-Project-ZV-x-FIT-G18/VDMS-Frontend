import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

type ProjectStatus =
  | "Assigned"
  | "In Progress"
  | "Site Inspection"
  | "Document Upload"
  | "OCR Review"
  | "Report Submission"
  | "Pending Review"
  | "Completed"
  | "Overdue";

interface TechnicalOfficerProject {
  id: string;
  projectCode: string;
  clientName: string;
  location: string;
  deadline: string;
  status: ProjectStatus;
  progress: number;
  assignedOfficerName: string;
}

const API_URL = "http://localhost:3000/technical-officer/projects";

interface ProjectFormData {
  projectCode: string;
  clientName: string;
  location: string;
  deadline: string;
  status: "Assigned" | "In Progress" | "Pending Review";
  progress: number;
  assignedOfficerName: string;
}

const initialFormData: ProjectFormData = {
  projectCode: "",
  clientName: "",
  location: "",
  deadline: "",
  status: "Assigned",
  progress: 0,
  assignedOfficerName: "John Doe",
};

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

const getDisplayStatus = (project: TechnicalOfficerProject): ProjectStatus =>
  isProjectOverdue(project) ? "Overdue" : project.status;

const AssignedProjects = () => {
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<TechnicalOfficerProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Note: error handling for loading assigned projects from the backend API.
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }

      const data = (await response.json()) as TechnicalOfficerProject[];
      setProjects(data);
    } catch (error) {
      console.error("Error loading Technical Officer projects:", error);
      setErrorMessage("Failed to load assigned projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProjects();
  }, []);

  const updateFormData = <K extends keyof ProjectFormData>(fieldName: K, value: ProjectFormData[K]) => {
    setFormData((currentFormData) => ({ ...currentFormData, [fieldName]: value }));
  };

  // Note: frontend validation before creating a project.
  const validateForm = () => {
    if (
      !formData.projectCode.trim() ||
      !formData.clientName.trim() ||
      !formData.location.trim() ||
      !formData.deadline ||
      !formData.status ||
      !formData.assignedOfficerName.trim()
    ) {
      return "All fields are required.";
    }

    if (formData.progress < 0 || formData.progress > 100) {
      return "Progress must be between 0 and 100.";
    }

    return "";
  };

  const handleCreateProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateForm();

    // Note: show validation errors before calling the backend.
    if (validationError) {
      setErrorMessage(validationError);
      setSuccessMessage("");
      return;
    }

    try {
      setCreating(true);
      setErrorMessage("");
      setSuccessMessage("");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create project: ${response.status}`);
      }

      setFormData(initialFormData);
      setShowCreateForm(false);
      setSuccessMessage("Project created successfully");
      await fetchProjects();
    } catch (error) {
      // Note: catch backend/API errors and show a user-friendly message.
      console.error("Error creating Technical Officer project:", error);
      setErrorMessage("Failed to create project. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const stats = useMemo(
    () => [
      { label: "Total Projects", value: projects.length.toString(), color: "#1890ff" },
      {
        label: "In Progress",
        value: projects.filter((project) => project.status === "In Progress").length.toString(),
        color: "#1890ff",
      },
      {
        label: "Pending Review",
        value: projects.filter((project) => project.status === "Pending Review").length.toString(),
        color: "#1890ff",
      },
      {
        label: "Overdue",
        value: projects.filter(isProjectOverdue).length.toString(),
        color: "#ff4d4f",
      },
    ],
    [projects]
  );

  const filteredProjects = projects.filter(
    (project) =>
      project.projectCode.toLowerCase().includes(search.toLowerCase()) ||
      project.clientName.toLowerCase().includes(search.toLowerCase()) ||
      project.location.toLowerCase().includes(search.toLowerCase())
  );

  const page: CSSProperties = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 32px 40px",
    boxSizing: "border-box",
  };

  const card: CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    padding: "20px",
  };

  // Practice: shared Assigned Projects button style. Change backgroundColor here for buttons using style={buttonStyle}.
  const buttonStyle: CSSProperties = {
    backgroundColor: "#1890ff",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 18px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  };

  const labelStyle: CSSProperties = {
    display: "block",
    color: "#374151",
    fontSize: "13px",
    fontWeight: 700,
    marginBottom: "6px",
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    padding: "9px 10px",
    fontSize: "14px",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
  };

  return (
    <div style={page}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: 0 }}>
          Assigned Projects
        </h1>
        {/* Practice: Create Project button uses buttonStyle color */}
        <button
          style={buttonStyle}
          onClick={() => {
            setShowCreateForm((currentValue) => !currentValue);
            setSuccessMessage("");
            setErrorMessage("");
          }}
        >
          Create Project
        </button>
      </div>

      {(successMessage || errorMessage) && (
        <p style={{ color: errorMessage ? "#dc2626" : "#15803d", fontSize: "13px", fontWeight: 700, margin: "0 0 14px" }}>
          {errorMessage || successMessage}
        </p>
      )}

      {showCreateForm && (
        <form onSubmit={handleCreateProject} style={{ ...card, marginBottom: "20px" }}>
          <h2 style={{ color: "#111827", fontSize: "16px", fontWeight: 700, margin: "0 0 16px" }}>
            Create Assigned Project
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
            <div>
              <label style={labelStyle}>Project Code</label>
              <input
                value={formData.projectCode}
                onChange={(event) => updateFormData("projectCode", event.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Client Name</label>
              <input
                value={formData.clientName}
                onChange={(event) => updateFormData("clientName", event.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input
                value={formData.location}
                onChange={(event) => updateFormData("location", event.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(event) => updateFormData("deadline", event.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select
                value={formData.status}
                onChange={(event) => updateFormData("status", event.target.value as ProjectFormData["status"])}
                required
                style={inputStyle}
              >
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending Review">Pending Review</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Progress</label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.progress}
                onChange={(event) => updateFormData("progress", Number(event.target.value))}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Assigned Officer Name</label>
              <input
                value={formData.assignedOfficerName}
                onChange={(event) => updateFormData("assignedOfficerName", event.target.value)}
                required
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            {/* Practice: Submit button color is controlled by this backgroundColor */}
            <button type="submit" disabled={creating} style={{ ...buttonStyle, backgroundColor: "#52c41a" }}>
              {creating ? "Submitting..." : "Submit"}
            </button>
            {/* Practice: Cancel button color is controlled by this backgroundColor, color, and border */}
            <button
              type="button"
              style={{ ...buttonStyle, backgroundColor: "#f9fafb", color: "#374151", border: "1px solid #d1d5db" }}
              onClick={() => {
                setShowCreateForm(false);
                setFormData(initialFormData);
                setErrorMessage("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div
        style={{
          ...card,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <SearchOutlined style={{ color: "#9ca3af", fontSize: "16px" }} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by project, client, or location..."
          style={{
            border: "none",
            outline: "none",
            fontSize: "14px",
            color: "#374151",
            width: "100%",
            background: "transparent",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {stats.map((stat) => (
          <div key={stat.label} style={card}>
            <p style={{ fontSize: "28px", fontWeight: 700, color: stat.color, margin: "0 0 4px" }}>
              {stat.value}
            </p>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ ...card, textAlign: "center", color: "#6b7280" }}>Loading assigned projects...</div>
      ) : projects.length === 0 ? (
        <div style={{ ...card, textAlign: "center", color: "#6b7280" }}>
          No assigned projects yet. Create one to begin.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "16px",
          }}
        >
          {filteredProjects.map((project) => {
            const displayStatus = getDisplayStatus(project);

            return (
              <div key={project.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <p style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
                    {project.projectCode} - {project.clientName}
                  </p>
                  <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>{project.location}</p>
                </div>
                <span
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: displayStatus === "Overdue" ? "#fff1f0" : "#e6f4ff",
                    color: displayStatus === "Overdue" ? "#dc2626" : "#096dd9",
                    borderRadius: "6px",
                    padding: "4px 10px",
                    fontSize: "12px",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  {displayStatus}
                </span>
              </div>

              <p
                style={{
                  fontSize: "13px",
                  color: displayStatus === "Overdue" ? "#dc2626" : "#6b7280",
                  margin: "0 0 12px",
                }}
              >
                Deadline: {project.deadline} | Officer: {project.assignedOfficerName}
              </p>

              <div
                style={{
                  height: "7px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "4px",
                  overflow: "hidden",
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${project.progress}%`,
                    backgroundColor: displayStatus === "Overdue" ? "#ff4d4f" : "#1890ff",
                    borderRadius: "4px",
                  }}
                />
              </div>

              {/* Practice: Open Project button uses buttonStyle color */}
              <button
                style={buttonStyle}
                onClick={() => navigate(`/technical-officer/projects/${encodeURIComponent(project.id)}`)}
              >
                Open Project
              </button>
            </div>
            );
          })}

          {filteredProjects.length === 0 && (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "60px 0",
                color: "#9ca3af",
                fontSize: "14px",
              }}
            >
              No projects found matching "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignedProjects;
