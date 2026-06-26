import type { CSSProperties } from "react";
import { useState, useEffect } from "react";
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { theme } from "../../../styles/theme";
import { getPriorityColor, getApprovalTypeIcon } from "../utils/helpers";
import { approvalsService } from "../../../services/approvalsService";

interface ApprovalStatus {
  projectId: string;
  status: "pending" | "approved" | "rejected" | "commented";
}

const ApprovalsPage = () => {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "processed">(
    "pending",
  );

  // Fetch approvals from API
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        setLoading(true);
        const data = await approvalsService.getPending();
        setApprovals(Array.isArray(data) ? data : []);
        setApprovalStatus(
          (Array.isArray(data) ? data : []).map((item: any) => ({
            projectId: item.projectId,
            status: "pending" as const,
          })),
        );
      } catch (err) {
        console.error("Error fetching approvals:", err);
        setError("Failed to load approvals");
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  const handleApprove = (projectId: string) => {
    setApprovalStatus((prev) =>
      prev.map((item) =>
        item.projectId === projectId ? { ...item, status: "approved" } : item,
      ),
    );
    // Call API to approve
    const approval = approvals.find((a) => a.projectId === projectId);
    if (approval) {
      approvalsService.approve(approval.id).catch((err) => {
        console.error("Error approving:", err);
        setError("Failed to approve");
      });
    }
  };

  const handleReject = (projectId: string) => {
    setApprovalStatus((prev) =>
      prev.map((item) =>
        item.projectId === projectId ? { ...item, status: "rejected" } : item,
      ),
    );
    // Call API to reject
    const approval = approvals.find((a) => a.projectId === projectId);
    if (approval) {
      approvalsService.reject(approval.id).catch((err) => {
        console.error("Error rejecting:", err);
        setError("Failed to reject");
      });
    }
  };

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

  const tabBarStyle: CSSProperties = {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    borderBottom: `1px solid ${theme.colors.border}`,
    paddingBottom: "12px",
  };

  const tabButtonStyle = (isActive: boolean): CSSProperties => ({
    padding: "8px 16px",
    border: "none",
    borderBottom: isActive ? `2px solid #1890ff` : "none",
    backgroundColor: "transparent",
    color: isActive ? "#1890ff" : theme.colors.text.secondary,
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.3s ease",
  });

  const approvalCardStyle: CSSProperties = {
    backgroundColor: theme.colors.background.paper,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "16px",
    display: "flex",
    gap: "16px",
  };

  const approvalIconStyle: CSSProperties = {
    fontSize: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "32px",
  };

  const approvalContentStyle: CSSProperties = {
    flex: 1,
  };

  const approvalHeaderStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  };

  const projectIdStyle: CSSProperties = {
    fontSize: "16px",
    fontWeight: 600,
    color: theme.colors.text.primary,
  };

  const priorityBadgeStyle = (
    priority: "Low" | "Medium" | "High",
  ): CSSProperties => {
    const color = getPriorityColor(priority);
    return {
      padding: "4px 12px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: 600,
      backgroundColor: color + "33",
      color: color,
    };
  };

  const approvalAddressStyle: CSSProperties = {
    fontSize: "13px",
    color: theme.colors.text.secondary,
    marginBottom: "8px",
  };

  const detailsGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "12px",
    marginBottom: "12px",
  };

  const detailItemStyle: CSSProperties = {
    fontSize: "12px",
  };

  const detailLabelStyle: CSSProperties = {
    color: theme.colors.text.secondary,
    marginBottom: "2px",
  };

  const detailValueStyle: CSSProperties = {
    color: theme.colors.text.primary,
    fontWeight: 500,
  };

  const actionButtonStyle = (variant: "approve" | "reject"): CSSProperties => ({
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.3s ease",
    backgroundColor: variant === "approve" ? "#52c41a20" : "#f5222d20",
    color: variant === "approve" ? "#52c41a" : "#f5222d",
  });

  const actionBarStyle: CSSProperties = {
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end",
    paddingTop: "12px",
    borderTop: `1px solid ${theme.colors.border}`,
  };

  const statusBadgeStyle = (status: string): CSSProperties => {
    const statusMap: { [key: string]: { bg: string; color: string } } = {
      approved: { bg: "#52c41a33", color: "#52c41a" },
      rejected: { bg: "#f5222d33", color: "#f5222d" },
      pending: { bg: "#faad1433", color: "#faad14" },
    };
    const style = statusMap[status] || { bg: "#f0f0f0", color: "#8c8c8c" };
    return {
      padding: "4px 12px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: 600,
      backgroundColor: style.bg,
      color: style.color,
      textTransform: "capitalize",
    };
  };

  const emptyStateStyle: CSSProperties = {
    textAlign: "center",
    padding: "48px 24px",
    color: theme.colors.text.secondary,
  };

  const emptyStateIconStyle: CSSProperties = {
    fontSize: "48px",
    marginBottom: "16px",
  };

  const pendingCount = approvalStatus.filter(
    (a) => a.status === "pending",
  ).length;
  const processedCount = approvalStatus.filter(
    (a) => a.status !== "pending",
  ).length;

  const displayedApprovals =
    activeTab === "pending"
      ? approvals.filter((a) =>
          approvalStatus.find(
            (ap) => ap.projectId === a.projectId && ap.status === "pending",
          ),
        )
      : approvals.filter((a) =>
          approvalStatus.find(
            (ap) => ap.projectId === a.projectId && ap.status !== "pending",
          ),
        );

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Project Approvals</h1>
        <p style={subtitleStyle}>
          Review and approve pending project submittals and authorization
          requests
        </p>
      </div>

      {/* Tab Bar */}
      <div style={tabBarStyle}>
        <button
          style={tabButtonStyle(activeTab === "pending")}
          onClick={() => setActiveTab("pending")}
        >
          <ClockCircleOutlined /> Pending Reviews ({pendingCount})
        </button>
        <button
          style={tabButtonStyle(activeTab === "processed")}
          onClick={() => setActiveTab("processed")}
        >
          <CheckCircleOutlined /> Processed ({processedCount})
        </button>
      </div>

      {/* Approvals List */}
      {displayedApprovals.length > 0 ? (
        <div>
          {displayedApprovals.map((approval) => {
            const approvalStatus = approvals.find(
              (a) => a.projectId === approval.projectId,
            );
            const isPending = approvalStatus?.status === "pending";

            return (
              <div key={approval.projectId} style={approvalCardStyle}>
                {/* Icon */}
                <div style={approvalIconStyle}>
                  {approvalStatus?.status === "approved" && (
                    <span style={{ color: "#52c41a" }}>✓</span>
                  )}
                  {approvalStatus?.status === "rejected" && (
                    <span style={{ color: "#f5222d" }}>✕</span>
                  )}
                  {isPending && (
                    <ExclamationOutlined style={{ color: "#faad14" }} />
                  )}
                </div>

                {/* Content */}
                <div style={approvalContentStyle}>
                  {/* Header */}
                  <div style={approvalHeaderStyle}>
                    <div>
                      <div style={projectIdStyle}>{approval.projectId}</div>
                      <div style={priorityBadgeStyle(approval.priority)}>
                        {approval.priority} Priority
                      </div>
                    </div>
                    {!isPending && (
                      <div
                        style={statusBadgeStyle(
                          approvalStatus?.status || "pending",
                        )}
                      >
                        {approvalStatus?.status}
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div style={approvalAddressStyle}>
                    {approval.propertyAddress}
                  </div>

                  {/* Details */}
                  <div style={detailsGridStyle}>
                    <div style={detailItemStyle}>
                      <div style={detailLabelStyle}>Approval Type</div>
                      <div style={detailValueStyle}>
                        {getApprovalTypeIcon(approval.approvalType)}{" "}
                        {approval.approvalType}
                      </div>
                    </div>
                    <div style={detailItemStyle}>
                      <div style={detailLabelStyle}>Submitted By</div>
                      <div style={detailValueStyle}>{approval.submittedBy}</div>
                    </div>
                    <div style={detailItemStyle}>
                      <div style={detailLabelStyle}>Submitted Date</div>
                      <div style={detailValueStyle}>
                        {approval.submittedDate}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isPending && (
                    <div style={actionBarStyle}>
                      <button
                        style={actionButtonStyle("approve")}
                        onClick={() => handleApprove(approval.projectId)}
                      >
                        <CheckOutlined /> Approve
                      </button>
                      <button
                        style={actionButtonStyle("reject")}
                        onClick={() => handleReject(approval.projectId)}
                      >
                        <CloseOutlined /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={emptyStateStyle}>
          <div style={emptyStateIconStyle}>
            {activeTab === "pending" ? "✓" : "📋"}
          </div>
          <p style={{ fontSize: "16px", fontWeight: 500, marginBottom: "8px" }}>
            {activeTab === "pending"
              ? "No pending approvals"
              : "No processed approvals"}
          </p>
          <p style={{ fontSize: "14px" }}>
            {activeTab === "pending"
              ? "All project submissions have been reviewed"
              : "Processed approvals will appear here"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApprovalsPage;
