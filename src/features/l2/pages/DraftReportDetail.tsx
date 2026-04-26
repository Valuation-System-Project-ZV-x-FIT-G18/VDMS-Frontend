import type { CSSProperties } from "react";
import { useState } from "react";

interface DraftReportDetailProps {
  projectId?: string;
  onBack?: () => void;
  onEditDetails?: () => void;
  onRejectDraft?: () => void;
  onRequestClarification?: () => void;
  onApproveDraft?: () => void;
}

const DraftReportDetail = ({
  projectId = "PV-2024-8842",
  onBack,
  onEditDetails,
  onRejectDraft,
  onRequestClarification,
  onApproveDraft,
}: DraftReportDetailProps) => {
  const [comments, setComments] = useState("");

  const containerStyle: CSSProperties = {
    padding: "0",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
  };

  const headerStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    padding: "24px 32px",
    borderBottom: "1px solid #e5e7eb",
    marginBottom: "24px",
  };

  const headerTopStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
  };

  const titleStyle: CSSProperties = {
    fontSize: "22px",
    fontWeight: 700,
    color: "#1f2937",
    margin: 0,
  };

  const statusBadgeStyle: CSSProperties = {
    display: "inline-block",
    padding: "6px 12px",
    backgroundColor: "#fef3c7",
    color: "#92400e",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 700,
    marginLeft: "16px",
  };

  const lastEditedStyle: CSSProperties = {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: 500,
  };

  const backButtonStyle: CSSProperties = {
    backgroundColor: "transparent",
    border: "none",
    color: "#3b82f6",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    padding: "0",
    marginRight: "16px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  };

  const mainGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "24px",
  };

  const contentContainerStyle: CSSProperties = {
    padding: "0 32px 32px 32px",
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const contentCardStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  };

  const leftColumnStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  };

  const sectionStyle: CSSProperties = {
    padding: "20px",
    borderTop: "1px solid #e5e7eb",
  };

  const firstSectionStyle: CSSProperties = {
    ...sectionStyle,
    borderTop: "none",
  };

  const sectionHeaderStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
  };

  const sectionTitleStyle: CSSProperties = {
    fontSize: "13px",
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0",
  };

  const sectionIconStyle: CSSProperties = {
    fontSize: "14px",
    color: "#3b82f6",
    display: "inline-block",
  };

  const editLinkStyle: CSSProperties = {
    marginLeft: "auto",
    fontSize: "11px",
    color: "#3b82f6",
    cursor: "pointer",
    textDecoration: "none",
    fontWeight: 600,
  };

  const rowStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "16px",
  };

  const lastRowStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  };

  const fieldStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  const labelStyle: CSSProperties = {
    fontSize: "11px",
    color: "#9ca3af",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const valueStyle: CSSProperties = {
    fontSize: "14px",
    color: "#1f2937",
    fontWeight: 500,
  };

  const descriptionBoxStyle: CSSProperties = {
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
    padding: "0",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
  };

  const descriptionTextStyle: CSSProperties = {
    fontSize: "13px",
    color: "#4b5563",
    lineHeight: "1.6",
    padding: "16px",
  };

  const imageCarouselStyle: CSSProperties = {
    width: "100%",
    height: "240px",
    backgroundColor: "#f3f4f6",
    position: "relative",
    overflow: "hidden",
  };

  const carouselImageStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const fileGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    padding: "16px",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
  };

  const fileBoxStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "12px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const fileIconStyle: CSSProperties = {
    fontSize: "24px",
    marginBottom: "8px",
  };

  const fileNameStyle: CSSProperties = {
    fontSize: "11px",
    color: "#6b7280",
    fontWeight: 500,
    wordBreak: "break-word",
  };

  const rightColumnStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  };

  const reviewActionsStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const reviewHeaderStyle: CSSProperties = {
    padding: "20px",
    borderBottom: "1px solid #e5e7eb",
  };

  const reviewTitleStyle: CSSProperties = {
    fontSize: "13px",
    fontWeight: 700,
    color: "#1f2937",
    margin: "0 0 4px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const reviewSubtitleStyle: CSSProperties = {
    fontSize: "11px",
    color: "#9ca3af",
    margin: 0,
  };

  const reviewButtonsContainerStyle: CSSProperties = {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };

  const buttonStyle = (
    variant: "primary" | "secondary" | "danger",
  ): CSSProperties => {
    const variants = {
      primary: {
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        border: "none",
      },
      secondary: {
        backgroundColor: "#ffffff",
        color: "#3b82f6",
        border: "1px solid #3b82f6",
      },
      danger: {
        backgroundColor: "#ffffff",
        color: "#ef4444",
        border: "1px solid #ef4444",
      },
    };

    return {
      width: "100%",
      padding: "10px 16px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s ease",
      ...variants[variant],
    };
  };

  const commentsBoxStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const commentsTitleStyle: CSSProperties = {
    fontSize: "13px",
    fontWeight: 700,
    color: "#1f2937",
    padding: "20px 20px 12px 20px",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const commentInputStyle: CSSProperties = {
    width: "100%",
    padding: "12px 20px",
    border: "none",
    fontSize: "12px",
    fontFamily: "inherit",
    minHeight: "100px",
    resize: "vertical",
    outline: "none",
    color: "#1f2937",
  };

  const feedbackLinkStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "11px",
    color: "#6b7280",
    cursor: "pointer",
    padding: "12px 20px",
    margin: "0",
    backgroundColor: "#f9fafb",
    border: "none",
    borderTop: "1px solid #e5e7eb",
    textDecoration: "none",
  };

  const viewerContainerStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "16px",
    textAlign: "center",
  };

  const viewerAvatarGroupStyle: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "-8px",
    marginBottom: "12px",
  };

  const viewerAvatarStyle: CSSProperties = {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "2px solid #ffffff",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "-8px",
    backgroundColor: "#e5e7eb",
  };

  const viewerTextStyle: CSSProperties = {
    fontSize: "11px",
    color: "#6b7280",
    lineHeight: "1.5",
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={headerTopStyle}>
          {onBack && (
            <button style={backButtonStyle} onClick={onBack}>
              ← Back to Dashboard
            </button>
          )}
          <h1 style={titleStyle}>
            Draft Report: {projectId}
            <span style={statusBadgeStyle}>Under Review</span>
          </h1>
        </div>
        <div style={lastEditedStyle}>Last edited 2 hours ago by Sarah J.</div>
      </div>

      {/* Main Content */}
      <div style={contentContainerStyle}>
        <div style={mainGridStyle}>
          {/* Left Column */}
          <div style={leftColumnStyle}>
            {/* Project Information Card */}
            <div style={contentCardStyle}>
              <div style={firstSectionStyle}>
                <div style={sectionHeaderStyle}>
                  <span style={sectionIconStyle}>◉</span>
                  <h3 style={sectionTitleStyle}>Project Information</h3>
                  <button style={editLinkStyle} onClick={onEditDetails}>
                    Edit Details
                  </button>
                </div>

                <div style={rowStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Project ID</label>
                    <div style={valueStyle}>{projectId}-TX</div>
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Client Name</label>
                    <div style={valueStyle}>Starlight Real Estate Holdings</div>
                  </div>
                </div>

                <div style={lastRowStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Valuation Date</label>
                    <div style={valueStyle}>October 24, 2024</div>
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Assigned Appraiser</label>
                    <div style={valueStyle}>Jonathan Miller, MAI</div>
                  </div>
                </div>
              </div>

              {/* Property Details Section */}
              <div style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                  <span style={sectionIconStyle}>◉</span>
                  <h3 style={sectionTitleStyle}>Property Details</h3>
                  <a style={editLinkStyle}>View Map</a>
                </div>

                <div style={rowStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Address</label>
                    <div style={valueStyle}>
                      842 Industrial Way, Austin, TX 78701
                    </div>
                  </div>
                </div>

                <div style={rowStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Lot Size</label>
                    <div style={valueStyle}>2.45 Acres</div>
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Zoning Type</label>
                    <div style={valueStyle}>LI-Industrial</div>
                  </div>
                </div>

                <div style={lastRowStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Year Built</label>
                    <div style={valueStyle}>2012 (Renovated 2018)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Land Description Card */}
            <div style={contentCardStyle}>
              <div style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                  <span style={sectionIconStyle}>◆</span>
                  <h3 style={sectionTitleStyle}>Land Description</h3>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "11px",
                      backgroundColor: "#e0f2fe",
                      color: "#0369a1",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontWeight: 600,
                    }}
                  >
                    AI-Generated
                  </span>
                </div>
              </div>

              <div style={descriptionBoxStyle}>
                <div style={imageCarouselStyle}>
                  <img
                    src="https://images.unsplash.com/photo-1500382017468-7049fdd98d5d?w=800&h=400&fit=crop"
                    alt="Property view"
                    style={carouselImageStyle}
                  />
                </div>

                <p style={descriptionTextStyle}>
                  The subject property comprises a rectangularly shaped parcel
                  of land located on the eastern side of Industrial Way. The
                  topography is generally level and at street grade, providing
                  excellent visibility and accessibility. Based on the provided
                  survey, the site contains no significant wetlands or
                  environmental encumbrances that would impede further
                  development. Utility infrastructure including municipal water,
                  sewer, and high-capacity fiber optic cabling is readily
                  available at the perimeter.
                </p>

                <div style={fileGridStyle}>
                  <div style={fileBoxStyle}>
                    <div style={fileIconStyle}>📄</div>
                    <div style={fileNameStyle}>Survey_Plot_Plan.pdf</div>
                  </div>
                  <div style={fileBoxStyle}>
                    <div style={fileIconStyle}>📊</div>
                    <div style={fileNameStyle}>Zoning_Max_Extract.pdf</div>
                  </div>
                  <div style={fileBoxStyle}>
                    <div style={fileIconStyle}>🖼️</div>
                    <div style={fileNameStyle}>Site_Photo_North.jpg</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={rightColumnStyle}>
            {/* Review Actions */}
            <div style={reviewActionsStyle}>
              <div style={reviewHeaderStyle}>
                <h3 style={reviewTitleStyle}>Review Actions</h3>
                <p style={reviewSubtitleStyle}>
                  Select the final status for this draft report
                </p>
              </div>

              <div style={reviewButtonsContainerStyle}>
                <button
                  style={buttonStyle("primary")}
                  onClick={onApproveDraft}
                >
                  ✓ Approve Draft
                </button>

                <button
                  style={buttonStyle("secondary")}
                  onClick={onRequestClarification}
                >
                  ⟲ Request Changes
                </button>

                <button style={buttonStyle("danger")} onClick={onRejectDraft}>
                  ✕ Reject Draft
                </button>
              </div>
            </div>

            {/* Reviewer Comments */}
            <div style={commentsBoxStyle}>
              <h3 style={commentsTitleStyle}>Reviewer Comments</h3>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add specific notes about required changes, observations, or praise for the appraiser..."
                style={commentInputStyle}
              />
              <button style={feedbackLinkStyle}>
                <span>📋</span>
                <span>View previous 3 feedback rounds</span>
              </button>
            </div>

            {/* Viewers */}
            <div style={viewerContainerStyle}>
              <div style={viewerAvatarGroupStyle}>
                <div style={viewerAvatarStyle}>👤</div>
                <div style={viewerAvatarStyle}>👤</div>
                <div style={viewerAvatarStyle}>+1</div>
              </div>
              <div style={viewerTextStyle}>
                2 other people are viewing this report
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftReportDetail;
