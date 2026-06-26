import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useLocation } from "react-router-dom";
import { simulatedOcrFields, type OcrFields } from "../data/mockData";
import {
  technicalOfficerReportsApi,
  type CreateTechnicalOfficerReportPayload,
  type TechnicalOfficerReport,
} from "../../../services/technicalOfficerReportsApi";
import {
  technicalOfficerProjectsApi,
  type TechnicalOfficerProject,
} from "../../../services/technicalOfficerProjectsApi";

interface ReportsRouteState {
  selectedProjectId?: string;
  submit?: boolean;
  ocrFields?: OcrFields;
}

type ReportManagementStatus =
  | "Draft"
  | "Pending Review"
  | "Rejected"
  | "Clarification Requested"
  | "Resubmitted"
  | "Approved";

interface ValuationSummary {
  id: string;
  projectCode: string;
  clientName: string;
  submittedDate: string;
  finalStatus: "Submitted" | "Completed" | "Approved";
  summary: string;
}

const reportStatusStyle: Record<ReportManagementStatus, CSSProperties> = {
  Draft: { backgroundColor: "#fff7e6", color: "#d46b08" },
  "Pending Review": { backgroundColor: "#e6f4ff", color: "#096dd9" },
  Rejected: { backgroundColor: "#fff1f0", color: "#cf1322" },
  "Clarification Requested": { backgroundColor: "#fffbe6", color: "#ad8b00" },
  Resubmitted: { backgroundColor: "#f0f5ff", color: "#2f54eb" },
  Approved: { backgroundColor: "#f6ffed", color: "#389e0d" },
};

const emptyDraftForm: CreateTechnicalOfficerReportPayload = {
  projectId: "",
  reportTitle: "",
  inspectionNotes: "",
  valuationSummary: "",
  recommendation: "",
};

const fallbackSummarySeed: ValuationSummary[] = [
  {
    id: "SUM-001",
    projectCode: "VAL-2024-077",
    clientName: "Greenfield Holdings",
    submittedDate: "2026-04-12",
    finalStatus: "Completed",
    summary: "Residential land parcel with verified road frontage, clear title documents, and stable nearby comparable sales.",
  },
  {
    id: "SUM-002",
    projectCode: "VAL-2024-081",
    clientName: "Lakeview Residences",
    submittedDate: "2026-04-16",
    finalStatus: "Approved",
    summary: "Apartment valuation completed with market approach, adjusted for floor level, parking allocation, and building condition.",
  },
];

const OCR_STORAGE_KEY = "technicalOfficerOcrData";
const LOCAL_REPORTS_STORAGE_KEY = "technicalOfficerReportsFallback";

const readStoredOcrData = (): Record<string, OcrFields> => {
  try {
    const savedOcrData = localStorage.getItem(OCR_STORAGE_KEY);
    return savedOcrData ? (JSON.parse(savedOcrData) as Record<string, OcrFields>) : {};
  } catch {
    return {};
  }
};

const readLocalReports = (): TechnicalOfficerReport[] => {
  try {
    const savedReports = localStorage.getItem(LOCAL_REPORTS_STORAGE_KEY);
    return savedReports ? (JSON.parse(savedReports) as TechnicalOfficerReport[]) : [];
  } catch {
    return [];
  }
};

const saveLocalReports = (reportsToStore: TechnicalOfficerReport[]) => {
  localStorage.setItem(LOCAL_REPORTS_STORAGE_KEY, JSON.stringify(reportsToStore));
};

const normalizeStatus = (status: string): ReportManagementStatus =>
  ["Draft", "Pending Review", "Rejected", "Clarification Requested", "Resubmitted", "Approved"].includes(status)
    ? (status as ReportManagementStatus)
    : "Draft";

const Reports = () => {
  const location = useLocation();
  const routeState = location.state as ReportsRouteState | null;
  const requestedProjectId = new URLSearchParams(location.search).get("projectId") || routeState?.selectedProjectId || "";
  const [reports, setReports] = useState<TechnicalOfficerReport[]>([]);
  const [projects, setProjects] = useState<TechnicalOfficerProject[]>([]);
  const [selectedReportId, setSelectedReportId] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    routeState?.submit && routeState.selectedProjectId ? "Report submitted for Manager Review" : ""
  );
  const [showDraftPreview, setShowDraftPreview] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [draftForm, setDraftForm] = useState<CreateTechnicalOfficerReportPayload>({
    ...emptyDraftForm,
    projectId: requestedProjectId,
  });
  const [clarificationResponses, setClarificationResponses] = useState<Record<string, string>>({});
  const [selectedSummary, setSelectedSummary] = useState<ValuationSummary | null>(null);
  const [reportOcrFields, setReportOcrFields] = useState<Record<string, OcrFields>>({});

  const selectedReport = reports.find((report) => report.id === selectedReportId) || reports[0] || null;
  const selectedProject = projects.find((project) => project.id === selectedReport?.projectId);
  const selectedOcrFields = selectedReport ? reportOcrFields[selectedReport.id] : null;

  const getProjectLabel = (projectId: string) => {
    const project = projects.find((item) => item.id === projectId);
    return project ? `${project.projectCode} - ${project.clientName}` : projectId;
  };

  const buildLocalReport = (payload: CreateTechnicalOfficerReportPayload): TechnicalOfficerReport => {
    const now = new Date().toISOString();

    return {
      id: `LOCAL-RPT-${Date.now()}`,
      ...payload,
      status: "Draft",
      rejectionReason: null,
      clarificationRequest: null,
      clarificationResponse: null,
      submittedAt: null,
      createdAt: now,
      updatedAt: now,
    };
  };

  // Note: error handling for loading reports, projects, and saved OCR data.
  const loadReports = async (preferredReportId?: string) => {
    try {
      setLoading(true);
      setErrorMessage("");
      const [backendReports, backendProjects] = await Promise.all([
        technicalOfficerReportsApi.findAll(),
        technicalOfficerProjectsApi.findAll(),
      ]);
      const localReports = readLocalReports();
      const data = backendReports.length > 0 ? backendReports : localReports;
      const storedOcrData = readStoredOcrData();
      const requestedOcrFields = requestedProjectId ? storedOcrData[requestedProjectId] : null;
      const projectReport = requestedProjectId ? data.find((report) => report.projectId === requestedProjectId) : null;

      setProjects(backendProjects);

      if (requestedProjectId && !requestedOcrFields && !projectReport) {
        setReports(data);
        setSelectedReportId((currentId) => preferredReportId || currentId || data[0]?.id || "");
        setErrorMessage("Run OCR first before creating report.");
        return;
      }

      if (requestedProjectId && requestedOcrFields && !projectReport) {
        const draftPayload = {
          projectId: requestedProjectId,
          reportTitle: `Draft Valuation Report - ${backendProjects.find((item) => item.id === requestedProjectId)?.projectCode || requestedProjectId}`,
          inspectionNotes: `Draft prepared using simulated OCR data for ${backendProjects.find((item) => item.id === requestedProjectId)?.clientName || requestedOcrFields.ownerName || "selected client"}.`,
          valuationSummary: `Plan ${requestedOcrFields.planNo}, ${requestedOcrFields.lotNo}, owner ${requestedOcrFields.ownerName}, property at ${requestedOcrFields.propertyLocation}.`,
          recommendation: "Review fake OCR fields, complete valuation notes, then submit for Manager Review.",
        };

        try {
          const createdReport = await technicalOfficerReportsApi.create(draftPayload);
          const nextReports = [createdReport, ...data];
          setReports(nextReports);
          setSelectedReportId(createdReport.id);
          setSuccessMessage("Draft report created from saved fake OCR data.");
          setDraftForm((currentForm) => ({ ...currentForm, projectId: requestedProjectId }));
          setReportOcrFields((currentFields) => ({ ...currentFields, [createdReport.id]: requestedOcrFields }));
          return;
        } catch {
          // Note: fallback handling when backend report creation fails.
          const localReport = buildLocalReport(draftPayload);
          const nextReports = [localReport, ...localReports.filter((report) => report.projectId !== requestedProjectId)];
          saveLocalReports(nextReports);
          setReports(backendReports.length > 0 ? [localReport, ...backendReports] : nextReports);
          setSelectedReportId(localReport.id);
          setSuccessMessage("Draft report created locally from saved fake OCR data.");
          setDraftForm((currentForm) => ({ ...currentForm, projectId: requestedProjectId }));
          setReportOcrFields((currentFields) => ({ ...currentFields, [localReport.id]: requestedOcrFields }));
          return;
        }
      }

      setReports(data);
      setSelectedReportId((currentId) => preferredReportId || projectReport?.id || currentId || data[0]?.id || "");
      setDraftForm((currentForm) => ({ ...currentForm, projectId: requestedProjectId || currentForm.projectId }));
      setReportOcrFields((currentFields) =>
        data.reduce<Record<string, OcrFields>>((fieldsByReportId, report) => {
          const project = backendProjects.find((item) => item.id === report.projectId);
          const storedReportOcrFields = storedOcrData[report.projectId] || null;

          const baseOcrFields = {
            ...simulatedOcrFields,
            ownerName: project?.clientName || simulatedOcrFields.ownerName,
            propertyLocation: project?.location || simulatedOcrFields.propertyLocation,
          };

          fieldsByReportId[report.id] = {
            ...baseOcrFields,
            ...currentFields[report.id],
            ...storedReportOcrFields,
          };

          return fieldsByReportId;
        }, {})
      );
    } catch (apiError) {
      setErrorMessage(apiError instanceof Error ? apiError.message : "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedProjectId]);

  const stats = useMemo(
    () => [
      { label: "Draft Reports", value: reports.filter((report) => report.status === "Draft").length.toString(), color: "#fa8c16" },
      {
        label: "Pending Review",
        value: reports.filter((report) => report.status === "Pending Review").length.toString(),
        color: "#1890ff",
      },
      {
        label: "Needs Action",
        value: reports
          .filter((report) => report.status === "Rejected" || report.status === "Clarification Requested")
          .length.toString(),
        color: "#cf1322",
      },
      { label: "Total Reports", value: reports.length.toString(), color: "#111827" },
    ],
    [reports]
  );

  const rejectedReports = reports.filter((report) => report.status === "Rejected" || report.rejectionReason);
  const clarificationReports = reports.filter((report) => report.status === "Clarification Requested" || report.clarificationRequest);
  const valuationSummaries: ValuationSummary[] =
    reports
      .filter((report) => report.submittedAt || report.status === "Pending Review" || report.status === "Approved" || report.status === "Resubmitted")
      .map((report) => ({
        id: report.id,
        projectCode: projects.find((project) => project.id === report.projectId)?.projectCode || report.projectId,
        clientName: projects.find((project) => project.id === report.projectId)?.clientName || "Assigned Client",
        submittedDate: report.submittedAt ? report.submittedAt.slice(0, 10) : report.updatedAt.slice(0, 10),
        finalStatus: report.status === "Approved" ? "Approved" : report.status === "Pending Review" ? "Submitted" : "Completed",
        summary: report.valuationSummary,
      })) || fallbackSummarySeed;
  const summaryRows = valuationSummaries.length > 0 ? valuationSummaries : fallbackSummarySeed;

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

  // Practice: shared Reports page button style. Change backgroundColor here for buttons using style={primaryButton}.
  const primaryButton: CSSProperties = {
    backgroundColor: "#1890ff",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 16px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  };

  const updateSelectedReport = (fieldName: keyof CreateTechnicalOfficerReportPayload, value: string) => {
    if (!selectedReport) {
      return;
    }

    setReports((currentReports) =>
      currentReports.map((report) => (report.id === selectedReport.id ? { ...report, [fieldName]: value } : report))
    );
    setSuccessMessage("");
  };

  const updateSelectedOcrField = (fieldName: keyof OcrFields, value: string) => {
    if (!selectedReport) {
      return;
    }

    setReportOcrFields((currentFields) => ({
      ...currentFields,
      [selectedReport.id]: {
        ...(currentFields[selectedReport.id] || simulatedOcrFields),
        [fieldName]: value,
      },
    }));
    setSuccessMessage("");
  };

  // Note: error handling for creating a draft report.
  const createDraftReport = async () => {
    try {
      setErrorMessage("");
      const createdReport = await technicalOfficerReportsApi.create(draftForm);
      setDraftForm({ ...emptyDraftForm, projectId: requestedProjectId });
      setShowCreateForm(false);
      setSuccessMessage("Draft report created successfully");
      await loadReports(createdReport.id);
    } catch (apiError) {
      setErrorMessage(apiError instanceof Error ? apiError.message : "Failed to create draft report.");
    }
  };

  const saveSelectedReport = async () => {
    if (!selectedReport) {
      return;
    }

    // Note: local fallback handling when backend-created report is not available.
    if (selectedReport.id.startsWith("LOCAL-RPT-")) {
      const nextReport = { ...selectedReport, updatedAt: new Date().toISOString() };
      const nextReports = reports.map((report) => (report.id === nextReport.id ? nextReport : report));
      setReports(nextReports);
      saveLocalReports(nextReports.filter((report) => report.id.startsWith("LOCAL-RPT-")));
      setSuccessMessage("Report changes saved locally");
      setErrorMessage("");
      return;
    }

    // Note: error handling for saving report changes to the backend.
    try {
      const savedReport = await technicalOfficerReportsApi.update(selectedReport.id, {
        projectId: selectedReport.projectId,
        reportTitle: selectedReport.reportTitle,
        inspectionNotes: selectedReport.inspectionNotes,
        valuationSummary: selectedReport.valuationSummary,
        recommendation: selectedReport.recommendation,
      });
      setReports((currentReports) => currentReports.map((report) => (report.id === savedReport.id ? savedReport : report)));
      setSuccessMessage("Report changes saved");
      setErrorMessage("");
    } catch (apiError) {
      setErrorMessage(apiError instanceof Error ? apiError.message : "Failed to save report.");
    }
  };

  const submitForReview = async () => {
    if (!selectedReport) {
      return;
    }

    // Note: local fallback handling for submitting locally stored reports.
    if (selectedReport.id.startsWith("LOCAL-RPT-")) {
      const now = new Date().toISOString();
      const submittedReport = {
        ...selectedReport,
        status: "Pending Review",
        submittedAt: now,
        updatedAt: now,
      };
      const nextReports = reports.map((report) => (report.id === submittedReport.id ? submittedReport : report));
      setReports(nextReports);
      saveLocalReports(nextReports.filter((report) => report.id.startsWith("LOCAL-RPT-")));
      setShowDraftPreview(false);
      setSuccessMessage("Draft report submitted locally for Manager Review");
      setErrorMessage("");
      return;
    }

    // Note: error handling for submitting the report to manager review.
    try {
      const submittedReport = await technicalOfficerReportsApi.submit(selectedReport.id);
      setReports((currentReports) => currentReports.map((report) => (report.id === submittedReport.id ? submittedReport : report)));
      setShowDraftPreview(false);
      setSuccessMessage("Draft report submitted for Manager Review");
      setErrorMessage("");
    } catch (apiError) {
      setErrorMessage(apiError instanceof Error ? apiError.message : "Failed to submit report.");
    }
  };

  const sendClarificationResponse = async (reportId: string) => {
    const response = clarificationResponses[reportId] || "";

    // Note: validation before sending clarification response.
    if (!response.trim()) {
      setSuccessMessage("Add a clarification response before sending.");
      return;
    }

    if (reportId.startsWith("LOCAL-RPT-")) {
      const now = new Date().toISOString();
      const nextReports = reports.map((report) =>
        report.id === reportId
          ? { ...report, clarificationResponse: response, status: "Resubmitted", updatedAt: now }
          : report
      );
      setReports(nextReports);
      saveLocalReports(nextReports.filter((report) => report.id.startsWith("LOCAL-RPT-")));
      setSelectedReportId(reportId);
      setSuccessMessage("Clarification response saved locally");
      setErrorMessage("");
      return;
    }

    try {
      const updatedReport = await technicalOfficerReportsApi.respondToClarification(reportId, response);
      setReports((currentReports) => currentReports.map((report) => (report.id === updatedReport.id ? updatedReport : report)));
      setSelectedReportId(updatedReport.id);
      setSuccessMessage("Clarification response sent successfully");
      setErrorMessage("");
    } catch (apiError) {
      setErrorMessage(apiError instanceof Error ? apiError.message : "Failed to send clarification response.");
    }
  };

  return (
    <div style={page}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: 0 }}>Reports</h1>
        {/* Practice: Create Draft Report uses primaryButton color */}
        <button style={primaryButton} onClick={() => setShowCreateForm((current) => !current)}>
          Create Draft Report
        </button>
      </div>

      {(errorMessage || successMessage) && (
        <div
          style={{
            ...card,
            borderColor: errorMessage ? "#fecaca" : "#bbf7d0",
            color: errorMessage ? "#dc2626" : "#15803d",
            marginBottom: "20px",
          }}
        >
          {errorMessage || successMessage}
        </div>
      )}

      {showCreateForm && (
        <section style={{ ...card, marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>
            Create Draft Report
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
            {(Object.keys(emptyDraftForm) as Array<keyof CreateTechnicalOfficerReportPayload>).map((fieldName) => (
              <div key={fieldName} style={{ gridColumn: fieldName === "projectId" || fieldName === "reportTitle" ? undefined : "1 / -1" }}>
                <label style={labelStyle}>{fieldName}</label>
                {fieldName === "projectId" || fieldName === "reportTitle" ? (
                  <input
                    value={draftForm[fieldName]}
                    onChange={(event) => setDraftForm((current) => ({ ...current, [fieldName]: event.target.value }))}
                    style={inputStyle}
                  />
                ) : (
                  <textarea
                    value={draftForm[fieldName]}
                    onChange={(event) => setDraftForm((current) => ({ ...current, [fieldName]: event.target.value }))}
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                )}
              </div>
            ))}
          </div>
          {/* Practice: Save Draft Report uses primaryButton color */}
          <button style={{ ...primaryButton, marginTop: "14px" }} onClick={createDraftReport}>
            Save Draft Report
          </button>
        </section>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "20px" }}>
        {stats.map((stat) => (
          <div key={stat.label} style={card}>
            <p style={{ fontSize: "30px", fontWeight: 700, color: stat.color, margin: "0 0 4px" }}>{stat.value}</p>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "20px" }}>
        <section style={card}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>
            Draft Reports by Project
          </h2>

          {loading ? (
            <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>Loading reports...</p>
          ) : reports.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>No reports created yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {reports.map((report) => {
                const isSelected = report.id === selectedReport?.id;
                const status = normalizeStatus(report.status);

                return (
                  <button
                    key={report.id}
                    style={{
                      textAlign: "left",
                      backgroundColor: isSelected ? "#f0f7ff" : "#ffffff",
                      border: `1px solid ${isSelected ? "#91caff" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      padding: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedReportId(report.id);
                      setSuccessMessage("");
                    }}
                  >
                    <p style={{ color: "#111827", fontSize: "14px", fontWeight: 700, margin: "0 0 4px" }}>
                      {getProjectLabel(report.projectId)}
                    </p>
                    <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 8px" }}>{report.reportTitle}</p>
                    <span style={{ ...reportStatusStyle[status], borderRadius: "6px", padding: "4px 10px", fontSize: "12px", fontWeight: 700 }}>
                      {report.status}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {selectedReport && (
          <section style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "18px" }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
                  Editable Report Form
                </h2>
                <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>
                  {selectedProject ? `${selectedProject.projectCode} - ${selectedProject.clientName}` : selectedReport.projectId}
                </p>
              </div>
              <span
                style={{
                  ...reportStatusStyle[normalizeStatus(selectedReport.status)],
                  alignSelf: "flex-start",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {selectedReport.status}
              </span>
            </div>

            {selectedReport.rejectionReason && (
              <div style={{ backgroundColor: "#fff1f0", border: "1px solid #ffccc7", borderRadius: "8px", color: "#7f1d1d", fontSize: "13px", lineHeight: 1.5, marginBottom: "16px", padding: "12px" }}>
                <strong>Rejection reason:</strong> {selectedReport.rejectionReason}
              </div>
            )}

            <div style={{ display: "grid", gap: "14px" }}>
              <div style={{ backgroundColor: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: "8px", padding: "14px" }}>
                <h3 style={{ color: "#111827", fontSize: "15px", fontWeight: 700, margin: "0 0 6px" }}>
                  OCR Extracted Data Used for Report
                </h3>
                <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: 1.5, margin: "0 0 14px" }}>
                  OCR extracted fields are reviewed before preparing the draft report.
                </p>

                {selectedOcrFields && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                    {(Object.keys(selectedOcrFields) as Array<keyof OcrFields>).map((fieldName) => (
                      <div key={fieldName}>
                        <label style={labelStyle}>{fieldName}</label>
                        <input
                          type={fieldName === "surveyDate" ? "date" : "text"}
                          value={selectedOcrFields[fieldName]}
                          onChange={(event) => updateSelectedOcrField(fieldName, event.target.value)}
                          style={inputStyle}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>Report Title</label>
                <input value={selectedReport.reportTitle} onChange={(event) => updateSelectedReport("reportTitle", event.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Inspection Notes</label>
                <textarea value={selectedReport.inspectionNotes} onChange={(event) => updateSelectedReport("inspectionNotes", event.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div>
                <label style={labelStyle}>Valuation Summary</label>
                <textarea value={selectedReport.valuationSummary} onChange={(event) => updateSelectedReport("valuationSummary", event.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div>
                <label style={labelStyle}>Recommendation</label>
                <textarea value={selectedReport.recommendation} onChange={(event) => updateSelectedReport("recommendation", event.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "18px", flexWrap: "wrap" }}>
              {/* Practice: Save Changes button color is controlled by this backgroundColor */}
              <button style={{ ...primaryButton, backgroundColor: "#52c41a" }} onClick={saveSelectedReport}>
                Save Changes
              </button>
              {/* Practice: Preview Draft Report button color is controlled by this backgroundColor */}
              <button style={{ ...primaryButton, backgroundColor: "#13c2c2" }} onClick={() => setShowDraftPreview(true)}>
                Preview Draft Report
              </button>
              {/* Practice: Submit for Review uses primaryButton color */}
              <button style={primaryButton} onClick={submitForReview}>
                Submit for Review
              </button>
            </div>
          </section>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", marginTop: "20px" }}>
        <section style={card}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Rejected Reports</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {rejectedReports.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>No rejected reports.</p>
            ) : (
              rejectedReports.map((report) => (
                <div key={report.id} style={{ border: "1px solid #f3f4f6", borderRadius: "8px", padding: "14px" }}>
                  <p style={{ color: "#111827", fontSize: "14px", fontWeight: 700, margin: "0 0 4px" }}>{getProjectLabel(report.projectId)}</p>
                  <p style={{ color: "#374151", fontSize: "13px", lineHeight: 1.5, margin: "0 0 12px" }}>
                    {report.rejectionReason || "Report was rejected by reviewer."}
                  </p>
                  <button style={{ ...primaryButton, backgroundColor: "#cf1322", padding: "8px 12px" }} onClick={() => setSelectedReportId(report.id)}>
                    Review Rejection
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section style={card}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>
            Clarification Requests
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {clarificationReports.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>No clarification requests.</p>
            ) : (
              clarificationReports.map((report) => (
                <div key={report.id} style={{ border: "1px solid #f3f4f6", borderRadius: "8px", padding: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
                    <p style={{ color: "#111827", fontSize: "14px", fontWeight: 700, margin: 0 }}>{getProjectLabel(report.projectId)}</p>
                    <span style={{ ...reportStatusStyle[normalizeStatus(report.status)], borderRadius: "6px", fontSize: "12px", fontWeight: 700, padding: "4px 10px" }}>
                      {report.status}
                    </span>
                  </div>
                  <p style={{ color: "#374151", fontSize: "13px", lineHeight: 1.5, margin: "0 0 12px" }}>
                    {report.clarificationRequest || "Reviewer requested clarification for this report."}
                  </p>
                  <label style={labelStyle}>Response to clarification</label>
                  <textarea
                    value={clarificationResponses[report.id] ?? report.clarificationResponse ?? ""}
                    onChange={(event) => setClarificationResponses((current) => ({ ...current, [report.id]: event.target.value }))}
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical", marginBottom: "10px" }}
                  />
                  <button style={{ ...primaryButton, padding: "8px 12px" }} onClick={() => sendClarificationResponse(report.id)}>
                    Send Response
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section style={{ ...card, marginTop: "20px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>
          Past Valuation Summaries
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "860px" }}>
            <thead>
              <tr>
                {["Project Code", "Client Name", "Submitted Date", "Final Status", "Summary", "Actions"].map((column) => (
                  <th key={column} style={{ borderBottom: "1px solid #f3f4f6", color: "#374151", fontSize: "12px", fontWeight: 700, padding: "10px 12px", textAlign: "left" }}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summaryRows.map((summary) => (
                <tr key={summary.id}>
                  <td style={{ borderBottom: "1px solid #f3f4f6", color: "#111827", fontSize: "14px", fontWeight: 700, padding: "12px" }}>{summary.projectCode}</td>
                  <td style={{ borderBottom: "1px solid #f3f4f6", color: "#374151", fontSize: "14px", padding: "12px" }}>{summary.clientName}</td>
                  <td style={{ borderBottom: "1px solid #f3f4f6", color: "#6b7280", fontSize: "14px", padding: "12px" }}>{summary.submittedDate}</td>
                  <td style={{ borderBottom: "1px solid #f3f4f6", color: "#6b7280", fontSize: "14px", padding: "12px" }}>{summary.finalStatus}</td>
                  <td style={{ borderBottom: "1px solid #f3f4f6", color: "#6b7280", fontSize: "14px", padding: "12px" }}>{summary.summary}</td>
                  <td style={{ borderBottom: "1px solid #f3f4f6", padding: "12px" }}>
                    {/* Practice: View Summary button color is controlled by this backgroundColor */}
                    <button style={{ ...primaryButton, backgroundColor: "#13c2c2", padding: "8px 12px", whiteSpace: "nowrap" }} onClick={() => setSelectedSummary(summary)}>
                      View Summary
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showDraftPreview && selectedReport && selectedOcrFields && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.35)", display: "grid", placeItems: "center", padding: "24px", zIndex: 1000 }} onClick={() => setShowDraftPreview(false)}>
          <section style={{ ...card, width: "100%", maxWidth: "760px", maxHeight: "88vh", overflow: "auto" }} onClick={(event) => event.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "18px" }}>
              <div>
                <h2 style={{ color: "#111827", fontSize: "20px", fontWeight: 700, margin: "0 0 4px" }}>Draft Report Preview</h2>
                <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>Review OCR and manual report content before manager submission.</p>
              </div>
              <button style={{ backgroundColor: "transparent", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "14px", fontWeight: 700 }} onClick={() => setShowDraftPreview(false)}>
                Close
              </button>
            </div>

            {[
              ["Project ID", selectedReport.projectId],
              ["Report Title", selectedReport.reportTitle],
              ["Inspection Notes", selectedReport.inspectionNotes],
              ["Valuation Summary", selectedReport.valuationSummary],
              ["Recommendation", selectedReport.recommendation],
            ].map(([label, value]) => (
              <div key={label} style={{ marginBottom: "14px" }}>
                <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: 700, margin: "0 0 4px" }}>{label}</p>
                <p style={{ color: "#111827", fontSize: "14px", lineHeight: 1.5, margin: 0 }}>{value}</p>
              </div>
            ))}

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
              <button style={{ ...primaryButton, backgroundColor: "#f9fafb", color: "#374151", border: "1px solid #d1d5db" }} onClick={() => setShowDraftPreview(false)}>
                Back to Edit
              </button>
              <button style={primaryButton} onClick={submitForReview}>
                Confirm and Submit for Manager Review
              </button>
            </div>
          </section>
        </div>
      )}

      {selectedSummary && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.35)", display: "grid", placeItems: "center", padding: "24px", zIndex: 1000 }} onClick={() => setSelectedSummary(null)}>
          <section style={{ ...card, width: "100%", maxWidth: "620px" }} onClick={(event) => event.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "18px" }}>
              <div>
                <h2 style={{ color: "#111827", fontSize: "20px", fontWeight: 700, margin: "0 0 4px" }}>Valuation Summary</h2>
                <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>{selectedSummary.projectCode} - {selectedSummary.clientName}</p>
              </div>
              <button style={{ backgroundColor: "transparent", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "14px", fontWeight: 700 }} onClick={() => setSelectedSummary(null)}>
                Close
              </button>
            </div>
            {[
              ["Submitted Date", selectedSummary.submittedDate],
              ["Final Status", selectedSummary.finalStatus],
              ["Summary", selectedSummary.summary],
            ].map(([label, value]) => (
              <div key={label} style={{ marginBottom: "14px" }}>
                <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: 700, margin: "0 0 4px" }}>{label}</p>
                <p style={{ color: "#111827", fontSize: "14px", lineHeight: 1.5, margin: 0 }}>{value}</p>
              </div>
            ))}
          </section>
        </div>
      )}
    </div>
  );
};

export default Reports;
