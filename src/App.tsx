// Main App component for the VDMS Frontend
// This component handles user authentication, role-based navigation, and page rendering

import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MainLayout from "./layouts/MainLayout";
import authService from "./services/authService";
import { GoogleOAuthProvider } from '@react-oauth/google';

// Import dashboard and page components for each role
//admin pages
import AdminDashboard from "./features/admin/pages/dashboard";
import AdminUsers from "./features/admin/pages/users";
import AdminTemplates from "./features/admin/pages/TemplatesPage";
import AdminValuationTypes from "./features/admin/pages/ValuationTypesPage";

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
import TechnicalOfficerSettingsPage from "./features/technical-officer/pages/Settings.tsx";

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
import L3Settings from "./features/l3/pages/Settings";

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
import L2DraftReportDetail from "./features/l2/pages/DraftReportDetail";
import L2EditDraftReport from "./features/l2/pages/EditDraftReport";
import L2RejectReportDraft from "./features/l2/pages/RejectReportDraft";
import L2RequestClarification from "./features/l2/pages/RequestClarification";
import L2Settings from "./features/l2/pages/Settings";

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
import L1DraftReportDetail from "./features/l1/pages/DraftReportDetail";
import L1EditDraftReport from "./features/l1/pages/EditDraftReport";
import L1RejectReportDraft from "./features/l1/pages/RejectReportDraft";
import L1RequestClarification from "./features/l1/pages/RequestClarification";
import L1Settings from "./features/l1/pages/Settings";

// SENIOR VALUATOR pages
import SeniorValuatorDashboard from "./features/technical-officer/pages/Dashboard"; // Using TO dashboard as base
import SeniorValuatorReports from "./features/technical-officer/pages/Report";
import SeniorValuatorApprovals from "./features/l2/pages/Approvals";
import SeniorValuatorSettings from "./features/technical-officer/pages/Settings";

// PROPERTY OWNER pages
import OwnerDashboard from "./features/property-owner/pages/Dashboard";
import OwnerAllProjects from "./features/property-owner/pages/AllProjects";
import OwnerPayment from "./features/property-owner/pages/Payment";
import OwnerSettings from "./features/property-owner/pages/Settings";

type Role = "bank" | "owner" | "admin" | "coordinator" | "technical-officer" | "l3-manager" | "l2-manager" | "l1-manager" | "senior-valuator";

export default function App() {
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [activePage, setActivePage] = useState<string>("dashboard");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetToken, setResetToken] = useState<string | null>(null);

  // Check for existing token on load
  useEffect(() => {
    // Check for reset token in URL
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("reset_token");
    if (tokenParam) {
      setResetToken(tokenParam);
    }

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      // Handle mock tokens for development
      if (token.startsWith("mock-jwt-")) {
        const role = token.split("-")[2] as Role;
        setUserRole(role);
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
    } catch (err) {
      console.error("Auth check failed", err);
      handleLogout();
    }
  };

  const handleSelectRole = (role: Role) => {
    setUserRole(role);
    setActivePage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUserRole(null);
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
          case "settings": return <></>; // Show nothing
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
          case "settings": return <TechnicalOfficerSettingsPage />;
          default: return <TechnicalOfficerDashboard />;
        }
      case "senior-valuator":
        switch (activePage) {
          case "dashboard": return <SeniorValuatorDashboard />;
          case "reports": return <SeniorValuatorReports />;
          case "approvals": return <SeniorValuatorApprovals />;
          case "settings": return <SeniorValuatorSettings />;
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
          case "settings": return <L3Settings />;
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
          case "settings": return <L2Settings />;
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
          case "settings": return <L1Settings />;
          default: return <L1Dashboard onNavigate={handleNavigate} />;
        }
          case "owner":
            switch (activePage) {
              case "dashboard": return <OwnerDashboard />;
              case "projects": return <OwnerAllProjects />;
              case "payment": return <OwnerPayment />;
              case "settings": return <OwnerSettings />;
              default: return <OwnerDashboard />;
            }
      default:
        return (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <h1>{String(userRole).replace("-", " ").toUpperCase()} Dashboard</h1>
            <p>Welcome to your specialized portal.</p>
          </div>
        );
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
    <MainLayout activePage={activePage} onNavigate={handleNavigate} role={userRole} userName={userRole} onLogout={handleLogout}>
      {renderContent()}
    </MainLayout>
  );

  return (
    <GoogleOAuthProvider clientId="1027178880625-v0k26a9783f6p60f6p60f6p60.apps.googleusercontent.com">
      {content}
    </GoogleOAuthProvider>
  );
}