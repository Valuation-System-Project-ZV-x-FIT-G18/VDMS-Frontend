// Main App component for the VDMS Frontend
// This component handles user authentication, role-based navigation, and page rendering

import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import authService from "./services/authService";
import { GoogleOAuthProvider } from '@react-oauth/google';

// Import dashboard and page components for each role
//admin pages
import AdminDashboard from "./features/admin/pages/dashboard";
import AdminUsers from "./features/admin/pages/users";
import AdminTemplates from "./features/admin/pages/TemplatesPage";
import AdminValuationTypes from "./features/admin/pages/ValuationTypesPage";
import AdminSettings from "./features/admin/pages/Settings";

//bank credit officer pages
import BankDashboard from "./features/bank-credit-officer/pages/Dashboard";
import BankAllProjects from "./features/bank-credit-officer/pages/AllProjects";
import BankSettings from "./features/bank-credit-officer/pages/Settings";

// COORDINATOR pages
import CoordinatorDashboard from "./features/coordinator/pages/Dashboard";


// COORDINATOR Workflow pages
import CoordinatorClientSearch from "./features/coordinator/pages/Workflow/ClientSearch";
import CoordinatorRegisterClient from "./features/coordinator/pages/Workflow/RegisterClient";
import CoordinatorCreateProject from "./features/coordinator/pages/Workflow/CreateProject";
import CoordinatorNewValuation from "./features/coordinator/pages/Workflow/NewValuation";
import CoordinatorAssignTO from "./features/coordinator/pages/Workflow/AssignTO";
import CoordinatorFleetManagement from "./features/coordinator/pages/FleetManagement";



// ✅ Technical Officer pages
import TechnicalOfficerDashboard from "./features/technical-officer/pages/Dashboard";
import AssignedProject from "./features/technical-officer/pages/AssignedProject";
import Report from "./features/technical-officer/pages/Report";
import Documents from "./features/technical-officer/pages/Documents";
import Attendance from "./features/technical-officer/pages/Attendance";
import TechnicalOfficerSettingsPage from "./features/technical-officer/pages/Settings";

// ✅ Bank Credit Officer pages
import BankDashboardPage from "./features/bank-credit-officer/pages/Dashboard";
import BankAllProjectsPage from "./features/bank-credit-officer/pages/AllProjects";
import BankSettingsPage from "./features/bank-credit-officer/pages/Settings";

// MANAGER pages (L1, L2, L3)
// L3 Manager Pages
import L3Dashboard from "./features/l3/pages/Dashboard";
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

// L2 Manager Pages
import L2Dashboard from "./features/l2/pages/Dashboard";
import L2AllProjects from "./features/l2/pages/AllProjects";
import L2Approvals from "./features/l2/pages/Approvals";
import L2Reports from "./features/l2/pages/Reports";
import L2PendingReviews from "./features/l2/pages/PendingReviews";
import L2ApprovedReports from "./features/l2/pages/ApprovedReports";
import L2RejectedReports from "./features/l2/pages/RejectedReports";
import L2AllReports from "./features/l2/pages/AllReports";
import L2FinalizedReports from "./features/l2/pages/FinalizedReports";
import L2VersionHistory from "./features/l2/pages/VersionHistory";
import L2PendingReviews from "./features/l2/pages/PendingReviews";
import L2AllProjectsAndBottlenecks from "./features/l2/pages/AllProjectsAndBottlenecks";
import L2DailyMorningReport from "./features/l2/pages/DailyMorningReport";
import L2SettingsPage from "./features/l2/pages/Settings";
import L2DraftReportDetail from "./features/l2/pages/DraftReportDetail";
import L2EditDraftReport from "./features/l2/pages/EditDraftReport";
import L2RejectReportDraft from "./features/l2/pages/RejectReportDraft";
import L2RequestClarification from "./features/l2/pages/RequestClarification";

// L1 Manager Pages
import L1Dashboard from "./features/l1/pages/Dashboard";
import L1AllProjects from "./features/l1/pages/AllProjects";
import L1Approvals from "./features/l1/pages/Approvals";
import L1Reports from "./features/l1/pages/Reports";
import L1PendingReviews from "./features/l1/pages/PendingReviews";
import L1ApprovedReports from "./features/l1/pages/ApprovedReports";
import L1RejectedReports from "./features/l1/pages/RejectedReports";
import L1AllReports from "./features/l1/pages/AllReports";
import L1FinalizedReports from "./features/l1/pages/FinalizedReports";
import L1VersionHistory from "./features/l1/pages/VersionHistory";
import L1Bottlenecks from "./features/l1/pages/AllProjectsAndBottlenecks";
import L1DailyMorningReport from "./features/l1/pages/DailyMorningReport";
import L1SettingsPage from "./features/l1/pages/Settings";
import L1DraftReportDetail from "./features/l1/pages/DraftReportDetail";
import L1EditDraftReport from "./features/l1/pages/EditDraftReport";
import L1RejectReportDraft from "./features/l1/pages/RejectReportDraft";
import L1RequestClarification from "./features/l1/pages/RequestClarification";

// SENIOR VALUATOR pages
import SeniorValuatorDashboard from "./features/technical-officer/pages/Dashboard"; // Using TO dashboard as base
import SeniorValuatorReports from "./features/technical-officer/pages/Report";
import SeniorValuatorApprovals from "./features/l2/pages/Approvals";

// PROPERTY OWNER pages
import OwnerDashboard from "./features/property-owner/pages/Dashboard";
import OwnerAllProjects from "./features/property-owner/pages/AllProjects";
import OwnerPayment from "./features/property-owner/pages/Payment";

type Role = "bank" | "owner" | "admin" | "coordinator" | "technical-officer" | "l3-manager" | "l2-manager" | "l1-manager" | "senior-valuator";

export default function App() {
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [activePage, setActivePage] = useState<string>("dashboard");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const loadMockUser = (role: Role) => {
    const defaultDetails: Record<Role, { firstName: string; lastName: string; email: string; photo?: string }> = {
      admin: { firstName: "John", lastName: "Doe", email: "admin@zavolt.com" },
      bank: { firstName: "Jane", lastName: "Smith", email: "bank@zavolt.com" },
      coordinator: { firstName: "Mike", lastName: "Johnson", email: "coordinator@zavolt.com" },
      "technical-officer": { firstName: "Sarah", lastName: "Williams", email: "technical-officer@zavolt.com" },
      "senior-valuator": { firstName: "David", lastName: "Brown", email: "senior-valuator@zavolt.com" },
      "l3-manager": { firstName: "Robert", lastName: "Miller", email: "l3-manager@zavolt.com" },
      "l2-manager": { firstName: "Emily", lastName: "Davis", email: "l2-manager@zavolt.com" },
      "l1-manager": { firstName: "James", lastName: "Wilson", email: "l1-manager@zavolt.com" },
      owner: { firstName: "Patricia", lastName: "Taylor", email: "owner@zavolt.com" },
    };

    // Try to find in localStorage vdms_mock_users
    const usersJson = localStorage.getItem("vdms_mock_users");
    if (usersJson) {
      try {
        const parsed = JSON.parse(usersJson);
        if (Array.isArray(parsed)) {
          // Look for any user matching this role
          const found = parsed.find((u: any) => u.role === role);
          if (found) {
            setCurrentUser(found);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
// COORDINATOR pages
import CoordinatorDashboard from "./features/coordinator/pages/Dashboard";
import CoordinatorSettings from "./features/coordinator/pages/Settings";

// COORDINATOR Workflow pages
import CoordinatorClientSearch from "./features/coordinator/pages/Workflow/ClientSearch";
import CoordinatorRegisterClient from "./features/coordinator/pages/Workflow/RegisterClient";
import CoordinatorCreateProject from "./features/coordinator/pages/Workflow/CreateProject";
import CoordinatorNewValuation from "./features/coordinator/pages/Workflow/NewValuation";
import CoordinatorAssignTO from "./features/coordinator/pages/Workflow/AssignTO";
import CoordinatorFleetManagement from "./features/coordinator/pages/FleetManagement";
import CoordinatorProjectStatus from "./features/coordinator/pages/ProjectStatus";
import CoordinatorMessages from "./features/coordinator/pages/Messages";

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
          <div style={{ color: "#16a34a" }}>✓ Step 1: L3 Approval</div>
          <div style={{ color: "#d4d4d4" }}>Step 2: L2 Review</div>
          <div style={{ color: "#d4d4d4" }}>Step 3: L1 Final Decision</div>
        </div>
        <h1 style={{ color: "#16a34a", marginBottom: "16px" }}>
          ✓ Step 1 of 3 - Approved
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
          <div style={{ color: "#16a34a" }}>✓ Step 1: L3 Approval</div>
          <div style={{ color: "#16a34a" }}>✓ Step 2: L2 Approval</div>
          <div style={{ color: "#d4d4d4" }}>Step 3: L1 Final Decision</div>
        </div>
        <h1 style={{ color: "#16a34a", marginBottom: "16px" }}>
          ✓ Step 2 of 3 - Approved
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
            🔒 REPORT LOCKED
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
            ✓ Report Approved
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
              🔒 Lock Final Report
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

    const fallback = defaultDetails[role];
    if (fallback) {
      setCurrentUser({
        id: "mock",
        firstName: fallback.firstName,
        lastName: fallback.lastName,
        email: fallback.email,
        role: role,
        photo: fallback.photo
      });
    }
  };

  // Check for existing token on load
  useEffect(() => {
    // Check for reset token in URL
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("reset_token");
    if (tokenParam) {
      setResetToken(tokenParam);
    }
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
        <Route
          path="/rejected"
          element={<L3RejectedReports onNavigate={handleNavigation} />}
        />
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

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      // Handle mock tokens for development
      if (token.startsWith("mock-jwt-")) {
        const role = token.split("-")[2] as Role;
        setUserRole(role);
        loadMockUser(role);
      } else {
        // Real token validation
        fetchMe();
      }
    }
    setLoading(false);
  }, []);

  const fetchMe = async () => {
    try {
      const user = await authService.getMe();
      setUserRole(user.role as Role);
      setCurrentUser(user);
    } catch (err) {
      console.error("Auth check failed", err);
      handleLogout();
    }
  };

  const handleSelectRole = (role: Role) => {
    setUserRole(role);
    setActivePage("dashboard");
    loadMockUser(role);
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
        <Route
          path="/rejected"
          element={<L2RejectedReports onNavigate={handleNavigation} />}
        />
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUserRole(null);
    setCurrentUser(null);
    setActivePage("dashboard");
  };

  const handleNavigate = (page: string, projectId?: string) => {
    if (page === "logout") {
      handleLogout();
    } else {
      setActivePage(page);
      if (projectId) {
        setActiveProjectId(projectId);
      }
    }
  };

  const renderContent = () => {
    if (!userRole) return null;

    switch (userRole) {
      case "admin":
        switch (activePage) {
          case "dashboard": return <AdminDashboard onNavigate={handleNavigate} />;
          case "users": return <AdminUsers />;
          case "templates": return <AdminTemplates />;
          case "valuation-types": return <AdminValuationTypes />;
          case "settings": return <AdminSettings role={userRole} />;
          default: return <AdminDashboard onNavigate={handleNavigate} />;
        }
      case "bank":
        switch (activePage) {
          case "dashboard": return <BankDashboard />;
          case "projects": return <BankAllProjects />;
          case "settings": return <BankSettings />;
          default: return <BankDashboard />;
        }
      case "coordinator":
        switch (activePage) {
          case "dashboard":
            return <CoordinatorDashboard />;
          case "create-project":
            return (
              <Routes>
                <Route path="/coordinator/workflow/search" element={<CoordinatorClientSearch />} />
                <Route path="/coordinator/workflow/register" element={<CoordinatorRegisterClient />} />
                <Route path="/coordinator/workflow/create-project" element={<CoordinatorCreateProject />} />
                <Route path="/coordinator/workflow/new-valuation" element={<CoordinatorNewValuation />} />
                <Route path="/coordinator/workflow/assign-to" element={<CoordinatorAssignTO />} />
                <Route path="*" element={<Navigate to="/coordinator/workflow/search" replace />} />
              </Routes>
            );
          case "fleet-management":
            return <CoordinatorFleetManagement />;
          default:
            return <CoordinatorDashboard />;
        }
      case "technical-officer":
        switch (activePage) {
          case "dashboard": return <TechnicalOfficerDashboard />;
          case "projects": return <AssignedProject />;
          case "attendance": return <Attendance />;
          case "report": return <Report />;
          case "documents": return <Documents />;
          case "settings": return <AdminSettings role={userRole} />;
          default: return <TechnicalOfficerDashboard />;
        }
      case "senior-valuator":
        switch (activePage) {
          case "dashboard": return <SeniorValuatorDashboard />;
          case "reports": return <SeniorValuatorReports />;
          case "approvals": return <SeniorValuatorApprovals />;
          case "settings": return <AdminSettings role={userRole} />;
          default: return <SeniorValuatorDashboard />;
        }
      case "l3-manager":
        switch (activePage) {
          case "dashboard": return <L3Dashboard onNavigate={handleNavigate} />;
          case "pending": return <L3PendingReviews onNavigate={handleNavigate} />;
          case "approved": return <L3ApprovedReports />;
          case "rejected": return <L3RejectedReports />;
          case "all": return <L3AllReports />;
          case "finalized": return <L3FinalizedReports />;
          case "history": return <L3VersionHistory />;
          case "draft-review":
            return (
              <L3DraftReportDetail
                projectId={activeProjectId || undefined}
                onBack={() => handleNavigate("dashboard")}
                onEditDetails={() => handleNavigate("edit-draft")}
                onRejectDraft={() => handleNavigate("reject-draft")}
                onRequestClarification={() => handleNavigate("request-clarification")}
              />
            );
          case "edit-draft":
            return <L3EditDraftReport projectId={activeProjectId || undefined} onBack={() => handleNavigate("draft-review")} />;
          case "reject-draft":
            return <L3RejectReportDraft projectId={activeProjectId || undefined} onBack={() => handleNavigate("draft-review")} />;
          case "request-clarification":
            return <L3RequestClarification projectCode={activeProjectId || undefined} onBack={() => handleNavigate("draft-review")} />;
          case "settings": return <AdminSettings role={userRole} />;
          default: return <L3Dashboard onNavigate={handleNavigate} />;
        }
      case "l2-manager":
        switch (activePage) {
          case "dashboard": return <L2Dashboard onNavigate={handleNavigate} />;
          case "projects": return <L2AllProjects />;
          case "approvals": return <L2Approvals />;
          case "reports": return <L2Reports />;
          case "pending": return <L2PendingReviews onNavigate={handleNavigate} />;
          case "approved": return <L2ApprovedReports />;
          case "rejected": return <L2RejectedReports />;
          case "all": return <L2AllReports />;
          case "finalized": return <L2FinalizedReports />;
          case "history": return <L2VersionHistory />;
          case "draft-review":
            return (
              <L2DraftReportDetail
                projectId={activeProjectId || undefined}
                onBack={() => handleNavigate("dashboard")}
                onEditDetails={() => handleNavigate("edit-draft")}
                onRejectDraft={() => handleNavigate("reject-draft")}
                onRequestClarification={() => handleNavigate("request-clarification")}
              />
            );
          case "edit-draft":
            return <L2EditDraftReport projectId={activeProjectId || undefined} onBack={() => handleNavigate("draft-review")} />;
          case "reject-draft":
            return <L2RejectReportDraft projectId={activeProjectId || undefined} onBack={() => handleNavigate("draft-review")} />;
          case "request-clarification":
            return <L2RequestClarification projectCode={activeProjectId || undefined} onBack={() => handleNavigate("draft-review")} />;
          case "settings": return <AdminSettings role={userRole} />;
          default: return <L2Dashboard onNavigate={handleNavigate} />;
        }
      case "l1-manager":
        switch (activePage) {
          case "dashboard": return <L1Dashboard onNavigate={handleNavigate} />;
          case "projects": return <L1AllProjects />;
          case "approvals": return <L1Approvals />;
          case "reports": return <L1Reports />;
          case "pending": return <L1PendingReviews onNavigate={handleNavigate} />;
          case "approved": return <L1ApprovedReports />;
          case "rejected": return <L1RejectedReports />;
          case "all": return <L1AllReports />;
          case "finalized": return <L1FinalizedReports />;
          case "history": return <L1VersionHistory />;
          case "bottlenecks": return <L1Bottlenecks onNavigate={handleNavigate} />;
          case "morning-report": return <L1DailyMorningReport onNavigate={handleNavigate} />;
          case "draft-review":
            return (
              <L1DraftReportDetail
                projectId={activeProjectId || undefined}
                onBack={() => handleNavigate("dashboard")}
                onEditDetails={() => handleNavigate("edit-draft")}
                onRejectDraft={() => handleNavigate("reject-draft")}
                onRequestClarification={() => handleNavigate("request-clarification")}
              />
            );
          case "edit-draft":
            return <L1EditDraftReport projectId={activeProjectId || undefined} onBack={() => handleNavigate("draft-review")} />;
          case "reject-draft":
            return <L1RejectReportDraft projectId={activeProjectId || undefined} onBack={() => handleNavigate("draft-review")} />;
          case "request-clarification":
            return <L1RequestClarification projectCode={activeProjectId || undefined} onBack={() => handleNavigate("draft-review")} />;
          case "settings": return <AdminSettings role={userRole} />;
          default: return <L1Dashboard onNavigate={handleNavigate} />;
        }
          case "owner":
            switch (activePage) {
              case "dashboard": return <OwnerDashboard />;
              case "projects": return <OwnerAllProjects />;
              case "payment": return <OwnerPayment />;
              case "settings": return <AdminSettings role={userRole} />;
              default: return <OwnerDashboard />;
            }
      default:
        return (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <h1>{String(userRole).replace("-", " ").toUpperCase()} Dashboard</h1>
            <p>Welcome to your specialized portal.</p>
          </div>
        );
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

function Coordinator() {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentPage = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const coordinatorSubPath = pathSegments[1] || "dashboard";

    if (
      coordinatorSubPath === "create-project" ||
      coordinatorSubPath.startsWith("workflow")
    ) {
      return "create-project";
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#F0F4FF" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #E5E7EB", borderTopColor: "#4F8EF7", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#4F8EF7", fontWeight: 600 }}>Loading VDMS...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (resetToken) {
    return (
      <ResetPasswordPage 
        token={resetToken}
        onSuccess={() => {
          setResetToken(null);
          // Clean URL
          window.history.replaceState({}, document.title, "/");
        } } onBack={function (): void {
          throw new Error("Function not implemented.");
        } }      />
    );
  }

  const content = !userRole ? (
    <LoginPage
      onSelectRole={handleSelectRole}
      onForgotPassword={() => alert("Redirecting to password reset...")}
    />
  ) : (
    <MainLayout
      activePage={activePage}
      onNavigate={handleNavigate}
      role={userRole}
      userName={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : userRole || "User"}
      userPhoto={currentUser?.photo}
      onLogout={handleLogout}
      userEmail={currentUser?.email}
      userPhone={currentUser?.phone || "+94 77 123 4567"}
    >
      {renderContent()}
    </MainLayout>
  );

  return (
    <GoogleOAuthProvider clientId="1027178880625-v0k26a9783f6p60f6p60f6p60.apps.googleusercontent.com">
      {content}
    </GoogleOAuthProvider>
  );
}