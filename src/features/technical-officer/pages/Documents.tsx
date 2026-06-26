import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FileTextOutlined, InboxOutlined } from "@ant-design/icons";
import { type OcrFields } from "../data/mockData";
import {
  technicalOfficerProjectsApi,
  type TechnicalOfficerProject,
} from "../../../services/technicalOfficerProjectsApi";

interface DocumentsRouteState {
  selectedProjectId?: string;
  mode?: "upload" | "ocr";
}

type DocumentStatus = "Uploaded" | "OCR Ready" | "Pending Review" | "Approved";

interface UploadedProjectDocument {
  id: string;
  projectId: string;
  documentType: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileDataUrl: string;
  uploadDate: string;
  status: DocumentStatus;
}

const documentStatusStyle: Record<DocumentStatus, CSSProperties> = {
  Uploaded: { backgroundColor: "#e6f4ff", color: "#096dd9" },
  "OCR Ready": { backgroundColor: "#f6ffed", color: "#389e0d" },
  "Pending Review": { backgroundColor: "#fff7e6", color: "#d46b08" },
  Approved: { backgroundColor: "#f0fdf4", color: "#15803d" },
};

const simulatedOcrFields: OcrFields = {
  planNo: "SP/ENG/2026/0148",
  lotNo: "Lot 12B",
  ownerName: "",
  propertyLocation: "",
  surveyDate: "2026-04-18",
};

const DOCUMENTS_STORAGE_KEY = "technicalOfficerDocuments";
const OCR_STORAGE_KEY = "technicalOfficerOcrData";

const readStoredDocuments = (): UploadedProjectDocument[] => {
  try {
    const savedDocuments = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    return savedDocuments ? (JSON.parse(savedDocuments) as UploadedProjectDocument[]) : [];
  } catch {
    return [];
  }
};

const readStoredOcrData = (): Record<string, OcrFields> => {
  try {
    const savedOcrData = localStorage.getItem(OCR_STORAGE_KEY);
    return savedOcrData ? (JSON.parse(savedOcrData) as Record<string, OcrFields>) : {};
  } catch {
    return {};
  }
};

const saveStoredDocuments = (documentsToStore: UploadedProjectDocument[]) => {
  localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documentsToStore));
};

const saveStoredOcrData = (ocrDataToStore: Record<string, OcrFields>) => {
  localStorage.setItem(OCR_STORAGE_KEY, JSON.stringify(ocrDataToStore));
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const Documents = () => {
  const location = useLocation();
  const routeState = location.state as DocumentsRouteState | null;
  const navigate = useNavigate();
  const requestedProjectId = new URLSearchParams(location.search).get("projectId") || routeState?.selectedProjectId || "";
  const [projects, setProjects] = useState<TechnicalOfficerProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");
  const [documents, setDocuments] = useState<UploadedProjectDocument[]>(() => readStoredDocuments());
  const [selectedProjectId, setSelectedProjectId] = useState(requestedProjectId);
  const [documentType, setDocumentType] = useState("Survey Plan");
  const [uploadMessage, setUploadMessage] = useState("");
  const [ocrProjectId, setOcrProjectId] = useState(requestedProjectId);
  const [ocrFile, setOcrFile] = useState<File | null>(null);
  const [ocrDataByProject, setOcrDataByProject] = useState<Record<string, OcrFields>>(() => readStoredOcrData());
  const [ocrFields, setOcrFields] = useState<OcrFields | null>(null);
  const [savedOcrFields, setSavedOcrFields] = useState<OcrFields | null>(null);
  const [previewDocument, setPreviewDocument] = useState<UploadedProjectDocument | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const ocrInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProjects = async () => {
      // Note: error handling for loading projects needed by document upload and OCR.
      try {
        setProjectsLoading(true);
        setProjectsError("");
        const data = await technicalOfficerProjectsApi.findAll();
        setProjects(data);
      } catch (apiError) {
        setProjectsError(apiError instanceof Error ? apiError.message : "Failed to load assigned projects.");
      } finally {
        setProjectsLoading(false);
      }
    };

    void loadProjects();
  }, []);

  useEffect(() => {
    if (requestedProjectId) {
      setSelectedProjectId(requestedProjectId);
      setOcrProjectId(requestedProjectId);
    }
  }, [requestedProjectId]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  );

  const selectedProjectDocuments = useMemo(
    () => documents.filter((documentItem) => documentItem.projectId === selectedProjectId),
    [documents, selectedProjectId]
  );

  useEffect(() => {
    const storedOcrFields = ocrProjectId ? ocrDataByProject[ocrProjectId] || null : null;
    setOcrFields(storedOcrFields);
    setSavedOcrFields(storedOcrFields);
  }, [ocrDataByProject, ocrProjectId]);

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

  // Practice: shared Documents page button style. Change backgroundColor here for buttons using style={primaryButton}.
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

  const handleUploadFiles = async (files: FileList | null) => {
    // Note: validation before uploading documents.
    if (!selectedProjectId) {
      setUploadMessage("Please select an assigned project before uploading a document.");
      return;
    }

    if (!files || files.length === 0) {
      return;
    }

    const remainingSlots = 5 - documents.filter((documentItem) => documentItem.projectId === selectedProjectId).length;

    if (remainingSlots <= 0) {
      setUploadMessage("Maximum 5 files are allowed per project.");
      if (uploadInputRef.current) {
        uploadInputRef.current.value = "";
      }
      return;
    }

    try {
      const selectedFiles = Array.from(files).slice(0, remainingSlots);
      const uploadedDocuments = await Promise.all(
        selectedFiles.map(async (file, index) => ({
          id: `DOC-${Date.now()}-${index}`,
          projectId: selectedProjectId,
          documentType,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileDataUrl: await fileToDataUrl(file),
          uploadDate: new Date().toISOString().slice(0, 10),
          status: "Uploaded" as DocumentStatus,
        }))
      );

      setDocuments((currentDocuments) => {
        const nextDocuments = [...uploadedDocuments, ...currentDocuments];
        saveStoredDocuments(nextDocuments);
        return nextDocuments;
      });

      const skippedFiles = files.length - selectedFiles.length;
      setUploadMessage(
        skippedFiles > 0
          ? `${uploadedDocuments.length} document(s) uploaded. ${skippedFiles} file(s) skipped because each project can store maximum 5 files.`
          : `${uploadedDocuments.length} document(s) uploaded for ${selectedProject?.projectCode || selectedProjectId}.`
      );
    } catch {
      // Note: catch file storage/read errors and show a readable message.
      setUploadMessage("Could not store the selected file(s). Try smaller files for this local demo.");
    } finally {
      if (uploadInputRef.current) {
        uploadInputRef.current.value = "";
      }
    }
  };

  const handleDownload = (documentItem: UploadedProjectDocument) => {
    const link = document.createElement("a");
    link.href = documentItem.fileDataUrl;
    link.download = documentItem.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setUploadMessage(`Download started for ${documentItem.fileName}.`);
  };

  const handleRemove = (documentId: string) => {
    setDocuments((currentDocuments) => {
      const nextDocuments = currentDocuments.filter((documentItem) => documentItem.id !== documentId);
      saveStoredDocuments(nextDocuments);
      return nextDocuments;
    });
    setPreviewDocument((currentPreview) => (currentPreview?.id === documentId ? null : currentPreview));
    setUploadMessage("Document removed from local demo list.");
  };

  const handleRunOcr = () => {
    // Note: validation before running OCR.
    if (!ocrProjectId || !ocrFile) {
      setUploadMessage("Select a project and upload an English document before starting OCR.");
      return;
    }

    const project = projects.find((item) => item.id === ocrProjectId);
    const nextOcrFields = {
      ...simulatedOcrFields,
      ownerName: project?.clientName || simulatedOcrFields.ownerName,
      propertyLocation: project?.location || simulatedOcrFields.propertyLocation,
    };

    setOcrDataByProject((currentData) => {
      const nextData = { ...currentData, [ocrProjectId]: nextOcrFields };
      saveStoredOcrData(nextData);
      return nextData;
    });
    setOcrFields(nextOcrFields);
    setSavedOcrFields(nextOcrFields);
    setUploadMessage("English OCR extraction simulated successfully. Review and edit the fields below.");
  };

  const updateOcrField = (fieldName: keyof OcrFields, value: string) => {
    if (!ocrFields) {
      return;
    }

    const nextFields = { ...ocrFields, [fieldName]: value };
    setOcrFields(nextFields);
    setSavedOcrFields(nextFields);

    if (ocrProjectId) {
      setOcrDataByProject((currentData) => {
        const nextData = { ...currentData, [ocrProjectId]: nextFields };
        saveStoredOcrData(nextData);
        return nextData;
      });
    }
  };

  const handleSaveOcrData = () => {
    if (!ocrFields) {
      setUploadMessage("Run OCR before saving extracted data.");
      return;
    }

    setSavedOcrFields(ocrFields);
    if (ocrProjectId) {
      setOcrDataByProject((currentData) => {
        const nextData = { ...currentData, [ocrProjectId]: ocrFields };
        saveStoredOcrData(nextData);
        return nextData;
      });
    }
    setUploadMessage("OCR data saved successfully");
  };

  const handleUseInReport = () => {
    const reportOcrFields = savedOcrFields || ocrFields;

    if (!ocrProjectId) {
      setUploadMessage("Select a project before using OCR data in a report.");
      return;
    }

    if (!reportOcrFields) {
      setUploadMessage("Run OCR before using it in a report.");
      return;
    }

    setOcrDataByProject((currentData) => {
      const nextData = { ...currentData, [ocrProjectId]: reportOcrFields };
      saveStoredOcrData(nextData);
      return nextData;
    });

    navigate(`/technical-officer/reports?projectId=${encodeURIComponent(ocrProjectId)}`);
  };

  return (
    <div style={page}>
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: "0 0 24px" }}>
        Documents
      </h1>

      {projectsError && (
        <div style={{ ...card, borderColor: "#fecaca", color: "#dc2626", marginBottom: "20px" }}>
          {projectsError}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 420px) 1fr", gap: "20px", marginBottom: "20px" }}>
        <section style={card}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>
            Step 1: Upload Document
          </h2>

          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>Assigned Project</label>
            <select value={selectedProjectId} onChange={(event) => setSelectedProjectId(event.target.value)} style={inputStyle}>
              <option value="">{projectsLoading ? "Loading projects..." : "Select project first"}</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.projectCode} - {project.clientName}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>Document Type</label>
            <select value={documentType} onChange={(event) => setDocumentType(event.target.value)} style={inputStyle}>
              <option>Survey Plan</option>
              <option>Deed</option>
              <option>Inspection Photos</option>
              <option>Valuation Notes</option>
              <option>Other</option>
            </select>
          </div>

          {/* Practice: Choose File uses primaryButton color. Opacity makes it look lighter until a project is selected. */}
          <button
            style={{
              ...primaryButton,
              width: "100%",
              opacity: selectedProjectId ? 1 : 0.65,
            }}
            onClick={() => {
              if (!selectedProjectId) {
                setUploadMessage("Please select an assigned project before uploading a document.");
                return;
              }
              uploadInputRef.current?.click();
            }}
          >
            <InboxOutlined /> Choose File
          </button>
          <input
            ref={uploadInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            style={{ display: "none" }}
            onChange={(event) => handleUploadFiles(event.target.files)}
          />

          {uploadMessage && (
            <p style={{ color: uploadMessage.includes("Please") || uploadMessage.includes("Select") ? "#dc2626" : "#15803d", fontSize: "13px", margin: "12px 0 0" }}>
              {uploadMessage}
            </p>
          )}
        </section>

        <section style={card}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>
            Step 2: Run OCR
          </h2>
          <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 14px" }}>
            Select a project and upload an English document to simulate OCR extraction.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            <div>
              <label style={labelStyle}>Assigned Project</label>
              <select value={ocrProjectId} onChange={(event) => setOcrProjectId(event.target.value)} style={inputStyle}>
                <option value="">{projectsLoading ? "Loading projects..." : "Select project"}</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.projectCode} - {project.clientName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>English Document</label>
              {/* Practice: Upload OCR Document button color is controlled by this backgroundColor */}
              <button
                style={{ ...primaryButton, width: "100%", backgroundColor: "#13c1c1" }}
                onClick={() => ocrInputRef.current?.click()}
              >
                {ocrFile?.name || "Upload OCR Document"}
              </button>
              <input
                ref={ocrInputRef}
                type="file"
                accept="image/*,application/pdf"
                style={{ display: "none" }}
                onChange={(event) => setOcrFile(event.target.files?.[0] || null)}
              />
            </div>
          </div>

          {/* Practice: Start OCR uses primaryButton color */}
          <button style={primaryButton} onClick={handleRunOcr}>
            Start OCR
          </button>

          {ocrFields && (
            <div style={{ marginTop: "18px" }}>
              <h3 style={{ color: "#111827", fontSize: "15px", fontWeight: 700, margin: "0 0 6px" }}>
                Step 3: Review Extracted Data
              </h3>
              <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 12px" }}>
                OCR results can be edited before saving.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                {(Object.keys(ocrFields) as Array<keyof OcrFields>).map((fieldName) => (
                  <div key={fieldName}>
                    <label style={labelStyle}>{fieldName}</label>
                    <input value={ocrFields[fieldName]} onChange={(event) => updateOcrField(fieldName, event.target.value)} style={inputStyle} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "14px" }}>
                {/* Practice: Save OCR Data button color is controlled by this backgroundColor */}
                <button style={{ ...primaryButton, backgroundColor: "#52c41a" }} onClick={handleSaveOcrData}>
                  Save OCR Data
                </button>
                {/* Practice: Use in Report button color is controlled by this backgroundColor */}
                <button style={{ ...primaryButton, backgroundColor: "#fa8c16" }} onClick={handleUseInReport}>
                  Use in Report
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <section style={card}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>
          Uploaded Documents by Project
        </h2>
        <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: 1.5, margin: "0 0 16px" }}>
          Files are stored in browser localStorage for demo. In production, files will be uploaded to backend storage via document-upload API.
        </p>

        {!selectedProject ? (
          <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>Select a project to view uploaded documents.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ border: "1px solid #f3f4f6", borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ backgroundColor: "#f9fafb", padding: "12px 14px", fontWeight: 700, color: "#111827" }}>
                {selectedProject.projectCode} - {selectedProject.clientName}
              </div>

              {selectedProjectDocuments.length === 0 ? (
                <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0, padding: "14px" }}>No documents uploaded for this project.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "860px" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#ffffff" }}>
                        {["Project ID", "Document Type", "File Name", "Upload Date", "Status", "Actions"].map((column) => (
                          <th
                            key={column}
                            style={{
                              textAlign: "left",
                              padding: "10px 14px",
                              color: "#374151",
                              fontSize: "12px",
                              fontWeight: 700,
                              borderTop: "1px solid #f3f4f6",
                              borderBottom: "1px solid #f3f4f6",
                            }}
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProjectDocuments.map((documentItem) => (
                        <tr key={documentItem.id}>
                          <td style={{ padding: "12px 14px", color: "#374151", fontSize: "14px", borderBottom: "1px solid #f3f4f6" }}>
                            {selectedProject.projectCode || documentItem.projectId}
                          </td>
                          <td style={{ padding: "12px 14px", color: "#374151", fontSize: "14px", fontWeight: 600, borderBottom: "1px solid #f3f4f6" }}>
                            <FileTextOutlined /> {documentItem.documentType}
                          </td>
                          <td style={{ padding: "12px 14px", color: "#6b7280", fontSize: "14px", borderBottom: "1px solid #f3f4f6" }}>
                            {documentItem.fileName}
                          </td>
                          <td style={{ padding: "12px 14px", color: "#6b7280", fontSize: "14px", borderBottom: "1px solid #f3f4f6" }}>
                            {documentItem.uploadDate}
                          </td>
                          <td style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6" }}>
                            <span
                              style={{
                                ...documentStatusStyle[documentItem.status],
                                borderRadius: "6px",
                                padding: "4px 10px",
                                fontSize: "12px",
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {documentItem.status}
                            </span>
                          </td>
                          <td style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6" }}>
                            <div style={{ display: "flex", gap: "8px" }}>
                              {/* Practice: View button color is controlled by this backgroundColor */}
                              <button
                                style={{ ...primaryButton, padding: "6px 10px", backgroundColor: "#1890ff" }}
                                onClick={() => setPreviewDocument(documentItem)}
                              >
                                View
                              </button>
                              {/* Practice: Download button color is controlled by this backgroundColor */}
                              <button
                                style={{ ...primaryButton, padding: "6px 10px", backgroundColor: "#13c2c2" }}
                                onClick={() => handleDownload(documentItem)}
                              >
                                Download
                              </button>
                              {/* Practice: Remove button color is controlled by this backgroundColor */}
                              <button
                                style={{ ...primaryButton, padding: "6px 10px", backgroundColor: "#ff4d4f" }}
                                onClick={() => handleRemove(documentItem.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {previewDocument && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.35)",
            display: "grid",
            placeItems: "center",
            padding: "24px",
            zIndex: 1000,
          }}
          onClick={() => setPreviewDocument(null)}
        >
          <div
            style={{ ...card, width: "100%", maxWidth: "460px" }}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 style={{ color: "#111827", fontSize: "18px", fontWeight: 700, margin: "0 0 14px" }}>
              Document Preview
            </h2>
            {previewDocument.fileType.startsWith("image/") ? (
              <img
                src={previewDocument.fileDataUrl}
                alt={previewDocument.fileName}
                style={{ width: "100%", maxHeight: "360px", objectFit: "contain", borderRadius: "8px", marginBottom: "14px", backgroundColor: "#f9fafb" }}
              />
            ) : (
              <p style={{ backgroundColor: "#f9fafb", borderRadius: "8px", color: "#6b7280", fontSize: "13px", margin: "0 0 14px", padding: "12px" }}>
                {previewDocument.fileName} preview is simulated for PDF documents in this demo.
              </p>
            )}
            {[
              ["File Name", previewDocument.fileName],
              ["Document Type", previewDocument.documentType],
              ["Project", projects.find((project) => project.id === previewDocument.projectId)?.projectCode || previewDocument.projectId],
              ["Upload Date", previewDocument.uploadDate],
            ].map(([label, value]) => (
              <div key={label} style={{ marginBottom: "10px" }}>
                <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: 700, margin: "0 0 3px" }}>{label}</p>
                <p style={{ color: "#111827", fontSize: "14px", margin: 0 }}>{value}</p>
              </div>
            ))}
            {/* Practice: Close uses primaryButton color */}
            <button style={primaryButton} onClick={() => setPreviewDocument(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
