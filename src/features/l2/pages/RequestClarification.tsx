import type { CSSProperties } from "react";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";

interface RequestClarificationProps {
  projectName?: string;
  projectCode?: string;
  clientName?: string;
  createdDate?: string;
  onBack?: () => void;
}

const RequestClarification = ({
  projectName = "Harbor View Residential Valuation",
  projectCode = "PRJ-2023-9021",
  clientName = "Apex Global Properties Ltd.",
  createdDate = "Oct 24, 2023",
  onBack,
}: RequestClarificationProps) => {
  const [recipient, setRecipient] = useState("");
  const [question, setQuestion] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const containerStyle: CSSProperties = {
    padding: "32px",
    backgroundColor: "#ffffff",
    minHeight: "100vh",
  };

  const breadcrumbStyle: CSSProperties = {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "24px",
  };

  const breadcrumbLinkStyle: CSSProperties = {
    color: "#3b82f6",
    cursor: "pointer",
    textDecoration: "none",
  };

  const headerStyle: CSSProperties = {
    marginBottom: "32px",
  };

  const titleStyle: CSSProperties = {
    fontSize: "24px",
    fontWeight: 700,
    color: "#1f2937",
    margin: 0,
  };

  const contextSectionStyle: CSSProperties = {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "24px",
    marginBottom: "32px",
  };

  const contextHeaderStyle: CSSProperties = {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1f2937",
    marginBottom: "16px",
  };

  const contextGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  };

  const contextItemStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
  };

  const contextLabelStyle: CSSProperties = {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: 600,
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const contextValueStyle: CSSProperties = {
    fontSize: "14px",
    color: "#1f2937",
    fontWeight: 500,
  };

  const statusBadgeStyle: CSSProperties = {
    display: "inline-block",
    padding: "6px 12px",
    backgroundColor: "#fef3c7",
    color: "#92400e",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 600,
    width: "fit-content",
    marginTop: "6px",
  };

  const formSectionStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "28px",
  };

  const formTitleStyle: CSSProperties = {
    fontSize: "18px",
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: "8px",
  };

  const formDescStyle: CSSProperties = {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "24px",
    lineHeight: "1.5",
  };

  const formGroupStyle: CSSProperties = {
    marginBottom: "24px",
  };

  const labelStyle: CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#1f2937",
    marginBottom: "8px",
  };

  const selectStyle: CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
    backgroundColor: "#f3f4f6",
    color: "#9ca3af",
    cursor: "pointer",
  };

  const textareaStyle: CSSProperties = {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
    fontFamily: "inherit",
    minHeight: "200px",
    resize: "vertical",
  };

  const fileUploadContainerStyle: CSSProperties = {
    border: "2px dashed #d1d5db",
    borderRadius: "8px",
    padding: "24px",
    textAlign: "center",
    backgroundColor: "#f9fafb",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const fileUploadIconStyle: CSSProperties = {
    fontSize: "32px",
    color: "#3b82f6",
    marginBottom: "8px",
  };

  const fileUploadTextStyle: CSSProperties = {
    fontSize: "13px",
    color: "#1f2937",
    fontWeight: 500,
    marginBottom: "4px",
  };

  const fileUploadSubtextStyle: CSSProperties = {
    fontSize: "12px",
    color: "#9ca3af",
  };

  const fileHintStyle: CSSProperties = {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "12px",
  };

  const fileListStyle: CSSProperties = {
    marginTop: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const fileItemStyle: CSSProperties = {
    padding: "8px 12px",
    backgroundColor: "#f3f4f6",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#1f2937",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const removeFileButtonStyle: CSSProperties = {
    background: "none",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    fontSize: "12px",
    padding: 0,
    fontWeight: 600,
  };

  const footerStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "24px",
  };

  const buttonGroupStyle: CSSProperties = {
    display: "flex",
    gap: "12px",
  };

  const cancelButtonStyle: CSSProperties = {
    padding: "10px 24px",
    backgroundColor: "#ffffff",
    color: "#6b7280",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const submitButtonStyle: CSSProperties = {
    padding: "10px 24px",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const supportLinkStyle: CSSProperties = {
    fontSize: "12px",
    color: "#6b7280",
  };

  const internalSupportLinkStyle: CSSProperties = {
    color: "#3b82f6",
    cursor: "pointer",
    textDecoration: "none",
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

    if (totalSize > 10 * 1024 * 1024) {
      alert("Total file size exceeds 10MB limit");
      return;
    }

    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!recipient) {
      alert("Please select a recipient");
      return;
    }
    if (!question.trim()) {
      alert("Please enter your question");
      return;
    }
    console.log({ recipient, question, files });
    alert("Request sent successfully!");
  };

  return (
    <div style={containerStyle}>
      {/* Breadcrumb */}
      <div style={breadcrumbStyle}>
        <span style={breadcrumbLinkStyle} onClick={onBack}>
          Projects
        </span>
        <span> › {projectCode} › </span>
        <span style={{ fontWeight: 600, color: "#1f2937" }}>
          Request Clarification
        </span>
      </div>

      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Request Clarification</h1>
      </div>

      {/* Project Context */}
      <div style={contextSectionStyle}>
        <div style={contextHeaderStyle}>Project Context</div>
        <div style={contextGridStyle}>
          <div style={contextItemStyle}>
            <span style={contextLabelStyle}>Project Name</span>
            <span style={contextValueStyle}>{projectName}</span>
          </div>
          <div style={contextItemStyle}>
            <span style={contextLabelStyle}>Project Code</span>
            <span style={contextValueStyle}>{projectCode}</span>
          </div>
          <div style={contextItemStyle}>
            <span style={contextLabelStyle}>Client</span>
            <span style={contextValueStyle}>{clientName}</span>
          </div>
          <div style={contextItemStyle}>
            <span style={contextLabelStyle}>Created Date</span>
            <span style={contextValueStyle}>{createdDate}</span>
            <div style={statusBadgeStyle}>Pending Review</div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div style={formSectionStyle}>
        <h2 style={formTitleStyle}>Request Clarification</h2>
        <p style={formDescStyle}>
          Please provide the details of your inquiry. A Technical Officer or
          Coordinator will respond shortly.
        </p>

        {/* Send To */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Send To</label>
          <select
            style={selectStyle}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          >
            <option value="">Select a recipient...</option>
            <option value="technical-officer">Technical Officer</option>
            <option value="coordinator">Coordinator</option>
            <option value="senior-valuator">Senior Valuator</option>
          </select>
        </div>

        {/* Your Question */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Your Question</label>
          <textarea
            style={textareaStyle}
            placeholder="Describe what you need clarified in detail..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        {/* File Upload */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Attach Files</label>
          <input
            type="file"
            id="file-upload"
            style={{ display: "none" }}
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
          />
          <label htmlFor="file-upload" style={fileUploadContainerStyle}>
            <div style={fileUploadIconStyle}>
              <UploadOutlined />
            </div>
            <div style={fileUploadTextStyle}>Click to upload</div>
            <div style={fileUploadSubtextStyle}>or drag and drop</div>
          </label>
          <div style={fileHintStyle}>
            Maximum file size 10MB. Accepted formats: PDF, JPG, PNG
          </div>

          {files.length > 0 && (
            <div style={fileListStyle}>
              {files.map((file, index) => (
                <div key={index} style={fileItemStyle}>
                  <span>{file.name}</span>
                  <button
                    style={removeFileButtonStyle}
                    onClick={() => removeFile(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <div style={supportLinkStyle}>
            Need urgent assistance?{" "}
            <a style={internalSupportLinkStyle}>Contact Internal Support</a>
          </div>
          <div style={buttonGroupStyle}>
            <button style={cancelButtonStyle} onClick={onBack}>
              Cancel
            </button>
            <button style={submitButtonStyle} onClick={handleSubmit}>
              Send Request →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestClarification;
