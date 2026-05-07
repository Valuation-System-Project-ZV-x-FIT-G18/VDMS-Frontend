import { useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CoordinatorLayout from "./layouts/CoordinatorLayout";
import RoleSelectPage from "./pages/RoleSelectPage";
// Technical Officer pages
import TechnicalOfficerDashboard from "./features/technical-officer/pages/Dashboard";
import AssignedProject from "./features/technical-officer/pages/AssignedProject";
import Report from "./features/technical-officer/pages/Report";
import Documents from "./features/technical-officer/pages/Documents";
import Attendance from "./features/technical-officer/pages/Attendance";
import TechnicalOfficerSettingsPage from "./features/technical-officer/pages/Settings";
// Bank Credit Officer pages
import BankDashboardPage from "./features/bank-credit-officer/pages/Dashboard";
import BankAllProjectsPage from "./features/bank-credit-officer/pages/AllProjects";
import BankSettingsPage from "./features/bank-credit-officer/pages/Settings";
// Property Owner pages
import OwnerDashboardPage from "./features/property-owner/pages/Dashboard";
import OwnerAllProjectsPage from "./features/property-owner/pages/AllProjects";
import OwnerPaymentPage from "./features/property-owner/pages/Payment";
import OwnerSettingsPage from "./features/property-owner/pages/Settings";
// L3 Manager pages
import L3DashboardPage from "./features/l3/pages/Dashboard";
import L3PendingReviews from "./features/l3/pages/PendingReviews";
import L3ApprovedReports from "./features/l3/pages/ApprovedReports";
import L3RejectedReports from "./features/l3/pages/RejectedReports";
import L3AllReports from "./features/l3/pages/AllReports";
import L3FinalizedReports from "./features/l3/pages/FinalizedReports";
import L3VersionHistory from "./features/l3/pages/VersionHistory";
import L3DraftReportDetail from "./features/l3/pages/DraftReportDetail";
import L3EditDraftReport from "./features/l3/pages/EditDraftReport";
import L3RejectReportDraft from "./features/l3/pages/RejectReportDraft";
import L3RequestClarification from "./features/l3/pages/RequestClarification";
import L3SettingsPage from "./features/l3/pages/Settings";
import L3AllProjectsAndBottlenecks from "./features/l3/pages/AllProjectsAndBottlenecks";
import L3DailyMorningReport from "./features/l3/pages/DailyMorningReport";
// L2 Manager pages
import L2DashboardPage from "./features/l2/pages/Dashboard";
import L2AllProjectsPage from "./features/l2/pages/AllProjects";
import L2ApprovalsPage from "./features/l2/pages/Approvals";
import L2ReportsPage from "./features/l2/pages/Reports";
import L2RejectedReports from "./features/l2/pages/RejectedReports";
import L2VersionHistory from "./features/l2/pages/VersionHistory";
import L2ApprovedReports from "./features/l2/pages/ApprovedReports";
import L2AllReports from "./features/l2/pages/AllReports";
import L2FinalizedReports from "./features/l2/pages/FinalizedReports";
import L2PendingReviews from "./features/l2/pages/PendingReviews";
import L2AllProjectsAndBottlenecks from "./features/l2/pages/AllProjectsAndBottlenecks";
import L2DailyMorningReport from "./features/l2/pages/DailyMorningReport";
import L2SettingsPage from "./features/l2/pages/Settings";
import L2DraftReportDetail from "./features/l2/pages/DraftReportDetail";
import L2EditDraftReport from "./features/l2/pages/EditDraftReport";
import L2RejectReportDraft from "./features/l2/pages/RejectReportDraft";
import L2RequestClarification from "./features/l2/pages/RequestClarification";
// L1 Manager pages
import L1DashboardPage from "./features/l1/pages/Dashboard";
import L1AllProjectsPage from "./features/l1/pages/AllProjects";
import L1ApprovalsPage from "./features/l1/pages/Approvals";
import L1ReportsPage from "./features/l1/pages/Reports";
import L1RejectedReports from "./features/l1/pages/RejectedReports";
import L1VersionHistory from "./features/l1/pages/VersionHistory";
import L1ApprovedReports from "./features/l1/pages/ApprovedReports";
import L1AllReports from "./features/l1/pages/AllReports";
import L1FinalizedReports from "./features/l1/pages/FinalizedReports";
import L1PendingReviews from "./features/l1/pages/PendingReviews";
import L1AllProjectsAndBottlenecks from "./features/l1/pages/AllProjectsAndBottlenecks";
import L1DailyMorningReport from "./features/l1/pages/DailyMorningReport";
import L1SettingsPage from "./features/l1/pages/Settings";
import L1DraftReportDetail from "./features/l1/pages/DraftReportDetail";
import L1EditDraftReport from "./features/l1/pages/EditDraftReport";
import L1RejectReportDraft from "./features/l1/pages/RejectReportDraft";
import L1RequestClarification from "./features/l1/pages/RequestClarification";
import CoordinatorDashboardPage from "./features/coordinator/dashboard/pages/DashboardPage";
import CoordinatorSearchPage from "./features/coordinator/search-client/pages/SearchPage";
import CoordinatorRegisterPage from "./features/coordinator/register-client/pages/RegisterPage";
import CoordinatorRegisterBankPage from "./features/coordinator/register-bank/pages/RegisterBankPage";
import CoordinatorPropertyInfoPage from "./features/coordinator/property-information/pages/PropertyInfoPage";
import CoordinatorSurveyPlanPage from "./features/coordinator/survey-plan/pages/SurveyPlanPage";
import CoordinatorLegalDetailsPage from "./features/coordinator/legal-details/pages/LegalDetailsPage";
import CoordinatorDocumentUploadPage from "./features/coordinator/document-upload/pages/DocumentUploadPage";
import CoordinatorNewValuationPage from "./features/coordinator/new-valuation/pages/NewValuationPage";
import CoordinatorAvailableToPage from "./features/coordinator/available-to/pages/AvailableToPage";
import CoordinatorOnLeaveToPage from "./features/coordinator/on-leave-to/pages/OnLeaveToPage";
import CoordinatorAssignedToPage from "./features/coordinator/assigned-to/pages/AssignedToPage";
import CoordinatorFleetDashboard from "./features/coordinator/fleet-management/pages/FleetDashboard";
import CoordinatorAllToPage from "./features/coordinator/fleet-management/pages/AllToPage";
import CoordinatorRejectedToPage from "./features/coordinator/rejected-to/pages/RejectedToPage";
import CoordinatorProjectSummaryPage from "./features/coordinator/project-summary/pages/ProjectSummaryPage";
import CoordinatorRevaluationPage from "./features/coordinator/revaluation/pages/RevaluationPage";
import CoordinatorBankInfoPage from "./features/coordinator/revaluation/pages/BankInfoPage";
type Role =
  | "bank"
  | "owner"
  | "l3-manager"
  | "l2-manager"
  | "l1-manager"
  | "admin"
  | "coordinator"
  | "technical-officer"
  | "senior-valuator";
function BlankRolePage({ title }: { title: string }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ margin: 0 }}>{title}</h1>
        <p style={{ marginTop: 8, color: "#6b7280" }}>
          This page is intentionally blank. The assigned member will build this
          dashboard.
        </p>
      </div>
    </div>
  );
}
// Wrapper components to extract projectId from URL and pass to DraftReportDetail
function L3DraftReportDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  return (
    <L3DraftReportDetail
      projectId={projectId || "PV-2024-8842"}
      onBack={() => navigate("/l3-manager/dashboard")}
      onEditDetails={() => navigate("/l3-manager/edit-draft")}
      onRejectDraft={() => navigate("/l3-manager/reject-report")}
      onRequestClarification={() =>
        navigate("/l3-manager/request-clarification")
      }
      onApproveDraft={() =>
        navigate(`/l3-manager/approve-final-report/${projectId}`)
      }
    />
  );
}
function L2DraftReportDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  return (
    <L2DraftReportDetail
      projectId={projectId || "PV-2024-8842"}
      onBack={() => navigate("/l2-manager/dashboard")}
      onEditDetails={() => navigate("/l2-manager/edit-draft")}
      onRejectDraft={() => navigate("/l2-manager/reject-report")}
      onRequestClarification={() =>
        navigate("/l2-manager/request-clarification")
      }
      onApproveDraft={() =>
        navigate(`/l2-manager/approve-final-report/${projectId}`)
      }
    />
  );
}
function L1DraftReportDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  return (
    <L1DraftReportDetail
      projectId={projectId || "PV-2024-8842"}
      onBack={() => navigate("/l1-manager/dashboard")}
      onEditDetails={() => navigate("/l1-manager/edit-draft")}
      onRejectDraft={() => navigate("/l1-manager/reject-report")}
      onRequestClarification={() =>
        navigate("/l1-manager/request-clarification")
      }
      onApproveDraft={() =>
        navigate(`/l1-manager/approve-final-report/${projectId}`)
      }
    />
  );
}
// Approval page wrapper components
function L3ApproveFinalReportPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  return (
    <div
      style={{
        padding: "32px",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "600px",
          backgroundColor: "#f0fdf4",
          border: "2px solid #22c55e",
          borderRadius: "8px",
          padding: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "32px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#4b5563",
          }}
        >
          <div style={{ color: "#16a34a" }}>[Done] Step 1: L3 Approval</div>
          <div style={{ color: "#d4d4d4" }}>Step 2: L2 Review</div>
          <div style={{ color: "#d4d4d4" }}>Step 3: L1 Final Decision</div>
        </div>
        <h1 style={{ color: "#16a34a", marginBottom: "16px" }}>
          Step 1 of 3 - Approved
        </h1>
        <p style={{ color: "#4b5563", marginBottom: "24px", fontSize: "14px" }}>
          Project {projectId} has been successfully approved at L3 management
          level. This report will now be forwarded to L2 manager for review.
        </p>
        <button
          onClick={() => navigate("/l3-manager/dashboard")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
function L2ApproveFinalReportPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  return (
    <div
      style={{
        padding: "32px",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "600px",
          backgroundColor: "#f0fdf4",
          border: "2px solid #22c55e",
          borderRadius: "8px",
          padding: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "32px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#4b5563",
          }}
        >
          <div style={{ color: "#16a34a" }}>[Done] Step 1: L3 Approval</div>
          <div style={{ color: "#16a34a" }}>[Done] Step 2: L2 Approval</div>
          <div style={{ color: "#d4d4d4" }}>Step 3: L1 Final Decision</div>
        </div>
        <h1 style={{ color: "#16a34a", marginBottom: "16px" }}>
          Step 2 of 3 - Approved
        </h1>
        <p style={{ color: "#4b5563", marginBottom: "24px", fontSize: "14px" }}>
          Project {projectId} has been successfully approved at L2 management
          level. L3 manager has already approved. This report will now be
          forwarded to L1 manager for final decision.
        </p>
        <button
          onClick={() => navigate("/l2-manager/dashboard")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
function L1ApproveFinalReportPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [isLocked, setIsLocked] = useState(false);
  const handleLockReport = () => {
    setIsLocked(true);
  };
  return (
    <div
      style={{
        padding: "32px",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isLocked ? (
        <div
          style={{
            textAlign: "center",
            maxWidth: "500px",
            backgroundColor: "#fee2e2",
            border: "3px solid #dc2626",
            borderRadius: "8px",
            padding: "48px",
          }}
        >
          <h1
            style={{ color: "#991b1b", marginBottom: "16px", fontSize: "28px" }}
          >
            Ã°Å¸â€â€™ REPORT LOCKED
          </h1>
          <p
            style={{
              color: "#7f1d1d",
              marginBottom: "24px",
              fontSize: "14px",
              lineHeight: "1.6",
              fontWeight: 600,
            }}
          >
            Project {projectId} has been successfully locked.
            <br />
            <br />
            This report is now permanently locked and cannot be edited. All
            approvals are final.
          </p>
          <button
            onClick={() => (window.location.href = "/l1-manager/dashboard")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            maxWidth: "500px",
            backgroundColor: "#f0fdf4",
            border: "2px solid #22c55e",
            borderRadius: "8px",
            padding: "32px",
          }}
        >
          <h1 style={{ color: "#16a34a", marginBottom: "16px" }}>
            Report Approved
          </h1>
          <p
            style={{ color: "#4b5563", marginBottom: "24px", fontSize: "14px" }}
          >
            Project {projectId} has been successfully approved by L3 and L2
            managers. As the final approver (L1), you can now lock this report.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              marginTop: "32px",
            }}
          >
            <button
              onClick={() => (window.location.href = "/l1-manager/dashboard")}
              style={{
                padding: "12px 24px",
                backgroundColor: "#6b7280",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleLockReport}
              style={{
                padding: "12px 24px",
                backgroundColor: "#dc2626",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Ã°Å¸â€â€™ Lock Final Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
function BankManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const getCurrentPage = () => {
    const path = location.pathname.split("/").pop();
    return path || "dashboard";
  };
  const handleNavigation = (page: string) => {
    navigate(`/bank/${page}`);
  };
  const activePage = getCurrentPage();
  return (
    <MainLayout
      role="bank"
      onNavigate={handleNavigation}
      activePage={activePage}
    >
      <Routes>
        <Route path="/" element={<BankDashboardPage />} />
        <Route path="/dashboard" element={<BankDashboardPage />} />
        <Route path="/projects" element={<BankAllProjectsPage />} />
        <Route path="/settings" element={<BankSettingsPage />} />
      </Routes>
    </MainLayout>
  );
}
function OwnerManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const getCurrentPage = () => {
    const path = location.pathname.split("/").pop();
    return path || "dashboard";
  };
  const handleNavigation = (page: string) => {
    navigate(`/owner/${page}`);
  };
  const activePage = getCurrentPage();
  return (
    <MainLayout
      role="owner"
      onNavigate={handleNavigation}
      activePage={activePage}
    >
      <Routes>
        <Route path="/" element={<OwnerDashboardPage />} />
        <Route path="/dashboard" element={<OwnerDashboardPage />} />
        <Route path="/projects" element={<OwnerAllProjectsPage />} />
        <Route path="/payment" element={<OwnerPaymentPage />} />
        <Route path="/settings" element={<OwnerSettingsPage />} />
      </Routes>
    </MainLayout>
  );
}
function L3Manager() {
  const navigate = useNavigate();
  const location = useLocation();
  const getCurrentPage = () => {
    const path = location.pathname.split("/").pop();
    return path || "dashboard";
  };
  const handleNavigation = (page: string, projectId?: string) => {
    if (projectId) {
      navigate(`/l3-manager/${page}/${projectId}`);
    } else {
      navigate(`/l3-manager/${page}`);
    }
  };
  const activePage = getCurrentPage();
  return (
    <MainLayout
      role="l3-manager"
      onNavigate={handleNavigation}
      activePage={activePage}
    >
      <Routes>
        <Route
          path="/"
          element={<L3DashboardPage onNavigate={handleNavigation} />}
        />
        <Route
          path="/dashboard"
          element={<L3DashboardPage onNavigate={handleNavigation} />}
        />
        <Route
          path="/pending"
          element={<L3PendingReviews onNavigate={handleNavigation} />}
        />
        <Route path="/approved" element={<L3ApprovedReports />} />
        <Route path="/rejected" element={<L3RejectedReports />} />
        <Route path="/all" element={<L3AllReports />} />
        <Route path="/finalized" element={<L3FinalizedReports />} />
        <Route path="/history" element={<L3VersionHistory />} />
        <Route
          path="/draft-review/:projectId"
          element={<L3DraftReportDetailPage />}
        />
        <Route
          path="/approve-final-report/:projectId"
          element={<L3ApproveFinalReportPage />}
        />
        <Route
          path="/edit-draft"
          element={
            <L3EditDraftReport
              projectId=""
              onBack={() => navigate("/l3-manager/dashboard")}
            />
          }
        />
        <Route
          path="/reject-report"
          element={
            <L3RejectReportDraft
              projectId=""
              draftId=""
              onBack={() => navigate("/l3-manager/dashboard")}
            />
          }
        />
        <Route
          path="/request-clarification"
          element={
            <L3RequestClarification
              projectName=""
              projectCode=""
              clientName=""
              createdDate=""
              onBack={() => navigate("/l3-manager/dashboard")}
            />
          }
        />
        <Route
          path="/bottlenecks"
          element={
            <L3AllProjectsAndBottlenecks onNavigate={handleNavigation} />
          }
        />
        <Route
          path="/daily-report"
          element={<L3DailyMorningReport onNavigate={handleNavigation} />}
        />
        <Route path="/settings" element={<L3SettingsPage />} />
      </Routes>
    </MainLayout>
  );
}
function L2Manager() {
  const navigate = useNavigate();
  const location = useLocation();
  const getCurrentPage = () => {
    const path = location.pathname.split("/").pop();
    return path || "dashboard";
  };
  const handleNavigation = (page: string, projectId?: string) => {
    if (projectId) {
      navigate(`/l2-manager/${page}/${projectId}`);
    } else {
      navigate(`/l2-manager/${page}`);
    }
  };
  const activePage = getCurrentPage();
  return (
    <MainLayout
      role="l2-manager"
      onNavigate={handleNavigation}
      activePage={activePage}
    >
      <Routes>
        <Route
          path="/"
          element={<L2DashboardPage onNavigate={handleNavigation} />}
        />
        <Route
          path="/dashboard"
          element={<L2DashboardPage onNavigate={handleNavigation} />}
        />
        <Route
          path="/pending"
          element={<L2PendingReviews onNavigate={handleNavigation} />}
        />
        <Route path="/projects" element={<L2AllProjectsPage />} />
        <Route path="/approvals" element={<L2ApprovalsPage />} />
        <Route path="/reports" element={<L2ReportsPage />} />
        <Route path="/approved" element={<L2ApprovedReports />} />
        <Route path="/all" element={<L2AllReports />} />
        <Route path="/finalized" element={<L2FinalizedReports />} />
        <Route path="/rejected" element={<L2RejectedReports />} />
        <Route path="/history" element={<L2VersionHistory />} />
        <Route
          path="/draft-review/:projectId"
          element={<L2DraftReportDetailPage />}
        />
        <Route
          path="/approve-final-report/:projectId"
          element={<L2ApproveFinalReportPage />}
        />
        <Route
          path="/edit-draft"
          element={
            <L2EditDraftReport
              projectId=""
              onBack={() => navigate("/l2-manager/dashboard")}
            />
          }
        />
        <Route
          path="/reject-report"
          element={
            <L2RejectReportDraft
              projectId=""
              draftId=""
              onBack={() => navigate("/l2-manager/dashboard")}
            />
          }
        />
        <Route
          path="/request-clarification"
          element={
            <L2RequestClarification
              projectName=""
              projectCode=""
              clientName=""
              createdDate=""
              onBack={() => navigate("/l2-manager/dashboard")}
            />
          }
        />
        <Route
          path="/bottlenecks"
          element={
            <L2AllProjectsAndBottlenecks onNavigate={handleNavigation} />
          }
        />
        <Route
          path="/daily-report"
          element={<L2DailyMorningReport onNavigate={handleNavigation} />}
        />
        <Route path="/settings" element={<L2SettingsPage />} />
      </Routes>
    </MainLayout>
  );
}
function L1Manager() {
  const navigate = useNavigate();
  const location = useLocation();
  const getCurrentPage = () => {
    const path = location.pathname.split("/").pop();
    return path || "dashboard";
  };
  const handleNavigation = (page: string, projectId?: string) => {
    if (projectId) {
      navigate(`/l1-manager/${page}/${projectId}`);
    } else {
      navigate(`/l1-manager/${page}`);
    }
  };
  const activePage = getCurrentPage();
  return (
    <MainLayout
      role="l1-manager"
      onNavigate={handleNavigation}
      activePage={activePage}
    >
      <Routes>
        <Route
          path="/"
          element={<L1DashboardPage onNavigate={handleNavigation} />}
        />
        <Route
          path="/dashboard"
          element={<L1DashboardPage onNavigate={handleNavigation} />}
        />
        <Route
          path="/pending"
          element={<L1PendingReviews onNavigate={handleNavigation} />}
        />
        <Route path="/projects" element={<L1AllProjectsPage />} />
        <Route path="/approvals" element={<L1ApprovalsPage />} />
        <Route path="/reports" element={<L1ReportsPage />} />
        <Route path="/approved" element={<L1ApprovedReports />} />
        <Route path="/all" element={<L1AllReports />} />
        <Route path="/finalized" element={<L1FinalizedReports />} />
        <Route
          path="/rejected"
          element={<L1RejectedReports onNavigate={handleNavigation} />}
        />
        <Route path="/history" element={<L1VersionHistory />} />
        <Route
          path="/bottlenecks"
          element={
            <L1AllProjectsAndBottlenecks onNavigate={handleNavigation} />
          }
        />
        <Route
          path="/morning-report"
          element={<L1DailyMorningReport onNavigate={handleNavigation} />}
        />
        <Route
          path="/draft-review/:projectId"
          element={<L1DraftReportDetailPage />}
        />
        <Route
          path="/approve-final-report/:projectId"
          element={<L1ApproveFinalReportPage />}
        />
        <Route
          path="/edit-draft"
          element={
            <L1EditDraftReport
              projectId=""
              onBack={() => navigate("/l1-manager/dashboard")}
            />
          }
        />
        <Route
          path="/reject-report"
          element={
            <L1RejectReportDraft
              projectId=""
              draftId=""
              onBack={() => navigate("/l1-manager/dashboard")}
            />
          }
        />
        <Route
          path="/request-clarification"
          element={
            <L1RequestClarification
              projectName=""
              projectCode=""
              clientName=""
              createdDate=""
              onBack={() => navigate("/l1-manager/dashboard")}
            />
          }
        />
        <Route path="/settings" element={<L1SettingsPage />} />
      </Routes>
    </MainLayout>
  );
}
function TechnicalOfficer() {
  const navigate = useNavigate();
  const location = useLocation();
  const getCurrentPage = () => {
    const path = location.pathname.split("/").pop();
    return path || "dashboard";
  };
  const handleNavigation = (page: string) => {
    navigate(`/technical-officer/${page}`);
  };
  const activePage = getCurrentPage();
  return (
    <MainLayout
      role="technical-officer"
      onNavigate={handleNavigation}
      activePage={activePage}
    >
      <Routes>
        <Route path="/" element={<TechnicalOfficerDashboard />} />
        <Route path="/dashboard" element={<TechnicalOfficerDashboard />} />
        <Route path="/projects" element={<AssignedProject />} />
        <Route path="/reports" element={<Report />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/settings" element={<TechnicalOfficerSettingsPage />} />
      </Routes>
    </MainLayout>
  );
}
function AppContent() {
  const [role, setRole] = useState<Role | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const validRoles: Role[] = [
    "bank",
    "owner",
    "l3-manager",
    "l2-manager",
    "l1-manager",
    "admin",
    "coordinator",
    "technical-officer",
    "senior-valuator",
  ];
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const potentialRole = pathSegments[0] as Role | undefined;
  const role = potentialRole && validRoles.includes(potentialRole) ? potentialRole : null;
  if (!role) {
    return (
      <RoleSelectPage
        onSelectRole={(selectedRole) => {
          // Store selected role in localStorage
          localStorage.setItem("selectedRole", selectedRole);
          setRole(selectedRole);
          navigate(`/${selectedRole}/dashboard`);
        }}
      />
    );
  }
  return (
    <Routes>
      <Route path="/bank/*" element={<BankManager />} />
      <Route path="/owner/*" element={<OwnerManager />} />
      <Route path="/l3-manager/*" element={<L3Manager />} />
      <Route path="/l2-manager/*" element={<L2Manager />} />
      <Route path="/l1-manager/*" element={<L1Manager />} />
      <Route path="/coordinator" element={<CoordinatorLayout />}>
        <Route index element={<CoordinatorDashboardPage />} />
        <Route path="dashboard" element={<CoordinatorDashboardPage />} />
        <Route path="search" element={<CoordinatorSearchPage />} />
        <Route path="register" element={<CoordinatorRegisterPage />} />
        <Route path="register-bank" element={<CoordinatorRegisterBankPage />} />
        <Route path="property-information" element={<CoordinatorPropertyInfoPage />} />
        <Route path="survey-plan" element={<CoordinatorSurveyPlanPage />} />
        <Route path="legal-details" element={<CoordinatorLegalDetailsPage />} />
        <Route path="document-upload" element={<CoordinatorDocumentUploadPage />} />
        <Route path="new-valuation" element={<CoordinatorNewValuationPage />} />
        <Route path="available-to" element={<CoordinatorAvailableToPage />} />
        <Route path="on-leave-to" element={<CoordinatorOnLeaveToPage />} />
        <Route path="assigned-to" element={<CoordinatorAssignedToPage />} />
        <Route path="fleet-management" element={<CoordinatorFleetDashboard />} />
        <Route path="all-to" element={<CoordinatorAllToPage />} />
        <Route path="rejected-to" element={<CoordinatorRejectedToPage />} />
        <Route path="project-summary" element={<CoordinatorProjectSummaryPage />} />
        <Route path="revaluation" element={<CoordinatorRevaluationPage />} />
        <Route path="revaluation-bank" element={<CoordinatorBankInfoPage />} />
      </Route>
      <Route path="/technical-officer/*" element={<TechnicalOfficer />} />
      <Route path="/admin" element={<BlankRolePage title="Admin Portal" />} />
      <Route
        path="/senior-valuator"
        element={<BlankRolePage title="Senior Valuator Portal" />}
      />
      <Route
        path="*"
        element={<BlankRolePage title="404 - Page Not Found" />}
      />
    </Routes>
  );
}
function App() {
  return <AppContent />;
}
export default App;
