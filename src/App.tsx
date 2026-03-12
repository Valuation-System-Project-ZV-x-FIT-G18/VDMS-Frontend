import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import RoleSelectPage from "./pages/RoleSelectPage";

// ✅ Technical Officer pages
import TechnicalOfficerDashboard from "./features/technical-officer/pages/Dashboard";
import AssignedProject from "./features/technical-officer/pages/AssignedProject";
import Report from "./features/technical-officer/pages/Report";
import Documents from "./features/technical-officer/pages/Documents";
import Attendance from "./features/technical-officer/pages/Attendance";
import TechnicalOfficerSettingsPage from "./features/technical-officer/pages/Settings.tsx";

// ✅ Bank Credit Officer pages
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
import L3SettingsPage from "./features/l3/pages/Settings.tsx";

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
import L2SettingsPage from "./features/l2/pages/Settings.tsx";
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
import L1SettingsPage from "./features/l1/pages/Settings.tsx";
import L1DraftReportDetail from "./features/l1/pages/DraftReportDetail";
import L1EditDraftReport from "./features/l1/pages/EditDraftReport";
import L1RejectReportDraft from "./features/l1/pages/RejectReportDraft";
import L1RequestClarification from "./features/l1/pages/RequestClarification";

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
    />
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

    return coordinatorSubPath;
  };

  const handleNavigation = (page: string) => {
    navigate(`/coordinator/${page}`);
  };

  const activePage = getCurrentPage();

  return (
    <MainLayout
      role="coordinator"
      onNavigate={handleNavigation}
      activePage={activePage}
    >
      <Routes>
        <Route path="/" element={<CoordinatorDashboard />} />
        <Route path="/dashboard" element={<CoordinatorDashboard />} />
        <Route path="/create-project" element={<CoordinatorClientSearch />} />
        <Route path="/workflow/search" element={<CoordinatorClientSearch />} />
        <Route
          path="/workflow-register"
          element={<CoordinatorRegisterClient />}
        />
        <Route
          path="/workflow/register"
          element={<CoordinatorRegisterClient />}
        />
        <Route path="/workflow-create" element={<CoordinatorCreateProject />} />
        <Route
          path="/workflow/create-project"
          element={<CoordinatorCreateProject />}
        />
        <Route
          path="/workflow-valuation"
          element={<CoordinatorNewValuation />}
        />
        <Route
          path="/workflow/new-valuation"
          element={<CoordinatorNewValuation />}
        />
        <Route path="/workflow-assign" element={<CoordinatorAssignTO />} />
        <Route path="/workflow/assign-to" element={<CoordinatorAssignTO />} />
        <Route path="/settings" element={<CoordinatorSettings />} />
        <Route
          path="/fleet-management"
          element={<CoordinatorFleetManagement />}
        />
        <Route path="/project-status" element={<CoordinatorProjectStatus />} />
        <Route path="/messages" element={<CoordinatorMessages />} />
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
  const role = potentialRole && validRoles.includes(potentialRole)
    ? potentialRole
    : null;

  // Role selection page
  if (!role) {
    return (
      <RoleSelectPage
        onSelectRole={(selectedRole) => {
          navigate(`/${selectedRole}/dashboard`);
        }}
      />
    );
  }

  // ✅ For bank/owner show layout
  // Route-based rendering
  return (
    <Routes>
      <Route path="/bank/*" element={<BankManager />} />
      <Route path="/owner/*" element={<OwnerManager />} />
      <Route path="/l3-manager/*" element={<L3Manager />} />
      <Route path="/l2-manager/*" element={<L2Manager />} />
      <Route path="/l1-manager/*" element={<L1Manager />} />
      <Route path="/coordinator/*" element={<Coordinator />} />
      <Route path="/technical-officer/*" element={<TechnicalOfficer />} />
      <Route path="/admin" element={<BlankRolePage title="Admin Portal" />} />
      <Route
        path="/senior-valuator"
        element={<BlankRolePage title="Senior Valuator Portal" />}
      />
    </Routes>
  );
}

function App() {
  return <AppContent />;
}

export default App;