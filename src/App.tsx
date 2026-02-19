import { useState } from "react";
import MainLayout from "./layouts/MainLayout";
import RoleSelectPage from "./pages/RoleSelectPage";

//  Bank Credit Officer pages
import BankDashboardPage from "./features/bank-credit-officer/pages/Dashboard";
import BankAllProjectsPage from "./features/bank-credit-officer/pages/AllProjects";
import BankSettingsPage from "./features/bank-credit-officer/pages/Settings";

//  Property Owner pages
import OwnerDashboardPage from "./features/property-owner/pages/Dashboard";
import OwnerAllProjectsPage from "./features/property-owner/pages/AllProjects";
import OwnerPaymentPage from "./features/property-owner/pages/Payment";
import OwnerSettingsPage from "./features/property-owner/pages/Settings";

//   L3 Manager pages
import L3DashboardPage from "./features/l3/pages/Dashboard";
import L3AllProjectsPage from "./features/l3/pages/AllProjects";
import L3ApprovalsPage from "./features/l3/pages/Approvals";
import L3ReportsPage from "./features/l3/pages/Reports";
import L3DraftReportDetail from "./features/l3/pages/DraftReportDetail";
import L3EditDraftReport from "./features/l3/pages/EditDraftReport";
import L3RejectReportDraft from "./features/l3/pages/RejectReportDraft";
import L3RejectedReports from "./features/l3/pages/RejectedReports";
import L3VersionHistory from "./features/l3/pages/VersionHistory";
import L3ApprovedReports from "./features/l3/pages/ApprovedReports";
import L3AllReports from "./features/l3/pages/AllReports";
import L3FinalizedReports from "./features/l3/pages/FinalizedReports";
import L3RequestClarification from "./features/l3/pages/RequestClarification";

type Role =
  | "bank"
  | "owner"
  | "l3-manager"
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

function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  const handleNavigation = (page: string, projectId?: string) => {
    setActivePage(page);
    if (projectId) setSelectedProjectId(projectId);
  };

  // ✅ Role selection first
  if (!role) {
    return (
      <RoleSelectPage
        onSelectRole={(selectedRole) => {
          setRole(selectedRole);
          setActivePage("dashboard");
        }}
      />
    );
  }

  // ✅ Other roles: blank pages only
  if (role === "admin") return <BlankRolePage title="Admin Portal" />;
  if (role === "coordinator")
    return <BlankRolePage title="Coordinator Portal" />;
  if (role === "technical-officer")
    return <BlankRolePage title="Technical Officer Portal" />;
  if (role === "senior-valuator")
    return <BlankRolePage title="Senior Valuator Portal" />;

  // ✅ L3 Manager
  if (role === "l3-manager") {
    return (
      <MainLayout
        activePage={activePage}
        onNavigate={handleNavigation}
        role={role}
      >
        {activePage === "dashboard" && (
          <L3DashboardPage onNavigate={handleNavigation} />
        )}
        {activePage === "projects" && <L3AllProjectsPage />}
        {activePage === "approvals" && <L3ApprovalsPage />}
        {activePage === "reports" && <L3ReportsPage />}
        {activePage === "approved" && <L3ApprovedReports />}
        {activePage === "all" && <L3AllReports />}
        {activePage === "finalized" && <L3FinalizedReports />}
        {activePage === "rejected" && (
          <L3RejectedReports onNavigate={handleNavigation} />
        )}
        {activePage === "history" && <L3VersionHistory />}
        {activePage === "draft-review" && (
          <L3DraftReportDetail
            projectId={selectedProjectId || "PV-2024-8842"}
            onBack={() => setActivePage("dashboard")}
            onEditDetails={() => setActivePage("edit-draft")}
            onRejectDraft={() => setActivePage("reject-report")}
            onRequestClarification={() =>
              setActivePage("request-clarification")
            }
          />
        )}
        {activePage === "edit-draft" && (
          <L3EditDraftReport
            projectId={selectedProjectId || "VAL-2023-004"}
            onBack={() => setActivePage("draft-review")}
          />
        )}
        {activePage === "reject-report" && (
          <L3RejectReportDraft
            projectId={selectedProjectId || "PV-RR0221"}
            draftId="VAL-2023-004"
            onBack={() => setActivePage("draft-review")}
          />
        )}
        {activePage === "request-clarification" && (
          <L3RequestClarification
            projectName="Harbor View Residential Valuation"
            projectCode="PRJ-2023-9021"
            clientName="Apex Global Properties Ltd."
            createdDate="Oct 24, 2023"
            onBack={() => setActivePage("draft-review")}
          />
        )}
      </MainLayout>
    );
  }

  // ✅ For bank/owner show layout
  return (
    <MainLayout
      activePage={activePage}
      onNavigate={handleNavigation}
      role={role}
    >
      {/* Bank Credit Officer */}
      {role === "bank" && activePage === "dashboard" && <BankDashboardPage />}
      {role === "bank" && activePage === "projects" && <BankAllProjectsPage />}
      {role === "bank" && activePage === "settings" && <BankSettingsPage />}

      {/* Property Owner */}
      {role === "owner" && activePage === "dashboard" && <OwnerDashboardPage />}
      {role === "owner" && activePage === "projects" && (
        <OwnerAllProjectsPage />
      )}
      {role === "owner" && activePage === "payment" && <OwnerPaymentPage />}
      {role === "owner" && activePage === "settings" && <OwnerSettingsPage />}
    </MainLayout>
  );
}

export default App;
