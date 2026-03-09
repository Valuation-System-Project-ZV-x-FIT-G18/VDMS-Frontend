import type { CSSProperties } from "react";
import { useState } from "react";

interface EditDraftReportProps {
  projectId?: string;
  onBack?: () => void;
}

const EditDraftReport = ({
  projectId = "VAL-2023-004",
  onBack,
}: EditDraftReportProps) => {
  const [formData, setFormData] = useState({
    propertyAddress: "428 Oakwood Heights, North Vancouver, BC V7N 2L9",
    lotNo: "PT 14",
    planNo: "EPP1024",
    detailedNarrative:
      "The subject property comprises a rectangularly shaped corner lot situated on a gently undulating terrain with a gradual slope from North to South. The total site area is approximately 8,400 square feet (0.19 acres), featuring a frontage of 70 feet along Oakwood Heights.\n\nSoil conditions appear stable based on neighboring structural integrity, though a geotechnical survey is recommended for high-load expansions. The property is currently zoned as RS-1 (One-Family Residential District), allowing for secondary suites as per recent municipal bylaws. Utilities including municipal water, sewer, electricity, and fiber-optic internet are all currently serviced to the property line.\n\nVegetation consists of mature deciduous trees along the Western perimeter providing natural privacy screening. Drainage is managed via an integrated municipal storm system with no visible signs of erosion or significant water retention issues during seasonal fluctuations.",
    finalEstimatedValue: "2,450,000.00",
    currency: "CAD",
    aiAssistedContent: true,
  });

  const [activeTab, setActiveTab] = useState("edit");

  const containerStyle: CSSProperties = {
    padding: "0",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
  };

  const headerStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    padding: "24px 32px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const headerLeftStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  };

  const headerTitleStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  const titleStyle: CSSProperties = {
    fontSize: "22px",
    fontWeight: 700,
    color: "#1f2937",
    margin: 0,
  };

  const referenceStyle: CSSProperties = {
    fontSize: "12px",
    color: "#9ca3af",
    margin: 0,
  };

  const tabsStyle: CSSProperties = {
    display: "flex",
    gap: "24px",
  };

  const tabStyle = (isActive: boolean): CSSProperties => ({
    padding: "8px 0",
    borderBottom: isActive ? "2px solid #3b82f6" : "2px solid transparent",
    color: isActive ? "#3b82f6" : "#9ca3af",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    background: "none",
    border: "none",
    transition: "all 0.2s ease",
  });

  const statusBadgeStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    backgroundColor: "#d1fae5",
    color: "#047857",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 600,
  };

  const contentStyle: CSSProperties = {
    padding: "32px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const sectionStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    padding: "24px",
    marginBottom: "24px",
  };

  const sectionHeaderStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "1px solid #e5e7eb",
  };

  const sectionIconStyle: CSSProperties = {
    fontSize: "18px",
  };

  const sectionTitleStyle: CSSProperties = {
    fontSize: "15px",
    fontWeight: 700,
    color: "#1f2937",
    margin: 0,
  };

  const rowStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    marginBottom: "20px",
  };

  const fieldStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const labelStyle: CSSProperties = {
    fontSize: "12px",
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const inputStyle: CSSProperties = {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#1f2937",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  const textareaStyle: CSSProperties = {
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#1f2937",
    fontFamily: "inherit",
    outline: "none",
    minHeight: "150px",
    resize: "vertical",
    lineHeight: "1.6",
  };

  const narrativeContainerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  };

  const aiToggleStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    backgroundColor: "#f0f7ff",
    borderRadius: "6px",
    border: "1px solid #bfdbfe",
  };

  const toggleCheckboxStyle: CSSProperties = {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  };

  const aiToggleLabelStyle: CSSProperties = {
    fontSize: "12px",
    fontWeight: 600,
    color: "#0369a1",
    cursor: "pointer",
  };

  const valueDisplayStyle: CSSProperties = {
    fontSize: "32px",
    fontWeight: 700,
    color: "#1f2937",
    margin: "16px 0 8px 0",
  };

  const currencyStyle: CSSProperties = {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: 500,
  };

  const buttonContainerStyle: CSSProperties = {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "32px",
    paddingTop: "24px",
    borderTop: "1px solid #e5e7eb",
  };

  const buttonStyle = (variant: "primary" | "secondary"): CSSProperties => ({
    padding: "10px 20px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    transition: "all 0.2s ease",
    ...(variant === "primary"
      ? {
          backgroundColor: "#3b82f6",
          color: "#ffffff",
        }
      : {
          backgroundColor: "#ffffff",
          color: "#6b7280",
          border: "1px solid #d1d5db",
        }),
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={headerLeftStyle}>
          <div style={headerTitleStyle}>
            <h1 style={titleStyle}>Edit Draft Report</h1>
            <p style={referenceStyle}>Valuation Reference: #{projectId}</p>
          </div>
        </div>

        <div style={statusBadgeStyle}>
          <span>● </span>
          <span>Auto-saved at 14:32</span>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 32px",
        }}
      >
        <div style={tabsStyle}>
          <button
            style={tabStyle(activeTab === "review")}
            onClick={() => setActiveTab("review")}
          >
            Review
          </button>
          <button
            style={tabStyle(activeTab === "edit")}
            onClick={() => setActiveTab("edit")}
          >
            Edit Details
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "edit" && (
        <div style={contentStyle}>
          {/* Property Information Section */}
          <div style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <span style={sectionIconStyle}>🏠</span>
              <h3 style={sectionTitleStyle}>Property Information</h3>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Property Address</label>
              <input
                type="text"
                style={inputStyle}
                value={formData.propertyAddress}
                onChange={(e) =>
                  handleInputChange("propertyAddress", e.target.value)
                }
              />
            </div>

            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Lot No.</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={formData.lotNo}
                  onChange={(e) => handleInputChange("lotNo", e.target.value)}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Plan No.</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={formData.planNo}
                  onChange={(e) => handleInputChange("planNo", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Land Description Section */}
          <div style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <span style={sectionIconStyle}>📍</span>
              <h3 style={sectionTitleStyle}>Land Description</h3>
            </div>

            <div style={narrativeContainerStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Detailed Narrative</label>
                <textarea
                  style={textareaStyle}
                  value={formData.detailedNarrative}
                  onChange={(e) =>
                    handleInputChange("detailedNarrative", e.target.value)
                  }
                />
              </div>

              <div style={aiToggleStyle}>
                <input
                  type="checkbox"
                  style={toggleCheckboxStyle}
                  checked={formData.aiAssistedContent}
                  onChange={(e) =>
                    handleInputChange(
                      "aiAssistedContent",
                      e.target.checked.toString(),
                    )
                  }
                />
                <label style={aiToggleLabelStyle}>✨ AI-Assisted Content</label>
              </div>
            </div>
          </div>

          {/* Valuation Amount Section */}
          <div style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <span style={sectionIconStyle}>💰</span>
              <h3 style={sectionTitleStyle}>Valuation Amount</h3>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Final Estimated Value</label>
              <div style={valueDisplayStyle}>
                {formData.finalEstimatedValue}
              </div>
              <div style={currencyStyle}>Currency: {formData.currency}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={buttonContainerStyle}>
            <button style={buttonStyle("secondary")} onClick={onBack}>
              Cancel Changes
            </button>
            <button style={buttonStyle("primary")}>
              💾 Save Report Changes
            </button>
          </div>
        </div>
      )}

      {/* Review Tab - shows minimal content */}
      {activeTab === "review" && (
        <div style={contentStyle}>
          <div style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <span style={sectionIconStyle}>📄</span>
              <h3 style={sectionTitleStyle}>Report Review</h3>
            </div>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              Click "Edit Details" tab to make changes to this report.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDraftReport;
