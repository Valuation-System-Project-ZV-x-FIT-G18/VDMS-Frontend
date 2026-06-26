import type { CSSProperties } from "react";
import { useState, useEffect } from "react";
import { draftReportService } from "../../../services/draftReportService";
import { projectService } from "../../../services/projectService";

interface RejectReportDraftProps {
  projectId?: string;
  draftId?: string;
  onBack?: () => void;
}

const RejectReportDraft = ({
  projectId = "PV-RR0221",
  draftId = "VAL-2023-004",
  onBack = () => {},
}: RejectReportDraftProps) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [project, setProject] = useState<any>(null);
  const [draft, setDraft] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const maxCharacters = 3000;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projects, drafts] = await Promise.all([
          projectService.getAll(),
          draftReportService.getByProject(projectId),
        ]);
        const matched = projects.find((p: any) => p.projectId === projectId);
        if (matched) setProject(matched);
        if (drafts && drafts.length > 0) setDraft(drafts[0]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [projectId]);

  const handleReject = async () => {
    if (!selectedReason || feedback.length < 20) return;
    try {
      setSubmitting(true);
      if (draft?.id) {
        await draftReportService.reject(draft.id, selectedReason, feedback);
      }
      alert("Report rejected and feedback sent!");
      onBack();
    } catch (error) {
      console.error("Failed to reject:", error);
      alert("Failed to reject. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ... all your existing styles stay exactly the same ...
  const containerStyle: CSSProperties = { padding: "0", backgroundColor: "#f9fafb", minHeight: "100vh" };
  const headerStyle: CSSProperties = { backgroundColor: "#ffffff", padding: "24px 32px", borderBottom: "1px solid #e5e7eb" };
  const headerTitleStyle: CSSProperties = { fontSize: "24px", fontWeight: 700, color: "#1f2937", margin: "0 0 8px 0" };
  const headerSubtitleStyle: CSSProperties = { fontSize: "14px", color: "#6b7280", margin: 0 };
  const contentStyle: CSSProperties = { padding: "32px", maxWidth: "900px", margin: "0 auto" };
  const sectionStyle: CSSProperties = { backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "24px" };
  const projectInfoGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "24px" };
  const infoFieldStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: "4px" };
  const infoLabelStyle: CSSProperties = { fontSize: "11px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" };
  const infoDraftIdStyle: CSSProperties = { fontSize: "14px", fontWeight: 600, color: "#3b82f6" };
  const infoValueStyle: CSSProperties = { fontSize: "14px", color: "#1f2937", fontWeight: 500 };
  const propertyAddressStyle: CSSProperties = { fontSize: "16px", fontWeight: 600, color: "#1f2937", marginBottom: "16px" };
  const statusBadgeStyle: CSSProperties = { display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", backgroundColor: "#fef3c7", color: "#92400e", borderRadius: "6px", fontSize: "11px", fontWeight: 700 };
  const sectionTitleStyle: CSSProperties = { fontSize: "14px", fontWeight: 700, color: "#1f2937", margin: "0 0 16px 0", textTransform: "uppercase", letterSpacing: "0.5px" };
  const reasonGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" };
  const radioOptionStyle: CSSProperties = { display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", backgroundColor: "#ffffff" };
  const radioOptionSelectedStyle: CSSProperties = { ...radioOptionStyle, borderColor: "#3b82f6", backgroundColor: "#eff6ff" };
  const radioInputStyle: CSSProperties = { width: "18px", height: "18px", cursor: "pointer" };
  const radioLabelStyle: CSSProperties = { fontSize: "13px", fontWeight: 500, color: "#374151", cursor: "pointer" };
  const feedbackContainerStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: "8px" };
  const feedbackLabelStyle: CSSProperties = { fontSize: "13px", fontWeight: 700, color: "#1f2937", textTransform: "uppercase", letterSpacing: "0.5px" };
  const textareaStyle: CSSProperties = { padding: "12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", color: "#1f2937", fontFamily: "inherit", minHeight: "120px", resize: "vertical", outline: "none" };
  const characterCountStyle: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#9ca3af" };
  const warningBoxStyle: CSSProperties = { backgroundColor: "#fef3c7", border: "1px solid #fcd34d", borderRadius: "6px", padding: "12px 16px", display: "flex", gap: "12px", alignItems: "flex-start" };
  const warningIconStyle: CSSProperties = { fontSize: "18px", lineHeight: "1.5" };
  const warningTextStyle: CSSProperties = { fontSize: "12px", color: "#78350f", lineHeight: "1.6" };
  const buttonContainerStyle: CSSProperties = { display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "32px" };
  const buttonStyle = (variant: "primary" | "secondary"): CSSProperties => ({ padding: "10px 20px", borderRadius: "6px", fontSize: "14px", fontWeight: 600, cursor: "pointer", border: "none", transition: "all 0.2s ease", ...(variant === "primary" ? { backgroundColor: "#dc2626", color: "#ffffff" } : { backgroundColor: "#ffffff", color: "#6b7280", border: "1px solid #d1d5db" }) });
  const helpLinkStyle: CSSProperties = { fontSize: "12px", color: "#3b82f6", textDecoration: "none", cursor: "pointer" };

  const reasons = ["Missing Information", "Incorrect Data", "Poor Image Quality", "Legal Issues"];

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={headerTitleStyle}>Reject Valuation Report Draft</h1>
        <p style={headerSubtitleStyle}>Provide detailed feedback to the appraiser regarding the necessary corrections.</p>
      </div>

      <div style={contentStyle}>
        <div style={sectionStyle}>
          <div style={projectInfoGridStyle}>
            <div style={infoFieldStyle}>
              <label style={infoLabelStyle}>Draft ID</label>
              <div style={infoDraftIdStyle}>{draft?.id || draftId}</div>
            </div>
            <div style={infoFieldStyle}>
              <label style={infoLabelStyle}>Status</label>
              <div style={statusBadgeStyle}><span>●</span><span>{draft?.status || "Pending Review"}</span></div>
            </div>
            <div style={infoFieldStyle}>
              <label style={infoLabelStyle}>Project ID</label>
              <div style={infoValueStyle}>{projectId}</div>
            </div>
          </div>

          <div style={propertyAddressStyle}>
            {project?.propertyAddress || draft?.propertyAddress || "4521 Oakwood Avenue, Los Angeles, CA"}
          </div>

          <div style={projectInfoGridStyle}>
            <div style={infoFieldStyle}>
              <label style={infoLabelStyle}>Client Name</label>
              <div style={infoValueStyle}>{draft?.clientName || project?.applicant || "Global Realty Fund"}</div>
            </div>
            <div style={infoFieldStyle}>
              <label style={infoLabelStyle}>Assigned Appraiser</label>
              <div style={infoValueStyle}>{draft?.assignedAppraiser || project?.technicalOfficer || "Sarah J. Miller"}</div>
            </div>
            <div style={infoFieldStyle}>
              <label style={infoLabelStyle}>Draft Submitted</label>
              <div style={infoValueStyle}>
                {draft?.created_at ? new Date(draft.created_at).toLocaleDateString() : "Oct 24, 2023"}
              </div>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Rejection Reason</h3>
          <div style={reasonGridStyle}>
            {reasons.map((reason) => (
              <label key={reason} style={selectedReason === reason ? radioOptionSelectedStyle : radioOptionStyle}>
                <input type="radio" style={radioInputStyle} checked={selectedReason === reason} onChange={() => setSelectedReason(reason)} />
                <span style={radioLabelStyle}>{reason}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={feedbackContainerStyle}>
            <label style={feedbackLabelStyle}>Detailed Feedback</label>
            <textarea
              style={textareaStyle}
              placeholder="Explain what needs to be corrected in detail..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value.slice(0, maxCharacters))}
            />
            <div style={characterCountStyle}>
              <span>At least 20 characters required</span>
              <span>{feedback.length} / {maxCharacters}</span>
            </div>
          </div>
        </div>

        <div style={warningBoxStyle}>
          <div style={warningIconStyle}>⚠️</div>
          <div style={warningTextStyle}>
            <strong>By rejecting this draft, the appraiser will be notified and the project status will move back to "Revision Required".</strong> All previous draft data remains saved.
          </div>
        </div>

        <div style={buttonContainerStyle}>
          <button style={buttonStyle("secondary")} onClick={onBack}>Cancel</button>
          <button
            style={{ ...buttonStyle("primary"), opacity: (!selectedReason || feedback.length < 20 || submitting) ? 0.5 : 1 }}
            onClick={handleReject}
            disabled={!selectedReason || feedback.length < 20 || submitting}
          >
            {submitting ? "Rejecting..." : "Reject & Send Back"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <span style={{ fontSize: "12px", color: "#6b7280" }}>
            Need help with the rejection policy? <a style={helpLinkStyle}>View Guidelines</a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RejectReportDraft;